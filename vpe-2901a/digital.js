const koffi = require("koffi");

const widgetlords = koffi.load("libwidgetlords.so");
const vpe_2901a_init = widgetlords.func("vpe_2901a_init", "void", []);
const vpe_2901a_2di_read_single = widgetlords.func(
  "vpe_2901a_2di_read_single",
  "uint8",
  ["uint8"],
);

module.exports = function (RED) {
  function DigitalNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    vpe_2901a_init();

    function update() {
      var value = vpe_2901a_2di_read_single(parseInt(config.channel));
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
  RED.nodes.registerType("widgetlords-vpe-2901a-digital", DigitalNode);
};
