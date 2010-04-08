

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
  this.counter=0;
  Mescaline.instance = this;
};

Mescaline.config=new MConfig();
Mescaline.prototype.refresh = function(gds){
  var gd = gds.shift();
  //alert('refresh '   + gd);
  var name = gd[0];
  var url = gd[1] + '?asdf=' + this.counter++;
  if(Mescaline.config.data_tag){
    url = url + '&data_tag='+Mescaline.config.data_tag;
  }

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
  var bs_callback = function(){Mescaline.instance.refresh(Mescaline.config.get_graphs())};
  var gd = gds.shift();
//  alert(gd);
  var name = gd[0];
  var url = gd[1] + '?asdf=' + this.counter++;
  if(Mescaline.config.data_tag){
    url = url + '&data_tag='+Mescaline.config.data_tag;
  }
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
        setInterval(bs_callback,3000);
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
