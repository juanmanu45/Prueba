const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();


router.get('/',verificarToken,async(req, res) =>{
    try {
        const products = 'https://dummyjson.com/carts';
        const response = await axios.get(products);

        res.json(response.data);
    } catch (error) {
        console.error('Error al hacer el llamado a la API externa:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

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