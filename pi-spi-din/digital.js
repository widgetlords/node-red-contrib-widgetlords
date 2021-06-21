var ffi = require('ffi-napi');

var pi_spi_din = ffi.Library('libwidgetlords', {
	'pi_spi_din_init': [ 'void', [] ],
	'pi_spi_din_8di_init': [ 'void', [ 'uint32', 'uint8' ] ],
	'pi_spi_din_8di_read_single': [ 'uint8', [ 'uint32', 'uint8', 'uint8' ] ]
});

module.exports = function(RED) {
    function DigitalNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        
        // pi_spi_din.pi_spi_din_init();
        pi_spi_din.pi_spi_din_8di_init(parseInt(config.chipenable), parseInt(config.address));
        
        function update()
        {
			var value = pi_spi_din.pi_spi_din_8di_read_single
				(parseInt(config.chipenable),
				 parseInt(config.address),
				 parseInt(config.channel));
			msg = { payload: value, channel: parseInt(config.channel) };
			if (config.topic !== undefined && config.topic !== '') msg.topic = config.topic;
			node.send(msg);
			
			node.status({fill:"green", shape:"dot", text:msg.payload});
		}
        var timeout = setInterval(update, parseInt(config.interval));
        
        node.on('close', function() {
			clearInterval(timeout);
		});	
    }
    RED.nodes.registerType("widgetlords-digital", DigitalNode);
}
