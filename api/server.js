'use strict';
const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const data = require('./products');
const path = require("path");
const multer = require("multer");
const { createReadStream } = require('fs');
const { createInterface } = require('readline');

const validatePassword = (password) => {
    // return false for users containing the characters \ / & ' "
    const regEx = /^[^\\\/&'"]*$/;
    return regEx.test(password);
};

const validateUser = (user) => {
    // return true if user contains only numbers and letters
    const regEx = /^[A-Za-z0-9]+$/;
    return regEx.test(user);
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(cookieParser());


app.get('/api/products', (req, res) => {
    return res.json(data.products);
});

app.post('/api/products', (req, res) => {
    let products = [], id = null;
    let cart = JSON.parse(req.body.cart);
    if (!cart) return res.json(products)
    for (let i = 0; i < data.products.length; i++) {
        id = data.products[i].id.toString();
        if (cart.hasOwnProperty(id)) {
            data.products[i].qty = cart[id]
            products.push(data.products[i]);
        }
    }
    return res.status(200).json(products);
});

app.post('/api/auth', async (req, res) => {
    const usersList = await getDataArray('./api/users.txt')
    let user = usersList.filter((user) => {
        return user.name == req.body.name && user.password == req.body.password;
    });
    if (user.length) {
        // if 'Remember Me' is not pressed in login, have the cookie live for 5 minutes
        const options = (req.body.remember_me == true) ? {} : {maxAge: 300000}; // 5 min = 300000
        res.cookie('username', req.body.name, options);
        return res.status(200).json({message: "Logged in successfully."});
    } else {
        return res.status(409).json({message: "Authentication failed. The credentials that were provided are incorrect."});
    }
});

app.post('/api/signup', async (req, res) => {
    const usersList = await getDataArray('./api/users.txt')
    let userExists = usersList.filter((user) => {
        return user.name == req.body.name;
    });
    if (userExists.length) {
        return res.status(409).json({message: "Sign up failed - username already exists."});
    } else if (validateUser(req.body.name) && validatePassword(req.body.password)) {
        const user = '\n' + JSON.stringify(req.body);
        writeToFile('./api/users.txt', user);
        return res.status(200).json({message: 'User created successfully! You may now proceed to log in.'});
    } else {
        return res.status(409).json("Sign up failed - invalid username / password.");
    }

});

app.post('/api/logger', (req, res, next) => {
    const log = JSON.stringify(req.body) + '\n';
    writeToFile('api/user-activity.txt', log);
    return res.status(200).json({message: 'Wrote log successfully.'});
});

app.get('/api/logger', async (req, res) => {
    const logsList = await getDataArray('./api/user-activity.txt');
    return res.status(200).json(logsList);
});

/* Handling the Custom Pop form and storing the uploaded image */

const storage = multer.diskStorage({
    destination: './api/uploads/',
    filename: function (req, file, cb) {
        cb(null, "IMAGE-" + Date.now() + path.extname(file.originalname));
    }
});
const acceptedFormats = ['jpg', 'png', 'gif', 'jpeg'];

const upload = multer({
    storage: storage,
    limits: {fileSize: 2000000}, // 2MB
    fileFilter: (req, file, cb) => {
        // Verifying that the file's extension is allowed
        if (acceptedFormats.some(ext => file.mimetype.endsWith("/" + ext))){
            return cb(null, true);
        }
        return cb(new Error('Only ' + acceptedFormats.join(", ") + ' files are allowed!'));
    }
}).single('customPopImage');

app.post('/api/custompop', function (req, res, next) {
    // We defined our directory to contain at most 50 images for security reasons (preventing malicious uploads)
    const fileCountInUploadDir = fs.readdirSync('api/uploads').length;
    if (fileCountInUploadDir < 50){
        upload(req, res, function(err) {
            // If there's an error (for example, file too large)
            if (err){
                return next(err);
            }
            return res.status(200).json({message: 'Request for a custom Pop has been sent! We\'ll get back to you with an offer in 2 business days.'});
        });
    } else {
        return res.status(409).json({message: "We have too much requests right now. Please try again later!"});
    }
});

/* Handling writing and reading from files for the users and logs */

const writeToFile = (path, text) => {
    fs.appendFile(path, text, function (err) {
        if (err) next(err);
    });
}

const createArrayFromFileLines = (path) => {
    let data = [];
    return new Promise(resolve => {
        try {
            const rl = createInterface({
                input: createReadStream(path),
                crlfDelay: Infinity
            });

            rl.on('line', (line) => {
                let parsedLine = "";
                    try {
                        parsedLine = JSON.parse(line);
                        data.push(parsedLine);
                    } catch(err) {
                        console.log("Error in parsing line. " + err.message);
                    }
            });

            rl.on('close', function(){
                resolve(data)
                });
        } catch (err) {
            console.error(err);
        }
    });
}

const getDataArray = (path) => {
    const data = createArrayFromFileLines(path);
    return data;
}

const PORT = 5000;

// Handling 404 responses
app.use(function (req, res, next) {
    res.status(404).json({message: "Sorry, can't find what you requested."})
});

// Handling errors
app.use(function (err, req, res, next) {
    res.status(500).json({message: err.message});
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));