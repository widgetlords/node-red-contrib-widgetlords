const koffi = require("koffi");

const widgetlords = koffi.load("libwidgetlords.so");
const vpe_3011b_init = widgetlords.func("vpe_3011b_init", "void", []);
const vpe_3011b_4ko_write_single = widgetlords.func(
  "vpe_3011b_4ko_write_single",
  "void",
  ["uint8", "uint8"],
);

module.exports = function (RED) {
  function RelayNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    vpe_3011b_init();

    node.on("input", function (msg) {
      node.debug(
        "Sending to libwidgetlords: " +
          parseInt(config.channel) +
          ", " +
          msg.payload,
      );

      node.status({ fill: "green", shape: "dot", text: msg.payload });

      vpe_3011b_4ko_write_single(parseInt(config.channel), msg.payload);
    });
  }
  RED.nodes.registerType("widgetlords-vpe-3011b-relay", RelayNode);
};
