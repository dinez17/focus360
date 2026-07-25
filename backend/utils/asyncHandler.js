// Wraps async controller functions so we never repeat try/catch blocks.
// Any thrown error automatically flows to our errorMiddleware.
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;