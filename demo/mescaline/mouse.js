function MMouse(node){
  this.zid = false;
  var that = this;
  if(node){
    if(typeof(node)=='string'){
      node = document.getElementById(node);
    }
    this.attached_node = node; 
    var down = function(evt){that.down(evt)};
    var up = function(evt){that.up(evt)};
    var move = function(evt){that.on_move(evt)};
    this.attached_node.addEventListener('mousedown',down,false);
    this.attached_node.addEventListener('mouseup',up,false);
    this.attached_node.addEventListener('mousemove',move,false);
  }
};
MMouse.prototype.top_level_graph = function(){
  return (this.tlg || Mescaline.config.gsvg());
}
  
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
MMouse.prototype.on_move = function (evt){
  if(this.zid){
    var xdiff = parseInt(this.zid[0]) - parseInt(evt.clientX);
    var ydiff = parseInt(this.zid[1]) - parseInt(evt.clientY);
    
    var ary  = this.top_level_graph().getAttribute('viewBox').split(' ');
    if(!bggrid.getUp()){
      var n=document.createElementNS('http://www.w3.org/2000/svg','rect');
      n.setAttribute('height','100%');
      n.setAttribute('width','100%');
      n.setAttribute('style','stroke: blue; fill: green; fill-opacity: 0.2;');
      n.setAttribute('x',1080);
      n.setAttribute('y',00);
      this.top_level_graph().appendChild(n);
      bggrid.setUp(n);
    //  alert('new node!');
    }
    ary[0] = parseInt(ary[0]) + (1.5*xdiff);
    //ary[1] = parseInt(ary[1]) + ydiff;
    this.zid=[evt.clientX,evt.clientY];
    this.top_level_graph().setAttribute('viewBox',ary.join(' '));
//    evt.cancelBubble=true;
//    evt.returnValue=false;
//    return false;
  }
}
MMouse.prototype.up = function(evt){
  this.zid=false;
  return false;
}
MMouse.prototype.down = function(evt){
  this.zid=[evt.clientX,evt.clientY];
  evt.cancelBubble=true;
  evt.returnValue=false;
  return false;
}

