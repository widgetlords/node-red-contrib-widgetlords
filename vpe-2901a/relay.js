var ffi = require('ffi-napi');

var widgetlords = ffi.Library('libwidgetlords', {
	'pi_spi_din_init': [ 'void', [] ],
	'vpe_2901a_init': [ 'void', [] ],
	'vpe_2901a_2ko_write_single': [ 'void', [ 'uint8', 'uint8' ] ]
});

module.exports = function(RED) {
    function RelayNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        
        widgetlords.pi_spi_din_init();
        widgetlords.vpe_2901a_init();
        
        node.on('input', function(msg) {
            this.status({fill:"green", shape:"dot", text:msg.payload});
            widgetlords.vpe_2901a_2ko_write_single
				(parseInt(config.channel), 
				 msg.payload);
				 
			node.status({fill:"green", shape:"dot", text:msg.payload});
        });
    }
    RED.nodes.registerType("widgetlords-vpe-2901a-relay", RelayNode);
}
