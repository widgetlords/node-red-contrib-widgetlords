var ffi = require('ffi');

var pi_spi_din = ffi.Library('libpi_spi_din', {
	'pi_spi_din_init': [ 'void', [] ],
	//'pi_spi_din_8di_init': [ 'void', [ 'uint32', 'uint8' ] ],
	'pi_spi_din_8ai_read_single': [ 'uint16', [ 'uint32', 'uint8' ] ]
});

pi_spi_din.pi_spi_din_init();

module.exports = function(RED) {
    function Node(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        
        //pi_spi_din.pi_spi_din_8di_init(parseInt(config.chipenable), parseInt(config.address));
        
        function update()
        {
			var value = pi_spi_din.pi_spi_din_8ai_read_single
				(parseInt(config.chipenable),
				 parseInt(config.channel));
			msg = { payload: value };
			node.send(msg);
		}
        var timeout = setInterval(update, parseInt(config.interval));
        
        node.on('close', function() {
			clearInterval(timeout);
		});	
    }
    RED.nodes.registerType("widgetlords-analog-in", Node);
}
