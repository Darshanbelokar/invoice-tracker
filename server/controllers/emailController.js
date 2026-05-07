const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const Invoice = require('../models/Invoice');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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

exports.sendInvoiceEmail = async (req, res) => {
  try {
    const { invoiceId, recipientEmail } = req.body;

    if (!invoiceId) {
      return res.status(400).json({ message: 'invoiceId is required' });
    }

    const invoice = await Invoice.findById(invoiceId).populate('clientId');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Use provided email or get from client
    const emailTo = recipientEmail || invoice.clientId?.email;

    if (!emailTo) {
      return res.status(400).json({ message: 'No recipient email found' });
    }

    const doc = new PDFDocument({ margin: 0 });
    let buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);

      const mailOptions = {
        from: `"Invoice App" <${process.env.EMAIL_USER}>`,
        to: emailTo,
        subject: `Invoice ${invoice._id}`,
        text: `Please find attached your professional invoice.`,
        attachments: [
          {
            filename: `invoice-${invoice._id}.pdf`,
            content: pdfData
          }
        ]
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Invoice email sent with professional PDF' });
    });

    generateInvoicePDF(doc, invoice);
    doc.end();

  } catch (error) {
    res.status(500).json({ message: 'Error sending email', error: error.message });
  }
};

// Send Payment Confirmation Email
exports.sendPaymentConfirmation = async (req, res) => {
  try {
    const { invoiceId, recipientEmail, amount } = req.body;

    if (!invoiceId || !recipientEmail || !amount) {
      return res.status(400).json({ message: 'invoiceId, recipientEmail, and amount are required' });
    }

    const invoice = await Invoice.findById(invoiceId).populate('clientId');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const mailOptions = {
      from: `"Invoice App" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `Payment Confirmation - Invoice ${invoice._id}`,
      html: `
        <h2>Payment Confirmation</h2>
        <p>Thank you for your payment!</p>
        <p><strong>Invoice ID:</strong> ${invoice._id}</p>
        <p><strong>Amount Paid:</strong> ₹${amount}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p>Your invoice status has been updated to Paid.</p>
        <p>Thank you for your business!</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Payment confirmation email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending payment confirmation', error: error.message });
  }
};

// Send Payment Reminder Email
exports.sendReminder = async (req, res) => {
  try {
    const { invoiceId, recipientEmail } = req.body;

    if (!invoiceId || !recipientEmail) {
      return res.status(400).json({ message: 'invoiceId and recipientEmail are required' });
    }

    const invoice = await Invoice.findById(invoiceId).populate('clientId');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    //Check if invoice status is Pending before sending reminder
    if (invoice.status === 'Paid') {
      return res.status(400).json({ message: 'Cannot send reminder for paid invoices' });
    }

    const mailOptions = {
      from: `"Invoice App" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `Payment Reminder - Invoice ${invoice._id}`,
      html: `
        <h2>Payment Reminder</h2>
        <p>This is a friendly reminder that payment is due for your invoice.</p>
        <p><strong>Invoice ID:</strong> ${invoice._id}</p>
        <p><strong>Amount Due:</strong> ₹${invoice.totalAmount}</p>
        <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> ${invoice.status}</p>
        <p>Please make the payment at your earliest convenience.</p>
        <p>For any queries, contact us at support@invoiceiq.com</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reminder email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending reminder', error: error.message });
  }
};