# cached-validations

> Create validation functions that cache results

## Install

```
$ npm install --save cached-validations
```

## Usage

Create a validation schema and then you can create a validation function that takes in values and outputs any errors based on the passed validation functions.

If an error has already been returned for a specific value then it will be cached and returned on the next invocation, making this a relatively performant option for doing things like form validations on `keyup`.

```js

import createValidator from 'cached-validations';

const formValidations = {
  email: email => {
    if (!email) return 'Email is required';
    if (isNotEmail(email)) return 'Must be a valid email';
  },
  age: age => {
    if (!age) return 'Age is required';
    if (age > 120 || age < 13) return 'Must provide a valid age.'
  }
}

const formValidator = createValidator(formValidations);

const dummyInput = {
  email: 'notanemail',
  age: 44
}
const errors = formValidator(dummyInput)
// {email: 'Must be a valid email'}
```


## API

### `createValidator(validations: object) => function => object`
Takes an object mapping validation functions to keys, returns
a function that will validate objects with those same keys and
return any errors based on the initially provided validations.

## License

MIT © Brandon Dail
