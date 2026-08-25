
import 'dart:io';

import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:path_provider/path_provider.dart';

import 'app_export_share_service.dart';
import 'document_export_design_service.dart';
import 'local_app_storage.dart';
import 'tax_summary_service.dart';

/// the current app dynamic invoice PDF renderer.
///
/// This intentionally renders a real PDF with the `pdf` package, not HTML and
/// not a hand-written PDF stream. It stays valid in Adobe/desktop viewers and
/// it paginates when invoices have more lines/content.
class InvoiceExportService {
  InvoiceExportService._();

  static Future<InvoiceExportResult> createLatestInvoicePdf({bool share = false}) async {
    final invoices = await LocalAppStorage.loadInvoices();
    if (invoices.isEmpty) throw StateError('No invoice saved yet. Create an invoice first.');
    return createInvoicePdf(invoices.first, share: share);
  }

  static Future<InvoiceExportResult> createInvoicePdf(StoredInvoice invoice, {bool share = false}) async {
    final business = await LocalAppStorage.loadBusinessDetails();
    final settings = await LocalAppStorage.loadInvoiceSettings();
    final taxSettings = await LocalAppStorage.loadTaxVatSettings();
    final enrichedInvoice = await _withClientDetailsForPdf(invoice);
    final docs = await getApplicationDocumentsDirectory();
    final dir = Directory('${docs.path}${Platform.pathSeparator}TaxSoleTrader${Platform.pathSeparator}invoices');
    if (!await dir.exists()) await dir.create(recursive: true);

    final base = safeInvoiceFileName(enrichedInvoice.number, clientName: enrichedInvoice.client);
    final pdfFile = File('${dir.path}${Platform.pathSeparator}$base.pdf');

    await pdfFile.writeAsBytes(
      await _invoiceAndroidDarkPdf(enrichedInvoice, business, settings, taxSettings),
      flush: true,
    );

    final saved = await AppExportShareService.saveFilesToDownloads(
      files: <File>[pdfFile],
      downloadsFolder: AppExportShareService.taxYearExportFolder(_taxYearForDate(enrichedInvoice.date), 'Invoices'),
    );

    var shareStarted = false;
    if (share) {
      shareStarted = await AppExportShareService.shareFile(
        file: pdfFile,
        chooserTitle: 'Share invoice ${enrichedInvoice.number}',
        mimeType: 'application/pdf',
      );
    }

    String? downloadsPdfPath;
    for (final path in saved.visiblePaths) {
      if (path.toLowerCase().endsWith('.pdf')) downloadsPdfPath ??= path;
    }

    return InvoiceExportResult(
      invoiceNumber: enrichedInvoice.number,
      pdfPath: pdfFile.path,
      htmlPath: '',
      textPath: '',
      downloadsPdfPath: downloadsPdfPath,
      shareStarted: shareStarted,
    );
  }


  /// Same rendering as [createInvoicePdf], but returns raw bytes only —
  /// no file written to disk, no downloads-folder entry, no share
  /// sheet. Used by AccountantAccessService to sync a real PDF to the
  /// accountant without side effects the user never asked for.
  static Future<List<int>> buildInvoicePdfBytes(StoredInvoice invoice) async {
    final business = await LocalAppStorage.loadBusinessDetails();
    final settings = await LocalAppStorage.loadInvoiceSettings();
    final taxSettings = await LocalAppStorage.loadTaxVatSettings();
    final enrichedInvoice = await _withClientDetailsForPdf(invoice);
    return _invoiceAndroidDarkPdf(enrichedInvoice, business, settings, taxSettings);
  }

  static Future<StoredInvoice> _withClientDetailsForPdf(StoredInvoice invoice) async {
    final currentUtr = invoice.clientUtr.trim();
    if (currentUtr.isNotEmpty) return invoice;

    final clientName = invoice.client.trim().toLowerCase();
    if (clientName.isEmpty) return invoice;

    try {
      final employers = await LocalAppStorage.loadEmployers();
      StoredEmployer? matched;
      for (final employer in employers) {
        final employerName = employer.name.trim().toLowerCase();
        if (employerName == clientName) {
          matched = employer;
          break;
        }
      }
      if (matched == null || matched.utr.trim().isEmpty) return invoice;

      return invoice.copyWith(
        clientAddress: invoice.clientAddress.trim().isNotEmpty ? invoice.clientAddress : matched.address,
        clientEmail: invoice.clientEmail.trim().isNotEmpty ? invoice.clientEmail : matched.email,
        clientPhone: invoice.clientPhone.trim().isNotEmpty ? invoice.clientPhone : matched.phone,
        clientUtr: matched.utr,
        clientVat: invoice.clientVat.trim().isNotEmpty ? invoice.clientVat : matched.vat,
      );
    } catch (_) {
      return invoice;
    }
  }

  static String _taxYearForDate(String dateText) {
    final date = DateFilters.parseDate(dateText) ?? DateTime.now();
    final startYear = date.isBefore(DateTime(date.year, 4, 6)) ? date.year - 1 : date.year;
    return '$startYear-${startYear + 1}';
  }

  /// Includes the client name alongside the invoice number so two different
  /// clients' invoices never collide on disk. Since invoice numbering is
  /// separate per employer/client (each client's first invoice is
  /// "TST INV-0001"), using the number alone would let exporting Client B's
  /// first invoice silently overwrite Client A's already-saved PDF -- both
  /// land in the same per-tax-year export folder, and the save step copies
  /// over any existing file with the same name with no warning.
  static String safeInvoiceFileName(String invoiceNo, {String clientName = ''}) {
    final number = DocumentExportDesignService.safeFileName(
      invoiceNo,
      fallback: 'invoice_${DateTime.now().millisecondsSinceEpoch}',
    );
    final client = DocumentExportDesignService.safeFileName(clientName, fallback: '');
    return client.isEmpty ? number : '${number}_$client';
  }

  static Future<List<int>> _invoiceAndroidDarkPdf(
    StoredInvoice invoice,
    BusinessDetails business,
    InvoiceSettings settings,
    TaxVatSettings taxSettings,
  ) async {
    final doc = pw.Document(
      version: PdfVersion.pdf_1_5,
      compress: true,
    );

    final lines = _invoiceLines(invoice);
    final includePeriod = lines.any((line) => line.period.trim().isNotEmpty);
    final businessName = business.displayBusinessName.trim().isEmpty ? 'Your Business' : business.displayBusinessName.trim();
    final client = invoice.client.trim().isEmpty ? 'Client' : invoice.client.trim();
    final dueLabel = _niceDate(invoice.dueDate);
    final loadedLogo = settings.logoPath.trim().isEmpty ? null : await _loadLogoImage(settings.logoPath.trim());
    // The logo file/size is configured once, globally, in Invoice Settings --
    // this per-invoice checkbox just decides whether THIS invoice shows it.
    final logoImage = invoice.includeLogo ? loadedLogo : null;

    doc.addPage(
      pw.MultiPage(
        pageTheme: pw.PageTheme(
          pageFormat: PdfPageFormat.a4,
          margin: const pw.EdgeInsets.fromLTRB(26, 24, 26, 32),
          // Purely decorative, drawn once behind every page's content --
          // doesn't affect layout/pagination the way inline widgets would.
          // Combines the status stamp (top of the page) and the optional
          // watermark (dead centre) -- see _pageBackground below.
          // Drawn IN FRONT of the page content (not behind it) so it's
          // never partially hidden behind an opaque card -- buildForeground
          // is the pdf package's counterpart to buildBackground, painted
          // after everything else instead of before.
          buildForeground: (context) => _pageBackground(invoice: invoice, settings: settings, logoImage: logoImage),
        ),
        footer: (context) => _footer(context),
        build: (context) {
          return <pw.Widget>[
            _topInvoiceBlock(
              businessName: businessName,
              business: business,
              businessUtr: business.utr,
              businessVat: taxSettings.vatRegistered ? taxSettings.vatNumber : '',
              logo: logoImage,
              logoWidth: settings.logoWidth,
            ),
            pw.SizedBox(height: 14),
            pw.Text('Bill to:', style: _style(13, bold: true, color: _ink)),
            pw.SizedBox(height: 6),
            _billToCard(client: client, invoice: invoice, invoiceNo: invoice.number, niceDate: _niceDate(invoice.date)),
            pw.SizedBox(height: 16),
            _workHeader(includePeriod: includePeriod),
            pw.SizedBox(height: 10),
            for (var i = 0; i < lines.length; i++) _workLine(lines[i], i, includePeriod: includePeriod),
            pw.SizedBox(height: 16),
            _totals(invoice),
            pw.SizedBox(height: 18),
            _paymentDetails(invoice, business, settings, dueLabel),
          ];
        },
      ),
    );

    return doc.save();
  }

  // Everything drawn behind the page content: the status stamp (now near
  // the top of the page, where the watermark used to visually collide
  // with it) and the optional watermark (dead centre of the page).
  static pw.Widget _pageBackground({
    required StoredInvoice invoice,
    required InvoiceSettings settings,
    required pw.MemoryImage? logoImage,
  }) {
    return pw.Stack(
      children: [
        pw.Align(
          alignment: const pw.Alignment(0, 0.75),
          child: _buildStatusStamp(invoice.status),
        ),
        if (settings.watermarkEnabled && invoice.includeWatermark)
          pw.Align(
            alignment: pw.Alignment.center,
            child: _watermarkContent(settings, logoImage),
          ),
      ],
    );
  }

  // What the watermark actually shows: custom text if the user typed
  // one, otherwise the logo image, otherwise nothing. Purely decorative
  // (page background), so a bit of very long text running close to the
  // page edges is a cosmetic concern only -- it never affects layout.
  static pw.Widget _watermarkContent(InvoiceSettings settings, pw.MemoryImage? logoImage) {
    final text = settings.watermarkText.trim();
    if (text.isNotEmpty) {
      return pw.Opacity(
        // A touch stronger than before (was 0.08, nearly invisible over
        // white) and a mid-grey instead of brand blue -- stays legible
        // over both the white page and the light card backgrounds.
        opacity: 0.16,
        child: pw.Transform.rotate(
          angle: 0.45,
          child: pw.Text(text, style: _style(42, bold: true, color: PdfColors.grey600)),
        ),
      );
    }
    if (logoImage != null) {
      return pw.Opacity(
        opacity: 0.10,
        child: pw.Image(logoImage, width: 220),
      );
    }
    return pw.SizedBox();
  }

  // Returns null (instead of throwing) if the saved logo path no longer
  // points at a real file, or isn't a valid image -- a PDF export should
  // never fail just because a logo went missing since Settings was saved.
  static Future<pw.MemoryImage?> _loadLogoImage(String logoPath) async {
    try {
      final file = File(logoPath);
      if (!await file.exists()) return null;
      final bytes = await file.readAsBytes();
      return pw.MemoryImage(bytes);
    } catch (_) {
      return null;
    }
  }

  static pw.Widget _topInvoiceBlock({
    required String businessName,
    required BusinessDetails business,
    required String businessUtr,
    required String businessVat,
    pw.MemoryImage? logo,
    double logoWidth = 120,
  }) {
    final contact = <String>[];
    if (business.phone.trim().isNotEmpty) contact.add(business.phone.trim());
    if (business.email.trim().isNotEmpty) contact.add(business.email.trim());
    final taxRefs = <String>[];
    if (businessUtr.trim().isNotEmpty) taxRefs.add('UTR: ${businessUtr.trim()}');
    if (businessVat.trim().isNotEmpty) taxRefs.add('VAT: ${businessVat.trim()}');

    final card = pw.Container(
      width: double.infinity,
      padding: const pw.EdgeInsets.fromLTRB(22, 14, 22, 14),
      decoration: pw.BoxDecoration(
        color: _softBlue,
        borderRadius: pw.BorderRadius.circular(20),
      ),
      child: pw.Column(
        crossAxisAlignment: pw.CrossAxisAlignment.start,
        children: [
          pw.Text(businessName, style: _style(24, bold: true, color: _ink)),
          if (business.address.trim().isNotEmpty) ...[
            pw.SizedBox(height: 6),
            pw.Text(business.address.replaceAll('\n', ', '), style: _style(8.5, color: _muted)),
          ],
          if (contact.isNotEmpty) ...[
            pw.SizedBox(height: 3),
            pw.Text(contact.join('  |  '), style: _style(8.5, color: _muted)),
          ],
          if (taxRefs.isNotEmpty) ...[
            pw.SizedBox(height: 3),
            pw.Text(taxRefs.join('  |  '), style: _style(8.5, color: _muted)),
          ],
        ],
      ),
    );

    if (logo == null) return card;

    // The logo is deliberately NOT part of the Row/Column above -- it's a
    // floating overlay (Stack + Positioned) instead. This means the card's
    // own height comes only from the business text, never from the logo:
    // dragging the logo-size slider makes the logo bigger or smaller
    // without ever stretching or resizing the card underneath it. The
    // tradeoff is that a very large logo can overlap a long business name
    // -- worth keeping in mind when picking a size.
    return pw.Stack(
      children: [
        card,
        pw.Positioned(
          top: 10,
          right: 18,
          child: pw.Image(logo, width: logoWidth, fit: pw.BoxFit.contain),
        ),
      ],
    );
  }
  static pw.Widget _buildStatusStamp(String status) {
    final s = status.trim().toUpperCase();

    PdfColor color = _accentBlue;

    if (s == 'PAID') {
      color = PdfColors.green;
    } else if (s == 'OVERDUE' || s == 'AMOUNT DUE') {
      color = PdfColors.red;
    } else if (s == 'PART PAID') {
      color = _amber;
    } else if (s == 'DRAFT') {
      color = PdfColors.grey;
    } else if (s == 'SENT') {
      color = PdfColors.blue;
    }

    return pw.Opacity(
      opacity: 0.13,
      child: pw.Transform.rotate(
        angle: 0.28,
        child: pw.Container(
          padding: const pw.EdgeInsets.symmetric(
            horizontal: 26,
            vertical: 12,
          ),
          decoration: pw.BoxDecoration(
            border: pw.Border.all(
              color: color,
              width: 3,
            ),
            borderRadius: pw.BorderRadius.circular(8),
          ),
          child: pw.Text(
            s,
            style: _style(30, bold: true, color: color),
          ),
        ),
      ),
    );
  }

  static pw.Widget _billToCard({required String client, required StoredInvoice invoice, required String invoiceNo, required String niceDate}) {
    final rows = <String>[];
    if (invoice.clientAddress.trim().isNotEmpty) rows.add(invoice.clientAddress.trim().replaceAll('\n', ', '));
    final contact = <String>[];
    if (invoice.clientPhone.trim().isNotEmpty) contact.add(invoice.clientPhone.trim());
    if (invoice.clientEmail.trim().isNotEmpty) contact.add(invoice.clientEmail.trim());
    if (contact.isNotEmpty) rows.add(contact.join('  |  '));
    final taxRefs = <String>[];
    if (invoice.clientUtr.trim().isNotEmpty) taxRefs.add('UTR: ${invoice.clientUtr.trim()}');
    if (invoice.clientVat.trim().isNotEmpty) taxRefs.add('VAT: ${invoice.clientVat.trim()}');
    if (taxRefs.isNotEmpty) rows.add(taxRefs.join('  |  '));

    return pw.Container(
      width: double.infinity,
      padding: const pw.EdgeInsets.fromLTRB(18, 13, 18, 13),
      decoration: pw.BoxDecoration(
        color: _softBlue,
        borderRadius: pw.BorderRadius.circular(18),
      ),
      child: pw.Row(
        crossAxisAlignment: pw.CrossAxisAlignment.start,
        children: [
          pw.Expanded(
            child: pw.Column(
              crossAxisAlignment: pw.CrossAxisAlignment.start,
              children: [
                pw.Text(client, style: _style(9, bold: true, color: _ink)),
                for (final row in rows) ...[
                  pw.SizedBox(height: 3),
                  pw.Text(row, style: _style(8.5, color: _muted)),
                ],
                if (invoice.periodFrom.trim().isNotEmpty || invoice.periodTo.trim().isNotEmpty) ...[
                  pw.SizedBox(height: 3),
                  pw.Text('Period: ${invoice.periodFrom.trim()} - ${invoice.periodTo.trim()}'.replaceAll(' - ', ' - '), style: _style(8.5, color: _muted)),
                ],
                if (invoice.reverseCharge) ...[
                  pw.SizedBox(height: 4),
                  pw.Text('VAT reverse charge applies: customer accounts for VAT to HMRC.', style: _style(8.5, color: _muted)),
                ],
              ],
            ),
          ),
          pw.SizedBox(width: 16),
          pw.Container(
            width: 180,
            padding: const pw.EdgeInsets.fromLTRB(18, 12, 18, 12),
            decoration: pw.BoxDecoration(
              color: _accentBlue,
              borderRadius: pw.BorderRadius.circular(16),
            ),
            child: pw.Column(
              crossAxisAlignment: pw.CrossAxisAlignment.start,
              children: [
                pw.Text(invoiceNo, style: _style(17, bold: true, color: PdfColors.white)),
                pw.SizedBox(height: 6),
                pw.Text('Invoice details', style: _style(8.5, bold: true, color: PdfColors.white)),
                pw.SizedBox(height: 6),
                pw.Text('Date: $niceDate', style: _style(8.2, color: PdfColors.white)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  static pw.Widget _workHeader({required bool includePeriod}) {
    return pw.Container(
      height: 30,
      padding: const pw.EdgeInsets.symmetric(horizontal: 16),
      decoration: pw.BoxDecoration(
        color: _navy,
        borderRadius: pw.BorderRadius.circular(8),
      ),
      child: pw.Row(
        children: [
          pw.Expanded(flex: includePeriod ? 48 : 56, child: pw.Text('Work details', style: _style(8.7, bold: true, color: PdfColors.white))),
          pw.Expanded(flex: 10, child: pw.Text('Qty', textAlign: pw.TextAlign.right, style: _style(8.7, bold: true, color: PdfColors.white))),
          pw.Expanded(flex: 14, child: pw.Text('Rate', textAlign: pw.TextAlign.right, style: _style(8.7, bold: true, color: PdfColors.white))),
          if (includePeriod) pw.Expanded(flex: 14, child: pw.Text('Period', textAlign: pw.TextAlign.right, style: _style(8.7, bold: true, color: PdfColors.white))),
          pw.Expanded(flex: 14, child: pw.Text('Line total', textAlign: pw.TextAlign.right, style: _style(8.7, bold: true, color: PdfColors.white))),
        ],
      ),
    );
  }

  static pw.Widget _workLine(_InvoiceLine line, int index, {required bool includePeriod}) {
    return pw.Container(
      width: double.infinity,
      margin: pw.EdgeInsets.only(bottom: index == 0 ? 0 : 3.0),
      padding: const pw.EdgeInsets.fromLTRB(16, 7, 16, 7),
      decoration: pw.BoxDecoration(
        color: _rowBlue,
        border: pw.Border.all(color: _rowBorder, width: 0.7),
        borderRadius: pw.BorderRadius.circular(6),
      ),
      child: pw.Row(
        crossAxisAlignment: pw.CrossAxisAlignment.start,
        children: [
          pw.Expanded(
            flex: includePeriod ? 48 : 56,
            child: pw.Column(
              crossAxisAlignment: pw.CrossAxisAlignment.start,
              children: [
                pw.Text(line.type.toUpperCase(), style: _style(8.5, bold: true, color: _darkMuted)),
                pw.SizedBox(height: 5),
                pw.Text(line.description, style: _style(8.8, color: _darkMuted)),
              ],
            ),
          ),
          pw.Expanded(flex: 10, child: pw.Text(line.qty, textAlign: pw.TextAlign.right, style: _style(8.8, color: _darkMuted))),
          pw.Expanded(flex: 14, child: pw.Text(line.rate, textAlign: pw.TextAlign.right, style: _style(8.8, color: _darkMuted))),
          if (includePeriod) pw.Expanded(flex: 14, child: pw.Text(line.period.trim().isEmpty ? '-' : line.period, textAlign: pw.TextAlign.right, style: _style(8.2, color: _darkMuted))),
          pw.Expanded(flex: 14, child: pw.Text(_money(line.amount), textAlign: pw.TextAlign.right, style: _style(8.8, bold: true, color: _ink))),
        ],
      ),
    );
  }

  static pw.Widget _totals(StoredInvoice invoice) {
    final rows = <pw.Widget>[
      _totalRow('Net amount', _money(invoice.netAmount)),
      if (invoice.vatAmount > 0 && !invoice.reverseCharge) _totalRow('VAT', _money(invoice.vatAmount)),
      if (invoice.reverseCharge) _totalRow('VAT reverse charge', 'Customer accounts for VAT'),
      if (invoice.cisAmount > 0) _totalRow('CIS deduction', '-${_money(invoice.cisAmount)}', negative: true),
    ];

    // Everything that actually needs vertical space (rows, total box, and
    // the optional part-paid card). The status stamp used to sit inside
    // this same Column, above the rows -- which meant its own rendered
    // size (rotated, so its bounding box is taller than it looks) added
    // real height here, pushing "Net amount" down and, with enough work
    // lines, pushing the invoice onto a second page. It's purely
    // decorative, so it no longer takes part in this layout at all.
    final totalsBlock = pw.Column(
      crossAxisAlignment: pw.CrossAxisAlignment.end,
      children: [
        pw.Container(
          width: 280,
          child: pw.Column(children: rows),
        ),
        pw.SizedBox(height: 14),
        pw.Container(
          width: 278,
          padding: const pw.EdgeInsets.fromLTRB(32, 15, 20, 15),
          decoration: pw.BoxDecoration(
            color: _accentBlue,
            borderRadius: pw.BorderRadius.circular(9),
          ),
          child: pw.Row(
            children: [
              pw.Expanded(
                child: pw.Text(
                  'TOTAL\nAMOUNT',
                  style: _style(
                    10,
                    bold: true,
                    color: PdfColors.white,
                    height: 1.35,
                  ),
                ),
              ),
              pw.Text(
                _money(invoice.amountDue),
                style: _style(14, bold: true, color: PdfColors.white),
              ),
            ],
          ),
        ),

        if (invoice.status == 'Part paid') ...[
          pw.SizedBox(height: 12),
          pw.Container(
            width: 278,
            padding: const pw.EdgeInsets.fromLTRB(16, 14, 16, 14),
            decoration: pw.BoxDecoration(
              color: PdfColors.white,
              border: pw.Border.all(color: _accentBlue, width: 1.2),
              borderRadius: pw.BorderRadius.circular(10),
            ),
            child: pw.Column(
              children: [
                _paidCardRow('Total Amount', _money(invoice.amountDue)),
                _paidCardDivider(),
                _paidCardRow(
                  'Paid Amount',
                  _money(invoice.paidAmount),
                  valueColor: PdfColors.green,
                ),
                _paidCardDivider(),
                _paidCardRow(
                  'Balance Due',
                  _money(invoice.remaining),
                  valueColor: _red,
                ),
                if (invoice.paidAt.trim().isNotEmpty) ...[
                  _paidCardDivider(),
                  _paidCardRow('Paid On', _niceDate(invoice.paidAt)),
                ],
              ],
            ),
          ),
        ],
      ],
    );

    return pw.Container(
      width: double.infinity,
      child: pw.Row(
        crossAxisAlignment: pw.CrossAxisAlignment.start,
        children: [
          pw.Spacer(),
          pw.SizedBox(width: 280, child: totalsBlock),
        ],
      ),
    );
  }

  static pw.Widget _totalRow(String label, String value, {bool negative = false}) {
    return pw.Padding(
      padding: const pw.EdgeInsets.only(bottom: 8),
      child: pw.Row(
        children: [
          pw.Expanded(child: pw.Text(label, textAlign: pw.TextAlign.right, style: _style(9.5, color: _ink))),
          pw.SizedBox(width: 38),
          pw.Container(
            width: 92,
            child: pw.Text(value, textAlign: pw.TextAlign.right, style: _style(9.5, color: negative ? _red : _ink)),
          ),
        ],
      ),
    );
  }

  static pw.Widget _paidCardRow(
    String label,
    String value, {
    PdfColor? valueColor,
  }) {
    return pw.Row(
      children: [
        pw.Expanded(
          child: pw.Text(
            label,
            style: _style(9.5, bold: true, color: _ink),
          ),
        ),
        pw.Text(
          value,
          textAlign: pw.TextAlign.right,
          style: _style(9.5, bold: true, color: valueColor ?? _ink),
        ),
      ],
    );
  }

  static pw.Widget _paidCardDivider() {
    return pw.Padding(
      padding: const pw.EdgeInsets.symmetric(vertical: 8),
      child: pw.Divider(color: PdfColors.grey300, height: 1),
    );
  }

  static pw.Widget _paymentDetails(
    StoredInvoice invoice,
    BusinessDetails business,
    InvoiceSettings settings,
    String dueDate,
  ) {
    final rows = <String>[];
    if (settings.showBankDetails && business.bankName.trim().isNotEmpty) rows.add('Bank: ${business.bankName.trim()}');
    if (settings.showBankDetails && business.bankAccountHolder.trim().isNotEmpty) rows.add('Account name: ${business.bankAccountHolder.trim()}');
    if (settings.showBankDetails && business.bankSortCode.trim().isNotEmpty) rows.add('Sort code: ${business.bankSortCode.trim()}');
    if (settings.showBankDetails && business.bankAccountNumber.trim().isNotEmpty) rows.add('Account no: ${business.bankAccountNumber.trim()}');
    if (settings.showBankDetails && business.bankIban.trim().isNotEmpty) rows.add('IBAN: ${business.bankIban.trim()}');
    rows.add('Reference: ${invoice.number}');
    rows.add(settings.footerNote.trim().isEmpty ? 'Please use invoice number as payment reference' : settings.footerNote.trim());
    rows.add('Terms: ${settings.paymentTermsLabel}. Due date: $dueDate');

    return pw.Container(
      width: 260,
      child: pw.Column(
        crossAxisAlignment: pw.CrossAxisAlignment.start,
        children: [
          pw.Text('Payment details', style: _style(8.8, bold: true, color: _ink)),
          pw.SizedBox(height: 6),
          for (final row in rows) ...[
            pw.Text(row, style: _style(7.8, color: _darkMuted)),
            pw.SizedBox(height: 2.5),
          ],
        ],
      ),
    );
  }

  static pw.Widget _footer(pw.Context context) {
    return pw.Column(
      crossAxisAlignment: pw.CrossAxisAlignment.start,
      children: [
        pw.Row(
          children: [
            pw.Expanded(child: pw.Container(height: 3, color: const PdfColor.fromInt(0xFF6BA6E8))),
            pw.SizedBox(width: 8),
            pw.Expanded(child: pw.Container(height: 3, color: const PdfColor.fromInt(0xFFF0C674))),
            pw.SizedBox(width: 8),
            pw.Expanded(child: pw.Container(height: 3, color: const PdfColor.fromInt(0xFFE56B6B))),
          ],
        ),
        pw.SizedBox(height: 12),
        pw.Center(
          child: pw.Column(
            children: [
              pw.Text(_safeFooterLine1, style: _style(6.6, color: _muted)),
              pw.SizedBox(height: 4),
              pw.Text(_safeFooterLine2, style: _style(6.6, color: _muted)),
              pw.SizedBox(height: 4),
              pw.Text('Page ${context.pageNumber} of ${context.pagesCount}', style: _style(7, color: _muted)),
            ],
          ),
        ),
      ],
    );
  }

  static List<_InvoiceLine> _invoiceLines(StoredInvoice invoice) {
    if (invoice.lines.isNotEmpty) {
      return invoice.lines
          .map((line) => _InvoiceLine(
                type: _cleanType(line.type),
                description: line.description.trim().isEmpty ? _cleanType(line.type) : line.description.trim(),
                qty: _cleanQty(line.qty, fallback: line.qty.toString()),
                rate: _money(line.rate),
                amount: line.amount,
                periodFrom: line.periodFrom,
                periodTo: line.periodTo,
              ))
          .toList(growable: false);
    }

    final description = invoice.description.trim().isEmpty ? 'Service' : invoice.description.trim();
    final split = description
        .split(RegExp(r';\s*'))
        .map((e) => e.trim())
        .where((e) => e.isNotEmpty)
        .toList();
    if (split.length > 1) {
      final parsed = <_InvoiceLine>[];
      for (final part in split) {
        final periodMatch = RegExp(r'\[([^\]]*)\]\s*$').firstMatch(part);
        var periodFrom = '';
        var periodTo = '';
        if (periodMatch != null) {
          final periodBits = (periodMatch.group(1) ?? '').split(' - ');
          if (periodBits.isNotEmpty) periodFrom = periodBits.first.trim();
          if (periodBits.length > 1) periodTo = periodBits.sublist(1).join(' - ').trim();
        }
        final withoutPeriod = part.replaceAll(RegExp(r'\s*\[[^\]]*\]\s*$'), '').trim();
        final match = RegExp(r'^(?:(Service|Material|Expense):\s*)?(.*?)\s*\(([-0-9.]+)\s*[×x]\s*£?([-0-9.,]+)\)\s*$', caseSensitive: false).firstMatch(withoutPeriod);
        if (match != null) {
          final type = _cleanType(match.group(1) ?? 'Service');
          final qtyText = match.group(3) ?? '1';
          final rateValue = _num(match.group(4) ?? '0');
          final qtyValue = _num(qtyText);
          final rawDescription = (match.group(2) ?? type).trim();
          parsed.add(_InvoiceLine(
            type: type,
            description: rawDescription.isEmpty ? type : rawDescription,
            qty: _cleanQty(qtyValue, fallback: qtyText),
            rate: _money(rateValue),
            amount: qtyValue * rateValue,
            periodFrom: periodFrom,
            periodTo: periodTo,
          ));
        } else {
          parsed.add(_InvoiceLine(type: 'Service', description: part, qty: '1', rate: _money(0), amount: 0));
        }
      }
      return parsed;
    }
    return [_singleInvoiceLine(invoice)];
  }

  static _InvoiceLine _singleInvoiceLine(StoredInvoice invoice) {
    final desc = invoice.description.trim().isEmpty ? 'Service' : invoice.description.trim();
    final qtyValue = _num(invoice.quantity.trim().isEmpty ? '1' : invoice.quantity);
    final rateValue = invoice.rate.trim().isEmpty ? (qtyValue <= 0 ? invoice.netAmount : invoice.netAmount / qtyValue) : _num(invoice.rate);
    return _InvoiceLine(
      type: 'Service',
      description: desc,
      qty: _cleanQty(qtyValue, fallback: invoice.quantity.trim().isEmpty ? '1' : invoice.quantity.trim()),
      rate: _money(rateValue),
      amount: invoice.netAmount,
      periodFrom: invoice.periodFrom,
      periodTo: invoice.periodTo,
    );
  }

  static String _cleanType(String value) {
    final raw = value.trim().toLowerCase();
    if (raw.startsWith('material')) return 'Material';
    if (raw.startsWith('expense')) return 'Expense';
    return 'Service';
  }

  static double _num(String value) {
    return double.tryParse(value.replaceAll('£', '').replaceAll(',', '').trim()) ?? 0;
  }

  static String _cleanQty(double value, {required String fallback}) {
    if (value <= 0) return fallback.trim().isEmpty ? '1' : fallback.trim();
    if (value == value.truncateToDouble()) return value.toStringAsFixed(0);
    return value.toStringAsFixed(2).replaceAll(RegExp(r'0+$'), '').replaceAll(RegExp(r'\.$'), '');
  }

  static String _niceDate(String value) {
    final clean = value.trim();
    final iso = RegExp(r'^(\d{4})-(\d{1,2})-(\d{1,2})$').firstMatch(clean);
    if (iso != null) return '${iso.group(3)!.padLeft(2, '0')}/${iso.group(2)!.padLeft(2, '0')}/${iso.group(1)}';
    return clean;
  }

  static String _money(double value) => DocumentExportDesignService.money(value);

  static pw.TextStyle _style(double size, {bool bold = false, PdfColor? color, double? height}) {
    return pw.TextStyle(
      fontSize: size,
      fontWeight: bold ? pw.FontWeight.bold : pw.FontWeight.normal,
      color: color ?? _ink,
      height: height,
    );
  }


static String get _safeFooterLine1 => '(c) ${DateTime.now().year} Tax Sole Trader. Built for UK Sole Traders. VAT | CIS | Self Assessment.';
  static const String _safeFooterLine2 = 'Proprietary document template. Generated locally by Tax Sole Trader.';

  static const PdfColor _ink = PdfColor(0.027, 0.067, 0.122);
  static const PdfColor _navy = PdfColor(0.055, 0.134, 0.212);
  static const PdfColor _accentBlue = PdfColor(0.071, 0.545, 0.961);
  static const PdfColor _softBlue = PdfColor(0.940, 0.970, 0.995);
  static const PdfColor _rowBlue = PdfColor(0.963, 0.976, 0.995);
  static const PdfColor _muted = PdfColor(0.345, 0.400, 0.486);
  static const PdfColor _darkMuted = PdfColor(0.130, 0.176, 0.239);
  static const PdfColor _amber = PdfColor(1.000, 0.655, 0.149);
  static const PdfColor _red = PdfColor(0.780, 0.100, 0.140);
  static const PdfColor _rowBorder = PdfColor(0.800, 0.870, 0.945);
}

class _InvoiceLine {
  const _InvoiceLine({required this.type, required this.description, required this.qty, required this.rate, required this.amount, this.periodFrom = '', this.periodTo = ''});

  final String type;
  final String description;
  final String qty;
  final String rate;
  final double amount;
  final String periodFrom;
  final String periodTo;

  String get period {
    final from = periodFrom.trim();
    final to = periodTo.trim();
    if (from.isEmpty && to.isEmpty) return '';
    if (from.isNotEmpty && to.isNotEmpty) return '$from\n$to';
    return from.isNotEmpty ? from : to;
  }
}

class InvoiceExportResult {
  const InvoiceExportResult({
    required this.invoiceNumber,
    required this.pdfPath,
    required this.htmlPath,
    required this.textPath,
    this.downloadsPdfPath,
    this.downloadsHtmlPath,
    this.downloadsTextPath,
    this.shareStarted = false,
  });

  final String invoiceNumber;
  final String pdfPath;
  final String htmlPath;
  final String textPath;
  final String? downloadsPdfPath;
  final String? downloadsHtmlPath;
  final String? downloadsTextPath;
  final bool shareStarted;

  String get visiblePdfPath => downloadsPdfPath ?? pdfPath;
  String get visibleHtmlPath => downloadsHtmlPath ?? htmlPath;
}



