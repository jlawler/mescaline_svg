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
var zid=false;
var tlg= document.getElementById('tlg');
var bggrid=function(){
  var up;
  var right;
  return {
    getUp: function(){return up},
    setUp: function(u){up=u},
    getRight: function(){return right},
    setRight: function(r){right=r}
  };
}();
function mm(evt){
  if(zid){
    var xdiff = parseInt(zid[0]) - parseInt(evt.clientX);
    var ydiff = parseInt(zid[1]) - parseInt(evt.clientY);
    
    var ary  = tlg.getAttribute('viewBox').split(' ');
    if(!bggrid.getUp()){
      var n=document.createElementNS('http://www.w3.org/2000/svg','rect');
      n.setAttribute('height','100%');
      n.setAttribute('width','100%');
      n.setAttribute('style','stroke: blue; fill: green; fill-opacity: 0.2;');
      n.setAttribute('x',1200);
      n.setAttribute('y',00);
      tlg.appendChild(n);
      bggrid.setUp(n);
    //  alert('new node!');
    }
    ary[0] = parseInt(ary[0]) + xdiff;
    //ary[1] = parseInt(ary[1]) + ydiff;
    zid=[evt.clientX,evt.clientY];
    tlg.setAttribute('viewBox',ary.join(' '));
    evt.cancelBubble=true;
    evt.returnValue=false;
    return false;
  }
}
function mouseup(evt){
  zid=false;
  return false;
}
function mousedown(evt){
  zid=[evt.clientX,evt.clientY];
  return false;
}
var graphC = function(){
  var labels;
  var gline;

  var pnode = document.getElementById('tlg');
  var data;
  var update_data = function(datai){
      data = datai;

      if(!pnode){pnode = document.getElementById('tlg');}
      //alert(coerce_data(data));
      if(!(gline)){
        gline = document.createElementNS('http://www.w3.org/2000/svg','polyline');
        gline.setAttribute('id','jwline');
        gline.setAttribute('style','stroke: green; opacity: 0.2; fill:none; stroke-width: 5px;');
        gline.setAttribute('points',coerce_data(data));
        pnode.appendChild(gline)     ;
      }else{
        gline.setAttribute('points',coerce_data(data));
      }
  } 
  var update_labels = function(){
     var j;
     var labels = coerce_data(data,true);
     for(j=0;j<labels.length;j++){
        var node=document.createElementNS('http://www.w3.org/2000/svg','circle');
        node.setAttribute('style','stroke: green; opacity: 0.2;   stroke-width: 5.2;');
        //if(j==0){alert(labels[j][0]+ ', ' + labels[j][1])};
        node.setAttribute('cx',labels[j][0]);
        node.setAttribute('cy',labels[j][1]);
        node.setAttribute('r',5);
        pnode.appendChild(node);
     }
  }
  return {
    'update_data': update_data,
    'update_labels': update_labels
  }

}; 
mescaline=function(rn){

  var first_gg = function(){
    var gg_graphs=new Array(); 
    return {add_graph: function(name,data,opts){
      if(!(gg_graphs[name])){alert('creating new graph');
gg_graphs[name]=graphC();}
      gg_graphs[name].update_data(data);
     }
    }
  }();
  var mescaline_struct={
    graph_group: new Array(first_gg),
    root_node: rn
  };
  return {
    graph_group: function(){return mescaline_struct['graph_group'][0]},
    ter: function(i){
      var u = (20.0-i)/20.0;
      var pnode = document.getElementById('jwline');
      pnode.setAttribute('points',coerce_data(data,false,(1 - (u))));
      if(i<=4){ return}
      setTimeout('tg.ter('+ (i-1) + ');',100);
    }
  };
};
