function DataSet(data){
  this.data = data;
  this._min_x = 0;
  this._min_y = 0;
  this._max_x = 20;
  this._max_y = 10;
  this.force_zero = true;
  for(var i=0; i < this.data.length; i++){
    if(this.data[i][0] < this._min_x){this._min_x = this.data[i][0];}
    if(this.data[i][1] < this._min_y){this._min_y = this.data[i][1];}
    if(this.data[i][0] > this._max_x){this._max_x = this.data[i][0];}
    if(this.data[i][1] > this._max_y){this._max_y = this.data[i][1];}
  }
//  alert([this._min_x,this._min_y,this._max_x,this._max_y]); 
  this.virtual_width = 1200;
  this.virtual_height = 600;
  this.virtual_x0 = 0;
  this.virtual_y0 = 0;
  this.scale = 1.0;
};
DataSet.prototype.min_x = function(){return this._min_x}
DataSet.prototype.max_x = function(){return this._max_x}
DataSet.prototype.min_y = function(){if(this.force_zero){return 0}else{return this._min_y}}
DataSet.prototype.max_y = function(){return this._max_y}

DataSet.prototype.data_string = function(force_zero){
  var ret;
  var da = this.data_array(force_zero);
  for(var j=0; j<da.length; j++){
    if(ret){ret = ret + ' '}else{ret=''};
    ret = ret + ( da[j][0]+ ','+ da[j][1]);
  }
  return ret;
}
DataSet.prototype.data_array = function(force_zero){
  force_zero = (this.force_zero || force_zero);
  var ret=new Array();
  var pair=null;
  var x,y,i;
  var x_scale,x_offset;
  var y_scale,y_offset;
  y_scale = (0.9 * this.virtual_height) / (this.max_y() - this.min_y());
  var m = 0;
  if((!force_zero) && this.min_y() < 0){m = (this.min_y() / (this.max_y() - this.min_y()))}
  y_offset = this.virtual_height + (m * this.virtual_height) ; 
  x_scale = this.virtual_width / (this._max_x - this._min_x);
  x_offset = 0; 
  if(y_scale > 0){y_scale = y_scale * -1.0}
  for(i=0; i < this.data.length; i++){
    pair=this.data[i];
    x = (x_scale * pair[0]) + x_offset;
    y = (y_scale * pair[1])+ y_offset;
    ret.push([x,y]);
  }
  //alert(ret);
  return ret;
};
  


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
function Graph(){
  var blah='asdf';
  this.labels=null;
  this.gline=null;
  this.pnode = document.getElementById('tlg');
  this.data=null;
  this.label_nodes=[];
}; 
Graph.prototype.update_data = function(datai){
  this.data = new DataSet(datai);

  if(!this.pnode){this.pnode = document.getElementById('tlg');}
  if(!(this.gline)){
    this.gline = document.createElementNS('http://www.w3.org/2000/svg','polyline');
    this.gline.setAttribute('id','jwline');
    this.gline.setAttribute('style','stroke: green; opacity: 0.2; fill:none; stroke-width: 5px;');
    this.gline.setAttribute('points',this.data.data_string());
    this.pnode.appendChild(this.gline)     ;
  }else{
    this.gline.setAttribute('points',this.data.data_string());
  }
} 
Graph.prototype.update_labels = function(){
  var labelds = this.data.data_array();
  var j;
  for(j=0;j<this.label_nodes.length;j++){
    this.pnode.removeChild(this.label_nodes[j]);
  }
  for(j=0;j<labelds.length;j++){
    var node=document.createElementNS('http://www.w3.org/2000/svg','circle');
    node.setAttribute('style','stroke: green; opacity: 0.2;   stroke-width: 5.2;');
    //if(j==0){alert(labels[j][0]+ ', ' + labels[j][1])};
    node.setAttribute('cx',labelds[j][0]);
    node.setAttribute('cy',labelds[j][1]);
    node.setAttribute('r',5);
    this.pnode.appendChild(node);
    this.label_nodes[j]=node;
  }
}

function Mescaline(rn){
  var first_gg = function(){
    var gg_graphs=new Array(); 
    return {add_graph: function(name,data,opts){
      if(!(gg_graphs[name])){
        gg_graphs[name]=new Graph();
      }
      gg_graphs[name].update_data(data);
      gg_graphs[name].update_labels();
     }
    }
  }();
  var mescaline_struct={
    graph_group: new Array(first_gg),
    root_node: rn
  };
  this.ms = function(){return mescaline_struct}
};
Mescaline.prototype.graph_group =  function(){return this.ms()['graph_group'][0]}
