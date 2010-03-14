function DataSet(data){
  this.data = data;
  this._min_x = data[0][0];
  this._min_y = 0;
  this._max_x = data[0][0];
  this._max_y = 10;
  this.force_zero = true;
  for(var i=0; i < this.data.length; i++){
    if(this.data[i][0] < this._min_x){this._min_x = this.data[i][0];}
    if(this.data[i][1] < this._min_y){this._min_y = this.data[i][1];}
    if(this.data[i][0] > this._max_x){this._max_x = this.data[i][0];}
    if(this.data[i][1] > this._max_y){this._max_y = this.data[i][1];}
  }
  this.virtual_width =  this.constructor.virtual_width;
  this.virtual_height = this.constructor.virtual_height;
  this.virtual_x0 = 0;
  this.virtual_y0 = 0;
  this.scale = 1.0;
};
DataSet.prototype.min_x = function(){return this._min_x}
DataSet.prototype.max_x = function(){return this._max_x}
DataSet.prototype.min_y = function(){if(this.force_zero){return 0}else{return this._min_y}}
DataSet.prototype.max_y = function(){return this._max_y}
DataSet.virtual_width = 1080;
DataSet.virtual_height = 540;

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
  x_offset = -1.0 * this.min_x(); 
  if(y_scale > 0){y_scale = y_scale * -1.0}
  for(i=0; i < this.data.length; i++){
    pair=this.data[i];
    x = (x_scale * (pair[0] + x_offset));
    y = (y_scale * pair[1])+ y_offset;
    ret.push([x,y]);
  }
  return ret;
};

