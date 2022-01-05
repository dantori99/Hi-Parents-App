const express = require ('express');
const {
    loggedIn
} = require ('../middlewares/auth');

const { searchParentChild,
        searchNannyChild
} = require('../controllers/search')

const router = express.Router();

router
.route('/search')
.get(loggedIn, searchParentChild)

router
.route('/searchh')
.get(searchNannyChild)


module.exports = router;

