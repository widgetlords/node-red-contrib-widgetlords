const koffi = require("koffi");

const widgetlords = koffi.load("libwidgetlords.so");
const pi_spi_din_4ko_init = widgetlords.func("pi_spi_din_4ko_init", "void", [
  "uint32",
  "uint8",
]);
const pi_spi_din_4ko_write_single = widgetlords.func(
  "pi_spi_din_4ko_write_single",
  "void",
  ["uint32", "uint8", "uint8", "uint8"],
);

module.exports = function (RED) {
  function RelayNode(config) {
    RED.nodes.createNode(this, config);

    this.channel = config.channel;
    this.address = config.address;
    this.chipenable = config.chipenable;

    var node = this;

    pi_spi_din_4ko_init(parseInt(node.chipenable), parseInt(node.address));

    node.on("input", function (msg) {
      this.status({ fill: "green", shape: "dot", text: msg.payload });
      pi_spi_din_4ko_write_single(
        parseInt(node.chipenable),
        parseInt(node.address),
        parseInt(node.channel),
        msg.payload,
      );

      node.status({ fill: "green", shape: "dot", text: msg.payload });
    });
  }
  RED.nodes.registerType("widgetlords-relay", RelayNode);
};
