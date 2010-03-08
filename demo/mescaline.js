
var graph = function(){


}; 
mescaline=function(rn){

  function coerce_data(din, to_array,scale_by){
    if(!scale_by){scale_by = 1.0};
    if(scale_by > 0){scale_by = scale_by * -1.0}
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
      y = (scale_by * pair[1]*50)+ 600;
      if(!to_array){
        ret = ret + x + ',' + y;
      }else{
        ret.push([x,y]);
      }
    }
    return ret;
  };
  var first_gg = {
    add_graph: function(data,opts){
var j;
var labels = coerce_data(data,true);
for(j=0;j<labels.length;j++){
var pnode = document.getElementById('tlg');
var node=document.createElementNS('http://www.w3.org/2000/svg','circle');
node.setAttribute('style','stroke: green; opacity: 0.2;   stroke-width: 5.2;');
//if(j==0){alert(labels[j][0]+ ', ' + labels[j][1])};
node.setAttribute('cx',labels[j][0]);
node.setAttribute('cy',labels[j][1]);
node.setAttribute('r',5);
pnode.appendChild(node);
}
var pnode = document.getElementById('tlg');
var node=document.createElementNS('http://www.w3.org/2000/svg','polyline');
node.setAttribute('id','jwline');
node.setAttribute('style','stroke: green; opacity: 0.2; fill:none; stroke-width: 5px;');
//alert(coerce_data(data));
node.setAttribute('points',coerce_data(data));
pnode.appendChild(node)     ;
    }
  };
  var mescaline_struct={
    graph_group: new Array(first_gg),
    root_node: rn
  };
  return {
    graph_group: function(){return mescaline_struct['graph_group'][0]},
    ter: function(i){
var u = 10-i;
var pnode = document.getElementById('jwline');
pnode.setAttribute('points',coerce_data(data,false,(1 - (u/10))));
if(i<=4){return}
setTimeout('tg.ter('+ (i-1) + ');',500);
}
  };

};
