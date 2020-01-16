import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import Login from './Login';
import {isAuthenticated} from '../repository';

// Acts as Route if the user is logged in. Otherwise, redirects to the login page.
export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        (isAuthenticated())
            ? <Component {...props} />
            : <Redirect to='/login' component={Login} />
    )} />
)