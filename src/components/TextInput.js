import React from 'react';

const TextInput = (props) => {
    let formControl = "form-control";
    let errorMessage = "";
    let inputName = props.name;
    let inputLabel = props.label ? (<label htmlFor={inputName}>{props.label}</label>) : ("");

    // The text field is red and has an error message if it has been modified and isn't valid
    if (props.touched && !props.valid) {
        formControl = "form-control is-invalid";
        errorMessage = props.errormessage;
    }
    // The text field is green if it has been modified and is valid
    if (props.touched && props.valid) {
        formControl = "form-control is-valid";
    }
    // Creating a text area / text input accordingly
    let inputContent = props.istextarea ?
        (<textarea className={formControl} id="exampleFormControlTextarea2" rows="3" style={{resize: "none"}} {...props}></textarea>) :
        (<input type="text" className={formControl} id={inputName} {...props} />);

    return (
        <div className="form-group row">
            <div className="col-12">
            {inputLabel}
            {inputContent}
                <div className="invalid-feedback">
                    {errorMessage}
                </div>
            </div>
        </div>
    );
}

export default TextInput;