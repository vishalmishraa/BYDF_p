require('dotenv').config();
const
    express = require('express'),
    passport = require('passport'),
    User = require('../models/User'),
    LocalStrategy = require('passport-local'),
    app = express();





passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
