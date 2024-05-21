var ffi = require("ffi-napi");

var widgetlords = ffi.Library("libwidgetlords", {
  pi_spi_init: ["void", []],
  pi_spi_8ko_write_single: ["void", ["uint8", "uint8", "uint8"]],
});

module.exports = function (RED) {
  function RelayNode(config) {
    RED.nodes.createNode(this, config);

    this.channel = config.channel;
    this.chipenable = config.chipenable;

    var node = this;

    node.on("input", function (msg) {
      this.status({ fill: "green", shape: "dot", text: msg.payload });
      widgetlords.pi_spi_8ko_write_single(
        parseInt(node.channel),
        msg.payload,
        parseInt(node.chipenable),
      );

      node.status({ fill: "green", shape: "dot", text: msg.payload });
    });
  }
  RED.nodes.registerType("widgetlords-pi-spi-relay", RelayNode);
};
