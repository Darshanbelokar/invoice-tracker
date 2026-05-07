const Invoice = require('../models/Invoice');

// Create a new invoice
exports.createInvoice = async (req, res) => {
  try {
    const { clientId, items, totalAmount, dueDate } = req.body;

    if (!clientId || !items || !totalAmount || !dueDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newInvoice = new Invoice({
      userId: req.user, 
      clientId,
      items,
      totalAmount,
      dueDate
    });

    await newInvoice.save();
    
    // Populate clientId before returning
    const populatedInvoice = await Invoice.findById(newInvoice._id).populate('clientId');
    
    res.status(201).json({ message: 'Invoice created successfully', data: populatedInvoice });
  } catch (error) {
    res.status(500).json({ message: 'Error creating invoice', error: error.message });
  }
};

// Get all invoices for a user
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user }).populate('clientId');

    res.status(200).json({ message: 'Invoices retrieved successfully', data: invoices });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoices', error: error.message });
  }
};

// Get a single invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id)
      .populate('clientId')
      .populate('userId');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json({ message: 'Invoice retrieved successfully', data: invoice });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoice', error: error.message });
  }
};

// Update an invoice
exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId, items, totalAmount, dueDate, status } = req.body;

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      id,
      { clientId, items, totalAmount, dueDate, status },
      { new: true, runValidators: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Populate clientId before returning
    const populatedInvoice = await Invoice.findById(updatedInvoice._id).populate('clientId');

    res.status(200).json({ message: 'Invoice updated successfully', data: populatedInvoice });
  } catch (error) {
    res.status(500).json({ message: 'Error updating invoice', error: error.message });
  }
};

// Delete an invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json({ message: 'Invoice deleted successfully', data: deletedInvoice });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting invoice', error: error.message });
  }
};

// Get invoices by status
exports.getInvoicesByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    if (!status) {
      return res.status(400).json({ message: 'status is required' });
    }

    const invoices = await Invoice.find({
      userId: req.user, 
      status
    }).populate('clientId');

    res.status(200).json({ message: 'Invoices retrieved successfully', data: invoices });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoices', error: error.message });
  }
};