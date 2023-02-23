require('dotenv').config('.env');
const cors = require('cors');
const express = require('express');
const app = express();
const morgan = require('morgan');
const { PORT = 3000 } = process.env;

// TODO - require express-openid-connect and destructure auth from it

const { User, Cupcake } = require('./db');

// middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

/* *********** YOUR CODE HERE *********** */
// follow the module instructions: destructure config environment variables from process.env
// follow the docs:
  // define the config object
  // attach Auth0 OIDC auth router
  // create a GET / route handler that sends back Logged in or Logged out
  const { auth, requiresAuth } = require('express-openid-connect');
const e = require('cors');

  const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET_AUTH,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
  };
  // {
  //   given_name: 'Kristina',
  //   family_name: 'Gorina',
  //   nickname: 'kristina.gorina',
  //   name: 'Kristina Gorina',
  //   picture: 'https://lh3.googleusercontent.com/a/AGNmyxbyea5khkC4dNWblHL40D74xLxU39WeWA9KVUYl=s96-c',
  //   locale: 'en',
  //   updated_at: '2023-02-23T20:02:14.286Z',
  //   email: 'kristina.gorina@clover.com',
  //   email_verified: true,
  //   sub: 'google-oauth2|101519670124270572386',
  //   sid: 'surSetzomMDFnntR5xjxgVJ_cGNM19c3'
  // }
  
  // auth router attaches /login, /logout, and /callback routes to the baseURL
  app.use(auth(config));
  app.use(async (error, req, res, next) => {
  if (res.statusCode < 400) {
  res.status(500).res.send({error: error.message});
  } else {
    const [user] = await User.findOrCreate({
      where: {
        username: req.oidc.user.nickname,
        name: req.oidc.user.name,
        email:req.oidc.user.email
      }
    })
    console.log(user);
    next();
  }
});
  // req.isAuthenticated is provided from the auth router
  app.get('/', requiresAuth(),(req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
    
    
  });
  
app.get('/cupcakes', requiresAuth(), async (req, res, next) => {
  try {
    const cupcakes = await Cupcake.findAll();
    res.send(cupcakes);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// error handling middleware
app.use((error, req, res, next) => {
  console.error('SERVER ERROR: ', error);
  if(res.statusCode < 400) res.status(500);
  res.send({error: error.message, name: error.name, message: error.message});
});

app.listen(PORT, () => {
  console.log(`Cupcakes are ready at http://localhost:${PORT}`);
});

