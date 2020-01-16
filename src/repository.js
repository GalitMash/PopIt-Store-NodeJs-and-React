import axios from 'axios/index';
import Cookies from 'universal-cookie';

const BASE_URL = 'http://localhost:5000';
// Requesting the product list
export const getProducts = () => {
	return axios.get(`${BASE_URL}/api/products`)
		.then(response => response.data)
		.catch(err => alertError(err.response.data));
};
// Requesting the cart product list
export const getCartProducts = (cart) => {
	return axios.post(`${BASE_URL}/api/products`, {cart})
		.then(response => response.data)
		.catch(err => alertError(err.response.data));
};
// Sending a request to authenticate a user in order to log in
export const login = (data) => {
	return axios.post(`${BASE_URL}/api/auth`, {name: data.name, password: data.password,
		remember_me: data.remember_me}, {withCredentials: true})
		.then(response => {return response.data})
		.catch(err => alertError(err.response.data));
};
// Sending a request to register a new user
export const signup = (data) => {
	return axios.post(`${BASE_URL}/api/signup`, {name: data.name, password: data.password})
		.then(response => {if (response.status === 200) {
			alert(response.data.message);
		    window.location = '/';
		}})
		.catch(err => alertError(JSON.parse(JSON.stringify(err.response.data))));
};

// Logging activities for the admin screen
export const activityLogger = (activity) => {
	console.log("Sent log");
	const date = new Date();
	const cookies = new Cookies();
	const user = cookies.get('username');
	if (!user) return; // Preventing logs when login expires
	return axios.post(`${BASE_URL}/api/logger`, {name: user, date: date, activity: activity})
		.catch(err => console.log("Unable to send logs to the logger. An error has occurred: " + err.message));
};

// Sending the custom pop form
export const customPopForm = (formData) => {
	const config = {
		headers: {
			'Content-Type': 'multipart/form-data'
		}};
	return axios.post(`${BASE_URL}/api/custompop`, formData, config)
		.catch(err => alertError(err.response.data))
};

// Getting the logs as an array from the logs file for the admin screen
export const getUserLogsArray = () => {
	return axios.get(`${BASE_URL}/api/logger`)
		.then(response => response.data)
		.catch(err => alertError(err.response.data));
};

// Checking if the user is logged in
export const isAuthenticated = () =>{
	const cookies = new Cookies();
	const cookie = cookies.get('username');
	return !!cookie; // Returns the truth value of the cookie
};

// Delete the cookie at log out
export const logOut = () =>{
	const cookies = new Cookies();
	cookies.remove('username');
};

// Checking if the user is the admin
export const isAdmin = () => {
	const cookies = new Cookies();
	const username = cookies.get('username');
	return (username === "admin"); // Returns whether the user is the Admin or not
};

// Getting the user's username
export const getUsername = () =>{
	const cookies = new Cookies();
	const username = cookies.get('username');
	return username;
};

const alertError = (err) => {
	alert("Sorry, an error has occurred: " + err.message);
};
