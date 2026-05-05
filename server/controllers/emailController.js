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

const generateInvoicePDF = (doc, invoice) => {
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const margin = 40;

  // HEADER SECTION
  doc.fontSize(24).font('Helvetica-Bold').fillColor('#333').text('Your Business Name', margin, margin);
  doc.fontSize(14).font('Helvetica-Bold').fillColor('#333').text('Invoice', pageWidth - margin - 150, margin, { width: 150, align: 'right' });
  doc.fontSize(12).fillColor('#666').text(`#${invoice._id.toString().slice(-6).toUpperCase()}`, pageWidth - margin - 150, doc.y, { width: 150, align: 'right' });
  doc.fontSize(10).fillColor('#999').text('Tax Invoice', pageWidth - margin - 150, doc.y, { width: 150, align: 'right' });

  doc.moveDown(1.5);

  //BILL TO SECTION
  doc.fontSize(11).font('Helvetica-Bold').fillColor('#333').text('BILL TO', margin, doc.y);
  doc.fontSize(10).font('Helvetica').fillColor('#555');
  doc.text(invoice.clientId.name, margin, doc.y + 3);
  doc.text(invoice.clientId.address || '123 Client Street', margin, doc.y);
  doc.text(invoice.clientId.email || 'client@email.com', margin, doc.y);
  doc.text(invoice.clientId.phone || 'Phone Number', margin, doc.y);

  const detailsY = doc.y - 60;
  doc.fontSize(10).font('Helvetica').fillColor('#666');
  doc.text('Issue date:', pageWidth - margin - 150, detailsY, { width: 80 });
  doc.font('Helvetica-Bold').text(new Date(invoice.createdAt).toLocaleDateString(), pageWidth - margin - 70, detailsY, { width: 70 });
  doc.font('Helvetica').text('Due date:', pageWidth - margin - 150, detailsY + 20, { width: 80 });
  doc.font('Helvetica-Bold').text(new Date(invoice.dueDate).toLocaleDateString(), pageWidth - margin - 70, detailsY + 20, { width: 70 });
  doc.font('Helvetica').text('Reference:', pageWidth - margin - 150, detailsY + 40, { width: 80 });
  doc.font('Helvetica-Bold').text(invoice._id.toString().slice(-8).toUpperCase(), pageWidth - margin - 70, detailsY + 40, { width: 70 });

  doc.moveDown(3);

  // INFO HEADER ROW
  const headerY = doc.y;
  const rowHeight = 20;
  const col1 = margin;
  const col2 = pageWidth - margin - 250;
  const col3 = pageWidth - margin - 150;
  const col4 = pageWidth - margin - 70;

  doc.rect(margin, headerY, pageWidth - margin * 2, rowHeight).fill('#F4A460');
  doc.fillColor('#fff').font('Helvetica-Bold').fontSize(10);
  doc.text('Invoice No.', col1 + 10, headerY + 5);
  doc.text('Issue Date', col2, headerY + 5);
  doc.text('Due Date', col3, headerY + 5);
  doc.text('Total Due (INR)', col4, headerY + 5);

  doc.fillColor('#333').text(invoice._id.toString().slice(-6).toUpperCase(), col1 + 10, headerY + 5);
  doc.text(new Date(invoice.createdAt).toLocaleDateString(), col2, headerY + 5);
  doc.text(new Date(invoice.dueDate).toLocaleDateString(), col3, headerY + 5);
  doc.fillColor('#000').font('Helvetica-Bold').text(`₹${invoice.totalAmount.toFixed(2)}`, col4, headerY + 5);

  doc.moveDown(2.5);

  // ITEMS TABLE HEADER 
  const tableHeaderY = doc.y;
  doc.rect(margin, tableHeaderY, pageWidth - margin * 2, 18).fill('#333');
  doc.fillColor('#fff').font('Helvetica-Bold').fontSize(10);
  doc.text('Description', col1 + 8, tableHeaderY + 4);
  doc.text('Quantity', col2 + 20, tableHeaderY + 4);
  doc.text('Unit price', col3, tableHeaderY + 4);
  doc.text('Amount', col4, tableHeaderY + 4);

  doc.moveDown(1.8);

  let itemY = doc.y;
  doc.font('Helvetica').fontSize(10).fillColor('#333');

  invoice.items.forEach((item, index) => {
    const rowBgColor = index % 2 ? '#f9f9f9' : '#ffffff';
    doc.rect(margin, itemY - 2, pageWidth - margin * 2, 18).fill(rowBgColor);
    doc.fillColor('#333');
    doc.text(item.name, col1 + 8, itemY);
    doc.text(item.quantity.toString(), col2 + 20, itemY);
    doc.text(`₹${item.price.toFixed(2)}`, col3, itemY);
    doc.text(`₹${(item.quantity * item.price).toFixed(2)}`, col4, itemY);
    itemY += 18;
  });

  doc.moveDown(1);

  // TOTALS SECTION
  const totalsX = pageWidth - margin - 200;
  doc.font('Helvetica').fontSize(10).fillColor('#666');
  doc.text('Subtotal:', totalsX, itemY + 10, { width: 80, align: 'right' });
  doc.text(`₹${invoice.totalAmount.toFixed(2)}`, totalsX + 100, itemY + 10, { width: 60, align: 'right' });
  doc.text('GST (0%):', totalsX, itemY + 30, { width: 80, align: 'right' });
  doc.text('₹0.00', totalsX + 100, itemY + 30, { width: 60, align: 'right' });
  doc.font('Helvetica-Bold').fontSize(12).fillColor('#000');
  doc.text('Total (INR):', totalsX, itemY + 50, { width: 80, align: 'right' });
  doc.text(`₹${invoice.totalAmount.toFixed(2)}`, totalsX + 100, itemY + 50, { width: 60, align: 'right' });

  // FOOTER
  doc.fontSize(9).fillColor('#666').font('Helvetica');
  doc.text('Your Business Name', margin, pageHeight - 60);
  doc.text('123 Business Ave, Mumbai, India', margin, doc.y);
  doc.text('📞 +91 2000 0000 | 🌐 www.yourbusinessname.com | 📧 support@yourbusinessname.com', margin, doc.y);

  const statusColor = invoice.status === 'Paid' ? '#2ecc71' : '#e74c3c';
  doc.fontSize(8).fillColor(statusColor).font('Helvetica-Bold');
  doc.text(`Status: ${invoice.status}`, margin, pageHeight - 15);
};

exports.sendInvoiceEmail = async (req, res) => {
  try {
    const { invoiceId, recipientEmail } = req.body;

    if (!invoiceId || !recipientEmail) {
      return res.status(400).json({ message: 'invoiceId and recipientEmail are required' });
    }

    const invoice = await Invoice.findById(invoiceId).populate('clientId');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const doc = new PDFDocument({ margin: 0 });
    let buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);

      const mailOptions = {
        from: `"Invoice App" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
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