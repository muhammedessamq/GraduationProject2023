const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true, strictTypes: true });
require("ajv-formats")(ajv);

const schema = {
  "type": "object",
  "properties": {
    "donatorId": {
      "type": "integer"
    },
    "username": {
      "type": "string",
      "minLength": 2,
      "maxLength": 15
    },
    "phoneNumber": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[0-9]{11}$"
      }
    },
    "address": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "password": {
      "type": "string",
      "minLength": 8,
      "maxLength": 20,
      "pattern": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,15}$"
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "taxNumber": {
      "type": "string",
      "pattern": "^[0-9]{9}$"
    },
    "userType": {
      "type": "string",
      "enum": ["Donator", "NGO"]
    },
    "status":{
      "type": "string",
      "enum": ["Pending", "Approved", "Rejected"]
    }
  },
  "required": ["username", "password", "email",  "userType","taxNumber"]
};
module.exports = ajv.compile(schema);
