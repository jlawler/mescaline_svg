
var graph = function(){


}; 
mescaline=function(rn){

  function coerce_data(din, to_array){
    if(to_array){
    var ret=new Array();
    }else{
    var ret = '';
    }
var pair=null;
var x,y;
    for(i=0; i < din.length; i++){
pair=din[i];
//alert(pair);
if(!to_array){
      if(ret){ret = ret + ' '}else{ret=''}

}
      x = 60 * pair[0];
      y = (-1.0 * pair[1]*50)+ 600;
      if(!to_array){
        ret = ret + x + ',' + y;
      }else{
        ret.append([x,y]);
      }
    }
    return ret;
  };
  var first_gg = {
    add_graph: function(data,opts){
var j;
for(j=0;j<din.length;i++){
var pnode = document.getElementById('tlg');
var node=document.createElementNS('http://www.w3.org/2000/svg','circle');
node.setAttribute('style','stroke: black;  stroke-width: 5.2;');
}
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
