class ProductNotFoundError extends Error {
    constructor() {
        super("Product not found!");
    }
}

module.exports = ProductNotFoundError;