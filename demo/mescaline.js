
var graph = function(){


}; 
mescaline=function(rn){
  function coerce_data(din){
    var ret = false;
    for(pair in din){
      if(ret){ret = ret + ','}else{ret=''}
      ret = ret + (pair[0] + ',' + pair[1])
    }
    return ret;
  };
  var first_gg = {
    add_graph: function(data,opts){

node=document.createElementNS('http://www.w3.org/2000/svg','polyline');
node.setAttribute('style','stroke: black;fill: red; fill-opacity: 0.3; stroke-width: 0.2;');
node.setAttribute('points',coerce_data(data));
node.setAttribute('x',0);
node.setAttribute('y',0);
     
    };
  };
  var mescaline_struct={
    graph_group: new Array({}),
    root_node: rn
  };
  return {
    graph_group: function(){return mescaline_struct['graph_group'][0]}
  };

};
