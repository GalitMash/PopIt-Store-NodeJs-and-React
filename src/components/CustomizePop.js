import React from 'react';
import TextInput from './TextInput';
import validate from './InputValidator';
import {customPopForm, activityLogger} from '../repository';

export default class CustomizePop extends React.Component {
    // Note: I am using 0 for false and 1 for true in attributes that are passed down as props,
    // because React has a problem with passing boolean values to unknown attributes (they become part of the DOM)
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            formFields: {
                nameOnBox: {
                    name: 'nameOnBox',
                    value: '',
                    placeholder: 'Enter the name to be displayed on the box',
                    valid: 0,
                    touched: 0,
                    label: 'Name on the box',
                    errorMessage: 'Please enter the name to be displayed on the box. ' +
                        'It should be at most 15 characters long. Only letters, numbers and these characters are allowed: ~!@#$%^&*()-_=+.:',
                    validationRules: {
                        maxLength: 15,
                        isRequired: true
                    }
                },
                clientName: {
                    name: 'clientName',
                    value: '',
                    placeholder: 'Enter your name',
                    valid: 0,
                    touched: 0,
                    label: 'Your name',
                    errorMessage: 'Please enter your name. ' +
                        'It should be at most 15 characters long. Only letters, numbers and these characters are allowed: ~!@#$%^&*()-_=+.:',
                    validationRules: {
                        maxLength: 15,
                        isRequired: true
                    }
                },

                email: {
                    name: 'email',
                    value: '',
                    placeholder: 'Enter your email address',
                    valid: 0,
                    touched: 0,
                    label: 'Email address',
                    errorMessage: 'Please enter a valid email address.',
                    validationRules: {
                        maxLength: 30,
                        isRequired: true,
                        isEmail: true
                    }
                },

                specialRequests: {
                    name: 'specialRequests',
                    value: '',
                    placeholder: 'You may enter any special requests, up to 250 characters',
                    valid: 1,
                    touched: 0,
                    isTextArea: 1,
                    label: 'Special Requests',
                    errorMessage: 'You can enter at most 250 characters. Only letters, numbers and these characters are allowed: ~!@#$%^&*()-_=+.:',
                    validationRules: {
                        maxLength: 250,
                    }
                },
                customPopImage: {
                    name: 'customPopImage',
                    value: '',
                    imageFile: null,
                    valid: 0,
                    touched: 0,
                    label: 'Upload image',
                    errorMessage: 'Please upload an image.',
                    validationRules: {
                        isRequired: true,
                    }
                }
            },
            formIsValid: false,
        }
    }
    // Checking whether the form is valid when some field has been modified
    handleInputChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        const imageFile = event.target.files ? event.target.files[0] : null;
        const updatedFields = {
            ...this.state.formFields
        };
        const updatedFormField = {
            ...updatedFields[name]
        };
        // 1 is true, 0 is false. See note at the beginning of this class
        updatedFormField.touched = 1;
        // Checking if an image was uploaded
        if (name === "customPopImage"){
            updatedFormField.imageFile = imageFile;
            updatedFormField.valid = imageFile ? 1 : 0; // Valid if it's not null
        } else { // Validating the text field
            updatedFormField.value = value;
            updatedFormField.valid = validate(value, updatedFormField.validationRules) ? 1 : 0;
        }

        updatedFields[name] = updatedFormField;
        this.setState({
            formFields: updatedFields
        });
        let formIsValid = true;
        for (let field in updatedFields) {
            formIsValid = updatedFields[field].valid && formIsValid;
        }
        this.setState({
            formFields: updatedFields,
            formIsValid: formIsValid
        });
    };

    // Submitting the form
    handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        let name;
        let value;
        for (let formFieldId in this.state.formFields) {
            name = this.state.formFields[formFieldId].name;
            value = this.state.formFields[formFieldId].value;
            if (name === "customPopImage") {
                formData.append(name, this.state.formFields.customPopImage.imageFile);
            } else {
                formData.append(name, value);
            }
        }
        // Sending a POST request with the form data, alerting the response and redirecting to the home page
        customPopForm(formData)
            .then(response => {
                if (response) alert(JSON.parse(JSON.stringify(response.data.message)))
            })
            .then(response => window.location = '/');

        // Logging the action for the user activity tracking in the admin page
        activityLogger('Submitted a customized Pop request');
    };

    render() {
        return (
            <div className="container">
                <h3 className="card-title">Customize a Pop</h3>
                <div className="form-group row">
                    <div className="col-5">
            <form encType="multipart/form-data">
                <TextInput name={this.state.formFields.nameOnBox.name}
                           placeholder={this.state.formFields.nameOnBox.placeholder}
                           value={this.state.formFields.nameOnBox.value}
                           onChange={this.handleInputChange}
                           touched={this.state.formFields.nameOnBox.touched}
                           valid={this.state.formFields.nameOnBox.valid}
                           label={this.state.formFields.nameOnBox.label}
                           errormessage={this.state.formFields.nameOnBox.errorMessage}
                />
                <TextInput name={this.state.formFields.clientName.name}
                           placeholder={this.state.formFields.clientName.placeholder}
                           value={this.state.formFields.clientName.value}
                           onChange={this.handleInputChange}
                           touched={this.state.formFields.clientName.touched}
                           valid={this.state.formFields.clientName.valid}
                           label={this.state.formFields.clientName.label}
                           errormessage={this.state.formFields.clientName.errorMessage}
                />
                <TextInput name={this.state.formFields.email.name}
                           placeholder={this.state.formFields.email.placeholder}
                           value={this.state.formFields.email.value}
                           onChange={this.handleInputChange}
                           touched={this.state.formFields.email.touched}
                           valid={this.state.formFields.email.valid}
                           label={this.state.formFields.email.label}
                           errormessage={this.state.formFields.email.errorMessage}
                />
                <TextInput name={this.state.formFields.specialRequests.name}
                           placeholder={this.state.formFields.specialRequests.placeholder}
                           value={this.state.formFields.specialRequests.value}
                           onChange={this.handleInputChange}
                           touched={this.state.formFields.specialRequests.touched}
                           valid={this.state.formFields.specialRequests.valid}
                           label={this.state.formFields.specialRequests.label}
                           istextarea={this.state.formFields.specialRequests.isTextArea}
                           errormessage={this.state.formFields.specialRequests.errorMessage}
                />
                <div className="form-group row">
                    <div className="col-12">
                        <label htmlFor="customPopImage">{this.state.formFields.customPopImage.label}</label>
                        <input type="file" name={this.state.formFields.customPopImage.name} className="form-control" id="customPopImage" onChange={this.handleInputChange}/>
                    </div>
                </div>

                <button type="submit"
                        className="btn btn-default"
                        onClick={this.handleSubmit}
                        disabled={!this.state.formIsValid}>
                    Submit
                </button>
            </form>
                    </div>
                    <div className="col-7">
                <img src={process.env.PUBLIC_URL + `/images/CustomPop.jpg`} className="float-right" alt="CustomPop"/>
            </div>
                </div>
            </div>
        );
    }
}