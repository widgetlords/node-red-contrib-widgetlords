var ffi = require('ffi-napi');

var pi_spi_din = ffi.Library('libwidgetlords', {
	'pi_spi_din_init': [ 'void', [] ],
	'pi_spi_din_4ko_init': [ 'void', [ 'uint32', 'uint8' ] ],
	'pi_spi_din_4ko_write_single': [ 'void', [ 'uint32', 'uint8', 'uint8', 'uint8' ] ]
});

module.exports = function(RED) {
    function RelayNode(config) {
        RED.nodes.createNode(this,config);
        
        this.channel = config.channel;
        this.address = config.address;
        this.chipenable = config.chipenable;
        
        var node = this;
        
        pi_spi_din.pi_spi_din_init();
        pi_spi_din.pi_spi_din_4ko_init(parseInt(node.chipenable), parseInt(node.address));
        
        node.on('input', function(msg) {
            this.status({fill:"green",shape:"dot",text:msg.payload});
            pi_spi_din.pi_spi_din_4ko_write_single
				(parseInt(node.chipenable),
				 parseInt(node.address),
				 parseInt(node.channel), 
				 msg.payload);
				 
			node.status({fill:"green", shape:"dot", text:msg.payload});
        });
    }
    RED.nodes.registerType("widgetlords-relay", RelayNode);
}
