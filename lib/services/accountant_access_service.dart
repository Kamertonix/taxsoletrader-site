import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'cloud_account_service.dart';
import 'deadline_service.dart';
import 'entitlement_service.dart';
import 'invoice_export_service.dart';
import 'local_app_storage.dart';
import 'mtd_quarterly_report_service.dart';
import 'tax_summary_service.dart';

/// The exact, finite set of categories a user can grant an accountant —
/// mirrors ACCOUNTANT_CATEGORIES in the Edge Functions' _accountant_shared.ts
/// and the check constraint in 015_accountant_access_foundation.sql. Keep
/// these three lists in lockstep if this ever changes.
enum AccountantCategory {
  transactions,
  invoices,
  expenses,
  vat,
  cis,
  mileage,
  documents,
  selfAssessment,
  businessProfile,
  deadlines,
  tasks,
  mtdReport,
}

extension AccountantCategoryX on AccountantCategory {
  String get id => switch (this) {
        AccountantCategory.selfAssessment => 'self_assessment',
        AccountantCategory.businessProfile => 'business_profile',
        AccountantCategory.mtdReport => 'mtd_report',
        _ => name,
      };

  String get label => switch (this) {
        AccountantCategory.transactions => 'Transactions',
        AccountantCategory.invoices => 'Invoices',
        AccountantCategory.expenses => 'Expenses',
        AccountantCategory.vat => 'VAT',
        AccountantCategory.cis => 'CIS',
        AccountantCategory.mileage => 'Mileage',
        AccountantCategory.documents => 'Documents (organizer)',
        AccountantCategory.selfAssessment => 'Self Assessment (estimate)',
        AccountantCategory.businessProfile => 'Business Profile',
        AccountantCategory.deadlines => 'Deadlines',
        AccountantCategory.tasks => 'Tasks',
        AccountantCategory.mtdReport => 'MTD Report',
      };

  String get permissionColumn => 'can_view_$id';
}

/// One row from accountant_links, as seen by the client (the app user).
class AccountantLink {
  const AccountantLink({
    required this.id,
    required this.status,
    required this.accountantId,
    required this.accountantDisplayName,
    required this.accountantFirmName,
    required this.clientLabel,
    required this.inviteCode,
    required this.permissions,
    required this.invitedAt,
    required this.acceptedAt,
    required this.revokedAt,
  });

  final String id;
  final String status; // pending | accepted | declined | revoked
  final String? accountantId;
  final String accountantDisplayName;
  final String accountantFirmName;
  final String clientLabel;
  final String? inviteCode;
  final Map<AccountantCategory, bool> permissions;
  final DateTime? invitedAt;
  final DateTime? acceptedAt;
  final DateTime? revokedAt;

  /// Invite created, not yet typed into the portal by anyone.
  bool get isAwaitingRedeem => status == 'pending' && accountantId == null;

  /// Redeemed by an accountant, waiting on the client's own approval —
  /// this is the "someone wants to view your data" prompt.
  bool get isAwaitingApproval => status == 'pending' && accountantId != null;

  bool get isAccepted => status == 'accepted';

  factory AccountantLink.fromRow(Map<String, dynamic> row, {Map<String, dynamic>? profile}) {
    DateTime? parseDate(Object? value) {
      final text = value?.toString() ?? '';
      return text.isEmpty ? null : DateTime.tryParse(text);
    }

    final permissions = <AccountantCategory, bool>{
      for (final category in AccountantCategory.values) category: row[category.permissionColumn] == true,
    };

    return AccountantLink(
      id: row['id']?.toString() ?? '',
      status: row['status']?.toString() ?? 'pending',
      accountantId: row['accountant_id']?.toString(),
      accountantDisplayName: profile?['display_name']?.toString() ?? '',
      accountantFirmName: profile?['firm_name']?.toString() ?? '',
      clientLabel: row['client_label']?.toString() ?? '',
      inviteCode: row['invite_code']?.toString(),
      permissions: permissions,
      invitedAt: parseDate(row['invited_at']),
      acceptedAt: parseDate(row['accepted_at']),
      revokedAt: parseDate(row['revoked_at']),
    );
  }
}

/// Flutter-side client for the accountant-access Edge Functions + direct
/// (RLS-protected) reads of the client's own accountant_links /
/// accountant_data_snapshots rows. Mirrors HmrcConnectionService's
/// structure: static class, `_requireSupabaseClient`, JSON helpers,
/// every write going through an Edge Function, direct table reads only
/// for the client's own non-sensitive status rows.
class AccountantAccessService {
  AccountantAccessService._();

  static bool get isBackendReady => CloudAccountService.isConfigured && CloudAccountService.isInitialised;

  /// All of the signed-in user's accountant links — pending invites
  /// awaiting redemption, pending approvals awaiting the user's own
  /// confirmation, accepted connections, and past revoked/declined ones
  /// (kept for history, shown collapsed in the UI).
  static Future<List<AccountantLink>> loadLinks() async {
    final client = _requireSupabaseClient();
    if (client.auth.currentSession == null) return const <AccountantLink>[];

    final rows = await client
        .from('accountant_links')
        .select()
        .order('created_at', ascending: false);
    final linkRows = List<Map<String, dynamic>>.from(rows as List);

    final accountantIds = linkRows
        .map((row) => row['accountant_id']?.toString())
        .whereType<String>()
        .toSet()
        .toList(growable: false);

    var profilesById = <String, Map<String, dynamic>>{};
    if (accountantIds.isNotEmpty) {
      final profileRows = await client
          .from('accountant_profiles')
          .select('user_id, display_name, firm_name')
          .inFilter('user_id', accountantIds);
      for (final row in List<Map<String, dynamic>>.from(profileRows as List)) {
        profilesById[row['user_id'].toString()] = row;
      }
    }

    return linkRows
        .map((row) => AccountantLink.fromRow(row, profile: profilesById[row['accountant_id']?.toString()]))
        .toList(growable: false);
  }

  /// Creates (or, if one is already open, refreshes) an un-redeemed
  /// invite code. [permissions] lets the user set what's shared before
  /// anyone has even seen the code — defaults on the server match
  /// AccountantExportScreen's own defaults (documents off, everything
  /// else on). Automatically sends the business's trading name (or the
  /// owner's name as fallback) as the display label the accountant sees
  /// on their dashboard — this app is local-first, so that's the only
  /// place a human-readable name for this client can come from.
  static Future<String> createInvite({Map<AccountantCategory, bool>? permissions}) async {
    final client = _requireSupabaseClient();
    if (client.auth.currentSession == null) {
      throw StateError('Sign in to Cloud Account before inviting an accountant.');
    }
    final business = await LocalAppStorage.loadBusinessDetails();
    final ownerName = '${business.firstName.trim()} ${business.surname.trim()}'.trim();
    final clientLabel = business.businessName.trim().isNotEmpty ? business.businessName.trim() : ownerName;
    final body = <String, dynamic>{
      'client_label': clientLabel,
      if (permissions != null)
        for (final entry in permissions.entries) entry.key.permissionColumn: entry.value,
    };
    final response = await client.functions.invoke('accountant-create-invite', body: body);
    final data = _responseMap(response.data);
    if (data['error'] != null) throw StateError(_text(data['error']));
    final code = _text(data['invite_code']);
    if (code.isEmpty) throw StateError('Could not create an invite code.');
    return code;
  }

  /// Client-side approve/decline of an accountant who has redeemed an
  /// invite code and is waiting for confirmation.
  static Future<void> respondToInvite({required String linkId, required bool approve}) async {
    final client = _requireSupabaseClient();
    if (client.auth.currentSession == null) throw StateError('Sign in to Cloud Account first.');
    final response = await client.functions.invoke(
      'accountant-respond-invite',
      body: <String, dynamic>{'link_id': linkId, 'action': approve ? 'approve' : 'decline'},
    );
    final data = _responseMap(response.data);
    if (data['error'] != null) throw StateError(_text(data['error']));
  }

  /// Ends a link immediately, from the client side.
  static Future<void> revokeLink(String linkId) async {
    final client = _requireSupabaseClient();
    if (client.auth.currentSession == null) throw StateError('Sign in to Cloud Account first.');
    final response = await client.functions.invoke('accountant-revoke-link', body: <String, dynamic>{'link_id': linkId});
    final data = _responseMap(response.data);
    if (data['error'] != null) throw StateError(_text(data['error']));
  }

  /// The per-category "last synced" timestamps for the signed-in user's
  /// own snapshots — shown in the app itself so the user can always see
  /// exactly what's been shared and when, not just trust that it has.
  static Future<Map<AccountantCategory, DateTime>> loadSyncStatus() async {
    final client = _requireSupabaseClient();
    if (client.auth.currentSession == null) return const <AccountantCategory, DateTime>{};
    final rows = await client.from('accountant_data_snapshots').select('category, synced_at');
    final result = <AccountantCategory, DateTime>{};
    for (final row in List<Map<String, dynamic>>.from(rows as List)) {
      final category = AccountantCategory.values.where((c) => c.id == row['category']).firstOrNull;
      final syncedAt = DateTime.tryParse(row['synced_at']?.toString() ?? '');
      if (category != null && syncedAt != null) result[category] = syncedAt;
    }
    return result;
  }

  /// The single deliberate "Sync now" action — reads local data with
  /// AccountantExportScreen's own filters (period + business-only) and
  /// uploads one snapshot per requested category. Never called
  /// automatically; only from an explicit button press.
  static Future<void> syncNow({
    required Set<AccountantCategory> categories,
    required bool businessOnly,
    required DateTime periodFrom,
    required DateTime periodTo,
  }) async {
    final client = _requireSupabaseClient();
    if (client.auth.currentSession == null) throw StateError('Sign in to Cloud Account before syncing.');

    // Not every stored model normalizes its date to ISO the way
    // StoredTransaction does — TstDateField (used by expenses and
    // invoices) writes 'DD/MM/YYYY' by default unless isoFormat is
    // passed, which those screens don't. DateTime.tryParse only
    // understands ISO, so without this, every expense/invoice date
    // silently failed to parse and got filtered out of every sync —
    // not an edge case, every single one. Handles both formats here,
    // in the sync layer only, rather than touching how expenses/
    // invoices store dates elsewhere in the app.
    DateTime? parseFlexibleDate(String text) {
      final trimmed = text.trim();
      final iso = DateTime.tryParse(trimmed);
      if (iso != null) return iso;
      final ukMatch = RegExp(r'^(\d{1,2})/(\d{1,2})/(\d{4})$').firstMatch(trimmed);
      if (ukMatch != null) {
        final day = int.tryParse(ukMatch.group(1)!);
        final month = int.tryParse(ukMatch.group(2)!);
        final year = int.tryParse(ukMatch.group(3)!);
        if (day != null && month != null && year != null) {
          try {
            return DateTime(year, month, day);
          } catch (_) {
            return null;
          }
        }
      }
      return null;
    }

    bool inPeriod(String dateText) {
      final date = parseFlexibleDate(dateText);
      if (date == null) return false;
      return !date.isBefore(periodFrom) && !date.isAfter(periodTo);
    }

    final transactions = await LocalAppStorage.loadTransactions();
    final invoices = await LocalAppStorage.loadInvoices();
    final expenses = await LocalAppStorage.loadExpenses();
    final mileageTrips = await LocalAppStorage.loadMileageTrips();

    final filteredTransactions = transactions.where((item) {
      if (!inPeriod(item.date)) return false;
      if (businessOnly && item.businessUse != 'BUSINESS') return false;
      if (item.needsReview) return false;
      return true;
    }).toList(growable: false);

    final snapshots = <Map<String, dynamic>>[];
    final periodFromText = periodFrom.toIso8601String().split('T').first;
    final periodToText = periodTo.toIso8601String().split('T').first;

    if (categories.contains(AccountantCategory.transactions)) {
      snapshots.add({
        'category': 'transactions',
        'period_from': periodFromText,
        'period_to': periodToText,
        'business_only': businessOnly,
        'payload': {'items': filteredTransactions.map((t) => t.toJson()).toList(growable: false)},
      });
    }
    if (categories.contains(AccountantCategory.invoices)) {
      final filtered = invoices.where((item) => inPeriod(item.date)).toList(growable: false);
      snapshots.add({
        'category': 'invoices',
        'period_from': periodFromText,
        'period_to': periodToText,
        'business_only': businessOnly,
        'payload': {'items': filtered.map((i) => i.toJson()).toList(growable: false)},
      });
      // Best-effort: the actual PDFs, not just their fields. Kept
      // separate from the JSON snapshot above so a PDF-rendering
      // failure on one invoice never blocks the (more important) data
      // sync from completing.
      await _syncInvoicePdfs(client, filtered);
    }
    if (categories.contains(AccountantCategory.expenses)) {
      final filtered = expenses.where((item) => inPeriod(item.date)).toList(growable: false);
      snapshots.add({
        'category': 'expenses',
        'period_from': periodFromText,
        'period_to': periodToText,
        'business_only': businessOnly,
        'payload': {'items': filtered.map((e) => e.toJson()).toList(growable: false)},
      });
    }
    if (categories.contains(AccountantCategory.vat)) {
      final vatItems = filteredTransactions.where((item) => item.vat).toList(growable: false);
      snapshots.add({
        'category': 'vat',
        'period_from': periodFromText,
        'period_to': periodToText,
        'business_only': businessOnly,
        'payload': {'items': vatItems.map((t) => t.toJson()).toList(growable: false)},
      });
    }
    if (categories.contains(AccountantCategory.cis)) {
      final cisItems = filteredTransactions.where((item) => item.cis).toList(growable: false);
      snapshots.add({
        'category': 'cis',
        'period_from': periodFromText,
        'period_to': periodToText,
        'business_only': businessOnly,
        'payload': {'items': cisItems.map((t) => t.toJson()).toList(growable: false)},
      });
    }
    if (categories.contains(AccountantCategory.mileage)) {
      final filtered = mileageTrips.where((item) => inPeriod(item.date)).toList(growable: false);
      snapshots.add({
        'category': 'mileage',
        'period_from': periodFromText,
        'period_to': periodToText,
        'business_only': businessOnly,
        'payload': {'items': filtered.map((m) => m.toJson()).toList(growable: false)},
      });
    }
    // Documents (organizer) sync is intentionally not implemented yet —
    // the permission toggle exists and defaults off, but no payload is
    // built for it until the organizer-export side of this is designed.

    if (categories.contains(AccountantCategory.selfAssessment)) {
      // Syncs the app's OWN computed estimate — never recalculated
      // here or in the portal. 'summary' (not 'items') marks this as a
      // single object, not a row list, so the portal renders it with
      // its own summary card instead of a generic table.
      final sa = await TaxSummaryService.buildSelfAssessmentSummary();
      snapshots.add({
        'category': 'self_assessment',
        'period_from': periodFromText,
        'period_to': periodToText,
        'business_only': businessOnly,
        'payload': {
          'summary': {
            'taxYear': sa.taxYear,
            'status': sa.status,
            'income': sa.income,
            'expenses': sa.expenses,
            'profit': sa.profit,
            'combinedIncome': sa.combinedIncome,
            'cisSuffered': sa.cisSuffered,
            'incomeTax': sa.incomeTax,
            'class2Ni': sa.class2Ni,
            'class4Ni': sa.class4Ni,
            'taxBeforeCis': sa.taxBeforeCis,
            'finalTax': sa.finalTax,
            'paymentOnAccount': sa.paymentOnAccount,
            'januaryPayment': sa.januaryPayment,
            'julyPayment': sa.julyPayment,
            'suggestedReserve': sa.suggestedReserve,
            'readiness': sa.readiness,
            'recordCount': sa.recordCount,
            'receiptCount': sa.receiptCount,
            'invoiceCount': sa.invoiceCount,
            'cisEnabled': sa.cisEnabled,
            'payeEnabled': sa.payeEnabled,
            'payeSalary': sa.payeSalary,
            'payeTaxPaid': sa.payeTaxPaid,
            'studentLoanEnabled': sa.studentLoanEnabled,
            'studentLoanRepayment': sa.studentLoanRepayment,
            'homeOfficeDeduction': sa.homeOfficeDeduction,
            'marriageAllowanceReduction': sa.marriageAllowanceReduction,
            'useTradingAllowance': sa.useTradingAllowance,
            'vatRegistered': sa.vatRegistered,
          },
        },
      });
    }

    if (categories.contains(AccountantCategory.businessProfile)) {
      // Identifying/compliance details only — deliberately excludes
      // bank account fields (sort code, account number, IBAN). Not
      // filtered by period; this is current-state profile info, not a
      // dated record.
      final business = await LocalAppStorage.loadBusinessDetails();
      final taxSettings = await LocalAppStorage.loadTaxVatSettings();
      final paye = await LocalAppStorage.loadPayeEmploymentSettings();
      snapshots.add({
        'category': 'business_profile',
        'period_from': null,
        'period_to': null,
        'business_only': businessOnly,
        'payload': {
          'profile': {
            'firstName': business.firstName,
            'surname': business.surname,
            'businessName': business.businessName,
            'businessType': business.businessType,
            'utr': business.utr,
            'nino': business.nino,
            'email': business.email,
            'phone': business.phone,
            'addressLine1': business.addressLine1,
            'addressLine2': business.addressLine2,
            'city': business.city,
            'postcode': business.postcode,
            'country': business.country,
            // Full "VAT and Tax" settings screen — every toggle, not
            // just VAT/CIS registration status.
            'taxYear': taxSettings.taxYear,
            'vatRegistered': taxSettings.vatRegistered,
            'vatNumber': taxSettings.vatNumber,
            'vatScheme': taxSettings.vatScheme,
            'vatFrequency': taxSettings.vatFrequency,
            'vatQuarterStart': taxSettings.vatQuarterStart,
            'flatRatePercent': taxSettings.flatRatePercent,
            'reverseChargeVat': taxSettings.reverseChargeVat,
            'cisRegistered': taxSettings.cisRegistered,
            'cisSubcontractor': taxSettings.cisSubcontractor,
            'cisType': taxSettings.cisType,
            'studentLoanEnabled': taxSettings.studentLoanEnabled,
            'studentLoanPlan': taxSettings.studentLoanPlan,
            'useTradingAllowance': taxSettings.useTradingAllowance,
            'tradingAllowanceExclusionsConfirmed': taxSettings.tradingAllowanceExclusionsConfirmed,
            'homeOfficeEnabled': taxSettings.homeOfficeEnabled,
            'homeOfficeHoursBand': taxSettings.homeOfficeHoursBand,
            'homeOfficeMonths': taxSettings.homeOfficeMonths,
            'claimMarriageAllowance': taxSettings.claimMarriageAllowance,
            'marriageAllowanceExclusionsConfirmed': taxSettings.marriageAllowanceExclusionsConfirmed,
            'vehicleExpenseMethod': taxSettings.vehicleExpenseMethod,
            'vehicleType': taxSettings.vehicleType,
            'boltDriver': taxSettings.boltDriver,
            // PAYE employment — separate model, own settings screen.
            'payeEnabled': paye.enabled,
            'payeSalary': paye.salary,
            'payeTaxPaid': paye.taxPaid,
            'payeNicPaid': paye.nicPaid,
          },
        },
      });
    }

    if (categories.contains(AccountantCategory.deadlines)) {
      // Syncs the app's own computed HMRC deadlines — never
      // recalculated here, same reasoning as self_assessment. Not
      // filtered by period; these are forward-looking, not historical.
      final deadlines = await DeadlineService.getVisibleDeadlines();
      snapshots.add({
        'category': 'deadlines',
        'period_from': null,
        'period_to': null,
        'business_only': businessOnly,
        'payload': {
          'items': deadlines
              .map((d) => {
                    'key': d.key,
                    'typeKey': d.typeKey,
                    'title': d.title,
                    'description': d.description,
                    'periodStart': d.periodStart.toIso8601String(),
                    'periodEnd': d.periodEnd.toIso8601String(),
                    'deadline': d.deadline.toIso8601String(),
                    'daysRemaining': d.daysRemaining,
                  })
              .toList(growable: false),
        },
      });
    }

    if (categories.contains(AccountantCategory.tasks)) {
      // Organizer's real task list (title, due date, status) — not
      // filtered by period; open/overdue tasks matter regardless of
      // when they were created.
      final tasks = await LocalAppStorage.loadOrganizerItems('tasks');
      snapshots.add({
        'category': 'tasks',
        'period_from': null,
        'period_to': null,
        'business_only': businessOnly,
        'payload': {
          'items': tasks
              .map((t) => {
                    'id': t.id,
                    'title': t.title,
                    'subtitle': t.subtitle,
                    'note': t.note,
                    'date': t.date,
                    'status': t.status,
                  })
              .toList(growable: false),
        },
      });
    }

    if (categories.contains(AccountantCategory.mtdReport)) {
      // Syncs the app's own MtdQuarterlyReportService.build() output —
      // never recalculated here. All four quarters, so the portal can
      // mirror the app's own quarter picker exactly, not just show
      // whatever quarter happened to be "current" at sync time.
      final quarterReports = <Map<String, dynamic>>[];
      for (final quarter in MtdQuarterlyReportService.quarterValues) {
        final report = await MtdQuarterlyReportService.build(quarter: quarter);
        quarterReports.add({
          'taxYear': report.taxYear,
          'quarter': report.quarter,
          'periodLabel': report.periodLabel,
          'income': report.income,
          'expenses': report.expenses,
          'profitLoss': report.profitLoss,
          'transactionCount': report.transactionCount,
          'invoiceCount': report.invoiceCount,
          'breakdown': {
            'invoiceIncome': report.breakdown.invoiceIncome,
            'transactionIncome': report.breakdown.transactionIncome,
            'manualIncome': report.breakdown.manualIncome,
            'transactionExpenses': report.breakdown.transactionExpenses,
            'manualExpenses': report.breakdown.manualExpenses,
            'vehicleExpensesExcluded': report.breakdown.vehicleExpensesExcluded,
            'mileage': report.breakdown.mileage,
            'mileageTrips': report.breakdown.mileageTrips,
            'mileageEnabled': report.breakdown.mileageEnabled,
          },
        });
      }
      snapshots.add({
        'category': 'mtd_report',
        'period_from': null,
        'period_to': null,
        'business_only': businessOnly,
        'payload': {'quarters': quarterReports},
      });
    }

    if (snapshots.isEmpty) return;

    final response = await client.functions.invoke('accountant-sync-snapshot', body: <String, dynamic>{'snapshots': snapshots});
    final data = _responseMap(response.data);
    if (data['error'] != null) throw StateError(_text(data['error']));
  }

  // Capped so one sync doesn't try to push an unreasonable payload —
  // most sole traders won't have more than this many invoices in a
  // single tax year anyway. If there are more, the newest ones (by
  // date, since `invoices` is already filtered to the period and kept
  // in storage order) win; older ones simply keep whatever PDF they
  // already have from a previous sync.
  static const int _maxInvoicePdfsPerSync = 40;

  static Future<void> _syncInvoicePdfs(SupabaseClient client, List<StoredInvoice> invoices) async {
    if (invoices.isEmpty) return;
    final batch = invoices.length > _maxInvoicePdfsPerSync
        ? invoices.sublist(invoices.length - _maxInvoicePdfsPerSync)
        : invoices;

    final payloadItems = <Map<String, dynamic>>[];
    for (final invoice in batch) {
      try {
        final bytes = await InvoiceExportService.buildInvoicePdfBytes(invoice);
        payloadItems.add({'invoice_id': invoice.id, 'pdf_base64': base64Encode(bytes)});
      } catch (_) {
        // One bad invoice (e.g. a corrupt line item) shouldn't stop
        // the rest from syncing — best-effort, silent per-item.
      }
    }
    if (payloadItems.isEmpty) return;

    try {
      await client.functions.invoke('accountant-sync-invoice-pdfs', body: <String, dynamic>{'invoices': payloadItems});
    } catch (_) {
      // Best-effort — the JSON invoice data already synced regardless;
      // losing the PDF attachment for this round isn't worth surfacing
      // as an error to the user.
    }
  }

  static const String _lastAutoSyncKey = 'accountant_access_last_auto_sync_v1';
  static const Duration _autoSyncThrottle = Duration(hours: 6);

  /// Called once, quietly, whenever the app opens — this is what makes
  /// "grant access and forget about it" actually true. If the user has
  /// an accepted accountant link, this pushes a fresh snapshot without
  /// any button press, any UI, or any interruption. Throttled to once
  /// per [_autoSyncThrottle] so opening the app repeatedly in a day
  /// doesn't hammer the network for no reason. Never throws — a failure
  /// here should be invisible; the manual "Sync now" button in
  /// Accountant Access remains as an explicit fallback regardless.
  static Future<void> autoSyncIfDue() async {
    try {
      if (!isBackendReady) return;
      final client = CloudAccountService.client;
      if (client == null || client.auth.currentSession == null) return;

      // Accountant Access is a premium feature — the entry screen is
      // already behind PremiumGate, but that only covers the moment
      // someone taps into it. Without this check, a lapsed
      // subscriber's device would keep quietly feeding fresh data to
      // their accountant forever. The database (020_...) is the real
      // enforcement layer regardless, but there's no reason to make
      // network calls that would just get refused.
      final entitlement = await EntitlementService.currentStatus();
      if (!entitlement.isEntitled) return;

      final prefs = await SharedPreferences.getInstance();
      final lastMillis = prefs.getInt(_lastAutoSyncKey);
      if (lastMillis != null) {
        final elapsed = DateTime.now().difference(DateTime.fromMillisecondsSinceEpoch(lastMillis));
        if (elapsed < _autoSyncThrottle) return;
      }

      final links = await loadLinks();
      final activeLink = links.where((l) => l.isAccepted).firstOrNull;
      if (activeLink == null) return;

      final categories = activeLink.permissions.entries.where((e) => e.value).map((e) => e.key).toSet();
      if (categories.isEmpty) return;

      final now = DateTime.now();
      final taxYearStart = now.month > 4 || (now.month == 4 && now.day >= 6) ? now.year : now.year - 1;
      await syncNow(
        categories: categories,
        businessOnly: true,
        periodFrom: DateTime(taxYearStart, 4, 6),
        periodTo: DateTime(taxYearStart + 1, 4, 5),
      );

      await prefs.setInt(_lastAutoSyncKey, now.millisecondsSinceEpoch);
    } catch (_) {
      // Best-effort only — silent failure by design, see doc comment above.
    }
  }

  static SupabaseClient _requireSupabaseClient() {
    final client = CloudAccountService.client;
    if (client == null) {
      throw StateError('Cloud sync is not configured yet. Please try again later.');
    }
    return client;
  }

  static Map<String, dynamic> _responseMap(Object? data) {
    if (data is Map) return Map<String, dynamic>.from(data);
    if (data is String && data.trim().isNotEmpty) {
      final decoded = jsonDecode(data);
      if (decoded is Map) return Map<String, dynamic>.from(decoded);
    }
    return <String, dynamic>{};
  }

  static String _text(Object? value) => value?.toString().trim() ?? '';
}
