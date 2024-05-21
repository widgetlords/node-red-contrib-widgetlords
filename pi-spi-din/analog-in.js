const koffi = require("koffi");

const widgetlords = koffi.load("libwidgetlords.so");
const pi_spi_din_8ai_read_single = widgetlords.func(
  "pi_spi_din_8ai_read_single",
  "uint16",
  ["uint32", "uint8"],
);

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    function update() {
      var value = pi_spi_din_8ai_read_single(
        parseInt(config.chipenable),
        parseInt(config.channel),
      );
      msg = { payload: value };
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
  RED.nodes.registerType("widgetlords-analog-in", Node);
};
