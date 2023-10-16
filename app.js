require('dotenv').config();

const
    express = require('express'),
    app = express(),
    flash = require('connect-flash'),
    { MongoClient, ServerApiVersion } = require('mongodb'),
    url = require('url'),
    mongoose = require("mongoose"),
    session = require('express-session'),

    User = require('./models/User'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    multer = require('multer'),

    bodyParser = require('body-parser'),
    path = require('path');


app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
            // secure: true, // becareful set this option, check here: https://www.npmjs.com/package/express-session#cookiesecure. In local, if you set this to true, you won't receive flash as you are using `http` in local, but http is not secure
        },
    })
);
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));

/****************** CLOUDNARY/MULTER SETUP ********************/



const { storage, cloudinary } = require('./config/cloudinary'),
    upload = multer({ storage: storage });

/**************** MONGO DB CONNECTION *********************** */

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
db = async () => {
    await mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log("database connected");
    }).catch(err => {
        console.log('ERROR', err.message);
    });//connecting mongo -> THE NAME OF WHAT WE WILL LOOK FOR IN MONGO

}
db();


/*************** CONFIGRATIONS ******************************* */

let isLoggedIn = (req, res, next) => {
    console.log(req.user);
    req.user ? next() : res.redirect("/login");
}
let isLoggedOut = (req, res, next) => {
    !req.user ? next() : res.redirect("/home");
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.use(express.static(__dirname));
app.use(passport.initialize());
app.use(passport.session());
require('./config/LocalAuth');

// create application/json parser
var jsonParser = bodyParser.json(),
    urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


/***************************************************************** */

app.get('/', (req, res) => {
    res.render('pages/landing');
});



/*************** USER RESGISTER / LOGIN ROUTE ******************************** */

app.get('/signup', isLoggedOut, (req, res) => {
    res.render('user/signup');
});

app.post('/signup', isLoggedOut, upload.single("image"), urlencodedParser, async (req, res) => {
    const
        email = req.body.email,
        imageurl = req.file.path,
        name = req.body.name,
        password = req.body.password,
        mob = req.body.mobNum,
        image = {
            url: imageurl,
            filename: req.file.filename
        };
    if (!email || !name || !password) {
        res.render('user/signup', { error: "Enter all the details" });
    } else {
        try {
            let userdata = { username: req.body.email, displayName: req.body.name, contact: mob, email: req.body.email, image: image };
            const user = new User(userdata);
            const NewUSer = await User.register(user, req.body.password);
            console.log(NewUSer);
            res.render('user/login', { success: "hey..! you are signed up! now login" })
        } catch (error) {
            x
            res.render('user/signup', { error: error.message });
        }
    }

});


app.get('/login', isLoggedOut, (req, res) => {
    res.render('user/login');
})

app.post('/login', isLoggedOut, urlencodedParser, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    res.redirect('/home');
})

app.get("/logout", isLoggedIn, (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.render('pages/landing', { success: "logged out" });
    });
})

app.get('/profile', isLoggedIn, (req, res) => {
    res.render('user/profile', { user: req.user });
})

/*************************** PAGES ************************************ */

app.get('/home', isLoggedIn, (req, res) => {
    res.render('home', { user: req.user });
});
app.get('/about', isLoggedIn, (req, res) => {
    res.render('about', { user: req.user });
});




/********************************************************************** */
app.get('/new', isLoggedIn, (req, res) => {
    res.render('pages/new', { user: req.user });
});
app.get('/show', isLoggedIn, (req, res) => {
    res.render('pages/show');
});
app.get('/listings', isLoggedIn, (req, res) => {
    res.render('pages/listings');
});

/***************************************************************************** */

app.listen(process.env.PORT, () => {
    console.log("Server running on  " + process.env.PORT);
})