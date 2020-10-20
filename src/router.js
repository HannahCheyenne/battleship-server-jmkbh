const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('https://http://localhost:4000/');
});

module.exports = router;