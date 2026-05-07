const PDFDocument = require('pdfkit');
const Invoice = require('../models/Invoice');

// Helper function to generate professional invoice PDF
const generateInvoicePDF = (doc, invoice) => {
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const margin = 40;

  //HEADER SECTION 
  doc.fontSize(24).font('Helvetica-Bold').fillColor('#333').text('Your Business Name', margin, margin);
  
  doc.moveDown(1);

  // BILL TO SECTION (LEFT SIDE)
  doc.fontSize(11).font('Helvetica-Bold').fillColor('#333').text('BILL TO', margin, doc.y);
  doc.fontSize(10).font('Helvetica').fillColor('#555');
  doc.text(invoice.clientId.name, margin, doc.y + 3);
  doc.text(invoice.clientId.address || '123 Client Street', margin, doc.y);
  doc.text(invoice.clientId.email || 'client@email.com', margin, doc.y);
  doc.text(invoice.clientId.phone || 'Phone Number', margin, doc.y);

  // INVOICE DETAILS BOX (RIGHT SIDE)
  const invoiceBoxX = pageWidth - margin - 180;
  const invoiceBoxY = margin + 25;
  const boxWidth = 170;
  const boxHeight = 90;
  
  // Draw box background
  doc.rect(invoiceBoxX, invoiceBoxY, boxWidth, boxHeight).fill('#f5f5f5');
  doc.rect(invoiceBoxX, invoiceBoxY, boxWidth, boxHeight).stroke('#ddd');
  
  // Invoice label
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#333');
  doc.text('Invoice', invoiceBoxX + 10, invoiceBoxY + 8, { width: boxWidth - 20 });
  
  // Invoice number
  doc.fontSize(14).font('Helvetica-Bold').fillColor('#F4A460');
  doc.text(`#${invoice._id.toString().slice(-6).toUpperCase()}`, invoiceBoxX + 10, invoiceBoxY + 25, { width: boxWidth - 20 });
  
  // Details
  doc.fontSize(8).font('Helvetica').fillColor('#666');
  doc.text(`Issue: ${new Date(invoice.createdAt).toLocaleDateString()}`, invoiceBoxX + 10, invoiceBoxY + 48, { width: boxWidth - 20 });
  doc.text(`Due: ${new Date(invoice.dueDate).toLocaleDateString()}`, invoiceBoxX + 10, invoiceBoxY + 62, { width: boxWidth - 20 });
  doc.fontSize(9).font('Helvetica-Bold').fillColor('#333');
  doc.text(`Amount: ₹${invoice.totalAmount.toFixed(2)}`, invoiceBoxX + 10, invoiceBoxY + 75, { width: boxWidth - 20 });

  doc.moveDown(5);

  // ITEMS TABLE HEADER 
  const tableHeaderY = doc.y;
  doc.rect(margin, tableHeaderY, pageWidth - margin * 2, 18).fill('#333');
  doc.fillColor('#fff').font('Helvetica-Bold').fontSize(10);
  
  const col1 = margin + 8;
  const col2 = margin + 250;
  const col3 = margin + 350;
  const col4 = pageWidth - margin - 80;
  
  doc.text('Description', col1, tableHeaderY + 4);
  doc.text('Quantity', col2, tableHeaderY + 4);
  doc.text('Unit price', col3, tableHeaderY + 4);
  doc.text('Amount', col4, tableHeaderY + 4);

  doc.moveDown(1.8);

  // ITEMS ROWS
  let itemY = doc.y;
  let rowNum = 0;
  doc.font('Helvetica').fontSize(10).fillColor('#333');

  invoice.items.forEach((item, index) => {
    const alternateRow = index % 2;
    const rowBgColor = alternateRow ? '#f9f9f9' : '#ffffff';
    
    // Row background
    doc.rect(margin, itemY - 2, pageWidth - margin * 2, 18).fill(rowBgColor);
    doc.fillColor('#333');
    
    doc.text(item.name || 'Item', col1, itemY);
    doc.text(item.quantity.toString(), col2, itemY);
    doc.text(`₹${item.price.toFixed(2)}`, col3, itemY);
    doc.text(`₹${(item.quantity * item.price).toFixed(2)}`, col4, itemY);
    
    itemY += 18;
  });

  doc.moveDown(1);

  // TOTALS SECTION
  const totalsStartY = itemY + 10;
  const totalsX = pageWidth - margin - 200;

  doc.font('Helvetica').fontSize(10).fillColor('#666');
  doc.text('Subtotal:', totalsX, totalsStartY, { width: 80, align: 'right' });
  doc.text(`₹${invoice.totalAmount.toFixed(2)}`, totalsX + 100, totalsStartY, { width: 60, align: 'right' });

  doc.moveDown(0.8);
  doc.text('GST (0%):', totalsX, doc.y, { width: 80, align: 'right' });
  doc.text('₹0.00', totalsX + 100, doc.y, { width: 60, align: 'right' });

  doc.moveDown(1);
  doc.font('Helvetica-Bold').fontSize(12).fillColor('#000');
  doc.text('Total (INR):', totalsX, doc.y, { width: 80, align: 'right' });
  doc.text(`₹${invoice.totalAmount.toFixed(2)}`, totalsX + 100, doc.y, { width: 60, align: 'right' });

  // FOOTER
  doc.fontSize(9).fillColor('#666').font('Helvetica');
  doc.text('Your Business Name', margin, pageHeight - 60);
  doc.text('123 Business Ave, Mumbai, India', margin, doc.y);
  doc.text('📞 +91 2000 0000 | 🌐 www.yourbusinessname.com | 📧 support@yourbusinessname.com', margin, doc.y);

  // Payment status
  const statusColor = invoice.status === 'Paid' ? '#2ecc71' : '#e74c3c';
  doc.fontSize(8).fillColor(statusColor).font('Helvetica-Bold');
  doc.text(`Status: ${invoice.status}`, margin, pageHeight - 15);
};

// DOWNLOAD PDF
exports.downloadPDF = async (req, res) => {
  try {
    console.log("PDF route hit");

    const invoice = await Invoice.findById(req.params.invoiceId)
      .populate('clientId')
      .populate('userId');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const doc = new PDFDocument({ margin: 0 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice-${invoice._id}.pdf`
    );

    doc.pipe(res);

    generateInvoicePDF(doc, invoice);

    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating PDF', error: error.message });
  }
};

// PREVIEW PDF (opens in browser)
exports.previewPDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId)
      .populate('clientId')
      .populate('userId');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const doc = new PDFDocument({ margin: 0 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=invoice-${invoice._id}.pdf`
    );

    doc.pipe(res);

    generateInvoicePDF(doc, invoice);

    doc.end();

  } catch (error) {
    res.status(500).json({ message: 'Error previewing PDF', error: error.message });
  }
};