var ffi = require("ffi-napi");

var widgetlords = ffi.Library("libwidgetlords", {
  pi_spi_din_init: ["void", []],
  vpe_3011b_init: ["void", []],
  vpe_3011b_8di_read_single: ["uint8", ["uint8"]],
});

module.exports = function (RED) {
  function DigitalNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    widgetlords.vpe_3011b_init();

    function update() {
      var value = widgetlords.vpe_3011b_8di_read_single(
        parseInt(config.channel),
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
  RED.nodes.registerType("widgetlords-vpe-3011b-digital", DigitalNode);
};
