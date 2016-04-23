import createValidator from './index'
import {expect} from 'chai'

describe('cached-validate', () => {
  it('should return the correct validation results', () => {

    const validations = {
      firstName: name => {
        if (!name) return 'name is required'
        if (typeof name !== 'string') return 'name must be a string'
      },
      age: age => {
        if (!age) return 'age is required'
        if (typeof age !== 'number') return 'age must be a number'
        if (age < 13) return 'You must be 13 years old or older'
      }
    }

    const testValidator = createValidator(validations);

    expect(
      testValidator({
        firstName: 'Brandon',
        age: '10'
      })
    ).to.deep.equal({
      age: 'age must be a number'
    })

    expect(
      testValidator({
        firstName: 1000,
        age: 15
      })
    ).to.deep.equal({
        firstName: 'name must be a string'
      })

    expect(
      testValidator({})
    ).to.deep.equal({
        firstName: 'name is required',
        age: 'age is required'
      })
  });

  it('should return cached results when available', () => {
    let callCount = 0;

    const validations = {
      number: () => {
        callCount++;
        return 'Some error string'
      }
    }

    const testValidator = createValidator(validations);

    testValidator({number: 10});
    testValidator({number: 10});
    testValidator({number: 10});
    testValidator({number: 10});

    expect(callCount).to.equal(1);

  })

  it('should not return cached results when the value changes', () => {
    let callCount = 0;

    const validations = {
      number: () => {
        callCount++;
        return 'Some error string'
      }
    }

    const testValidator = createValidator(validations);

    testValidator({number: 10});
    testValidator({number: 10});
    testValidator({number: 20});
    testValidator({number: 10});

    expect(callCount).to.equal(2);

  })

})
