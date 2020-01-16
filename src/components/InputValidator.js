const validate = (value, rules) => {
    let isValid = AlphanumericValidator(value);
    for (let rule in rules) {
        switch (rule) {
            case 'maxLength': isValid = isValid && maxLengthValidator(value, rules[rule]); break;
            case 'isRequired': isValid = isValid && requiredValidator(value); break;
            case 'isEmail': isValid = isValid && emailValidator(value); break;
            default: isValid = true;
        }
    }
    return isValid;
};

// Checking that the field's value contains only letters, numbers and some special characters.
const AlphanumericValidator = (value) => {
    const regex = /^[A-Za-z0-9~!@#$%^&*()\-\_\=\+:\.]*$/;
    return regex.test(String(value).toLowerCase());
};

// Checking that the field's value doesn't exceed the max length
const maxLengthValidator = (value, maxLength) => {
    return value.length <= maxLength;
};

// Checking that a required field has been filled
const requiredValidator = (value) => {
    return value.trim() !== '';
};

// Checking that the email field is valid
const emailValidator = (value) => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(value).toLowerCase());
};

export default validate;