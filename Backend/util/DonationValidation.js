const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true, strictTypes: true });
require("ajv-formats")(ajv);

const schema = {
  "type": "object",
  "properties": {
    "donationId": {
      "type": "integer"
    },
    "name": {
      "type": "string",
      "minLength": 2,
      "maxLength": 15
    },
    "deliveryStatus": {
      "type": "string",
      "enum": ["Available", "Not Available"]
    },
    "date": {
      "type": "string",
      "format": "date-time"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "description": {
      "type": "string",
      "maxLength": 200
    },
    "status": {
      "type": "string",
      "enum": ["Available", "Requested" , "Delivered", "Removed"]
    },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "quantity": {
            "type": "integer"
          }
        },
        "required": ["name", "quantity"]
      }
    }
  },
  "required": ["name", "deliveryStatus", "tags" , "items"]
};
module.exports = ajv.compile(schema);
