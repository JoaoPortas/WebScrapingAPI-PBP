const httpStatusCodes = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    NOT_ACCEPTABLE: 406,
    REQUEST_TIMEOUT: 408,
    INTERNAL_SERVER: 500,
    NOT_IMPLEMENTED: 501
}

const errorType = {
    PRODUCT_NOT_FOUND: {
        errorCode: '001',
        name: 'PRODUCT_NOT_FOUND',
        message: 'Product not found: The product to search was not found.',
        statusCode: httpStatusCodes.OK
    }
}

module.exports = { errorType: errorType };
