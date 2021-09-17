class CustomError extends Error {
    constructor(json) {
        super(json.message);

        this.errorCode = json.errorCode;
        this.name = json.name;
        this.description = json.message;
        this.statusCode =  json.statusCode;
    }
}

module.exports = {
    CustomError: CustomError
}