import express from 'express';
import { Store } from '../Model/Store.js';

const router = express.Router();

// Middleware for fetching a store by ID
async function getStore(req, res, next) {
  let store;
  try {
    store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.store = store;
  next();
}

// Create a new store
router.post('/', async (req, res) => {
  const store = new Store(req.body);

  try {
    const savedStore = await store.save();
    res.status(201).json(savedStore);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all stores
router.get('/', async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single store by ID
router.get('/:id', getStore, (req, res) => {
  res.json(res.store);
});

// Update a store by ID
// Update a store by ID
router.put('/:id', getStore, async (req, res) => {
  try {
    // Update fields only if provided in the request body
    if (req.body.Name) {
      res.store.Name = req.body.Name;
    }
    if (req.body.Quantity) {
      res.store.Quantity = req.body.Quantity;
    }
    if (req.body.Price) {
      res.store.Price = req.body.Price;
    }
    if (req.body.Description) {
      res.store.Description = req.body.Description;
    }
    if (req.body.email) {
      res.store.email = req.body.email;
    }
    
    // Update photoURL only if it exists in the request body, otherwise retain the old one
    if (req.body.photoURL) {
      res.store.photoURL = req.body.photoURL;
    }

    const updatedStore = await res.store.save();
    res.json({
      message: 'Store updated successfully',
      data: updatedStore
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a store
router.delete('/:id', getStore, async (req, res) => {
  try {
    await res.store.deleteOne(); // Use deleteOne() method for the store document
    res.json({ message: 'Store deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Exporting the Express router
export default router;
