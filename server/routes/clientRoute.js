const express = require('express')
const Clientrouter = express.Router();

const{
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
} = require('../controllers/clientController');

Clientrouter.route('/')
  .post(createClient)
  .get(getClients)

Clientrouter.route('/:id')
  .get(getClientById)
  .put(updateClient)
  .delete(deleteClient)

module.exports = Clientrouter;