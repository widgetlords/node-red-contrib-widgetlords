var ffi = require('ffi-napi');

var widgetlords = ffi.Library('libwidgetlords', {
	'pi_spi_init': [ 'void', [] ],
	'pi_spi_8di_init': [ 'void', [ 'uint8', 'uint8' ] ],
	'pi_spi_8di_read_single': [ 'uint8', [ 'uint8', 'uint8', 'uint8' ] ]
});

module.exports = function(RED) {
    function DigitalNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        
        // widgetlords.pi_spi_init();
        widgetlords.pi_spi_8di_init(parseInt(config.address), parseInt(config.chipenable));
        
        function update()
        {
			var value = widgetlords.pi_spi_8di_read_single
				(parseInt(config.address),
				 parseInt(config.channel),
				 parseInt(config.chipenable));
			msg = { payload: value, channel: parseInt(config.channel) };
			node.send(msg);
			
			node.status({fill:"green", shape:"dot", text:msg.payload});
		}
        var timeout = setInterval(update, parseInt(config.interval));
        
        node.on('close', function() {
			clearInterval(timeout);
		});	
    }
    RED.nodes.registerType("widgetlords-pi-spi-digital", DigitalNode);
}
