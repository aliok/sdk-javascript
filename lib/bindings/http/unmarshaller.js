const Constants = require("./constants.js");
const Commons = require("./commons.js");

const STRUCTURED = "structured";
const BINARY = "binary";

const allowedBinaryContentTypes = [];
allowedBinaryContentTypes.push(Constants.MIME_JSON);
allowedBinaryContentTypes.push(Constants.MIME_OCTET_STREAM);

const allowedStructuredContentTypes = [];
allowedStructuredContentTypes.push(Constants.MIME_CE_JSON);

function validateArgs(payload, headers) {
  if (!payload) {
    throw new TypeError("payload is null or undefined");
  }

  if (!headers) {
    throw new TypeError("headers is null or undefined");
  }
}

// Is it binary or structured?
function resolveBindingName(payload, headers) {
  const contentType =
    Commons.sanityContentType(headers[Constants.HEADER_CONTENT_TYPE]);

  if (contentType.startsWith(Constants.MIME_CE)) {
    // Structured
    if (allowedStructuredContentTypes.includes(contentType)) {
      return STRUCTURED;
    } else {
      const err = new TypeError("structured+type not allowed");
      err.errors = [contentType];
      throw err;
    }
  } else {
    // Binary
    if (allowedBinaryContentTypes.includes(contentType)) {
      return BINARY;
    } else {
      const err = new TypeError("content type not allowed");
      err.errors = [contentType];
      throw err;
    }
  }
}

const Unmarshaller = function(receiverByBinding) {
  this.receiverByBinding = receiverByBinding;
};

Unmarshaller.prototype.unmarshall = function(payload, headers) {
  return new Promise((resolve, reject) => {
    try {
      validateArgs(payload, headers);

      const sanityHeaders = Commons.sanityAndClone(headers);

      // Validation level 1
      if (!sanityHeaders[Constants.HEADER_CONTENT_TYPE]) {
        throw new TypeError("content-type header not found");
      }

      // Resolve the binding
      const bindingName = resolveBindingName(payload, sanityHeaders);
      const cloudevent = this.receiverByBinding[bindingName]
        .parse(payload, sanityHeaders);

      resolve(cloudevent);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = Unmarshaller;
