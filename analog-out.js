var ffi = require('ffi');

var pi_spi_din = ffi.Library('libpi_spi_din', {
	'pi_spi_din_init': [ 'void', [] ],
	'pi_spi_din_4ao_init': [ 'void', [] ],
	'pi_spi_din_4ao_write_single': [ 'void', [ 'uint8', 'uint16' ] ]
});

pi_spi_din.pi_spi_din_init();

module.exports = function(RED) {
    function Node(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        
        pi_spi_din.pi_spi_din_4ao_init();
		
		node.on('input', function(msg) {
            this.status({fill:"green",shape:"dot",text:msg.payload});
            pi_spi_din.pi_spi_din_4ao_write_single
				(parseInt(config.channel), 
				 parseInt(msg.payload));
        });
    }
    RED.nodes.registerType("widgetlords-analog-out", Node);
}
