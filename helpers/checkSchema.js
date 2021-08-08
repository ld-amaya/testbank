const jsonschema = require("jsonschema");
const { BadRequestError } = require("../expressError");

function checkSchema(data, schema) {
    const validator = jsonschema.validate(data, schema);
    if (!validator.valid) {
        const errs = validator.errors.map(e => e.stack);
        throw new BadRequestError(errs);
    }
    return true
}

module.exports = checkSchema;