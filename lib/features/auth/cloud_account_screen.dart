import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../models/sync_snapshot.dart';
import '../../services/app_sync_service.dart';
import '../../services/cloud_account_service.dart';
import '../../services/data_rights_service.dart';
import '../../services/entitlement_service.dart';
import '../../services/profile_setup_status_service.dart';
import '../../theme/app_theme.dart';
import '../../widgets/android_motion.dart';
import '../../widgets/android_dark_action_button.dart';
import '../../widgets/android_dark_confirm_dialog.dart';
import '../../widgets/android_dark_glass_card.dart';

enum _AuthAction { signIn, signUp, reset, signOut, googleSignIn }

class CloudAccountScreen extends StatefulWidget {
  const CloudAccountScreen({super.key, required this.onBack});

  final VoidCallback onBack;

  @override
  State<CloudAccountScreen> createState() => _CloudAccountScreenState();
}

class _CloudAccountScreenState extends State<CloudAccountScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _obscurePassword = true;
  bool _busy = false;
  String _status = CloudAccountService.statusText;
  late Future<SyncSnapshot> _snapshotFuture;
  late Future<DataRightsStatus> _dataRightsFuture;
  late Future<EntitlementStatus> _entitlementFuture;

  @override
  void initState() {
    super.initState();
    _snapshotFuture = AppSyncService.buildLocalSnapshot();
    _dataRightsFuture = DataRightsService.loadStatus();
    // forceRefresh: this screen is exactly where someone checks "am I
    // still subscribed, when does it renew" — a 5-minute-stale cached
    // answer would be the wrong thing to show here specifically.
    _entitlementFuture = EntitlementService.currentStatus(forceRefresh: true);
    _refreshStatus();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _refreshStatus() {
    final email = CloudAccountService.currentUserEmail;
    setState(() {
      _status = email == null
          ? CloudAccountService.statusText
          : 'Signed in as $email. Local-first backup and cloud sync are ready.';
    });
  }

  void _reloadSnapshot() {
    _snapshotFuture = AppSyncService.buildLocalSnapshot();
    setState(() {});
  }

  void _reloadDataRights() {
    _dataRightsFuture = DataRightsService.loadStatus();
    setState(() {});
  }

  Future<void> _runAuthAction(_AuthAction action) async {
    if (_busy) return;

    setState(() {
      _busy = true;
      _status = switch (action) {
        _AuthAction.signIn => 'Signing in...',
        _AuthAction.signUp => 'Creating account...',
        _AuthAction.reset => 'Requesting password reset...',
        _AuthAction.signOut => 'Signing out...',
        _AuthAction.googleSignIn => 'Signing in with Google...',
      };
    });

    try {
      final message = switch (action) {
        _AuthAction.signIn => await CloudAccountService.signInWithPassword(
            email: _emailController.text,
            password: _passwordController.text,
          ),
        _AuthAction.signUp => await CloudAccountService.signUpWithPassword(
            email: _emailController.text,
            password: _passwordController.text,
          ),
        _AuthAction.reset => await CloudAccountService.sendPasswordReset(
            email: _emailController.text,
          ),
        _AuthAction.signOut => await _signOutMessage(),
        _AuthAction.googleSignIn => await CloudAccountService.signInWithGoogle(),
      };

      if (!mounted) return;
      setState(() => _status = message);
      _refreshStatus();
      _reloadSnapshot();
    } catch (error) {
      if (!mounted) return;
      setState(() => _status = 'Cloud action failed: $error');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _createLocalBackupManifest() async {
    if (_busy) return;
    setState(() {
      _busy = true;
      _status = 'Creating local backup manifest...';
    });
    try {
      final userId = CloudAccountService.currentUserEmail ?? 'local_user';
      final message = await AppSyncService.createLocalBackupManifest(userId: userId);
      if (!mounted) return;
      setState(() => _status = message);
      _reloadSnapshot();
    } catch (error) {
      if (!mounted) return;
      setState(() => _status = 'Backup manifest failed: $error');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<String> _signOutMessage() async {
    await CloudAccountService.signOut();
    return CloudAccountService.isConfigured
        ? 'Signed out. You can sign in again when needed.'
        : CloudAccountService.statusText;
  }

  Future<void> _exportAllMyData() async {
    if (_busy) return;
    setState(() {
      _busy = true;
      _status = 'Preparing your data export...';
    });
    try {
      final message = await DataRightsService.performRealDataExport();
      if (!mounted) return;
      setState(() => _status = message);
      _reloadDataRights();
    } catch (error) {
      if (!mounted) return;
      setState(() => _status = 'Data export failed: $error');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _deleteAllMyLocalData() async {
    if (_busy) return;

    final firstConfirm = await AndroidDarkConfirmDialog.show(
      context,
      title: 'Delete all local data?',
      message: 'This permanently removes every transaction, invoice, expense, '
          'mileage trip, vehicle, receipt photo, certificate photo and setting '
          'stored on this device. This cannot be undone. Cloud data (if you use '
          'cloud sync) is not affected by this — it must be requested separately.',
      confirmLabel: 'Continue',
      icon: Icons.delete_forever_rounded,
    );
    if (!mounted || !firstConfirm) return;

    final finalConfirm = await AndroidDarkConfirmDialog.show(
      context,
      title: 'Are you absolutely sure?',
      message: 'There is no way to recover this data afterwards unless you '
          'exported a backup first. The app will need to be set up again from '
          'scratch on next launch.',
      confirmLabel: 'Yes, delete everything',
      icon: Icons.warning_amber_rounded,
    );
    if (!mounted || !finalConfirm) return;

    setState(() {
      _busy = true;
      _status = 'Deleting all local data...';
    });
    try {
      final message = await DataRightsService.performRealAccountDeletion();
      if (!mounted) return;
      setState(() => _status = message);
      _reloadDataRights();
      _reloadSnapshot();
    } catch (error) {
      if (!mounted) return;
      setState(() => _status = 'Account deletion failed: $error');
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final signedInEmail = CloudAccountService.currentUserEmail;
    final isSignedIn = signedInEmail != null;

    return SingleChildScrollView(
      clipBehavior: Clip.none,
      padding: const EdgeInsets.fromLTRB(
        AppDimens.pagePadding,
        AppDimens.pageTopPadding,
        AppDimens.pagePadding,
        AppDimens.pageBottomPadding,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _BackRow(onBack: widget.onBack),
          const SizedBox(height: 18),
          const Text(
            'Account & Cloud',
            style: TextStyle(fontSize: 26, fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 6),
          const Text(
            'Sign in to back up your data and use the app on more than one device.',
            style: TextStyle(color: AppColors.textSecondary, fontSize: 14, height: 1.35),
          ),
          const SizedBox(height: 18),
          AndroidDarkGlassCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const _SectionTitle(icon: Icons.cloud_done_rounded, title: 'Cloud status'),
                const SizedBox(height: 12),
                _StatusPill(
                  configured: CloudAccountService.isConfigured,
                  signedIn: isSignedIn,
                  text: _status,
                ),
                const SizedBox(height: 14),
                _InfoLine(label: 'Signed in as', value: signedInEmail ?? 'Not signed in'),
              ],
            ),
          ),
          if (isSignedIn) ...[
            const SizedBox(height: 14),
            AndroidDarkGlassCard(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const _SectionTitle(icon: Icons.workspace_premium_rounded, title: 'Subscription'),
                  const SizedBox(height: 12),
                  FutureBuilder<EntitlementStatus>(
                    future: _entitlementFuture,
                    builder: (context, snapshot) {
                      if (!snapshot.hasData && !snapshot.hasError) {
                        return const Padding(
                          padding: EdgeInsets.symmetric(vertical: 8),
                          child: Text('Checking subscription status...', style: TextStyle(color: AppColors.textMuted, fontSize: 12.5)),
                        );
                      }
                      if (snapshot.hasError) {
                        return const Text(
                          'Could not check your subscription status.',
                          style: TextStyle(color: AppColors.textMuted, fontSize: 12.5),
                        );
                      }
                      return _SubscriptionDetails(status: snapshot.data!);
                    },
                  ),
                ],
              ),
            ),
          ],
          const SizedBox(height: 14),
          AndroidDarkGlassCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const _SectionTitle(icon: Icons.lock_rounded, title: 'Sign in / create account'),
                const SizedBox(height: 14),
                TextField(
                  controller: _emailController,
                  enabled: !_busy && !isSignedIn,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(
                    labelText: 'Email',
                    hintText: 'you@example.com',
                    prefixIcon: Icon(Icons.email_rounded),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _passwordController,
                  enabled: !_busy && !isSignedIn,
                  obscureText: _obscurePassword,
                  decoration: InputDecoration(
                    labelText: 'Password',
                    hintText: 'Minimum 6 characters',
                    prefixIcon: const Icon(Icons.password_rounded),
                    suffixIcon: IconButton(
                      onPressed: _busy || isSignedIn
                          ? null
                          : () => setState(() => _obscurePassword = !_obscurePassword),
                      icon: Icon(_obscurePassword ? Icons.visibility_rounded : Icons.visibility_off_rounded),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                if (isSignedIn)
                  _PrimaryActionButton(
                    label: _busy ? 'Please wait...' : 'Sign out',
                    icon: Icons.logout_rounded,
                    secondary: true,
                    enabled: !_busy,
                    onTap: () => _runAuthAction(_AuthAction.signOut),
                  )
                else ...[
                  _PrimaryActionButton(
                    label: _busy ? 'Please wait...' : 'Sign in',
                    icon: Icons.login_rounded,
                    enabled: !_busy,
                    onTap: () => _runAuthAction(_AuthAction.signIn),
                  ),
                  if (CloudAccountService.isGoogleConfigured) ...[
                    const SizedBox(height: 10),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton.icon(
                        onPressed: _busy ? null : () => _runAuthAction(_AuthAction.googleSignIn),
                        icon: Image.asset('assets/images/google_logo.png', width: 18, height: 18),
                        label: Text(_busy ? 'Please wait...' : 'Sign in with Google', style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w800)),
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppColors.border),
                          padding: const EdgeInsets.symmetric(vertical: 13),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),
                    ),
                  ],
                  const SizedBox(height: 10),
                  _SecondaryActionRow(
                    busy: _busy,
                    onCreate: () => _runAuthAction(_AuthAction.signUp),
                    onReset: () => _runAuthAction(_AuthAction.reset),
                  ),
                ],
                if (!CloudAccountService.isConfigured) ...[
                  const SizedBox(height: 12),
                  const Text(
                    'Cloud sign-in is not available on this build yet.',
                    style: TextStyle(color: AppColors.warning, fontSize: 12, height: 1.35, fontWeight: FontWeight.w700),
                  ),
                ],
                if (!isSignedIn && !CloudAccountService.isGoogleConfigured) ...[
                  const SizedBox(height: 12),
                  const Text(
                    'Sign in with Google is hidden until --dart-define=GOOGLE_SERVER_CLIENT_ID=... (the Web OAuth client) is passed at run/build time.',
                    style: TextStyle(color: AppColors.textMuted, fontSize: 11.5, height: 1.35, fontWeight: FontWeight.w600),
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(height: 14),
          FutureBuilder<SyncSnapshot>(
            future: _snapshotFuture,
            builder: (context, snapshot) {
              final data = snapshot.data ?? SyncSnapshot.empty();
              return AndroidDarkGlassCard(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Expanded(child: _SectionTitle(icon: Icons.backup_rounded, title: 'Backup & sync foundation')),
                        IconButton(
                          tooltip: 'Refresh',
                          onPressed: _busy ? null : _reloadSnapshot,
                          icon: const Icon(Icons.refresh_rounded, color: AppColors.accentLight),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    _InfoLine(label: 'Mode', value: data.mode),
                    _InfoLine(label: 'Protected tables', value: AppSyncService.protectedTables.length.toString()),
                    _InfoLine(label: 'Total records', value: data.totalRecords.toString()),
                    _InfoLine(label: 'Business records', value: data.businessRecords.toString()),
                    _InfoLine(label: 'Organizer items', value: data.organizerFiles.toString()),
                    _InfoLine(label: 'Pending uploads', value: data.pendingUploads.toString()),
                    _InfoLine(label: 'Data health', value: data.isHealthy ? 'Healthy' : '${data.damagedRecords} damaged records'),
                    _InfoLine(label: 'Last backup', value: data.lastBackupLabel),
                    const SizedBox(height: 12),
                    _RecordGrid(snapshot: data),
                    const SizedBox(height: 12),
                    _PrimaryActionButton(
                      label: _busy ? 'Please wait...' : 'Create local backup manifest',
                      icon: Icons.inventory_2_rounded,
                      secondary: true,
                      enabled: !_busy,
                      onTap: _createLocalBackupManifest,
                    ),
                    const SizedBox(height: 10),
                    Text(
                      AppSyncService.syncSummary(data),
                      style: const TextStyle(color: AppColors.textMuted, fontSize: 12, height: 1.35),
                    ),
                  ],
                ),
              );
            },
          ),
          const SizedBox(height: 14),
          FutureBuilder<DataRightsStatus>(
            future: _dataRightsFuture,
            builder: (context, snapshot) {
              final status = snapshot.data;
              return AndroidDarkGlassCard(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const _SectionTitle(icon: Icons.privacy_tip_rounded, title: 'Data export & account deletion'),
                    const SizedBox(height: 12),
                    _StatusPill(
                      configured: true,
                      signedIn: true,
                      text: status == null
                          ? 'Checking data rights status...'
                          : DataRightsService.storeReviewSummary(status),
                    ),
                    const SizedBox(height: 12),
                    _InfoLine(label: 'Last export', value: status?.exportRequestLabel ?? 'Checking...'),
                    _InfoLine(
                      label: status?.localDataAlreadyErased == true ? 'Data deleted' : 'Deletion status',
                      value: status?.localDataAlreadyErased == true
                          ? (status?.localDataErasedLabel ?? '')
                          : (status?.deletionRequestLabel ?? 'Checking...'),
                    ),
                    const SizedBox(height: 10),
                    _PrimaryActionButton(
                      label: _busy ? 'Please wait...' : 'Export all my data',
                      icon: Icons.file_download_rounded,
                      secondary: true,
                      enabled: !_busy,
                      onTap: _exportAllMyData,
                    ),
                    const SizedBox(height: 10),
                    _PrimaryActionButton(
                      label: _busy ? 'Please wait...' : 'Delete all my local data',
                      icon: Icons.delete_forever_rounded,
                      secondary: true,
                      enabled: !_busy,
                      onTap: _deleteAllMyLocalData,
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      'Export shares a real file with everything stored on this device. Deletion is real and permanent for local data (after two confirmations) — it does not remove any cloud-synced data, which must be requested separately.',
                      style: TextStyle(color: AppColors.textMuted, fontSize: 12, height: 1.35),
                    ),
                  ],
                ),
              );
            },
          ),
          const SizedBox(height: 14),
          FutureBuilder<ProfileSetupStatus>(
            future: ProfileSetupStatusService.buildStatus(),
            builder: (context, snapshot) {
              final status = snapshot.data;
              return AndroidDarkGlassCard(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const _SectionTitle(icon: Icons.assignment_turned_in_rounded, title: 'Profile setup status'),
                    const SizedBox(height: 12),
                    _StatusPill(
                      configured: status != null && status.readyItems >= status.totalItems,
                      signedIn: status != null && status.readyItems >= status.totalItems,
                      text: status?.summaryText ?? 'Checking profile setup...',
                    ),
                    const SizedBox(height: 12),
                    if (status == null)
                      const Text(
                        'Checking local setup records...',
                        style: TextStyle(color: AppColors.textMuted, fontSize: 12.5, height: 1.35),
                      )
                    else ...[
                      _SetupStatusBlock(title: 'Business details', text: status.businessStatusText),
                      _SetupStatusBlock(title: 'Tax setup', text: status.taxStatusText),
                      _SetupStatusBlock(title: 'Identity / tax reference', text: status.identityStatusText),
                      _SetupStatusBlock(title: 'Cloud sync readiness', text: status.cloudReadinessText),
                    ],
                    const SizedBox(height: 4),
                    const Text(
                      'This card is read-only, Profile Setup Status. Edit the values in Business Details, Tax/VAT Settings and PAYE screens.',
                      style: TextStyle(color: AppColors.textMuted, fontSize: 12, height: 1.35),
                    ),
                  ],
                ),
              );
            },
          ),
          const SizedBox(height: 14),
          AndroidDarkGlassCard(
            padding: const EdgeInsets.all(16),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _SectionTitle(icon: Icons.security_rounded, title: 'Production safety'),
                SizedBox(height: 12),
                _ChecklistLine(text: 'Use anon public key only in the app'),
                _ChecklistLine(text: 'Keep service-role key only on server/serverless side'),
                _ChecklistLine(text: 'Enable RLS on every user table'),
                _ChecklistLine(text: 'Use user_id checks in every policy'),
                _ChecklistLine(text: 'Keep online sync disabled until auth, RLS and restore tests are complete'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _RecordGrid extends StatelessWidget {
  const _RecordGrid({required this.snapshot});

  final SyncSnapshot snapshot;

  @override
  Widget build(BuildContext context) {
    final rows = <List<String>>[
      ['Transactions', snapshot.transactions.toString()],
      ['Expenses', snapshot.expenses.toString()],
      ['Invoices', snapshot.invoices.toString()],
      ['Imports', snapshot.bankImports.toString()],
      ['Mileage', snapshot.mileageTrips.toString()],
      ['Vehicles', snapshot.vehicles.toString()],
      ['Organizer', snapshot.organizerItems.toString()],
      ['Exports', snapshot.exports.toString()],
    ];

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: rows.map((row) => _MiniStat(label: row[0], value: row[1])).toList(growable: false),
    );
  }
}

class _MiniStat extends StatelessWidget {
  const _MiniStat({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 132,
      padding: const EdgeInsets.all(11),
      decoration: BoxDecoration(
        color: AppColors.input,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.borderSoft),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(value, style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w900, fontSize: 17)),
          const SizedBox(height: 2),
          Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 11, fontWeight: FontWeight.w700)),
        ],
      ),
    );
  }
}

class _BackRow extends StatelessWidget {
  const _BackRow({required this.onBack});

  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) {
    return AndroidPressEffect(
      onTap: onBack,
      borderRadius: 18,
      child: const Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.arrow_back_ios_new_rounded, size: 16, color: AppColors.textSecondary),
          SizedBox(width: 8),
          Text('Back', style: TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.w800)),
        ],
      ),
    );
  }
}

class _PrimaryActionButton extends StatelessWidget {
  const _PrimaryActionButton({
    required this.label,
    required this.icon,
    required this.onTap,
    this.secondary = false,
    this.enabled = true,
  });

  final String label;
  final IconData icon;
  final VoidCallback onTap;
  final bool secondary;
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    return AndroidDarkActionButton(
      label: label,
      icon: icon,
      kind: secondary ? AndroidDarkButtonKind.neutral : AndroidDarkButtonKind.primary,
      onTap: enabled ? onTap : null,
    );
  }
}

class _SecondaryActionRow extends StatelessWidget {
  const _SecondaryActionRow({required this.busy, required this.onCreate, required this.onReset});

  final bool busy;
  final VoidCallback onCreate;
  final VoidCallback onReset;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(child: _SmallOutlineButton(label: 'Create account', icon: Icons.person_add_alt_1_rounded, enabled: !busy, onTap: onCreate)),
        const SizedBox(width: 10),
        Expanded(child: _SmallOutlineButton(label: 'Reset password', icon: Icons.mark_email_read_rounded, enabled: !busy, onTap: onReset)),
      ],
    );
  }
}

class _SmallOutlineButton extends StatelessWidget {
  const _SmallOutlineButton({required this.label, required this.icon, required this.enabled, required this.onTap});

  final String label;
  final IconData icon;
  final bool enabled;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return AndroidPressEffect(
      enabled: enabled,
      onTap: onTap,
      borderRadius: 16,
      child: Opacity(
        opacity: enabled ? 1 : 0.55,
        child: Container(
          constraints: const BoxConstraints(minHeight: 48),
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 10),
          decoration: BoxDecoration(
            gradient: AppGradients.secondaryButton,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.borderSoftStrong),
            boxShadow: const [BoxShadow(color: Color(0x22000000), blurRadius: 12, offset: Offset(0, 6))],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 17, color: AppColors.accentLight),
              const SizedBox(width: 7),
              Flexible(child: Text(label, maxLines: 1, overflow: TextOverflow.ellipsis, textAlign: TextAlign.center, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900))),
            ],
          ),
        ),
      ),
    );
  }
}

class _SubscriptionDetails extends StatelessWidget {
  const _SubscriptionDetails({required this.status});

  final EntitlementStatus status;

  static const String _playPackageName = 'com.taxsoletrader.app';

  Future<void> _openManageSubscription() async {
    // Deep-links straight to this subscription's own management page in
    // Google Play — cancelling, pausing, and changing payment method
    // all happen there, governed by Play Billing, never inside this app.
    final uri = Uri.parse(
      'https://play.google.com/store/account/subscriptions?sku=premium&package=$_playPackageName',
    );
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  String _formatDate(DateTime? date) {
    if (date == null) return '—';
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    return '${date.day} ${months[date.month - 1]} ${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    final children = <Widget>[
      _InfoLine(label: 'Status', value: _statusLabel(status.status)),
      if (status.plan != null) _InfoLine(label: 'Plan', value: _planLabel(status.plan!)),
    ];

    switch (status.status) {
      case PremiumStatus.trialing:
        children.add(_InfoLine(label: 'Trial ends', value: _formatDate(status.trialEndsAt)));
        final days = status.trialDaysRemaining;
        if (days != null) children.add(_InfoLine(label: 'Days left', value: '$days'));
      case PremiumStatus.active:
        children.add(
          _InfoLine(
            label: 'Renews on',
            value: status.currentPeriodEndsAt != null ? _formatDate(status.currentPeriodEndsAt) : 'No end date set',
          ),
        );
      case PremiumStatus.expired:
        children.add(const _InfoLine(label: 'Trial ended', value: 'Subscribe to continue using premium features.'));
      case PremiumStatus.cancelled:
        children.add(
          _InfoLine(
            label: 'Access until',
            value: status.currentPeriodEndsAt != null ? _formatDate(status.currentPeriodEndsAt) : '—',
          ),
        );
      case PremiumStatus.none:
        children.add(const _InfoLine(label: 'Free trial', value: 'Not started yet — open any premium feature to begin.'));
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ...children,
        if (status.status == PremiumStatus.active || status.status == PremiumStatus.trialing) ...[
          const SizedBox(height: 10),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: _openManageSubscription,
              icon: const Icon(Icons.open_in_new_rounded, size: 16),
              label: const Text('Manage subscription (Google Play)'),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: AppColors.accentStroke),
                foregroundColor: AppColors.accentLight,
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'Change payment method, cancel, or pause — all handled by Google Play, not by this app.',
            style: TextStyle(color: AppColors.textMuted, fontSize: 11, height: 1.35),
          ),
        ],
      ],
    );
  }

  String _statusLabel(PremiumStatus s) => switch (s) {
        PremiumStatus.none => 'No subscription',
        PremiumStatus.trialing => 'Free trial',
        PremiumStatus.active => 'Active',
        PremiumStatus.expired => 'Trial expired',
        PremiumStatus.cancelled => 'Cancelled',
      };

  String _planLabel(String plan) => switch (plan) {
        'monthly' => 'Monthly',
        'quarterly' => 'Quarterly',
        'annual' => 'Annual',
        _ => plan,
      };
}

class _StatusPill extends StatelessWidget {
  const _StatusPill({required this.configured, required this.signedIn, required this.text});

  final bool configured;
  final bool signedIn;
  final String text;

  @override
  Widget build(BuildContext context) {
    final color = signedIn ? AppColors.success : (configured ? AppColors.warning : AppColors.draft);
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(13),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withValues(alpha: 0.42)),
      ),
      child: Text(text, style: TextStyle(color: color, fontSize: 13, height: 1.35, fontWeight: FontWeight.w800)),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle({required this.icon, required this.title});

  final IconData icon;
  final String title;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, color: AppColors.accentLight, size: 20),
        const SizedBox(width: 8),
        Expanded(child: Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900))),
      ],
    );
  }
}

class _InfoLine extends StatelessWidget {
  const _InfoLine({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 7),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(width: 112, child: Text(label, style: const TextStyle(color: AppColors.textMuted, fontSize: 12))),
          Expanded(child: Text(value, style: const TextStyle(color: AppColors.textPrimary, fontSize: 12.5, fontWeight: FontWeight.w800))),
        ],
      ),
    );
  }
}

class _ChecklistLine extends StatelessWidget {
  const _ChecklistLine({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 9),
      child: Row(
        children: [
          const Icon(Icons.check_circle_rounded, color: AppColors.success, size: 17),
          const SizedBox(width: 8),
          Expanded(child: Text(text, style: const TextStyle(color: AppColors.textSecondary, fontSize: 13, height: 1.25))),
        ],
      ),
    );
  }
}


class _SetupStatusBlock extends StatelessWidget {
  const _SetupStatusBlock({required this.title, required this.text});

  final String title;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppColors.input,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.borderSoft),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(color: AppColors.textPrimary, fontSize: 13, fontWeight: FontWeight.w900)),
            const SizedBox(height: 7),
            Text(text, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12.5, height: 1.35, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }
}
