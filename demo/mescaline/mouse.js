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
      n.setAttribute('x',1080);
      n.setAttribute('y',00);
      tlg.appendChild(n);
      bggrid.setUp(n);
    //  alert('new node!');
    }
    ary[0] = parseInt(ary[0]) + xdiff;
    //ary[1] = parseInt(ary[1]) + ydiff;
    zid=[evt.clientX,evt.clientY];
    tlg.setAttribute('viewBox',ary.join(' '));
//    evt.cancelBubble=true;
//    evt.returnValue=false;
//    return false;
  }
}
function mouseup(evt){
  zid=false;
  return false;
}
function mousedown(evt){
  zid=[evt.clientX,evt.clientY];
    evt.cancelBubble=true;
    evt.returnValue=false;
    return false;

}

