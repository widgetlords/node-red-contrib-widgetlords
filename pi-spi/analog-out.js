const koffi = require("koffi");

const widgetlords = koffi.load("libwidgetlords.so");
const pi_spi_2ao_write_single = widgetlords.func(
  "pi_spi_2ao_write_single",
  "void",
  ["uint8", "uint16", "uint8"],
);

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    node.on("input", function (msg) {
      this.status({ fill: "green", shape: "dot", text: msg.payload });
      pi_spi_2ao_write_single(
        parseInt(config.channel),
        parseInt(msg.payload),
        parseInt(config.chipenable),
      );

      node.status({ fill: "green", shape: "dot", text: msg.payload });
    });
  }
  RED.nodes.registerType("widgetlords-pi-spi-analog-out", Node);
};
