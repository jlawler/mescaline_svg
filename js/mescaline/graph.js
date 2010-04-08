function Graph(name,gg){
  this.gg = gg;
  if(!name){name = 'jwline'}
  var blah='asdf';
  this.name = name;
  this.gline_id = name + '_id';
  this.moline_id = name + '_mo_id';
  this.labels=null;
  this.gline=null;
  this.data=null;
  this.label_nodes=[];
  if(!this.constructor.config){
    this.constructor.config = Mescaline.config;
  }
  this.config = this.constructor.config;
  this.pnode = this.config.gsvg();
}; 

Graph.prototype._callbacks = function(){
  return this.data.callbacks();
}
Graph.prototype.callbacks = function(){
  var cb;
  if(this._callbacks() && this._callbacks().length > 0){
    var cbs = this._callbacks();
    for(var i = 0; i < cbs.length; i++){
      cb = cbs[i]; 
      this.gg.queue_callback(cb[0],cb[1],this.data);
    }
    //alert('after running callbacks' + this._callbacks());
  }
}
var f=true;
Graph.prototype.update_data = function(datai){
  if(datai){
    if(!this.data){
      this.data = new DataSet(datai);
      for(var i in this.gg.globals){
        this.data['_'+i]=this.gg.globals[i];
      }
    }
    this.data.update_data(datai);
  }else{
    //alert('trying to refreesh a graph!'+ this.data.callback_names());
  }
  if(this.data && this.data.no_callbacks()){
    this.update_data_line();
  }
};    

Graph.prototype.update_data_line = function(){
  if(!this.pnode){this.pnode = document.getElementById(this.config.gsvg());}
  if(!(this.gline)){
    this.gline = document.createElementNS('http://www.w3.org/2000/svg','polyline');
    this.gline.setAttribute('id',this.gline_id);
    this.gline.setAttribute('opacity','0.2');
    this.gline.setAttribute('style','stroke: green; fill:none; stroke-width: 5px;');
    this.gline.setAttribute('points',this.data.data_string());
    this.pnode.appendChild(this.gline)     ;
  }

  this.gline.setAttribute('points',this.data.data_string());
  if(!(this.moline)){ 
    this.moline = document.createElementNS('http://www.w3.org/2000/svg','polyline');
    this.moline.setAttribute('id',this.moline_id);
    this.moline.setAttribute('opacity','0.0');
    this.moline.setAttribute('style','stroke: green; fill:none; stroke-width: 75px;');
    this.moline.setAttribute('points',this.data.data_string());

    if(Graph.config.mouseover){
      var z = function(this_graph){
      this_graph.moline.onmouseover = function(){this_graph.mouseover_line()}
      this_graph.moline.onmouseout = function(){this_graph.mouseout_line()}
      }(this);
    }
    this.pnode.appendChild(this.moline);
  }else{
    this.moline.setAttribute('points',this.data.data_string());
  }
} 
Graph.prototype.update_labels = function(){
  if(Mescaline.config.mouseover){
    if(this.data.no_callbacks()){
      this.actually_update_labels();
    }
  }
}
Graph.prototype.mouseout_line = function(){
//  this.gline.setAttribute('opacity','0.2');
}

Graph.prototype.mouseout_label = function(g,ln){
  if(!this.popup_label){return}
  return;
  if(g.name != this.name){
    this.popup_label.setAttribute('visibility','hidden');
  }
  if(this.popup_label && (parseInt(this.popup_label.getAttribute('x'))==parseInt(ln[0]))){
  }
}
Graph.prototype.mouseover_line = function(g){
  tg.dl.set_label('mod',this.name);
  if((g && (this.name == g.name)) || (!g)){
//    alert(this.name + ' ' + (g &&g.name) + ' so setting opac up!');
    this.gline.setAttribute('opacity','0.63');
    return;
  }
  //  alert(this.name + ' ' + (g &&g.name));
}

Graph.prototype.mouseover_label = function(j,ln){
  if(j && j.name != this.name){
    if(this.popup_label){this.popup_label.setAttribute('visibility','hidden');}
    return
  }
  this.mouseover_line(this);
  var data = this.data.data_array();
  tg.dl.set_label('dat', this.name);  
  tg.dl.set_label(' X ', parseInt(ln[0]));  
  tg.dl.set_label(' Y ', parseInt(ln[1]));  
  if(!this.popup_label){
    this.popup_label_g=document.createElementNS('http://www.w3.org/2000/svg','g');
    this.popup_label=document.createElementNS('http://www.w3.org/2000/svg','circle');
    this.popup_label.setAttribute('style','stroke: blue; fill: yellow; opacity: 0.9;   stroke-width: 3.2;');
    this.popup_label.setAttribute('r',5);
    this.popup_label_g.appendChild(this.popup_label);
    Mescaline.config.gsvg_node.appendChild(this.popup_label_g);
  }
  this.popup_label.setAttribute('cx',ln[0]);
  this.popup_label.setAttribute('cy',ln[1]);
  this.popup_label.setAttribute('visibility','visible');
}





Graph.prototype.actually_update_labels = function(){
  var that_graph = this;
  var labelds = this.data.data_array();
  if(this.label_nodes){
    for(var j=0;j<this.label_nodes.length;j++){
      if(this.label_nodes[j]){
        var label_parent = this.label_nodes[j][0].parentNode;
        if(this.label_nodes[j][0]){label_parent.removeChild(this.label_nodes[j][0]);}
        if(this.label_nodes[j][1]){label_parent.removeChild(this.label_nodes[j][1]);}
      }
    }
  }
  for(j=0;j<labelds.length;j++){var z = function(pnode,this_graph,label_pnt,index){
    var asdfasdf = function(rx,ry){
    var node=document.createElementNS('http://www.w3.org/2000/svg','circle');
    node.setAttribute('style','stroke: green;  stroke-width: 5.2;');
    node.setAttribute('opacity','0.2'); 
    node.setAttribute('cx',label_pnt[0]);
    node.setAttribute('cy',label_pnt[1]);
    node.setAttribute('r',5);
    var mouseover_node = document.createElementNS('http://www.w3.org/2000/svg','circle');
    mouseover_node.setAttribute('style','stroke: red; fill: red; opacity: 0.3;   stroke-width: 25.2; pointer-events: all;');
    mouseover_node.setAttribute('cx',label_pnt[0]);
    mouseover_node.setAttribute('cy',label_pnt[1]);
    mouseover_node.setAttribute('r',25);
    if(Graph.config.mouseover){
      node.onmouseout = function(){
        this_graph.mouseover_line();
        this_graph.gg.mouseover_label(this_graph,label_pnt);
      }

      node.onmouseover = function(){
//      alert(this_graph.name);
        this_graph.mouseover_line();
        this_graph.gg.mouseover_label(this_graph,label_pnt);
      }
      mouseover_node.onmouseover = function(){
        this_graph.mouseover_line();
        this_graph.gg.mouseover_label(this_graph,label_pnt);
      } 
      mouseover_node.onmouseout = function(){
//        this_graph.mouseout_line();
        this_graph.gg.mouseout_label(this_graph,label_pnt);
      } 

    }
    pnode.appendChild(mouseover_node);
    pnode.appendChild(node);
    return [node,mouseover_node];
    };
    this_graph.label_nodes[j]=asdfasdf(label_pnt[0],label_pnt[0]); 
  }(this.pnode,that_graph,labelds[j],j);}
}
