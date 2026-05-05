const express = require('express');
const invoiceRouter = express.Router();

const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  getInvoicesByStatus
} = require('../controllers/invoiceController');

invoiceRouter.route('/')
  .post(createInvoice)
  .get(getInvoices);

invoiceRouter.route('/:id')
  .get(getInvoiceById)
  .put(updateInvoice)
  .delete(deleteInvoice);

invoiceRouter.route('/status/filter')
  .get(getInvoicesByStatus);

module.exports = invoiceRouter;
