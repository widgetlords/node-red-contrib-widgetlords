const koffi = require("koffi");

const sdafe_reading = koffi.struct("sdafe_reading", {
  value: "uint16",
  status: "uint32",
  counts: "uint16",
  type: "uint32",
});

const widgetlords = koffi.load("libwidgetlords.so");
const sdafe_set_type = widgetlords.func("sdafe_set_type", "void", [
  "uint8",
  "uint32",
]);
const sdafe_read = widgetlords.func("sdafe_read", sdafe_reading, ["uint8"]);

module.exports = function (RED) {
  function SdafeNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    sdafe_set_type(parseInt(config.channel), parseInt(config.input_type));

    function update() {
      var value = sdafe_read(parseInt(config.channel));
      msg = { payload: value.value, channel: parseInt(config.channel) };
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
  RED.nodes.registerType("widgetlords-vpe-3011b-sdafe", SdafeNode);
};
