function Graph(name,gg){
  this.gg = gg;
  if(!name){name = 'jwline'}
  var blah='asdf';
  this.name = name
  this.gline_id = name + '_id';
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
//  if(this.data.callbacks().length==0){alert('aborted update')}
  if(!this.pnode){this.pnode = document.getElementById(this.config.gsvg());}
  if(!(this.gline)){
    this.gline = document.createElementNS('http://www.w3.org/2000/svg','polyline');
    this.gline.setAttribute('id',this.gline_id);
    this.gline.setAttribute('opacity','0.2');
    this.gline.setAttribute('style','stroke: green; fill:none; stroke-width: 5px;');
    this.gline.setAttribute('points',this.data.data_string());
/*
    this.gline.setAttribute('onmouseover','document.getElementById(\'' + 
      this.gline_id +'\').setAttribute(\'style\',\'stroke: green; opacity: 0.2; fill:none; stroke-width: 5px;\');');
    this.gline.setAttribute('onmouseover','alert(document.getElementById(\'' + 
      this.gline_id +'\'));');
*/
    if(Graph.config.mouseover){
      this.gline.setAttribute('onmouseover','document.getElementById(\'' + 
        this.gline_id +'\').setAttribute(\'opacity\',\'0.63\')');
    }

    this.pnode.appendChild(this.gline)     ;
  }else{
    this.gline.setAttribute('points',this.data.data_string());
  }
} 
Graph.prototype.update_labels = function(){
  if(Mescaline.config.mouseover){
    if(this.data.no_callbacks()){
      this.actually_update_labels();
    }
  }
}
Graph.prototype.actually_update_labels = function(){
  var labelds = this.data.data_array();
  var j;
  for(j=0;j<this.label_nodes.length;j++){
    this.pnode.removeChild(this.label_nodes[j]);
  }
  for(j=0;j<labelds.length;j++){
    var pnode=this.pnode;
    var asdfasdf = function(rx,ry){
    var node=document.createElementNS('http://www.w3.org/2000/svg','circle');
    node.setAttribute('style','stroke: green; opacity: 0.2;   stroke-width: 5.2;');
    node.setAttribute('cx',labelds[j][0]);
    node.setAttribute('cy',labelds[j][1]);
    node.setAttribute('r',5);
    if(Graph.config.mouseover){
      node.setAttribute('onmouseover',(Graph.config.top_level_name + '.drawDataLabel(' + '\'test1\','+labelds[j][0] + ')'));
    }
    pnode.appendChild(node);
    return node;
    };
    this.label_nodes[j]=asdfasdf(labelds[j][0],labelds[j][0]); 
  }
}
