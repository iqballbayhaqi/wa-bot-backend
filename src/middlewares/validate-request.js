
const validateRequest = async (schema, body) => {
    const options = {
        abortEarly: false, // include all errors
        allowUnknown: true, // ignore unknown props
        stripUnknown: true, // remove unknown props
    };

    const { error, value } = await schema.validate(body, options);

    if (error) {
        throw error;
    }
}

module.exports = validateRequest;