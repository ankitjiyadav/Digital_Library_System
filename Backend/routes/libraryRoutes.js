const express = require('express');
const { addLibrary, getLibraries, updateLibrary } = require('../controllers/LibraryController');

const router = express.Router();

router.post('/', addLibrary);
router.get('/', getLibraries);
router.put('/:id', updateLibrary);

module.exports = router;
