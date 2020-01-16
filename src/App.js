import React, { Component } from 'react';
import {PrivateRoute} from './components/PrivateRoute';
import Login from './components/Login';
import Products from './components/ProductList';
import SignUp from './components/SignUp';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import StoreLocator from './components/StoreLocator';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import { isAuthenticated, logOut, isAdmin, getUsername } from './repository';
import CustomizePop from "./components/CustomizePop";
import AdminScreen from "./components/AdminScreen";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth: false,
            admin: false,
            username: ""
        };
    }
    // Checking whether the user is logged in or is the admin
    componentWillMount(){
        const name = getUsername();
        this.setState({username: name})
        if (isAuthenticated()){
            this.setState({auth: true});
        }
        if (isAdmin()){
            this.setState({admin: true});
        }
    }

    checkAuthentication = () => {
        if (!isAuthenticated()){
            this.setState({auth: false});
            this.setState({admin: false});
        }
    };
    // Sending a logout request (removing cookie), and then setting the auth and admin state fields to false.
    handleLogOut = () => {
        logOut();
        this.checkAuthentication();
    };
    // Displaying a 404 page when trying to access a page that doesn't exist
    NoMatch = () => {
        return (
            <div className="container">
                <h3>404 - Sorry, this page doesn't exist!</h3>
            </div>
        );
    };

    render() {
        return (
            <Router>
                <div>
                    <nav className="navbar navbar-expand-lg navbar-dark" style={{backgroundColor: "#6f42c1"}}>
                        <div className="container">
                            <Link className="navbar-brand" to="/">PopIt</Link>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse justify-content-between" id="navbarToggler">
                                <div className="navbar-nav">
                                    {this.state.auth &&
                                    <React.Fragment>
                                        <Link className="nav-item nav-link" onClick={this.checkAuthentication} to="/">Products</Link>
                                        <Link className="nav-item nav-link" onClick={this.checkAuthentication} to="/cart">Cart</Link>
                                        <Link className="nav-item nav-link" onClick={this.checkAuthentication} to="/customizepop">Customize A Pop</Link>
                                        <Link className="nav-item nav-link" onClick={this.checkAuthentication} to="/storelocator">Store Locator</Link>
                                    </React.Fragment>}
                                    { this.state.admin &&
                                    <Link className="nav-item nav-link" onClick={this.checkAuthentication} to="/admin">Admin Screen</Link>}
                                </div>
                                {
                                    (this.state.auth) ?
                                        ( <React.Fragment>
                                            <div className="navbar-nav">
                                                <Link className="nav-item nav-link" href="/" onClick={this.handleLogOut} to="/login">Log Out</Link>
                                            </div>
                                            <div className="navbar-nav ml-auto">
                                                <div className="nav-item navbar-text navbar-right">Welcome, {this.state.username}!</div>
                                            </div>
                                        </React.Fragment>) :
                                        ( <React.Fragment>
                                            <div className="navbar-nav mr-auto">
                                                <Link className="nav-item nav-link float-right" to="/login">Log In</Link>
                                                <Link className="nav-item nav-link float-right" to="/signup">Sign Up</Link>
                                            </div>
                                        </React.Fragment>)
                                }
                            </div>
                        </div>
                    </nav>
                    <br/>
                    <Switch>
                        <PrivateRoute exact path="/" component={Products} />
                        <PrivateRoute exact path="/cart" component={Cart} />
                        <PrivateRoute exact path="/checkout" component={Checkout} />
                        <PrivateRoute exact path="/customizepop" component={CustomizePop} />
                        <PrivateRoute exact path="/storelocator" component={StoreLocator} />
                        <PrivateRoute exact path="/admin" component={AdminScreen} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/signup" component={SignUp} />
                        <Route component={this.NoMatch}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
