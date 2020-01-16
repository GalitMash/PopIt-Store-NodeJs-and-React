import React from 'react';
import { signup } from '../repository';

export default class SignUp extends React.Component{

  constructor(props) {
    super(props);
    this.state = { name: '', password: '', remember_me: false };
  }

  handleInputChange = (event) => {
    this.setState({[event.target.name]: event.target.value})
  };

  // Registering the user (sending a request) once the submit button has been pressed
  submitSignUp = (event) => {
    event.preventDefault();
    const userDetails = this.state;
    signup(userDetails)
      .catch(err => alert(err));
  };

  render() {
    return (
      <div className="container">
        <div className="col-sm-8 col-sm-offset-2">
          <div className="panel panel-primary">
            <div className="panel-heading">
              <h3>Sign Up </h3>
              <hr/>
            </div>
            <div className="panel-body">
              <form onSubmit={this.submitSignUp}>
                <div className="form-group">
                  <label>Name:</label>
                  <input type="text" className="form-control" name="name" onChange={this.handleInputChange}/>
                </div>
                <div className="form-group">
                  <label>Password:</label>
                  <input type="password" className="form-control" name="password" onChange={this.handleInputChange}/>
                </div>
                <button type="submit" className="btn btn-default">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
