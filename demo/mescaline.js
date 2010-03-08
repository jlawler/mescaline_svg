
var graph = function(){
  node=document.createElementNS('http://www.w3.org/2000/svg','polyline');
  node.setAttribute('style','stroke: black;fill: red; fill-opacity: 0.3; stroke-width: 0.2;');
  node.setAttribute('points',data1);
  node.setAttribute('x',0);
  node.setAttribute('y',0);


}; 
mescaline=function(rn){
  var mescaline_struct={
    graph_group: new Array({}),
    root_node: rn
  };
  return {
    graph_group: function(){return mescaline_struct['graph_group'][0]}
  };

};
