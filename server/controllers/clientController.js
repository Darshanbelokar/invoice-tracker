const Client = require('../models/Client');

// Create a new client
exports.createClient = async (req, res) => {
  try {
    const { name, contactPerson, email, phone, address, country, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const newClient = await Client.create({
      userId: req.user,  
      name,
      contactPerson,
      email,
      phone,
      address,
      country: country || 'USA',
      status: status || 'active'
    });

    res.status(201).json({
      message: 'Client created successfully',
      data: newClient
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error creating client',
      error: error.message
    });
  }
};

// Get all clients for a user
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find({ userId: req.user });

    res.status(200).json({
      message: 'Clients retrieved successfully',
      data: clients
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error fetching clients',
      error: error.message
    });
  }
};

// Get a single client by ID
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    //Ownership check
    if (client.userId.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.status(200).json({
      message: 'Client retrieved successfully',
      data: client
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error fetching client',
      error: error.message
    });
  }
};

// Update a client
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    if (client.userId.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Client updated successfully',
      data: updatedClient
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error updating client',
      error: error.message
    });
  }
};

// Delete a client
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    if (client.userId.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await client.deleteOne();

    res.status(200).json({
      message: 'Client deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error deleting client',
      error: error.message
    });
  }
};