function MConfig(){
}
MConfig.prototype.key = function(){
  return(this.key_svg_node || document.getElementById(this.key_svg_id));
}
MConfig.prototype.gsvg = function(){
  return(this.gsvg_node || document.getElementById(this.gsvg_id));
}

function Mescaline(rn){
  var mouseover;
  var first_gg = function(){
    var gg_graphs=new Array(); 
    return {add_graph: function(name,data,opts){
      if(!(gg_graphs[name])){
        gg_graphs[name]=new Graph();
      }
      gg_graphs[name].update_data(data);
      gg_graphs[name].update_labels();
     },
     get_data: function(name){return gg_graphs[name].data.data_array()}
    }
  }();
  var mescaline_struct={
    graph_group: new Array(first_gg),
    root_node: rn
  };
  this.ms = function(){return mescaline_struct}
  this.setMouseover = function(x){mouseover=x}
  this.getMouseover = function(){return mouseover}
  
};
Mescaline.config=new MConfig();
Mescaline.prototype.drawDataLabel =  function(name,x){
  var label;
  if(this.getMouseover()){label=this.getMouseover()}else{
      var g=document.createElementNS('http://www.w3.org/2000/svg','g');
      label=document.createElementNS('http://www.w3.org/2000/svg','rect');
      g.appendChild(label);
      this.setMouseover(label);
      label.setAttribute('width','100px');
      label.setAttribute('opacity','0.5');
      label.setAttribute('height','100px');
      label.setAttribute('fill','white');
      document.getElementById(Mescaline.config.gsvg_id).appendChild(g);
  }
  var ary = this.ms()['graph_group'][0].get_data(name);
  for(var point=0; point < ary.length; point++){
    if(ary[point][0]==x){
      label.setAttribute('x',x);
      label.setAttribute('y',ary[point][1]-100);
    }
  }
}
Mescaline.prototype.graph_group =  function(){return this.ms()['graph_group'][0]}
Mescaline.prototype.draw_bg =  function(){
  var pnode = document.getElementById(Mescaline.config.gsvg_id);
  for(var x=0;x<=20;x++){
    l = document.createElementNS('http://www.w3.org/2000/svg','line');
    l.setAttribute('style','stroke: black; stroke-width: 3px; opacity: 0.3;');
    var os = (x*(1080/20));
    l.setAttribute('x1',os);
    l.setAttribute('y1',-1000);
    l.setAttribute('x2',os);
    l.setAttribute('y2',1000);
    l.setAttribute('points','' + os + ',0 ' + os + ', -1000' );
    pnode.appendChild(l);
  }
}
