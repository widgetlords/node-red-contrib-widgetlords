const koffi = require("koffi");

const widgetlords = koffi.load("libwidgetlords.so");
const vpe_2901a_init = widgetlords.func("vpe_2901a_init", "void", []);
const vpe_2901a_2ko_write_single = widgetlords.func(
  "vpe_2901a_2ko_write_single",
  "void",
  ["uint8", "uint8"],
);

module.exports = function (RED) {
  function RelayNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    vpe_2901a_init();

    node.on("input", function (msg) {
      this.status({ fill: "green", shape: "dot", text: msg.payload });
      vpe_2901a_2ko_write_single(parseInt(config.channel), msg.payload);

      node.status({ fill: "green", shape: "dot", text: msg.payload });
    });
  }
  RED.nodes.registerType("widgetlords-vpe-2901a-relay", RelayNode);
};
