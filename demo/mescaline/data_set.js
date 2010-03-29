function DataSet(data){
  this.data = data;
  this._min_x = data[0][0];
  this._min_y = 0;
  this._max_x = data[0][0];
  this._max_y = 0;
  this.force_zero = true;
  this.callback_queue = {};
  this.virtual_width =  Mescaline.config.virtual_width;
  this.virtual_height = Mescaline.config.virtual_height;
  this.virtual_x0 = 0;
  this.virtual_y0 = 0;
  this.scale = 1.0;
};
DataSet.prototype.set_max_x = function(zeta){this._max_x = zeta }
DataSet.prototype.set_min_x = function(zeta){this._min_x = zeta }
DataSet.prototype.set_max_y = function(zeta){this._max_y = zeta }
DataSet.prototype.set_min_y = function(zeta){this._min_y = zeta }

var alertoncet=true;
function alertonce(s){
  if(alertoncet){
    alertoncet = false;
    alert(s);
  }
}
DataSet.prototype.recalc_data = function(force){
    tg.dl.set_label('force','false');
  if(force){
    force = {
      min_x: 0,
      max_x: false,
      min_y: 0 
    }
    this._min_x = force.min_x;
    this._max_x = force.max_x;
    this._min_y = force.min_y;
    this._max_y = force.max_y;
    tg.dl.set_label('force','true');
    alert(force);
  }
  return this.update_data(this.data,true);
}

DataSet.prototype.update_data = function(datai,x_st,width){
   for(var i=0; i < datai.length; i++){
    if(x_st && width && ((datai[i][0] < x_st) ||(datai[i][0] > (x_st+width)))){
      next;
    }
    if(!(this._min_x) || datai[i][0] < this._min_x){
      if(!this.callback_queue.min_x || datai[i][0] < this.callback_queue.min_x){ 
        this.callback_queue.min_x = datai[i][0];
      }
    }
    if(!(this._min_y) || datai[i][1] < this._min_y){
      if(!this.callback_queue['min_y'] || datai[i][1] < this.callback_queue['min_y']){
      this.callback_queue['min_y'] = datai[i][1];
      }
    }
    if(!(this._max_x) || datai[i][0] > this._max_x){
      if(!this.callback_queue['max_x'] || datai[i][0] > this.callback_queue['max_x']){
      this.callback_queue['max_x']= datai[i][0];
      }
    }
    if(!(this._max_y) || datai[i][1] > this._max_y){
      if(!this.callback_queue['max_y'] || datai[i][1] > this.callback_queue['max_y']){
      this.callback_queue['max_y']=datai[i][1];
      }
    }
  }
  this.data = datai;
}
DataSet.prototype.clear_callback = function(name){
  delete this.callback_queue[name];
}

DataSet.prototype.callbacks = function(){
  var cbs=new Array();
  for(var i in this.callback_queue){
    cbs.push([i,this.callback_queue[i]]);
  }
  return cbs; 
}
DataSet.prototype.callback_names = function(){
var list = new Array();
for(var i in this.callback_queue){
  list.push(i);
}
return (list)
}

DataSet.prototype.no_callbacks = function(){
var list = new Array();
for(var i in this.callback_queue){
  list.push(i);
}
//alert(list);
//alert('checking for callbacks, callbacks = ' + this.callback_queue + (this.callback_queue.length == 0));
return (list.length == 0)
}
DataSet.prototype.x_range = function(){if(this._x_range){return this._x_range}else{return(this._max_x - this._min_x)}}
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
  //alert([this._min_x,this._max_x,this._min_y,this._max_y]);
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
  x_scale = this.virtual_width / this.x_range();
  x_offset = -1.0 * this.min_x(); 
  if(y_scale > 0){y_scale = y_scale * -1.0}
  for(i=0; i < this.data.length; i++){
    pair=this.data[i];
    if(this.data[i][0] >= this._min_x){
      x = (x_scale * (pair[0] + x_offset));
      y = (y_scale * pair[1])+ y_offset;
      ret.push([x,y]);
    }
  }
  return ret;
};

