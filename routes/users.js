const express = require('express');
const router = express.Router();

// Get all users
router.get('/', (req, res) => {
    res.send('oot users');
})
// Get one user
router.get('/:id', (req, res) => {
    
})
// Create user
router.post('/', (req, res) => {
    
})
// Update user
router.patch('/', (req, res) => {
    
})
// Delete user
router.delete('/', (req, res) => {
    
})


module.exports = router;