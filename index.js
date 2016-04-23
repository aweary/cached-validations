/**
 * Accepts a map of field names and their respective
 * validation functions. Creates a Map instance used
 * by the returned function to memoize return values.
 *
 * Returns a function that iterates over the field names
 * and either pulls a valid result for the value from
 * the cache or runs the validation function again to
 * get the new result.
 *
 * Returns an object where the keys are the fields
 * and the values are the returned validation errors.
 *
 * @param   {Object}   validators map of fieldNames and validators
 * @return  {Function}
 */

export default function createValidator(validators) {
  const cache = new Map();
  return (input) => {
    const fields = Object.keys(validators);
    const errors = {};
    for (let i = 0; i < fields.length; i++) {
      const fieldName = fields[i];
      const fieldValue = input[fieldName];
      if (!cache.has(fieldName)) cache.set(fieldName, new Map());
      const fieldCache = cache.get(fieldName);
      const cachedValue = fieldCache.get(fieldValue);
      if (cachedValue !== undefined) {
        errors[fieldName] = cachedValue;
        continue;
      }
      const validator = validators[fieldName];
      if (!validator) continue;
      const error = validator(fieldValue);
      if (error) {
        errors[fieldName] = error;
        fieldCache.set(fieldValue, error)
      }
    }
    return errors;
  }
}
