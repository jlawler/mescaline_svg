
function DebugLights(){
  this.tl = Mescaline.config.gsvg_node;
  this.cx = 200;
  this.cy = 0;
  this.light_ary = new Array();
}

DebugLights.prototype.add_light = function(name){
    if(this.light_ary[name]){return(this.light_ary[name])}
    var new_lite=document.createElementNS('http://www.w3.org/2000/svg','rect');
    new_lite.setAttribute('width','70px');
    new_lite.setAttribute('opacity','0.5');
    new_lite.setAttribute('height','50px');
    new_lite.setAttribute('fill','white');
    new_lite.setAttribute('y',this.cy); 
    new_lite.setAttribute('x',this.cx); 
    var new_label = document.createElementNS('http://www.w3.org/2000/svg','text');
    new_label.setAttribute('x',this.cx + 10);
    new_label.setAttribute('y',this.cy + 20);
    new_label.setAttribute('font-family',"Verdana");
    new_label.setAttribute('font-size',"20"); 
    new_label.appendChild(document.createTextNode(name))
    var text_label = document.createElementNS('http://www.w3.org/2000/svg','text');
    text_label.setAttribute('x',this.cx + 10);
    text_label.setAttribute('y',this.cy + 40);
    text_label.setAttribute('font-family',"Verdana");
    text_label.setAttribute('font-size',"20");
    text_label.appendChild(document.createTextNode(name));
    var new_obj = {
      lite: new_lite,
      label: new_label,
      text: text_label
    } 
    this.cx = this.cx + 100;
    this.light_ary[name] = new_obj;
    this.tl.appendChild(this.light_ary[name].lite);
    this.tl.appendChild(new_label);
    this.tl.appendChild(text_label);
    return(this.light_ary[name]);
}
DebugLights.prototype.set_label = function(name,thing){
//  alert(thing);
  for(i = this.add_light(name).text.childNodes.length-1; i >= 0; i--){
    this.add_light(name).text.removeChild(this.add_light(name).text.childNodes[i]);
  }
  this.add_light(name).text.appendChild(document.createTextNode(thing));
}

DebugLights.prototype.set = function(name,thing){
  this.add_light(name).lite.setAttribute('opacity',thing);
}

