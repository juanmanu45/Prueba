const { GetRequest } = require('itrm-tools');

require('dotenv').config();
const User = require('./models/users');
const express = require('express');
const sequelize = require('./database');
const { Sequelize } = require('sequelize');
const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const bcrypt = require('bcrypt');


const swaggerUI = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc');

// const options ={
//     efinition: {
//         openapi: '3.0.0', // specify the version of OpenAPI Specification
//         info: {
//             title: 'Your API Documentation',
//             version: '1.0.0',
//             description: 'Your API description goes here',
//         },
//     },
//     apis: ['./apps/*.js'], //
// };


const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
//app.use('appi-doc',swaggerUI.serve,swaggerUI.setup(swaggerJsdoc(options)))

const Session = sequelize.define('Session', {
    sid: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    data: Sequelize.TEXT,
    expires: Sequelize.DATE,
});

//session store sequalize
const sessionStore = new SequelizeStore({
    db: sequelize,
    table: 'Session',
    expiration: 24 * 60 * 60 * 1000,
});


app.use(session({
    secret: 'SecretSession',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
}));


sequelize.sync();

//login  que entra en bd busca match y retorna tokenjwt para rutas protegidas

app.post('/login', async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await User.findOne({
            where: {
                userName: userName,
            },
        });

        console.log(user)
        if (user) {

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                const payload = {
                    job: user.job,
                    userName: user.userName
                }

                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })

                res.status(200).json({ token });
            } else {
                res.status(403).json({ success: false, error: 'Incorrect Password' });
            }
        } else {
            res.status(403).json({ success: false, error: 'User Not Found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


//logOut 
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.status(200).json({error:'ha salido del app'});
});

//Midleware de error general
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});



app.use('/users', usersRouter);
app.use('/products', productsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});