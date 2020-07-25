const saved = (statusCode, action, name, data) => {
    const statusMessage = `${name} ${action} successfully`
    return {
        status: {statusCode, statusMessage},
        data: data ? data.toObject({virtuals: true}) : statusMessage
    }
}

export default {
    ok: (data, msg) => ({
        status: {statusCode: 200, statusMessage: msg || 'Ok'},
        data: data && data.toObject ? data.toObject({virtuals: true}) : data
    }),
    list: data => ({status: {statusCode: 200, statusMessage: 'Ok'}, data}),
    updated: (name, data) => saved(200, 'updated', name, data),
    submitted: (name, data) => saved(200, 'submitted', name, data),
    created: (name, data) => saved(201, 'created', name, data),
    deleted: (name, data) => saved(201, 'deleted', name, data),
    activated: (name, data) => saved(200, 'activated', name, data),
    signedIn: {statusCode: 200, statusMessage: 'Signed in successfully'},
    aggregate: data => ({status: {statusCode: 200, statusMessage: 'Ok'}, data}),

    transaction_complete: {status: {statusCode: 200, statusMessage: 'Transaction completed successfully'}},
    find_reset_pin: name => ({status: {statusCode: 200, statusMessage: `Check your ${name} for the Reset PIN`}}),
    insufficient_funds: {status: {statusCode: 403, statusMessage: 'Insufficient funds'}},

    blocked: {status: {statusCode: 403, statusMessage: 'This account is block, contact support.'}},
    not_permitted: {status: {statusCode: 403, statusMessage: 'Not enough permissions.'}},
    not_found: name => ({status: {statusCode: 404, statusMessage: name + ' not found'}}),
    conflict: name => ({status: {statusCode: 404, statusMessage: name + ' exists'}}),
    form_invalid: name => ({status: {statusCode: 422, statusMessage: `Please provide correct ${name} information`}}),
    invalid_field: name => ({status: {statusCode: 422, statusMessage: 'Invalid ' + name}}),
    field_invalid: name => ({status: {statusCode: 422, statusMessage: name + ' is invalid '}}),
    incorrect_field: name => ({status: {statusCode: 422, statusMessage: 'Incorrect ' + name}}),
    fields_empty: {status: {statusCode: 422, statusMessage: 'Fill in all fields'}},
    field_required: name => ({status: {statusCode: 422, statusMessage: name + ' is required'}}),
    limit_reached: name => ({status: {statusCode: 422, statusMessage: name + ' limit reached'}}),
    not_available: name => ({status: {statusCode: 422, statusMessage: name + ' not available'}}),
    unknown: {status: {statusCode: 500, statusMessage: 'Something went wrong, try again'}},
    not_implemented: {status: {statusCode: 501, statusMessage: 'Not implemented'}}
}