
function GraphGroup(){
  this.graph_names = new Array();
  this.gg_graphs=new Array(); 
  this.global_attrs = new Array();
  this.reset_globals();
  this.callback_q = new Array();
}

var f = true;

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

function Mescaline(rn){
  var mouseover;
  this.refresh_data={};
  var first_gg = new GraphGroup();
  var mescaline_struct={
    graph_group: new Array(first_gg),
    root_node: rn
  };
  this.ms = function(){return mescaline_struct}
  this.setMouseover = function(x){mouseover=x}
  this.getMouseover = function(){return mouseover}
  
};
GraphGroup.prototype.finish_startup = function(){
  this.run_callbacks();
  //alert([this.global_attrs['max_x'], this.global_attrs['min_x']]);
  this.queue_callback('x_range',(this.global_attrs['max_x'] - this.global_attrs['min_x']))
  this.run_callbacks(true);
}
Mescaline.config=new MConfig();
var counter=0;
Mescaline.prototype.refresh = function(gds,first){
  var gd = gds.shift();
  //alert('refresh '   + gd);
  var name = gd[0];
  var url = gd[1] + '?asdf=' + counter++;
  var http_request = new XMLHttpRequest();
  var current_mescaline = this;
  http_request.open( "GET", url, true );
  http_request.onreadystatechange = function () {
    if ( http_request.readyState == 4){
      if( http_request.status == 200 ) {
        var data = eval( http_request.responseText );
        current_mescaline.graph_group().add_graph(name,data);
      }
      if(gds.length == 0){
        tg.graph_group().run_callbacks();
        tg.graph_group().try_to_refresh_graphs();
      }else{
        current_mescaline.refresh(gds);
      }
    }
  };
  http_request.send(null)
}

Mescaline.prototype.bootstrap = function(gds){
  var gd = gds.shift();
//  alert(gd);
  var name = gd[0];
  var url = gd[1] + '?asdf=' + counter++;
  this.refresh_data[name]=url;
  var http_request = new XMLHttpRequest();
  http_request.open( "GET", url, true );
  var current_mescaline = this;
  http_request.onreadystatechange = function () {
    if ( http_request.readyState == 4){
      if(  http_request.status == 200 ) {
        var data = eval( http_request.responseText );
        current_mescaline.graph_group().add_graph(name,data);
      }
      if(gds.length == 0){
        tg.graph_group().finish_startup();
        tg.graph_group().try_to_refresh_graphs();
        setInterval(Mescaline.config.top_level_name + '.refresh(Mescaline.config.get_graphs(),true)',3000);
      }else{
        current_mescaline.bootstrap(gds);
      }
    }
  };
  http_request.send(null)
}

Mescaline.prototype.start = function(){
  var gd = Mescaline.config.get_graphs();
  if(!this.dl){this.dl = new DebugLights();}
  this.bootstrap(gd);
}
Mescaline.prototype.enableMouse =  function(){
  this.mouse = new MMouse();
}
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
