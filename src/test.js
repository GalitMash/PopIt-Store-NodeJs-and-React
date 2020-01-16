fetch = require('node-fetch');
axios = require('axios');

const FE_URL = 'http://localhost:3000';
const BE_URL = 'http://localhost:5000';

//test the login page
fetch(`${FE_URL}/login`)
    .then(res => res.status)
    .then((status) => {
        console.log("the status code for the login page is: " + status);

        // testing the login functionality
        fetch(`${BE_URL}/api/auth`, {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },

            // it's really unsecure to have the passwords in the test, but we don't have another system for it now
            body: JSON.stringify({'name': 'admin', 'password': 'admin', 'remember_me': 'on'})
        }).then(res => res.status)
            .then((status) => {
                console.log(`testing the login functionality by attempting to log in with admin, the result code is: ${status}`)
            });

        // test signup page
        fetch(`${FE_URL}/signup`).then(res => res.status)
            .then((status) => {
                console.log("the status code for the signup page is: " + status)
            });

        // test signup functionality
        fetch(`${BE_URL}/api/signup`, {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'name': 'admin2', 'password': 'admin'})
        }).then(res => res.status)
            .then((status) => {
                console.log(`testing the signup functionality by attempting to sign up, the result code is: ${status}`)
            });

        // test items functionality
        fetch(`${BE_URL}/api/products`).then(res => res.text())
            .then((text) => {
                let items = JSON.parse(text);
                console.log(`testing the items from the BE by attempting to access an existing item 'Rick Sanchez', the result is : ${items[0]['name']}`);
                console.log(`testing the items from the BE by attempting to access a non existing item, the result is : ${items[10]}`);
            });

        // test item page
        fetch(`${FE_URL}/`).then(res => res.status)
            .then((status) => {
                console.log("the status code for the items page is: " + status)
            });

        // test cart page
        fetch(`${FE_URL}/cart`).then(res => res.status)
            .then((status) => {
                console.log("the status code for the cart page is: " + status)
            });

        // test checkout page
        fetch(`${FE_URL}/checkout`).then(res => res.status)
            .then((status) => {
                console.log("the status code for the checkout page is: " + status)
            });

        // test store locator page
        fetch(`${FE_URL}/storelocator`).then(res => res.status)
            .then((status) => {
                console.log("the status code for the store locator page is: " + status)
            });

        // test customize pop page
        fetch(`${FE_URL}/customizepop`).then(res => res.status)
            .then((status) => {
                console.log("the status code for the customize pop is: " + status)
            });

        // test admin page
        fetch(`${FE_URL}/adminscreen`).then(res => res.status)
            .then((status) => {
                console.log("the status code for the adminscreen page is: " + status)
            });

        // testing the customize a pop functionality
        fetch(`${BE_URL}/api/custompop`, {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( {
                nameOnBox: 'somename',
                clientName: 'someclient',
                email: 'example@gmail.com',
                imageFile: 'testfile',
                specialRequests: '???' })
        }).then(res => res.status)
            .then((status) => {
                console.log(`testing the custompop submit functionality, the result code is: ${status}`)
            });
    });
