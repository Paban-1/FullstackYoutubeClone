// Custome APIError class for sending standardized error responses
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Somthing went wrong",
    errors = [],
    statck = ""
  ) {
    (super(message)
      (this.statusCode = statusCode),
      (this.data = null),
      (this.message = message),
      (this.errors = errors));
    this.sucess = false;
    if (statck) {
      this.stack = statck;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
