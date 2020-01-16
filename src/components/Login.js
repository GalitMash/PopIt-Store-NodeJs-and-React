import React from 'react';
import { login } from '../repository';

export default class Login extends React.Component{

  constructor(props) {
    super(props);
    this.state = { name: '', password: '', remember_me: false };
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  // Sending a login request and redirecting to the products page
  submitLogin = (event) => {
    event.preventDefault();
    login(this.state)
      .then(token => window.location = '/')
      .catch(err => alert(err));
  };

  rerouteToSignUp = () => {
    this.props.history.push('/signup');
  };

  render() {
    return (
      <div className="container">
        <div className="col-sm-8 col-sm-offset-2">
          <div className="panel panel-primary">
            <div className="panel-heading">
              <h3>Log in </h3>
              <hr/>
            </div>
            <div className="panel-body">
              <form onSubmit={this.submitLogin}>
                <div className="form-group">
                  <label>Name:</label>
                  <input type="text" className="form-control" name="name" onChange={this.handleInputChange}/>
                </div>
                <div className="form-group">
                  <label>Password:</label>
                  <input type="password" className="form-control" name="password" onChange={this.handleInputChange}/>
                </div>
                <label>
                  <input type="checkbox"
                         defaultChecked={this.state.remember_me}
                         onChange={this.handleInputChange}
                         name="remember_me"
                         style={{width:"auto"}}/> Remember Me
                </label>
                <br/>
                <button type="submit" className="btn btn-default">Submit</button>
              </form>
            <br/>
              <button className="btn btn-default" onClick={this.rerouteToSignUp}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
