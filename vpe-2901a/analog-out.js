const koffi = require("koffi");

const widgetlords = koffi.load("libwidgetlords.so");
const vpe_2901a_init = widgetlords.func("vpe_2901a_init", "void", []);
const vpe_2901a_2ao_write_single = widgetlords.func(
  "vpe_2901a_2ao_write_single",
  "void",
  ["uint8", "uint16"],
);

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    vpe_2901a_init();

    node.on("input", function (msg) {
      this.status({ fill: "green", shape: "dot", text: msg.payload });
      vpe_2901a_2ao_write_single(
        parseInt(config.channel),
        parseInt(msg.payload),
      );

      node.status({ fill: "green", shape: "dot", text: msg.payload });
    });
  }
  RED.nodes.registerType("widgetlords-vpe-2901a-analog-out", Node);
};
