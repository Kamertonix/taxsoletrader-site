import 'package:flutter/material.dart';

import '../../services/app_export_share_service.dart';
import '../../services/entitlement_service.dart';
import '../../services/report_vat_export_service.dart';
import '../../services/tax_summary_service.dart';
import '../../services/local_app_storage.dart';
import '../../theme/app_theme.dart';
import '../premium/upgrade_screen.dart';
import '../../widgets/android_motion.dart';
import '../../widgets/android_dark_action_button.dart';
import '../../widgets/tst_card.dart';
import '../../widgets/android_dark_glass_card.dart';
import '../../widgets/premium_dropdown.dart';

/// Flutter recreation of Android activity_reports.xml.
///
/// This screen intentionally mirrors the Android layout order, colours, spacing
/// and effects from TaxSoleTrader Dark(7): title, period spinner, mileage
/// warning, metric cards, VAT/CIS summary, full report card and export buttons.
class _ReportGlyphs {
  static const car = '\u{1F697}';
}

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({
    super.key,
    required this.onOpenAccountantExport,
    this.onOpenCisStatement,
    this.onOpenAccountantAccess,
  });

  final VoidCallback onOpenAccountantExport;
  final VoidCallback? onOpenCisStatement;
  final VoidCallback? onOpenAccountantAccess;

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  String _taxYear = '2026-2027';
  List<String> _periods = const <String>['Full Tax Year'];
  String _selectedPeriod = 'Full Tax Year';
  late Future<ReportSummary> _summaryFuture;
  late Future<MonthlyReportSeries> _chartFuture;
  bool _entitled = false;

  @override
  void initState() {
    super.initState();
    _periods = _buildReportPeriods(_taxYear);
    _summaryFuture = TaxSummaryService.buildReportSummary(_selectedPeriod);
    _chartFuture = TaxSummaryService.buildMonthlyReportSeries();
    _loadSettingsTaxYear();
    _loadEntitlement();
  }

  Future<void> _loadEntitlement() async {
    final status = await EntitlementService.currentStatus();
    if (!mounted) return;
    setState(() => _entitled = status.isEntitled);
  }

  void _openUpgrade() {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => UpgradeScreen(
          featureName: 'Full Report',
          onBack: () => Navigator.of(context).pop(),
        ),
      ),
    );
  }

  Future<void> _loadSettingsTaxYear() async {
    final settings = await LocalAppStorage.loadTaxVatSettings();
    if (!mounted) return;
    final periods = _buildReportPeriods(settings.taxYear);
    setState(() {
      _taxYear = settings.taxYear;
      _periods = periods;
      if (!_periods.contains(_selectedPeriod)) {
        _selectedPeriod = _periods.first;
      }
      _summaryFuture = TaxSummaryService.buildReportSummary(_selectedPeriod);
      _chartFuture = TaxSummaryService.buildMonthlyReportSeries();
    });
  }

  static List<String> _buildReportPeriods(String taxYear) {
    final startYear = DateFilters.parseTaxStartYear(taxYear);
    final endYear = startYear + 1;
    return <String>[
      'Full Tax Year',
      'Q1: 6 Apr $startYear - 5 Jul $startYear',
      'Q2: 6 Jul $startYear - 5 Oct $startYear',
      'Q3: 6 Oct $startYear - 5 Jan $endYear',
      'Q4: 6 Jan $endYear - 5 Apr $endYear',
      'April $startYear',
      'May $startYear',
      'June $startYear',
      'July $startYear',
      'August $startYear',
      'September $startYear',
      'October $startYear',
      'November $startYear',
      'December $startYear',
      'January $endYear',
      'February $endYear',
      'March $endYear',
    ];
  }

  void _selectPeriod(String value) {
    setState(() {
      _selectedPeriod = value;
      _summaryFuture = TaxSummaryService.buildReportSummary(value);
    });
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<ReportSummary>(
      future: _summaryFuture,
      builder: (context, snapshot) {
        final summary = snapshot.data;
        return SingleChildScrollView(
          clipBehavior: Clip.none,
          padding: const EdgeInsets.fromLTRB(
            AppDimens.pagePadding,
            30,
            AppDimens.pagePadding,
            AppDimens.pageBottomPadding,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Reports',
                style: TextStyle(
                  color: AppColors.textPrimary,
                  fontSize: 30,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.4,
                ),
              ),
              const SizedBox(height: 5),
              const Text(
                'Exports, reports and business insights',
                style: TextStyle(
                  color: Color(0xFFA9B7C9),
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 18),
              _PeriodDropdown(
                value: _selectedPeriod,
                periods: _periods,
                onChanged: (value) {
                  _selectPeriod(value);
                },
              ),
              const SizedBox(height: 18),
              if (snapshot.connectionState == ConnectionState.waiting && summary == null)
                const TstCard(
                  color: AppColors.cardSoft,
                  borderColor: AppColors.borderSoftStrong,
                  radius: 18,
                  padding: EdgeInsets.all(18),
                  child: Text(
                    'Loading report totals...',
                    style: TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w800),
                  ),
                )
              else ...[
                if (summary?.vehicleConfigured ?? false) ...<Widget>[
                  _VehicleRuleCard(note: summary?.vehicleNote),
                  const SizedBox(height: 24),
                ],
                _AdaptiveReportMetricGrid(
                  cards: [
                    _ReportMetricCard(
                      value: summary?.income ?? 0,
                      label: 'Income',
                      color: AppColors.input,
                      labelColor: const Color(0xFFBFD7FF),
                    ),
                    _ReportMetricCard(
                      value: summary?.expenses ?? 0,
                      label: 'Expenses',
                      color: AppColors.cardRed,
                      labelColor: const Color(0xFFFFD2E4),
                    ),
                    _ReportMetricCard(
                      value: summary?.profit ?? 0,
                      label: 'Net profit',
                      color: AppColors.cardGreen,
                      labelColor: const Color(0xFFD5FFE0),
                    ),
                    _ReportMetricCard(
                      value: summary?.taxReserve ?? 0,
                      label: 'Tax reserve estimate',
                      color: AppColors.cardPurple,
                      labelColor: const Color(0xFFE1D0FF),
                    ),
                  ],
                ),
                if ((summary?.vatRegistered ?? false) || (summary?.cisRegistered ?? false)) ...<Widget>[
                  const SizedBox(height: 30),
                  _SectionTitle((summary?.vatRegistered ?? false) && (summary?.cisRegistered ?? false)
                      ? 'VAT / CIS Summary'
                      : (summary?.vatRegistered ?? false)
                          ? 'VAT Summary'
                          : 'CIS Summary'),
                  const SizedBox(height: 14),
                  _VatCisSummary(
                    summary: summary,
                    showVat: summary?.vatRegistered ?? false,
                    showCis: summary?.cisRegistered ?? false,
                    onOpenCisStatement: widget.onOpenCisStatement,
                  ),
                ],
                const SizedBox(height: 30),
                const _SectionTitle('Monthly Performance'),
                const SizedBox(height: 14),
                FutureBuilder<MonthlyReportSeries>(
                  future: _chartFuture,
                  builder: (context, chartSnapshot) {
                    return _MonthlyPerformanceCard(series: chartSnapshot.data);
                  },
                ),
                const SizedBox(height: 30),
                const _SectionTitle('Full Report'),
                const SizedBox(height: 14),
                if (_entitled)
                  _FullReportCard(summary: summary, period: _selectedPeriod)
                else
                  _FullReportUpgradeCard(onTap: _openUpgrade),
                const SizedBox(height: 18),
                _ExportButtons(
                  onOpenAccountantExport: widget.onOpenAccountantExport,
                  onOpenAccountantAccess: widget.onOpenAccountantAccess,
                  summary: summary,
                  period: _selectedPeriod,
                ),
              ],
            ],
          ),
        );
      },
    );
  }
}
class _PeriodDropdown extends StatelessWidget {
  const _PeriodDropdown({
    required this.value,
    required this.periods,
    required this.onChanged,
  });

  final String value;
  final List<String> periods;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) => AppPremiumDropdown(value: value, items: periods, onChanged: onChanged);
}

class _VehicleRuleCard extends StatelessWidget {
  const _VehicleRuleCard({this.note});

  final String? note;

  @override
  Widget build(BuildContext context) {
    return AndroidPulseOpacity(
      minOpacity: 0.88,
      duration: const Duration(milliseconds: 1500),
      child: TstCard(
        color: AppColors.input,
        borderColor: AppColors.attentionBorder.withValues(alpha: 0.42),
        radius: 18,
        padding: const EdgeInsets.all(16),
        child: Text(
          '${_ReportGlyphs.car} Vehicle summary\n${note ?? 'Vehicle method not configured.'}',
          style: const TextStyle(
            color: AppColors.textPrimary,
            fontSize: 13,
            height: 1.45,
            fontWeight: FontWeight.w900,
          ),
        ),
      ),
    );
  }
}
class _AdaptiveReportMetricGrid extends StatelessWidget {
  const _AdaptiveReportMetricGrid({required this.cards});

  final List<Widget> cards;

  @override
  Widget build(BuildContext context) {
    final textScale = MediaQuery.textScalerOf(context).scale(1);
    final singleColumn = textScale >= 1.15;

    if (singleColumn) {
      return Column(
        children: [
          for (var i = 0; i < cards.length; i++) ...[
            SizedBox(width: double.infinity, child: cards[i]),
            if (i != cards.length - 1) const SizedBox(height: 12),
          ],
        ],
      );
    }

    return Column(
      children: [
        for (var i = 0; i < cards.length; i += 2) ...[
          Row(
            children: [
              Expanded(child: cards[i]),
              const SizedBox(width: 16),
              Expanded(child: cards[i + 1]),
            ],
          ),
          if (i + 2 < cards.length) const SizedBox(height: 16),
        ],
      ],
    );
  }
}

class _ReportMetricCard extends StatelessWidget {
  const _ReportMetricCard({
    required this.value,
    required this.label,
    required this.color,
    required this.labelColor,
  });

  final double value;
  final String label;
  final Color color;
  final Color labelColor;

  @override
  Widget build(BuildContext context) {
    return AndroidDarkGlassCard(
      gradient: _metricGradient(label),
      borderColor: labelColor.withValues(alpha: .28),
      radius: 20,
      padding: const EdgeInsets.all(16),
      shadowColor: const Color(0x55000000),
      child: ConstrainedBox(
        constraints: const BoxConstraints(minHeight: 64),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AnimatedMoneyText(
              value: value,
              style: const TextStyle(
                color: AppColors.textPrimary,
                fontSize: 19,
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              label,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                color: labelColor,
                fontSize: 13,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

Gradient _metricGradient(String label) {
  final lower = label.toLowerCase();
  if (lower.contains('income')) return AndroidDarkCardGradients.blue;
  if (lower.contains('expense')) return AndroidDarkCardGradients.red;
  if (lower.contains('profit')) return AndroidDarkCardGradients.green;
  if (lower.contains('tax')) return AndroidDarkCardGradients.purple;
  return AndroidDarkCardGradients.menu;
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(
        color: AppColors.textPrimary,
        fontSize: 18,
        fontWeight: FontWeight.w900,
      ),
    );
  }
}

class _VatCisSummary extends StatelessWidget {
  const _VatCisSummary({
    required this.summary,
    required this.showVat,
    required this.showCis,
    this.onOpenCisStatement,
  });

  final ReportSummary? summary;
  final bool showVat;
  final bool showCis;
  final VoidCallback? onOpenCisStatement;

  @override
  Widget build(BuildContext context) {
    return AndroidDarkGlassCard(
      gradient: AndroidDarkCardGradients.menu,
      borderColor: const Color(0x442F80FF),
      radius: 20,
      padding: const EdgeInsets.all(18),
      shadowColor: const Color(0x55000000),
      child: Row(
        children: [
          if (showVat)
            Expanded(
              child: _VatCisColumn(
                title: 'VAT',
                value: summary?.vatAmount ?? 0,
                valueColor: AppColors.accent,
              ),
            ),
          if (showVat && showCis)
            Container(
              width: 1,
              height: 90,
              margin: const EdgeInsets.symmetric(horizontal: 18),
              color: const Color(0xFF244C8F),
            ),
          if (showCis)
            Expanded(
              child: GestureDetector(
                onTap: onOpenCisStatement,
                child: _VatCisColumn(
                  title: 'CIS',
                  value: summary?.cisSuffered ?? 0,
                  valueColor: const Color(0xFF9B51FF),
                  showLink: onOpenCisStatement != null,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
class _VatCisColumn extends StatelessWidget {
  const _VatCisColumn({
    required this.title,
    required this.value,
    required this.valueColor,
    this.showLink = false,
  });

  final String title;
  final double value;
  final Color valueColor;
  final bool showLink;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            color: AppColors.textPrimary,
            fontSize: 16,
            fontWeight: FontWeight.w900,
          ),
        ),
        const SizedBox(height: 10),
        AnimatedMoneyText(
          value: value,
          style: TextStyle(
            color: valueColor,
            fontSize: 22,
            fontWeight: FontWeight.w900,
          ),
        ),
        if (showLink) ...[
          const SizedBox(height: 6),
          const Text('View statement →', style: TextStyle(color: AppColors.accentLight, fontSize: 11.5, fontWeight: FontWeight.w800)),
        ],
      ],
    );
  }
}

class _MonthlyPerformanceCard extends StatelessWidget {
  const _MonthlyPerformanceCard({required this.series});

  final MonthlyReportSeries? series;

  @override
  Widget build(BuildContext context) {
    final data = series;
    return AndroidDarkGlassCard(
      gradient: AndroidDarkCardGradients.menu,
      borderColor: const Color(0x442F80FF),
      radius: 20,
      padding: const EdgeInsets.fromLTRB(16, 18, 16, 16),
      shadowColor: const Color(0x55000000),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Income vs expenses by month',
            style: TextStyle(
              color: AppColors.textPrimary,
              fontSize: 15,
              fontWeight: FontWeight.w900,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Apr to Mar tax-year view • posted business records only',
            style: TextStyle(
              color: AppColors.textSecondary,
              fontSize: 12,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 18),
          if (data == null)
            const SizedBox(
              height: 150,
              child: Center(
                child: Text(
                  'Loading chart data...',
                  style: TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.w800),
                ),
              ),
            )
          else
            SizedBox(
              height: 166,
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  for (var i = 0; i < data.labels.length; i++)
                    Expanded(
                      child: _MonthBar(
                        label: data.labels[i],
                        income: data.income[i],
                        expenses: data.expenses[i],
                        maxValue: data.maxValue,
                      ),
                    ),
                ],
              ),
            ),
          const SizedBox(height: 14),
          const Row(
            children: [
              _LegendDot(color: AppColors.accentLight, label: 'Income'),
              SizedBox(width: 18),
              _LegendDot(color: AppColors.danger, label: 'Expenses'),
            ],
          ),
        ],
      ),
    );
  }
}

class _MonthBar extends StatelessWidget {
  const _MonthBar({
    required this.label,
    required this.income,
    required this.expenses,
    required this.maxValue,
  });

  final String label;
  final double income;
  final double expenses;
  final double maxValue;

  @override
  Widget build(BuildContext context) {
    final incomeHeight = (income / maxValue * 104).clamp(4.0, 104.0).toDouble();
    final expenseHeight = (expenses / maxValue * 104).clamp(4.0, 104.0).toDouble();
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 2),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          SizedBox(
            height: 112,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 7,
                  height: income == 0 ? 4 : incomeHeight,
                  decoration: BoxDecoration(
                    color: AppColors.accentLight,
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                const SizedBox(width: 3),
                Container(
                  width: 7,
                  height: expenses == 0 ? 4 : expenseHeight,
                  decoration: BoxDecoration(
                    color: AppColors.danger,
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: const TextStyle(
              color: AppColors.textMuted,
              fontSize: 10,
              fontWeight: FontWeight.w900,
            ),
          ),
        ],
      ),
    );
  }
}

class _LegendDot extends StatelessWidget {
  const _LegendDot({required this.color, required this.label});

  final Color color;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 9,
          height: 9,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 7),
        Text(
          label,
          style: const TextStyle(
            color: AppColors.textSecondary,
            fontSize: 12,
            fontWeight: FontWeight.w800,
          ),
        ),
      ],
    );
  }
}

class _FullReportUpgradeCard extends StatelessWidget {
  const _FullReportUpgradeCard({required this.onTap});
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return AndroidDarkGlassCard(
      gradient: AndroidDarkCardGradients.menu,
      borderColor: const Color(0x442F80FF),
      radius: 20,
      padding: const EdgeInsets.all(18),
      shadowColor: const Color(0x55000000),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('🔒 Full Report', style: TextStyle(color: AppColors.textPrimary, fontSize: 15, fontWeight: FontWeight.w900)),
          const SizedBox(height: 8),
          const Text(
            'The metrics above (income, expenses, net profit, tax reserve) stay free. The detailed itemised report — '
            'ready to export or send to your accountant — is part of the premium plan, with a 14-day free trial.',
            style: TextStyle(color: AppColors.textSecondary, fontSize: 13, height: 1.35),
          ),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: onTap,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.accent,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              child: const Text('See plans', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800)),
            ),
          ),
        ],
      ),
    );
  }
}

class _FullReportCard extends StatelessWidget {
  const _FullReportCard({required this.summary, required this.period});

  final ReportSummary? summary;
  final String period;

  @override
  Widget build(BuildContext context) {
    return AndroidDarkGlassCard(
      gradient: AndroidDarkCardGradients.menu,
      borderColor: const Color(0x442F80FF),
      radius: 20,
      padding: const EdgeInsets.all(18),
      shadowColor: const Color(0x55000000),
      child: SizedBox(
        width: double.infinity,
        child: Text(
          summary?.fullReport ?? 'Period: $period\n\nNo report data saved yet.',
          style: const TextStyle(
            color: AppColors.textPrimary,
            fontSize: 14,
            height: 1.45,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}
class _ExportButtons extends StatelessWidget {
  const _ExportButtons({required this.onOpenAccountantExport, this.onOpenAccountantAccess, required this.summary, required this.period});
  final VoidCallback onOpenAccountantExport;
  final VoidCallback? onOpenAccountantAccess;
  final ReportSummary? summary;
  final String period;
  @override
  Widget build(BuildContext context) {
    return AndroidDarkGlassCard(
      gradient: AndroidDarkCardGradients.menu,
      borderColor: const Color(0x552F80FF),
      radius: 22,
      padding: const EdgeInsets.fromLTRB(14, 14, 14, 16),
      shadowColor: const Color(0x66000000),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Row(
            children: [
              Icon(Icons.file_download_rounded, color: AppColors.accentLight, size: 20),
              SizedBox(width: 9),
              Expanded(
                child: Text(
                  'Export & share',
                  style: TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 16,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _AndroidPrimaryButton(label: 'Export PDF Report', onTap: () => _exportReport(context, share: true)),
          const SizedBox(height: 9),
          _AndroidPrimaryButton(label: 'Share Accountant Pack', onTap: onOpenAccountantExport),
          if (onOpenAccountantAccess != null) ...[
            const SizedBox(height: 9),
            _AndroidPrimaryButton(label: 'Invite Accountant (Live Access)', onTap: onOpenAccountantAccess!),
          ],
        ],
      ),
    );
  }
  Future<void> _exportReport(BuildContext context, {required bool share}) async {
    final data = summary;
    if (data == null) return;

    // Reports export (Transactions/Expenses report, PDF/save) is a
    // premium feature — free plan keeps per-item share (a single
    // transaction/expense/invoice), not aggregated report export.
    final status = await EntitlementService.currentStatus();
    if (!context.mounted) return;
    if (!status.isEntitled) {
      await Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => UpgradeScreen(
            featureName: 'Report export',
            onBack: () => Navigator.of(context).pop(),
          ),
        ),
      );
      return;
    }

    final result = await ReportVatExportService.exportReport(summary: data, share: share);
    if (!context.mounted) return;
    AppExportShareService.showAndroidDarkSnack(
      context,
      'Report exported: ${result.primaryPath}',
      kind: ExportSnackKind.success,
    );
  }
}

class _AndroidPrimaryButton extends StatelessWidget {
  const _AndroidPrimaryButton({required this.label, this.onTap});

  final String label;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final lower = label.toLowerCase();
    final icon = lower.contains('csv')
        ? Icons.table_chart_rounded
        : lower.contains('accountant')
            ? Icons.folder_zip_rounded
            : lower.contains('saved')
                ? Icons.history_rounded
                : Icons.picture_as_pdf_rounded;
    return AndroidDarkActionButton(
      label: label,
      icon: icon,
      onTap: onTap,
      kind: onTap == null
          ? AndroidDarkButtonKind.neutral
          : (lower.contains('pdf') || lower.contains('csv') ? AndroidDarkButtonKind.export : AndroidDarkButtonKind.primary),
      height: 48,
    );
  }
}



