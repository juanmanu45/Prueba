const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');


router.get('/', verificarToken, async (req, res) =>  {
    
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

//Create new Users
router.post('/', async (req, res) => {
    try {
        const { name, userName, lastName, job, password } = req.body;
        const pwEncript = await bcrypt.hash(password, 10)
        const newUser = await User.create({ name, userName, lastName, job, password: pwEncript });
        res.json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//verificar el token JWT de usuario

function verificarToken(req, res, next) {
    const tokenHeader = req.headers.authorization;

    if (!tokenHeader) {
        return res.status(401).json({ success: false, error: 'Token not provided' });
    }
    const token = tokenHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, error: 'Invalid token format' });
    }

    req.token = token;
    jwt.verify(token, process.env.JWT_SECRET, (error, authData) => {
        if (error) {
            console.log('Error al verificar el token:', error);
            res.status(403).json({ success: false, error: 'Access Denied' });
        } else {
            next();
        }
    });
}

module.exports = router;