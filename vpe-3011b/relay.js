var ffi = require("ffi-napi");

var widgetlords = ffi.Library("libwidgetlords", {
  pi_spi_din_init: ["void", []],
  vpe_3011b_init: ["void", []],
  vpe_3011b_4ko_write_single: ["void", ["uint8", "uint8"]],
});

module.exports = function (RED) {
  function RelayNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    widgetlords.vpe_3011b_init();

    node.on("input", function (msg) {
      node.debug(
        "Sending to libwidgetlords: " +
          parseInt(config.channel) +
          ", " +
          msg.payload,
      );

      node.status({ fill: "green", shape: "dot", text: msg.payload });

      widgetlords.vpe_3011b_4ko_write_single(
        parseInt(config.channel),
        msg.payload,
      );
    });
  }
  RED.nodes.registerType("widgetlords-vpe-3011b-relay", RelayNode);
};
