const environment = process.env.NODE_ENV || "development";
const config = require(`./environments/${environment}`);

module.exports = config;
