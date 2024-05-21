const koffi = require("koffi");

const widgetlords = koffi.load("libwidgetlords.so");
const pi_spi_8ai_16b_set_channel = widgetlords.func(
  "pi_spi_8ai_16b_set_channel",
  "void",
  ["uint8", "uint8"],
);
const pi_spi_8ai_16b_read = widgetlords.func("pi_spi_8ai_16b_read", "uint16", [
  "uint8",
]);

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    function update() {
      pi_spi_8ai_16b_set_channel(
        parseInt(config.channel),
        parseInt(config.chipenable),
      );
      var value = pi_spi_8ai_16b_read(parseInt(config.chipenable));
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
  RED.nodes.registerType("widgetlords-pi-spi-8ai-16b", Node);
};
