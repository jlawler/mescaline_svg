
var graph = function(){


}; 
mescaline=function(rn){

  function coerce_data(din){
    var ret = false;
var pair=null;
    for(i=0; i< din.length; i++){
pair=din[i];
//alert(pair);
      if(ret){ret = ret + ' '}else{ret=''}
      ret = ret + ((50 * pair[0]) + ',' + (((-1.0 * pair[1]*50)+ 600)));
    }
    return ret;
  };
  var first_gg = {
    add_graph: function(data,opts){
var pnode = document.getElementById('tlg');
var node=document.createElementNS('http://www.w3.org/2000/svg','polyline');
node.setAttribute('style','stroke: black;  stroke-width: 5.2;');
alert(coerce_data(data));
node.setAttribute('points',coerce_data(data));
pnode.appendChild(node)     ;
    }
  };
  var mescaline_struct={
    graph_group: new Array(first_gg),
    root_node: rn
  };
  return {
    graph_group: function(){return mescaline_struct['graph_group'][0]}
  };

};
