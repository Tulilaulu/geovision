var labelType, useGradients, nativeTextSupport, animate;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};

function init(){
    //init data
    jQuery('#loader').fadeOut();

//this references data in json_file.js
var json = json_data;
 
    //init RGraph
    var rgraph = new $jit.RGraph({
        //Where to append the visualization
        injectInto: 'infovis',
        //set canvas size
        width: 600,
        height: 600,

        //Optional: create a background canvas that plots
        //concentric circles.
        background: {
          CanvasStyles: {
            strokeStyle: '#555'
          }
        },

        //set distance for nodes on different levels
	levelDistance: 100,

        //set transformation speed
        duration: 500,
        fps: 40,

        //set transformation style
        transition: $jit.Trans.Circ,

        //Add navigation capabilities:
        //zooming by scrolling and panning.
        Navigation: {
          enable: true,
          panning: true,
          zooming: 25
        },
        
        //Set Node and Edge styles.
        Node: {
            overridable: true,
            color: '#ccb',
            alpha: 1,
            dim: 3,
            height: 20,
            width: 90,
            autoHeight: false,
            autoWidth: false,
            lineWidth: 1,
            transform: true,
            align: "center",
            angularWidth:1,
            span:1,
            type: 'circle',
            CanvasStyles: {}
        },
        
        Edge: {
          overridable: true,
          color: '#068481',
          lineWidth:1.2,
          dim: 50
        },

        //Set tooltip configuration
        Tips: {
            enable: true,
            width: 30,
            align: 'left',
            onShow: function(tip, node) {
                tip.innerHTML = ""
                if(node.data.description != undefined)
                    tip.innerHTML += node.data.description;
                if(node.data.adjacencies != undefined)
                    tip.innerHTML += node.data.adjacencies;
            }
        },
        
        onBeforeCompute: function(node){
            Log.write("centering " + node.name + "...");
            //Add the relation list in the right column.
            //This list is taken from the data property of each JSON node.
//            var adj = node.adjacencies;
//            $jit.id('inner-details').innerHTML = ""
//            for(var edge in adj){
//                var i = edge.nodeTo.id;
//                $jit.id('inner-details').innerHTML = i + "a</br>";
//            }
            $jit.id('inner-details').innerHTML = ""
            if(node.data.description != undefined)
                $jit.id('inner-details').innerHTML += node.data.description;
            if(node.data.adjacencies != undefined)
                $jit.id('inner-details').innerHTML += node.data.adjacencies;
        },
        
        onAfterCompute: function(){
            Log.write("done");
        },
        //Add the name of the node in the correponding label
        //and a click handler to move the graph.
        //This method is called once, on label creation.
        onCreateLabel: function(domElement, node){
            domElement.innerHTML = node.name.substr(0,10);
            domElement.onclick = function(){
                rgraph.onClick(node.id);
            };
        },
        //Change some label dom properties.
        //This method is called each time a label is plotted.
        onPlaceLabel: function(domElement, node){
            var style = domElement.style;
            style.display = '';
            style.cursor = 'pointer';

            if (node._depth <= 2) {
                style.fontSize = "1.1em";
                style.color = "#ccc";
            
            } else if(node._depth == 3){
                style.fontSize = "1.1em";
                style.color = "#494949";
            
            } else {
                style.display = 'none';
            }

            var left = parseInt(style.left);
            var w = domElement.offsetWidth;
            style.left = (left - w / 2) + 'px';
        }
    });

    //load JSON data
    rgraph.loadJSON(json);
    
    //trigger small animation
    rgraph.graph.eachNode(function(n) {
      var pos = n.getPos();
      pos.setc(-200, -200);
    });
    rgraph.compute('end');
    rgraph.fx.animate({
      modes:['polar'],
      duration: 1000
    });
    
  
    //end
    //append information about the root relations in the right column
    $jit.id('inner-details').innerHTML = rgraph.graph.getNode(rgraph.root).data.description;
    $jit.id('inner-details').innerHTML += rgraph.graph.getNode(rgraph.root).data.adjacencies;

}
