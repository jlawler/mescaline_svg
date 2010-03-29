function MConfig(){
}
MConfig.prototype.get_graphs = function(){
  var ret = new Array();
  for(var i = 0; i < Mescaline.config.graphs.length; i++){
    ret.push(new Array(Mescaline.config.graphs[i][0],Mescaline.config.graphs[i][1]));
  }
  return ret;
}
MConfig.prototype.set_key_svg_id = function(nid){
    this.key_svg_id = nid;
    this.key_svg_node =  document.getElementById(this.key_svg_id);
}

MConfig.prototype.set_gsvg_id = function(nid){
    this.gsvg_id = nid;
    this.gsvg_node =  document.getElementById(this.gsvg_id);
}
MConfig.prototype.key = function(){
  return(this.key_svg_node || document.getElementById(this.key_svg_id));
}
MConfig.prototype.gsvg = function(){
  return(this.gsvg_node || document.getElementById(this.gsvg_id));
}


