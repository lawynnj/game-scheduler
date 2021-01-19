function formatResponse(body) {
  var response = {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  };

  return response;
}

function formatError(error) {
  const errorCode = error.code || error.name || "Internal Server Error";
  const response = {
    statusCode: error.statusCode || 500,
    headers: {
      "Content-Type": "text/plain",
      "x-amzn-ErrorType": errorCode,
    },
    body: errorCode + ": " + error.message,
  };

  return response;
}

function serialize(object) {
  return JSON.stringify(object, null, 2);
}

exports.serialize = serialize;
exports.formatError = formatError;
exports.formatResponse = formatResponse;
