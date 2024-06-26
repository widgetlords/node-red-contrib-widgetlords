const koffi = require("koffi");

const widgetlords = koffi.load("libwidgetlords.so");
const pi_spi_din_4ao_write_single = widgetlords.func(
  "pi_spi_din_4ao_write_single",
  "void",
  ["uint8", "uint8", "uint16"],
);

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    node.on("input", function (msg) {
      this.status({ fill: "green", shape: "dot", text: msg.payload });
      pi_spi_din_4ao_write_single(
        parseInt(config.address),
        parseInt(config.channel),
        parseInt(msg.payload),
      );

      node.status({ fill: "green", shape: "dot", text: msg.payload });
    });
  }
  RED.nodes.registerType("widgetlords-analog-out", Node);
};
