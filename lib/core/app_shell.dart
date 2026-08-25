import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../features/accountant_access/accountant_access_screen.dart';
import '../features/alerts/notifications_deadlines_screen.dart';
import '../services/accountant_access_service.dart';
import '../features/backup/backup_restore_screen.dart';
import '../features/auth/cloud_account_screen.dart';
import '../features/diagnostics/app_diagnostics_screen.dart';
import '../features/diagnostics/data_health_screen.dart';
import '../features/diagnostics/release_readiness_screen.dart';
import '../features/bank/bank_connection_screen.dart';
import '../features/bank/gov_hmrc_connection_screen.dart';
import '../features/bank/hmrc_connection_screen.dart';
import '../features/business/business_screen.dart';
import '../features/business/employers_screen.dart';
import '../features/business/paye_employment_screen.dart';
import '../features/dashboard/dashboard_screen.dart';
import '../features/dashboard/tax_breakdown_screen.dart';
import '../features/export/accountant_export_screen.dart';
import '../features/expenses/add_expense_screen.dart';
import '../features/expenses/expense_detail_screen.dart';
import '../features/expenses/expenses_hub_screen.dart';
import '../features/home/home_screen.dart';
import '../features/importers/bank_import_screen.dart';
import '../features/importers/bolt_import_screen.dart';
import '../features/importers/import_history_screen.dart';
import '../features/invoices/invoices_screen.dart';
import '../features/invoices/invoice_detail_screen.dart';
import '../features/invoices/invoice_preview_screen.dart';
import '../features/legal/legal_compliance_screen.dart';
import '../features/legal/legal_info_screen.dart';
import '../features/mileage/mileage_tracker_screen.dart';
import '../features/mileage/vehicle_manager_screen.dart';
import '../features/mtd/mtd_hub_screen.dart';
import '../features/organizer/organizer_screen.dart';
import '../features/reports/reports_screen.dart';
import '../features/settings/details/accountant_details_screen.dart';
import '../features/self_assessment/self_assessment_screen.dart';
import '../features/settings/details/app_preferences_screen.dart';
import '../features/settings/details/bank_import_rules_screen.dart';
import '../features/settings/details/business_details_screen.dart';
import '../features/settings/details/invoice_settings_screen.dart';
import '../features/settings/details/tax_vat_settings_screen.dart';
import '../features/settings/privacy_security_screen.dart';
import '../features/settings/settings_screen.dart';
import '../features/help/help_faq_screen.dart';
import '../features/transactions/add_transaction_screen.dart';
import '../features/transactions/transaction_detail_screen.dart';
import '../features/transactions/transactions_screen.dart';
import '../features/vat/vat_return_screen.dart';
import '../features/vat/vat_return_preview_screen.dart';
import '../features/vat/vat_statement_screen.dart';
import '../features/cis/cis_statement_screen.dart';
import '../theme/app_theme.dart';
import '../widgets/app_bottom_nav.dart';
import '../widgets/premium_gate.dart';
import '../widgets/top_brand_header.dart';

enum AppModule {
  cloudAccount,
  expensesHub,
  addExpense,
  expenseDetail,
  selfAssessment,
  taxBreakdown,
  transactions,
  addTransaction,
  transactionDetail,
  invoices,
  invoiceDetail,
  invoicePreview,
  vatReturn,
  vatReturnPreview,
  vatStatement,
  cisStatement,
  mtd,
  organizer,
  bankConnection,
  hmrcConnection,
  govConnection,
  bankImport,
  boltImport,
  bankImportRules,
  importHistory,
  hmrcDeadlines,
  mileageTracker,
  vehicleManager,
  employers,
  addEmployer,
  payeEmployment,
  accountantExport,
  businessDetails,
  taxVatSettings,
  invoiceSettings,
  accountantDetails,
  appPreferences,
  appDiagnostics,
  dataHealth,
  releaseReadiness,
  legalCompliance,
  about,
  terms,
  privacy,
  legalDisclaimer,
  subscriptionTerms,
  dataSecurity,
  dataRetention,
  openBankingPolicy,
  contact,
  supportCentre,
  helpFaq,
  legalProtection,
  privacySecurity,
  crashLogs,
  backupRestore,
  accountantAccess,
}

class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int _currentIndex = 0;
  AppModule? _activeModule;
  bool _organizerHasSubNav = false;
  VoidCallback? _organizerBackHandler;
  final List<AppModule?> _moduleBackStack = <AppModule?>[];
  DateTime? _lastHomeBackPressed;
  bool _showHomeBackExitHint = false;
  /// Set right before opening AppModule.helpFaq when a screen's "Learn
  /// more" hint wants to land directly on a relevant answer, instead of
  /// the FAQ opening blank -- read once by the HelpFaqScreen route below,
  /// then irrelevant again until the next time it's set.
  String? _pendingFaqQuery;

  void _openFaq({String? query}) {
    _pendingFaqQuery = query;
    _openModule(AppModule.helpFaq);
  }

  static const Duration _homeBackExitWindow = Duration(seconds: 2);

  void _clearInvoiceTransientState() {
    InvoicesScreen.editInvoiceId = null;
    InvoiceDetailScreen.editSelectedInvoice = false;
  }

  void _setPage(int index) {
    if (index == _currentIndex && _activeModule == null) return;
    _clearInvoiceTransientState();
    setState(() {
      _moduleBackStack.clear();
      _activeModule = null;
      _currentIndex = index;
    });
  }

  void _openModule(AppModule module) {
    setState(() {
      _moduleBackStack.add(_activeModule);
      _activeModule = module;
    });
  }

  void _closeModule() {
    if (_activeModule == AppModule.invoices) {
      _clearInvoiceTransientState();
    }
    setState(() {
      if (_moduleBackStack.isNotEmpty) {
        _activeModule = _moduleBackStack.removeLast();
      } else {
        _activeModule = null;
      }
    });
  }

  Future<bool> _handleSystemBack() async {
    if (_activeModule != null) {
      // Let OrganizerScreen handle its own back navigation if it has sub-nav
      if (_activeModule == AppModule.organizer && _organizerHasSubNav) {
        _organizerBackHandler?.call();
        return false;
      }
      _closeModule();
      _organizerHasSubNav = false;
      return false;
    }
    if (_currentIndex != 0) {
      setState(() => _currentIndex = 0);
      return false;
    }

    final now = DateTime.now();
    final lastPressed = _lastHomeBackPressed;
    if (lastPressed != null && now.difference(lastPressed) <= _homeBackExitWindow) {
      await SystemNavigator.pop();
      return true;
    }

    _lastHomeBackPressed = now;
    if (mounted) {
      setState(() => _showHomeBackExitHint = true);
      Future<void>.delayed(const Duration(milliseconds: 1400), () {
        if (!mounted) return;
        if (_lastHomeBackPressed == now) {
          setState(() => _showHomeBackExitHint = false);
        }
      });
    }
    return false;
  }

  void _openReportsFromModule() {
    setState(() {
      _activeModule = null;
      _currentIndex = 2;
    });
  }

  void _returnToTransactionsAfterDelete() {
    setState(() {
      _moduleBackStack.removeWhere((module) => module == AppModule.transactionDetail);
      _activeModule = AppModule.transactions;
    });
  }

  @override
  void initState() {
    super.initState();
    // Fire-and-forget: quietly refreshes the accountant's data if the
    // user has an active accountant link and it's been a while since
    // the last auto-sync. Never awaited, never shown to the user —
    // this is what makes "grant access, then forget about it" true
    // instead of requiring a manual "Sync now" tap every visit.
    unawaited(AccountantAccessService.autoSyncIfDue());
  }

  @override
  Widget build(BuildContext context) {
    final safeTop = MediaQuery.of(context).padding.top;
    final isHomeRoot = _activeModule == null && _currentIndex == 0;
    final headerHeight = isHomeRoot ? TopBrandHeader.homeReservedHeight : TopBrandHeader.height;

    final pages = <Widget>[
      HomeScreen(
        onNavigate: _setPage,
        onOpenScanExpenses: () => _openModule(AppModule.expensesHub),
        onOpenSelfAssessment: () => _openModule(AppModule.selfAssessment),
        onOpenTransactions: () => _openModule(AppModule.transactions),
        onOpenInvoices: () => _openModule(AppModule.invoices),
        onOpenVatReturn: () => _openModule(AppModule.vatReturn),
        onOpenMtd: () => _openModule(AppModule.mtd),
        onOpenOrganizer: () => _openModule(AppModule.organizer),
        onOpenBankConnection: () => _openModule(AppModule.bankConnection),
        onOpenHmrcConnection: () => _openModule(AppModule.hmrcConnection),
        onOpenGovConnection: () => _openModule(AppModule.govConnection),
        onOpenBankImport: () => _openModule(AppModule.bankImport),
        onOpenBoltImport: () => _openModule(AppModule.boltImport),
        onOpenHmrcDeadlines: () => _openModule(AppModule.hmrcDeadlines),
        onOpenMileageTracker: () => _openModule(AppModule.mileageTracker),
        onOpenBusinessDetails: () => _openModule(AppModule.businessDetails),
        onOpenFaq: _openFaq,
      ),
      DashboardScreen(onOpenTaxBreakdown: () => _openModule(AppModule.taxBreakdown)),
      ReportsScreen(
        onOpenAccountantExport: () => _openModule(AppModule.accountantExport),
        onOpenCisStatement: () => _openModule(AppModule.cisStatement),
        onOpenAccountantAccess: () => _openModule(AppModule.accountantAccess),
      ),
      BusinessScreen(
        onOpenBusinessDetails: () => _openModule(AppModule.businessDetails),
        onOpenEmployers: () => _openModule(AppModule.employers),
        onOpenTaxVatSettings: () => _openModule(AppModule.taxVatSettings),
        onOpenVehicleManager: () => _openModule(AppModule.vehicleManager),
        onOpenPaye: () => _openModule(AppModule.payeEmployment),
        onOpenInvoiceSettings: () => _openModule(AppModule.invoiceSettings),
        onOpenAccountantDetails: () => _openModule(AppModule.accountantDetails),
        onOpenExportData: () => _openModule(AppModule.accountantExport),
        onOpenBackupRestore: () => _openModule(AppModule.backupRestore),
      ),
      SettingsScreen(
        onOpenBusinessDetails: () => _openModule(AppModule.businessDetails),
        onOpenTaxVatSettings: () => _openModule(AppModule.taxVatSettings),
        onOpenInvoiceSettings: () => _openModule(AppModule.invoiceSettings),
        onOpenPayeEmployment: () => _openModule(AppModule.payeEmployment),
        onOpenAccountantDetails: () => _openModule(AppModule.accountantDetails),
        onOpenAppPreferences: () => _openModule(AppModule.appPreferences),
        onOpenMtd: () => _openModule(AppModule.mtd),
        onOpenBankImportRules: () => _openModule(AppModule.bankImportRules),
        onOpenCloudAccount: () => _openModule(AppModule.cloudAccount),
        onOpenAppDiagnostics: () => _openModule(AppModule.appDiagnostics),
        onOpenDataHealth: () => _openModule(AppModule.dataHealth),
        onOpenReleaseReadiness: () => _openModule(AppModule.releaseReadiness),
        onOpenLegalCompliance: () => _openModule(AppModule.legalCompliance),
        onOpenAbout: () => _openModule(AppModule.about),
        onOpenTerms: () => _openModule(AppModule.terms),
        onOpenPrivacy: () => _openModule(AppModule.privacy),
        onOpenContact: () => _openModule(AppModule.contact),
        onOpenSupportCentre: () => _openModule(AppModule.supportCentre),
        onOpenHelpFaq: () => _openFaq(),
        onOpenLegalProtection: () => _openModule(AppModule.legalProtection),
        onOpenPrivacySecurity: () => _openModule(AppModule.privacySecurity),
        onOpenCrashLogs: () => _openModule(AppModule.crashLogs),
      ),
    ];

    final Widget currentPage = switch (_activeModule) {
      AppModule.cloudAccount => CloudAccountScreen(onBack: _closeModule),
      AppModule.expensesHub => ExpensesHubScreen(
          onBack: _closeModule,
          onOpenAddExpense: () => _openModule(AppModule.addExpense),
          onOpenExpenseDetail: () => _openModule(AppModule.expenseDetail),
        ),
      AppModule.addExpense => AddExpenseScreen(onBack: () => _openModule(AppModule.expensesHub), onSaved: () => _openModule(AppModule.expensesHub)),
      AppModule.expenseDetail => ExpenseDetailScreen(onBack: () => _openModule(AppModule.expensesHub), onEdit: () => _openModule(AppModule.addExpense)),
      AppModule.selfAssessment => SelfAssessmentScreen(onBack: _closeModule),
      AppModule.taxBreakdown => PremiumGate(
          featureName: 'Official Tax Breakdown',
          onBack: _closeModule,
          child: const TaxBreakdownScreen(),
        ),
      AppModule.transactions => TransactionsScreen(
          onOpenAddTransaction: () { AddTransactionScreen.editSelectedTransaction = false; _openModule(AppModule.addTransaction); },
          onOpenTransactionDetail: () => _openModule(AppModule.transactionDetail),
        ),
      AppModule.addTransaction => AddTransactionScreen(onSaved: () => _openModule(AppModule.transactions)),
      AppModule.transactionDetail => TransactionDetailScreen(
          onEdit: () { AddTransactionScreen.editSelectedTransaction = true; _openModule(AppModule.addTransaction); },
          onDeleted: _returnToTransactionsAfterDelete,
        ),
      AppModule.invoices => InvoicesScreen(
          onBack: _closeModule,
          onOpenInvoiceDetail: () => _openModule(AppModule.invoiceDetail),
          onOpenInvoicePreview: () => _openModule(AppModule.invoicePreview),
        ),
      AppModule.invoiceDetail => InvoiceDetailScreen(
          onEdit: () => _openModule(AppModule.invoices),
          onPreview: () => _openModule(AppModule.invoicePreview),
        ),
      AppModule.invoicePreview => InvoicePreviewScreen(
          onBack: () => _openModule(AppModule.invoices),
          onOpenBusinessDetails: () => _openModule(AppModule.businessDetails),
        ),
      AppModule.vatReturn => VatReturnScreen(
          onBack: _closeModule,
          onOpenPreview: () => _openModule(AppModule.vatReturnPreview),
          onOpenStatement: () => _openModule(AppModule.vatStatement),
        ),
      AppModule.vatReturnPreview => PremiumGate(
          featureName: 'VAT Return PDF',
          onBack: _closeModule,
          child: const VatReturnPreviewScreen(),
        ),
      AppModule.vatStatement => PremiumGate(
          featureName: 'VAT Statement',
          onBack: _closeModule,
          child: VatStatementScreen(onBack: _closeModule),
        ),
      AppModule.cisStatement => PremiumGate(
          featureName: 'CIS Deduction Statement',
          onBack: _closeModule,
          child: CisStatementScreen(onBack: _closeModule),
        ),
      AppModule.mtd => MtdHubScreen(
          onBack: _closeModule,
          onOpenVatReturn: () => _openModule(AppModule.vatReturn),
          onOpenReports: _openReportsFromModule,
          onOpenDeadlines: () => _openModule(AppModule.hmrcDeadlines),
          onOpenCloudBackup: () => _openModule(AppModule.cloudAccount),
          onOpenHmrcConnection: () => _openModule(AppModule.hmrcConnection),
        ),
      AppModule.organizer => OrganizerScreen(
        onSubNavChanged: (hasSubNav) => setState(() => _organizerHasSubNav = hasSubNav),
        onRegisterBackHandler: (handler) => _organizerBackHandler = handler,
          onClose: _closeModule,
          onNavigate: (index) {
            _closeModule();
            _setPage(index);
          },
        ),
      AppModule.bankConnection => BankConnectionScreen(onBack: _closeModule),
      AppModule.hmrcConnection => PremiumGate(
          featureName: 'HMRC filing',
          onBack: _closeModule,
          child: HmrcConnectionScreen(onBack: _closeModule),
        ),
      AppModule.govConnection => GovConnectionScreen(onBack: _closeModule),
      AppModule.bankImport => BankImportScreen(
          onBack: _closeModule,
          onOpenImportHistory: () => _openModule(AppModule.importHistory),
          onOpenBankConnection: () => _openModule(AppModule.bankConnection),
        ),
      AppModule.bankImportRules => const BankImportRulesScreen(),
      AppModule.boltImport => BoltImportScreen(onBack: _closeModule),
      AppModule.importHistory => const ImportHistoryScreen(),
      AppModule.hmrcDeadlines => NotificationsDeadlinesScreen(onBack: _closeModule),
      AppModule.mileageTracker => MileageTrackerScreen(
          onBack: _closeModule,
          onOpenVehicleManager: () => _openModule(AppModule.vehicleManager),
        ),
      AppModule.vehicleManager => VehicleManagerScreen(onBack: _closeModule),
      AppModule.employers => EmployersScreen(onOpenAddEmployer: () => _openModule(AppModule.addEmployer)),
      AppModule.addEmployer => AddEmployerScreen(onSaved: () => _openModule(AppModule.employers)),
      AppModule.payeEmployment => const PayeEmploymentScreen(),
      AppModule.accountantExport => PremiumGate(
          featureName: 'Accountant export',
          onBack: _closeModule,
          child: AccountantExportScreen(onBack: _closeModule),
        ),
      AppModule.accountantAccess => PremiumGate(
          featureName: 'Accountant access',
          onBack: _closeModule,
          child: AccountantAccessScreen(onBack: _closeModule),
        ),
      AppModule.businessDetails => BusinessDetailsScreen(onBack: _closeModule),
      AppModule.taxVatSettings => TaxVatSettingsScreen(onBack: _closeModule),
      AppModule.invoiceSettings => InvoiceSettingsScreen(onBack: _closeModule),
      AppModule.accountantDetails => AccountantDetailsScreen(onBack: _closeModule),
      AppModule.appPreferences => AppPreferencesScreen(onBack: _closeModule),
      AppModule.appDiagnostics => AppDiagnosticsScreen(onBack: _closeModule),
      AppModule.dataHealth => DataHealthScreen(onBack: _closeModule),
      AppModule.releaseReadiness => ReleaseReadinessScreen(onBack: _closeModule),
      AppModule.legalCompliance => LegalComplianceScreen(
          onBack: _closeModule,
          onOpenPrivacyPolicy: () => _openModule(AppModule.privacy),
          onOpenTerms: () => _openModule(AppModule.terms),
          onOpenLegalDisclaimer: () => _openModule(AppModule.legalDisclaimer),
          onOpenSubscriptionTerms: () => _openModule(AppModule.subscriptionTerms),
          onOpenDataSecurity: () => _openModule(AppModule.dataSecurity),
          onOpenDataRetention: () => _openModule(AppModule.dataRetention),
          onOpenOpenBankingPolicy: () => _openModule(AppModule.openBankingPolicy),
          onOpenAbout: () => _openModule(AppModule.about),
          onOpenSupport: () => _openModule(AppModule.supportCentre),
          onOpenContact: () => _openModule(AppModule.contact),
        ),
      AppModule.about => LegalInfoScreen(kind: LegalInfoKind.about, onBack: _closeModule),
      AppModule.terms => LegalInfoScreen(kind: LegalInfoKind.terms, onBack: _closeModule),
      AppModule.privacy => LegalInfoScreen(kind: LegalInfoKind.privacy, onBack: _closeModule),
      AppModule.legalDisclaimer => LegalInfoScreen(kind: LegalInfoKind.legalDisclaimer, onBack: _closeModule),
      AppModule.subscriptionTerms => LegalInfoScreen(kind: LegalInfoKind.subscriptionTerms, onBack: _closeModule),
      AppModule.dataSecurity => LegalInfoScreen(kind: LegalInfoKind.dataSecurity, onBack: _closeModule),
      AppModule.dataRetention => LegalInfoScreen(kind: LegalInfoKind.dataRetention, onBack: _closeModule),
      AppModule.openBankingPolicy => LegalInfoScreen(kind: LegalInfoKind.openBankingPolicy, onBack: _closeModule),
      AppModule.contact => LegalInfoScreen(kind: LegalInfoKind.contact, onBack: _closeModule),
      AppModule.supportCentre => LegalInfoScreen(kind: LegalInfoKind.support, onBack: _closeModule),
      AppModule.helpFaq => HelpFaqScreen(onBack: _closeModule, initialQuery: _pendingFaqQuery),
      AppModule.legalProtection => LegalInfoScreen(kind: LegalInfoKind.legalProtection, onBack: _closeModule),
      AppModule.privacySecurity => PrivacySecurityScreen(onBack: _closeModule),
      AppModule.backupRestore => BackupRestoreScreen(onBack: _closeModule),
      AppModule.crashLogs => LegalInfoScreen(kind: LegalInfoKind.crashLogs, onBack: _closeModule),
      null => pages[_currentIndex],
    };

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) return;
        await _handleSystemBack();
      },
      child: Scaffold(
      extendBody: true,
      backgroundColor: AppColors.bg,
      body: Stack(
        children: [
          const DecoratedBox(
            decoration: BoxDecoration(gradient: AppGradients.appBackground),
            child: SizedBox.expand(),
          ),
          Padding(
            padding: EdgeInsets.only(top: headerHeight + safeTop),
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 180),
              switchInCurve: Curves.easeOut,
              switchOutCurve: Curves.easeIn,
              transitionBuilder: (child, animation) {
                return FadeTransition(
                  opacity: animation,
                  child: SlideTransition(
                    position: Tween<Offset>(
                      begin: const Offset(0.015, 0),
                      end: Offset.zero,
                    ).animate(animation),
                    child: child,
                  ),
                );
              },
              child: KeyedSubtree(
                key: ValueKey<String>(
                  _activeModule == null ? 'nav_$_currentIndex' : 'module_${_activeModule!.name}',
                ),
                child: currentPage,
              ),
            ),
          ),
          Align(
            alignment: Alignment.topCenter,
            child: TopBrandHeader(
              homeMode: isHomeRoot,
              onOpenNotifications: () => _openModule(AppModule.hmrcDeadlines),
            ),
          ),
          IgnorePointer(
            ignoring: true,
            child: Align(
              alignment: Alignment.bottomCenter,
              child: AnimatedOpacity(
                opacity: _showHomeBackExitHint ? 1 : 0,
                duration: const Duration(milliseconds: 140),
                curve: Curves.easeOut,
                child: Padding(
                  padding: EdgeInsets.only(
                    left: 24,
                    right: 24,
                    bottom: 118 + MediaQuery.paddingOf(context).bottom,
                  ),
                  child: Text(
                    'Press back again to exit',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: AppColors.textSecondary.withValues(alpha: 0.98),
                      fontSize: 13.5,
                      fontWeight: FontWeight.w600,
                      height: 1.2,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: AppBottomNav(currentIndex: _currentIndex, onTap: _setPage),
      ),
    );
  }
}



