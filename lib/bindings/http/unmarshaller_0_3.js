const GenericUnmarshaller = require("./unmarshaller.js");

const StructuredReceiver = require("./receiver_structured_0_3.js");
const BinaryReceiver = require("./receiver_binary_0_3.js");

const RECEIVER_BY_BINDING = {
  structured: new StructuredReceiver(),
  binary: new BinaryReceiver()
};

const Unmarshaller = function() {
  this.unmarshaller = new GenericUnmarshaller(RECEIVER_BY_BINDING);
};

Unmarshaller.prototype.unmarshall = function(payload, headers) {
  return this.unmarshaller.unmarshall(payload, headers);
};

module.exports = Unmarshaller;
