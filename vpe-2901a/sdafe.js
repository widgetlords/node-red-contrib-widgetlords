var ffi = require('ffi-napi');
var ref = require('ref-napi');
var Struct = require('ref-struct-di')(ref);

var sdafe_reading = Struct({
	value: 'uint16',
	status: 'uint32',
	counts: 'uint16',
	type: 'uint32'
});

var widgetlords = ffi.Library('libwidgetlords', {
	'sdafe_set_type': [ 'void', [ 'uint8', 'uint32' ] ],
	'sdafe_read': [ sdafe_reading, [ 'uint8' ] ]
});

module.exports = function(RED) {
    function SdafeNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        
        widgetlords.sdafe_set_type(parseInt(config.channel), parseInt(config.input_type));
        
        function update()
        {
			var value = widgetlords.sdafe_read(parseInt(config.channel));
			msg = { payload: value.value, channel: parseInt(config.channel) };
			if (config.topic !== undefined && config.topic !== '') msg.topic = config.topic;
			node.send(msg);
			
			node.status({fill:"green", shape:"dot", text:msg.payload});
		}
        var timeout = setInterval(update, parseInt(config.interval));
        
        node.on('close', function() {
			clearInterval(timeout);
		});	
    }
    RED.nodes.registerType("widgetlords-vpe-2901a-sdafe", SdafeNode);
}
