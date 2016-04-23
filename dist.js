"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createValidator;
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

function createValidator(validators) {
  var cache = new Map();
  return function (input) {
    var fields = Object.keys(validators);
    var errors = {};
    for (var i = 0; i < fields.length; i++) {
      var fieldName = fields[i];
      var fieldValue = input[fieldName];
      if (!cache.has(fieldName)) cache.set(fieldName, new Map());
      var fieldCache = cache.get(fieldName);
      var cachedValue = fieldCache.get(fieldValue);
      if (cachedValue !== undefined) {
        errors[fieldName] = cachedValue;
        continue;
      }
      var validator = validators[fieldName];
      if (!validator) continue;
      var error = validator(fieldValue);
      if (error) {
        errors[fieldName] = error;
        fieldCache.set(fieldValue, error);
      }
    }
    return errors;
  };
}
