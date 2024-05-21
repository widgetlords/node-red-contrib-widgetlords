const koffi = require("koffi");

const widgetlords = koffi.load("libwidgetlords.so");
const pi_spi_8di_init = widgetlords.func("pi_spi_8di_init", "void", [
  "uint8",
  "uint8",
]);
const pi_spi_8di_read_single = widgetlords.func(
  "pi_spi_8di_read_single",
  "uint8",
  ["uint8", "uint8", "uint8"],
);

module.exports = function (RED) {
  function DigitalNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    pi_spi_8di_init(parseInt(config.address), parseInt(config.chipenable));

    function update() {
      var value = pi_spi_8di_read_single(
        parseInt(config.address),
        parseInt(config.channel),
        parseInt(config.chipenable),
      );
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
  RED.nodes.registerType("widgetlords-pi-spi-digital", DigitalNode);
};
