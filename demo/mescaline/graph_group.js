function GraphGroup(){
  this.graph_names = new Array();
  this.gg_graphs=new Array(); 
  this.global_attrs = new Array();
  this.reset_globals();
  this.callback_q = new Array();
}


GraphGroup.prototype.reset_globals = function(){
  this.global_attrs['min_x'] = 0;
  this.global_attrs['min_y'] = 0;
  this.global_attrs['max_x'] = 0;
  this.global_attrs['max_y'] = 0;
}

GraphGroup.prototype.mouseover_line = function(target_graph,label_pnt){
  if(!target_graph){
    alert('wtf');
  }
  for(var i=0;i<this.graph_names.length;i++){
    this.gg_graphs[this.graph_names[i]].mouseover_line(target_graph,label_pnt); 
  }
}
GraphGroup.prototype.mouseover_label = function(target_graph,label_pnt){
  for(var i=0;i<this.graph_names.length;i++){
    this.gg_graphs[this.graph_names[i]].mouseover_label(target_graph,label_pnt); 
  }
}

GraphGroup.prototype.mouseout_label = function(target_graph,label_pnt){
  for(var i=0;i<this.graph_names.length;i++){
    this.gg_graphs[this.graph_names[i]].mouseout_label(target_graph,label_pnt); 
  }
}

GraphGroup.prototype.globals = function(){return this.global_attrs}
GraphGroup.prototype.try_to_refresh_graphs = function(){
  for(var i=0;i<this.graph_names.length;i++){
    this.gg_graphs[this.graph_names[i]].update_data(); 
    this.gg_graphs[this.graph_names[i]].update_labels(); 
  }
}
GraphGroup.prototype.queue_callback = function(name,data,source){
  this.callback_q.push(new Array(name,data,source));
}

GraphGroup.prototype.run_callbacks = function(debug){
//  alert('running callbaks!');
  var cb;
  var debug_ary = new Array();
  while( cb = this.callback_q.shift()){
    if(debug){debug_ary.push(new Array(cb[0],cb[1]))};
    this.run_callback(cb[0],cb[1],cb[2]);
    //if(debug){alert(debug_ary)};
  }
}
GraphGroup.prototype.run_callback = function(name,data,source){
//  alert(typeof this.global_attrs[name]);
  if(this.global_attrs[name] || typeof(this.global_attrs[name])=='number' || name == 'x_range'){
    if(name.match(/^min_/)){
      if(data < this.global_attrs[name]){
        this.global_attrs[name] = data;
        for(var i=0;i<this.graph_names.length;i++){
          var nn = '_' + name;
          //alert('set ' + nn + ' to ' + data);
          this.gg_graphs[this.graph_names[i]].data[nn] = this.global_attrs[name]; 
        }
       
        this.try_to_refresh_graphs();
      } 
    }
    if(name.match(/^max_/)){
      var nn = '_' + name;
      if(data > this.global_attrs[name]){
        if(name=='max_x' && this.global_attrs['x_range']){
          this.scroll((data - this.global_attrs['max_x'])/this.global_attrs['x_range']);
          this.queue_callback('min_x',this.global_attrs['max_x'] - this.global_attrs['x_range']);
//          alert('bump? (' + data + ')');
        }
        this.global_attrs[name] = data;
        for(var i=0;i<this.graph_names.length;i++){
          this.gg_graphs[this.graph_names[i]].data[nn] = this.global_attrs[name]; 
        }
        this.try_to_refresh_graphs();
      } 
    }
    if(name.match(/_range/)){
      //alert('rang callback');
      this.global_attrs[name] = data;
      for(var i=0;i<this.graph_names.length;i++){
        var nn = '_' + name;
        this.gg_graphs[this.graph_names[i]].data[nn] = this.global_attrs[name]; 
        }
        this.try_to_refresh_graphs();

    }
  }
  if(source){source.clear_callback(name)};
}

GraphGroup.prototype.finish_startup = function(){
  this.run_callbacks();
  //alert([this.global_attrs['max_x'], this.global_attrs['min_x']]);
  this.queue_callback('x_range',(this.global_attrs['max_x'] - this.global_attrs['min_x']))
  this.run_callbacks(true);
}

GraphGroup.prototype.scroll = function(pcnt){
  var was  = Mescaline.config.gsvg_node.getAttribute('viewBox');
  var ary  = Mescaline.config.gsvg_node.getAttribute('viewBox').split(' ');
  ary[0]= parseInt(ary[0]) + (ary[2] * pcnt);
  Mescaline.config.gsvg_node.setAttribute('viewBox',ary.join(' '));
  var now  = Mescaline.config.gsvg_node.getAttribute('viewBox');
//  alert("WAS " + was + '!   NOW + ' + now);
}
GraphGroup.prototype.recalc_graphs = function(){
  var force = true;
  this.reset_globals();
  for(var i=0;i<this.graph_names.length;i++){
    var gn = this.graph_names[i];
    this.gg_graphs[gn].data.recalc_data(force);
    this.gg_graphs[gn].callbacks();
  }
  this.run_callbacks();
  this.try_to_refresh_graphs();
}
GraphGroup.prototype.add_graph = function(name,data,opts){
//  alert(this.constructor);
  if(!(this.gg_graphs[name])){
    this.graph_names.push(name);
    this.gg_graphs[name]=new Graph(name,this);
    this.gg_graphs[name].update_data(data);
    for(var i in this.global_attrs){
      this.gg_graphs[name].data['_' + i] = this.global_attrs[i];
    }
  }else{
    this.gg_graphs[name].update_data(data);
  }
  this.gg_graphs[name].callbacks();
  this.run_callbacks();
  this.try_to_refresh_graphs();
  
  this.gg_graphs[name].update_labels();
  if(Mescaline.config.force_recalc_sizes){this.recalc_graphs();}
}

GraphGroup.prototype.get_data = function(name){
   return this.gg_graphs[name].data.data_array()
}
