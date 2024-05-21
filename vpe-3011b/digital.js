const koffi = require("koffi");

const widgetlords = koffi.load("libwidgetlords.so");
const vpe_3011b_init = widgetlords.func("vpe_3011b_init", "void", []);
const vpe_3011b_8di_read_single = widgetlords.func(
  "vpe_3011b_8di_read_single",
  "uint8",
  ["uint8"],
);

module.exports = function (RED) {
  function DigitalNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    vpe_3011b_init();

    function update() {
      var value = vpe_3011b_8di_read_single(parseInt(config.channel));
      msg = { payload: value, channel: parseInt(config.channel) };
      if (config.topic !== undefined && config.topic !== "")
        msg.topic = config.topic;
      node.send(msg);

      node.status({ fill: "green", shape: "dot", text: msg.payload });
    }
    var timeout = setInterval(update, parseInt(config.interval));

    node.on("close", function () {
      clearInterval(timeout);
    });
  }
  RED.nodes.registerType("widgetlords-vpe-3011b-digital", DigitalNode);
};
