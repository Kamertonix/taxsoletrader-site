import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../services/accountant_access_service.dart';
import '../../services/local_app_storage.dart';
import '../../theme/app_theme.dart';
import '../../widgets/android_dark_action_button.dart';
import '../../widgets/android_dark_confirm_dialog.dart';
import '../../widgets/tst_card.dart';

/// "Accountant Access" — lets the user invite their accountant to a
/// read-only, live view of their tax data, approve/decline redeemed
/// invites, see who's currently connected and what they can see, sync
/// data on demand, and revoke access at any time.
///
/// Everything here is deliberate, nothing automatic: an invite is only
/// created when the user taps the button, approval only happens on an
/// explicit tap, and syncing only happens on "Sync now" — same
/// local-first philosophy as the rest of the app.
class AccountantAccessScreen extends StatefulWidget {
  const AccountantAccessScreen({super.key, required this.onBack});

  final VoidCallback onBack;

  @override
  State<AccountantAccessScreen> createState() => _AccountantAccessScreenState();
}

class _AccountantAccessScreenState extends State<AccountantAccessScreen> {
  bool _loading = true;
  bool _busy = false;
  List<AccountantLink> _links = const <AccountantLink>[];
  Map<AccountantCategory, DateTime> _syncStatus = const <AccountantCategory, DateTime>{};
  final Map<AccountantCategory, bool> _newInvitePermissions = {
    for (final category in AccountantCategory.values)
      category: category != AccountantCategory.documents && category != AccountantCategory.selfAssessment,
  };
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() => _loading = true);
    try {
      final links = AccountantAccessService.isBackendReady ? await AccountantAccessService.loadLinks() : const <AccountantLink>[];
      final syncStatus = AccountantAccessService.isBackendReady ? await AccountantAccessService.loadSyncStatus() : const <AccountantCategory, DateTime>{};
      if (!mounted) return;
      setState(() {
        _links = links;
        _syncStatus = syncStatus;
        _loading = false;
        _error = null;
      });
    } catch (error) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _error = '$error';
      });
    }
  }

  AccountantLink? get _activeOrPendingLink {
    for (final link in _links) {
      if (link.isAwaitingRedeem || link.isAwaitingApproval || link.isAccepted) return link;
    }
    return null;
  }

  List<AccountantLink> get _pastLinks => _links.where((l) => l.status == 'revoked' || l.status == 'declined').toList(growable: false);

  Future<void> _runBusy(Future<void> Function() action) async {
    if (_busy) return;
    setState(() => _busy = true);
    try {
      await action();
      await _load();
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$error')));
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _createInvite() async {
    await _runBusy(() async {
      final code = await AccountantAccessService.createInvite(permissions: _newInvitePermissions);
      if (!mounted) return;
      HapticFeedback.mediumImpact();
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Invite code ready: $code')));
    });
  }

  Future<void> _respond(AccountantLink link, bool approve) async {
    await _runBusy(() => AccountantAccessService.respondToInvite(linkId: link.id, approve: approve));
  }

  Future<void> _revoke(AccountantLink link) async {
    final confirmed = await AndroidDarkConfirmDialog.show(
      context,
      title: 'Revoke accountant access?',
      message: link.accountantFirmName.isEmpty
          ? 'Your accountant will immediately lose access to your shared data.'
          : '${link.accountantFirmName} will immediately lose access to your shared data.',
      confirmLabel: 'Revoke',
      icon: Icons.link_off_rounded,
    );
    if (!confirmed) return;
    await _runBusy(() => AccountantAccessService.revokeLink(link.id));
  }

  Future<void> _syncNow(AccountantLink link) async {
    await _runBusy(() async {
      final settings = await LocalAppStorage.loadTaxVatSettings();
      final now = DateTime.now();
      final taxYearStart = now.month > 4 || (now.month == 4 && now.day >= 6) ? now.year : now.year - 1;
      final periodFrom = DateTime(taxYearStart, 4, 6);
      final periodTo = DateTime(taxYearStart + 1, 4, 5);
      final categories = link.permissions.entries.where((e) => e.value).map((e) => e.key).toSet();
      await AccountantAccessService.syncNow(
        categories: categories,
        businessOnly: true,
        periodFrom: periodFrom,
        periodTo: periodTo,
      );
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Synced. Your accountant now sees the latest data.')));
      // settings is loaded only to keep this in step with
      // AccountantExportScreen's tax-year logic if it changes later.
      settings;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator(color: AppColors.accentLight));
    }

    final link = _activeOrPendingLink;

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, AppDimens.pageBottomPadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            IconButton(onPressed: widget.onBack, icon: const Icon(Icons.arrow_back_rounded, color: AppColors.textPrimary)),
            const SizedBox(width: 4),
            const Expanded(
              child: Text('🧾 Accountant Access', style: TextStyle(color: AppColors.textPrimary, fontSize: 24, fontWeight: FontWeight.w900)),
            ),
          ]),
          const SizedBox(height: 6),
          const Text(
            'Give your accountant a live, read-only view of your tax data — they can never edit or delete anything, and you can revoke access any time.',
            style: TextStyle(color: AppColors.textSecondary, fontSize: 13.5, fontWeight: FontWeight.w600, height: 1.4),
          ),
          const SizedBox(height: 18),

          if (!AccountantAccessService.isBackendReady)
            TstCard(
              color: AppColors.cardOrange,
              borderColor: AppColors.warningBorder,
              radius: 18,
              padding: const EdgeInsets.all(16),
              child: const Text(
                'Accountant Access needs Cloud Account. Sign in to Cloud Account first.',
                style: TextStyle(color: AppColors.textPrimary, fontSize: 13.5, fontWeight: FontWeight.w700, height: 1.35),
              ),
            )
          else if (_error != null)
            TstCard(
              color: AppColors.cardRed,
              borderColor: AppColors.danger,
              radius: 18,
              padding: const EdgeInsets.all(16),
              child: Text(_error!, style: const TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w700)),
            )
          else if (link == null)
            _InviteCard(
              permissions: _newInvitePermissions,
              busy: _busy,
              onTogglePermission: (category, value) => setState(() => _newInvitePermissions[category] = value),
              onCreateInvite: _createInvite,
            )
          else if (link.isAwaitingRedeem)
            _WaitingForAccountantCard(inviteCode: link.inviteCode ?? '', busy: _busy, onCancel: () => _revoke(link))
          else if (link.isAwaitingApproval)
            _ApprovalRequestCard(link: link, busy: _busy, onApprove: () => _respond(link, true), onDecline: () => _respond(link, false))
          else if (link.isAccepted)
            _ConnectedCard(link: link, syncStatus: _syncStatus, busy: _busy, onSyncNow: () => _syncNow(link), onRevoke: () => _revoke(link)),

          if (_pastLinks.isNotEmpty) ...[
            const SizedBox(height: 22),
            const Text('Past connections', style: TextStyle(color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.w900)),
            const SizedBox(height: 10),
            ..._pastLinks.map((l) => _PastLinkRow(link: l)),
          ],
        ],
      ),
    );
  }
}

class _InviteCard extends StatelessWidget {
  const _InviteCard({
    required this.permissions,
    required this.busy,
    required this.onTogglePermission,
    required this.onCreateInvite,
  });

  final Map<AccountantCategory, bool> permissions;
  final bool busy;
  final void Function(AccountantCategory, bool) onTogglePermission;
  final VoidCallback onCreateInvite;

  @override
  Widget build(BuildContext context) {
    return TstCard(
      radius: 18,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Invite your accountant', style: TextStyle(color: AppColors.textPrimary, fontSize: 17, fontWeight: FontWeight.w900)),
          const SizedBox(height: 4),
          const Text(
            'Choose what to share, then generate a code. Give it to your accountant — they enter it in their own portal, then you confirm access here before anything is visible.',
            style: TextStyle(color: AppColors.textSecondary, fontSize: 12.5, fontWeight: FontWeight.w600, height: 1.4),
          ),
          const SizedBox(height: 14),
          ...AccountantCategory.values.map((category) => _PermissionToggleRow(
                category: category,
                value: permissions[category] ?? false,
                onChanged: (v) => onTogglePermission(category, v),
              )),
          const SizedBox(height: 6),
          AndroidDarkActionButton(
            label: busy ? 'Creating…' : 'Generate invite code',
            icon: Icons.person_add_alt_1_rounded,
            onTap: busy ? null : onCreateInvite,
          ),
        ],
      ),
    );
  }
}

class _PermissionToggleRow extends StatelessWidget {
  const _PermissionToggleRow({required this.category, required this.value, required this.onChanged});

  final AccountantCategory category;
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          Expanded(
            child: Text(category.label, style: const TextStyle(color: AppColors.textPrimary, fontSize: 13.5, fontWeight: FontWeight.w700)),
          ),
          Switch(value: value, onChanged: onChanged, activeThumbColor: AppColors.accent),
        ],
      ),
    );
  }
}

class _WaitingForAccountantCard extends StatelessWidget {
  const _WaitingForAccountantCard({required this.inviteCode, required this.busy, required this.onCancel});

  final String inviteCode;
  final bool busy;
  final VoidCallback onCancel;

  @override
  Widget build(BuildContext context) {
    return TstCard(
      color: AppColors.cardBlue,
      borderColor: AppColors.accentStroke,
      radius: 18,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Waiting for your accountant', style: TextStyle(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.w900)),
          const SizedBox(height: 10),
          Center(
            child: SelectableText(
              inviteCode,
              style: const TextStyle(color: AppColors.accentLight, fontSize: 30, fontWeight: FontWeight.w900, letterSpacing: 4),
            ),
          ),
          const SizedBox(height: 10),
          const Text(
            'Share this code with your accountant. Nothing is visible to them until you approve the connection here, after they enter it.',
            style: TextStyle(color: AppColors.textSecondary, fontSize: 12.5, fontWeight: FontWeight.w600, height: 1.4),
          ),
          const SizedBox(height: 12),
          AndroidDarkActionButton(label: 'Cancel invite', kind: AndroidDarkButtonKind.danger, onTap: busy ? null : onCancel),
        ],
      ),
    );
  }
}

class _ApprovalRequestCard extends StatelessWidget {
  const _ApprovalRequestCard({required this.link, required this.busy, required this.onApprove, required this.onDecline});

  final AccountantLink link;
  final bool busy;
  final VoidCallback onApprove;
  final VoidCallback onDecline;

  @override
  Widget build(BuildContext context) {
    final name = link.accountantFirmName.isNotEmpty ? link.accountantFirmName : (link.accountantDisplayName.isNotEmpty ? link.accountantDisplayName : 'An accountant');
    return TstCard(
      color: AppColors.cardOrange,
      borderColor: AppColors.warningBorder,
      radius: 18,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('$name wants access', style: const TextStyle(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.w900)),
          const SizedBox(height: 6),
          const Text(
            'They redeemed your invite code and are waiting for your confirmation. They will only see the categories you selected, and only after you confirm.',
            style: TextStyle(color: AppColors.textSecondary, fontSize: 12.5, fontWeight: FontWeight.w600, height: 1.4),
          ),
          const SizedBox(height: 12),
          Row(children: [
            Expanded(child: AndroidDarkActionButton(label: 'Decline', kind: AndroidDarkButtonKind.danger, compact: true, onTap: busy ? null : onDecline)),
            const SizedBox(width: 10),
            Expanded(child: AndroidDarkActionButton(label: 'Confirm', kind: AndroidDarkButtonKind.success, compact: true, onTap: busy ? null : onApprove)),
          ]),
        ],
      ),
    );
  }
}

class _ConnectedCard extends StatelessWidget {
  const _ConnectedCard({required this.link, required this.syncStatus, required this.busy, required this.onSyncNow, required this.onRevoke});

  final AccountantLink link;
  final Map<AccountantCategory, DateTime> syncStatus;
  final bool busy;
  final VoidCallback onSyncNow;
  final VoidCallback onRevoke;

  String _formatDate(DateTime? date) {
    if (date == null) return 'Never';
    final local = date.toLocal();
    String two(int n) => n.toString().padLeft(2, '0');
    return '${two(local.day)}/${two(local.month)}/${local.year} ${two(local.hour)}:${two(local.minute)}';
  }

  @override
  Widget build(BuildContext context) {
    final grantedCategories = link.permissions.entries.where((e) => e.value).map((e) => e.key).toList(growable: false);
    final oldestSync = grantedCategories
        .map((c) => syncStatus[c])
        .whereType<DateTime>()
        .fold<DateTime?>(null, (min, d) => min == null || d.isBefore(min) ? d : min);

    return TstCard(
      color: AppColors.cardSoft,
      borderColor: AppColors.success,
      radius: 18,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '✅ ${link.accountantFirmName.isNotEmpty ? link.accountantFirmName : 'Connected accountant'}',
            style: const TextStyle(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.w900),
          ),
          if (link.accountantDisplayName.isNotEmpty) ...[
            const SizedBox(height: 2),
            Text(link.accountantDisplayName, style: const TextStyle(color: AppColors.headerGreeting, fontSize: 12.5, fontWeight: FontWeight.w700)),
          ],
          const SizedBox(height: 4),
          Text('Connected since ${_formatDate(link.acceptedAt)}', style: const TextStyle(color: AppColors.textMuted, fontSize: 11.5, fontWeight: FontWeight.w600)),
          const SizedBox(height: 12),
          const Text('Shared categories', style: TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w800)),
          const SizedBox(height: 6),
          Wrap(
            spacing: 6,
            runSpacing: 6,
            children: grantedCategories
                .map((c) => Chip(
                      label: Text(c.label, style: const TextStyle(color: AppColors.textPrimary, fontSize: 11.5, fontWeight: FontWeight.w700)),
                      backgroundColor: AppColors.input,
                      side: const BorderSide(color: AppColors.borderSoft),
                      visualDensity: VisualDensity.compact,
                    ))
                .toList(growable: false),
          ),
          const SizedBox(height: 12),
          Text('Data as of: ${_formatDate(oldestSync)}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12.5, fontWeight: FontWeight.w700)),
          const SizedBox(height: 4),
          const Text(
            'Refreshes quietly whenever you open the app (at most a few times a day). Press "Sync now" if you want your accountant to see this instant.',
            style: TextStyle(color: AppColors.textMuted, fontSize: 11.5, fontWeight: FontWeight.w600, height: 1.35),
          ),
          const SizedBox(height: 14),
          AndroidDarkActionButton(label: busy ? 'Syncing…' : 'Sync now', icon: Icons.sync_rounded, kind: AndroidDarkButtonKind.export, onTap: busy ? null : onSyncNow),
          const SizedBox(height: 10),
          AndroidDarkActionButton(label: 'Revoke access', icon: Icons.link_off_rounded, kind: AndroidDarkButtonKind.danger, onTap: busy ? null : onRevoke),
        ],
      ),
    );
  }
}

class _PastLinkRow extends StatelessWidget {
  const _PastLinkRow({required this.link});

  final AccountantLink link;

  @override
  Widget build(BuildContext context) {
    final name = link.accountantFirmName.isNotEmpty ? link.accountantFirmName : (link.accountantDisplayName.isNotEmpty ? link.accountantDisplayName : 'Unknown');
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: TstCard(
        radius: 14,
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        child: Row(
          children: [
            Icon(
              link.status == 'revoked' ? Icons.link_off_rounded : Icons.close_rounded,
              color: AppColors.textMuted,
              size: 18,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(name, style: const TextStyle(color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.w700)),
            ),
            Text(
              link.status == 'revoked' ? 'Revoked' : 'Declined',
              style: const TextStyle(color: AppColors.textMuted, fontSize: 11.5, fontWeight: FontWeight.w700),
            ),
          ],
        ),
      ),
    );
  }
}
