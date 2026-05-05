const express = require('express');
const pdfRouter = express.Router();

const { authenticateToken } = require('../middleware/authMiddleware');

const {
  downloadPDF,
  previewPDF
} = require('../controllers/pdfController');

pdfRouter.get('/download/:invoiceId', authenticateToken, downloadPDF);
pdfRouter.get('/preview/:invoiceId', authenticateToken, previewPDF);

module.exports = pdfRouter;