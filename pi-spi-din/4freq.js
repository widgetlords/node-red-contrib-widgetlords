var ffi = require("ffi-napi");

var widgetlords = ffi.Library("libwidgetlords", {
  pi_spi_din_4freq_read_fixed: ["uint32", ["uint32", "uint8", "uint8"]],
  pi_spi_din_4freq_read_variable: ["uint32", ["uint32", "uint8", "uint8"]],
  pi_spi_din_4freq_read_pulse: ["uint32", ["uint32", "uint8", "uint8"]],
  pi_spi_din_4freq_read_di: ["uint16", ["uint32", "uint8"]],
});

module.exports = function (RED) {
  function Node(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    function update() {
      var value = 0;
      let type = parseInt(config.itype);
      if (type === 0) {
        value = widgetlords.pi_spi_din_4freq_read_fixed(
          parseInt(config.chipenable),
          parseInt(config.address),
          parseInt(config.channel),
        );
      } else if (type === 1) {
        value = widgetlords.pi_spi_din_4freq_read_variable(
          parseInt(config.chipenable),
          parseInt(config.address),
          parseInt(config.channel),
        );
      } else if (type === 2) {
        value = widgetlords.pi_spi_din_4freq_read_pulse(
          parseInt(config.chipenable),
          parseInt(config.address),
          parseInt(config.channel),
        );
      } else if (type === 3) {
        value = widgetlords.pi_spi_din_4freq_read_di(
          parseInt(config.chipenable),
          parseInt(config.address),
        );
        var channel = parseInt(config.channel);
        value = (value >> channel) & 1;
      }
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
  RED.nodes.registerType("widgetlords-pi-spi-din-4freq", Node);
};
