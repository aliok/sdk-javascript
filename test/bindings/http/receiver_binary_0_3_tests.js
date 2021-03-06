const expect = require("chai").expect;

const HTTPBinaryReceiver =
  require("../../../lib/bindings/http/receiver_binary_0_3.js");

const receiver = new HTTPBinaryReceiver();

describe("HTTP Transport Binding Binary Receiver for CloudEvents v0.3", () => {
  describe("Check", () => {
    it("Throw error when payload arg is null or undefined", () => {
      // setup
      const payload = null;
      const attributes = {};

      // act and assert
      expect(receiver.check.bind(receiver, payload, attributes))
        .to.throw("payload is null or undefined");
    });

    it("Throw error when attributes arg is null or undefined", () => {
      // setup
      const payload = {};
      const attributes = null;

      // act and assert
      expect(receiver.check.bind(receiver, payload, attributes))
        .to.throw("attributes is null or undefined");
    });

    it("Throw error when payload is not an object or string", () => {
      // setup
      const payload = 1.2;
      const attributes = {};

      // act and assert
      expect(receiver.check.bind(receiver, payload, attributes))
        .to.throw("payload must be an object or a string");
    });

    it("Throw error when headers has no 'ce-type'", () => {
      // setup
      const payload = {};
      const attributes = {
        "ce-specversion": "specversion",
        "ce-source": "source",
        "ce-id": "id",
        "Content-Type": "application/json"
      };

      // act and assert
      expect(receiver.check.bind(receiver, payload, attributes))
        .to.throw("header 'ce-type' not found");
    });

    it("Throw error when headers has no 'ce-specversion'", () => {
      // setup
      const payload = {};
      const attributes = {
        "ce-type": "type",
        "ce-source": "source",
        "ce-id": "id",
        "Content-Type": "application/json"
      };

      // act and assert
      expect(receiver.check.bind(receiver, payload, attributes))
        .to.throw("header 'ce-specversion' not found");
    });

    it("Throw error when headers has no 'ce-source'", () => {
      // setup
      const payload = {};
      const attributes = {
        "ce-type": "type",
        "ce-specversion": "specversion",
        "ce-id": "id",
        "Content-Type": "application/json"
      };

      // act and assert
      expect(receiver.check.bind(receiver, payload, attributes))
        .to.throw("header 'ce-source' not found");
    });

    it("Throw error when headers has no 'ce-id'", () => {
      // setup
      const payload = {};
      const attributes = {
        "ce-type": "type",
        "ce-specversion": "specversion",
        "ce-source": "source",
        "Content-Type": "application/json"
      };

      // act and assert
      expect(receiver.check.bind(receiver, payload, attributes))
        .to.throw("header 'ce-id' not found");
    });

    it("Throw error when spec is not 0.3", () => {
      // setup
      const payload = {};
      const attributes = {
        "ce-type": "type",
        "ce-specversion": "0.2",
        "ce-source": "source",
        "ce-id": "id",
        "Content-Type": "application/json"
      };

      // act and assert
      expect(receiver.parse.bind(receiver, payload, attributes))
        .to.throw("invalid spec version");
    });

    it("Throw error when the content-type is invalid", () => {
      // setup
      const payload = {};
      const attributes = {
        "ce-type": "type",
        "ce-specversion": "specversion",
        "ce-source": "source",
        "ce-id": "id",
        "Content-Type": "text/html"
      };

      // act and assert
      expect(receiver.check.bind(receiver, payload, attributes))
        .to.throw("invalid content type");
    });

    it("No error when all required headers are in place", () => {
      // setup
      const payload = {};
      const attributes = {
        "ce-type": "type",
        "ce-specversion": "0.3",
        "ce-source": "source",
        "ce-id": "id",
        "Content-Type": "application/json"
      };

      // act and assert
      expect(receiver.check.bind(receiver, payload, attributes))
        .to.not.throw();
    });
  });

  describe("Parse", () => {
    it("CloudEvent contains 'type'", () => {
      // setup
      const payload = {
        data: "dataString"
      };
      const attributes = {
        "ce-type": "type",
        "ce-specversion": "0.3",
        "ce-source": "source",
        "ce-id": "id",
        "ce-time": "2019-06-16T11:42:00Z",
        "ce-schemaurl": "http://schema.registry/v1",
        "Content-Type": "application/json"
      };

      // act
      const actual = receiver.parse(payload, attributes);

      // assert
      expect(actual.getType())
        .to.equal("type");
    });

    it("CloudEvent contains 'specversion'", () => {
      // setup
      const payload = {
        data: "dataString"
      };
      const attributes = {
        "ce-type": "type",
        "ce-specversion": "0.3",
        "ce-source": "source",
        "ce-id": "id",
        "ce-time": "2019-06-16T11:42:00Z",
        "ce-schemaurl": "http://schema.registry/v1",
        "Content-Type": "application/json"
      };

      // act
      const actual = receiver.parse(payload, attributes);

      // assert
      expect(actual.getSpecversion())
        .to.equal("0.3");
    });

    it("CloudEvent contains 'source'", () => {
      // setup
      const payload = {
        data: "dataString"
      };
      const attributes = {
        "ce-type": "type",
        "ce-specversion": "0.3",
        "ce-source": "/source",
        "ce-id": "id",
        "ce-time": "2019-06-16T11:42:00Z",
        "ce-schemaurl": "http://schema.registry/v1",
        "Content-Type": "application/json"
      };

      // act
      const actual = receiver.parse(payload, attributes);

      // assert
      expect(actual.getSource())
        .to.equal("/source");
    });

    it("CloudEvent contains 'id'", () => {
      // setup
      const payload = {
        data: "dataString"
      };
      const attributes = {
        "ce-type": "type",
        "ce-specversion": "0.3",
        "ce-source": "/source",
        "ce-id": "id",
        "ce-time": "2019-06-16T11:42:00Z",
        "ce-schemaurl": "http://schema.registry/v1",
        "Content-Type": "application/json"
      };

      // act
      const actual = receiver.parse(payload, attributes);

      // assert
      expect(actual.getId())
        .to.equal("id");
    });

    it("CloudEvent contains 'time'", () => {
      // setup
      const payload = {
        data: "dataString"
      };
      const attributes = {
        "ce-type": "type",
        "ce-specversion": "0.3",
        "ce-source": "/source",
        "ce-id": "id",
        "ce-time": "2019-06-16T11:42:00.000Z",
        "ce-schemaurl": "http://schema.registry/v1",
        "Content-Type": "application/json"
      };

      // act
      const actual = receiver.parse(payload, attributes);

      // assert
      expect(actual.getTime())
        .to.equal("2019-06-16T11:42:00.000Z");
    });

    it("CloudEvent contains 'schemaurl'", () => {
      // setup
      const payload = {
        data: "dataString"
      };
      const attributes = {
        "ce-type": "type",
        "ce-specversion": "0.3",
        "ce-source": "/source",
        "ce-id": "id",
        "ce-time": "2019-06-16T11:42:00Z",
        "ce-schemaurl": "http://schema.registry/v1",
        "Content-Type": "application/json"
      };

      // act
      const actual = receiver.parse(payload, attributes);

      // assert
      expect(actual.getSchemaurl())
        .to.equal("http://schema.registry/v1");
    });

    it("CloudEvent contains 'datacontenttype' (application/json)", () => {
      // setup
      const payload = {
        data: "dataString"
      };
      const attributes = {
        "ce-type": "type",
        "ce-specversion": "0.3",
        "ce-source": "/source",
        "ce-id": "id",
        "ce-time": "2019-06-16T11:42:00Z",
        "ce-schemaurl": "http://schema.registry/v1",
        "Content-Type": "application/json"
      };

      // act
      const actual = receiver.parse(payload, attributes);

      // assert
      expect(actual.getDataContentType())
        .to.equal("application/json");
    });

    it("CloudEvent contains 'datacontenttype' (application/octet-stream)",
      () => {
      // setup
        const payload = "The payload is binary data";
        const attributes = {
          "ce-type": "type",
          "ce-specversion": "0.3",
          "ce-source": "/source",
          "ce-id": "id",
          "ce-time": "2019-06-16T11:42:00Z",
          "ce-schemaurl": "http://schema.registry/v1",
          "Content-Type": "application/octet-stream"
        };

        // act
        const actual = receiver.parse(payload, attributes);

        // assert
        expect(actual.getDataContentType())
          .to.equal("application/octet-stream");
      });

    it("CloudEvent contains 'data' (application/json)", () => {
      // setup
      const payload = {
        data: "dataString"
      };
      const attributes = {
        "ce-type": "type",
        "ce-specversion": "0.3",
        "ce-source": "/source",
        "ce-id": "id",
        "ce-time": "2019-06-16T11:42:00Z",
        "ce-schemaurl": "http://schema.registry/v1",
        "Content-Type": "application/json"
      };

      // act
      const actual = receiver.parse(payload, attributes);

      // assert
      expect(actual.getData())
        .to.deep.equal(payload);
    });

    it("CloudEvent contains 'data' (application/octet-stream)", () => {
      // setup
      const payload = "The payload is binary data";
      const attributes = {
        "ce-type": "type",
        "ce-specversion": "0.3",
        "ce-source": "/source",
        "ce-id": "id",
        "ce-time": "2019-06-16T11:42:00Z",
        "ce-schemaurl": "http://schema.registry/v1",
        "Content-Type": "application/octet-stream"
      };

      // act
      const actual = receiver.parse(payload, attributes);

      // assert
      expect(actual.getData())
        .to.deep.equal(payload);
    });

    it("No error when all attributes are in place", () => {
      // setup
      const payload = {
        data: "dataString"
      };
      const attributes = {
        "ce-type": "type",
        "ce-specversion": "0.3",
        "ce-source": "source",
        "ce-id": "id",
        "ce-time": "2019-06-16T11:42:00Z",
        "ce-schemaurl": "http://schema.registry/v1",
        "Content-Type": "application/json"
      };

      // act
      const actual = receiver.parse(payload, attributes);

      // assert
      expect(actual)
        .to.be.an("object");

      expect(actual)
        .to.have.property("format");
    });

    it("Should accept 'extension1'", () => {
      // setup
      const extension1 = "mycuston-ext1";
      const payload = {
        data: "dataString"
      };
      const attributes = {
        "ce-type": "type",
        "ce-specversion": "0.3",
        "ce-source": "source",
        "ce-id": "id",
        "ce-time": "2019-06-16T11:42:00Z",
        "ce-schemaurl": "http://schema.registry/v1",
        "Content-Type": "application/json",
        "ce-extension1": extension1
      };

      // act
      const actual = receiver.parse(payload, attributes);
      const actualExtensions = actual.getExtensions();

      // assert
      expect(actualExtensions.extension1)
        .to.equal(extension1);
    });
  });
});
