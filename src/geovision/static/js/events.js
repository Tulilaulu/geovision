Config.Events = 
{
	enableForEdges: true,
	enable : true,
	type : 'Native', //edge event doesn't work with 'HTML'..

	onClick: function(node, opt)
	{
		if(!node || node.nodeFrom)
			return;
		if(currentEdge != undefined){
			
			rgraph.config.Events.onMouseLeave(currentEdge);
		}
		if(currentNode != undefined){
			
			rgraph.config.Events.onMouseLeave(currentNode);
		}
		
		fetchJSON(node, true);
		
		$jit.Graph.Util.computeLevels(rgraph.graph, rgraph.root, 0);
		$jit.Graph.Util.each(rgraph.graph, function(node){
			if(node._depth > max_level)
				max_level = node._depth;
		})
		rgraph.canvas.canvases[1].opt.numberOfCircles = max_level +2;
		rgraph.canvas.canvases[1].plot();
		
		if(node.data.type == 'enzyme'){
			$.getJSON('/enzyme_data', { id: node.id }, showEnzymeData);
		}
	},
	onMouseEnter: function(node, eventInfo, e)
	{
		if(ctxMenuOpen || busy)
			return;

		rgraph.canvas.getElement().style.cursor = 'pointer';

		if (node.nodeTo)
			currentEdge = node;
		else
			currentNode = node;
	},
	onMouseLeave: function(object, eventInfo, e)
	{
		if(ctxMenuOpen || !object || busy)
			return;
		currentNode = currentEdge = undefined;
		rgraph.canvas.getElement().style.cursor = '';
	}
};
