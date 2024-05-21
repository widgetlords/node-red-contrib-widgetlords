var ffi = require("ffi-napi");

var widgetlords = ffi.Library("libwidgetlords", {
  pi_spi_init: ["void", []],
  pi_spi_8ai_read_single: ["uint16", ["uint8", "uint8"]],
});

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    function update() {
      var value = widgetlords.pi_spi_8ai_read_single(
        parseInt(config.channel),
        parseInt(config.chipenable),
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
  RED.nodes.registerType("widgetlords-pi-spi-analog-in", Node);
};
