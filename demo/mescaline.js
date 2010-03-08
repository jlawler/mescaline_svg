mescaline=function(){
  var mescaline_struct={
    graph_group: new Array({})
  };
  return {
    graph_group: function(){return mescaline_struct['graph_group'][0]}
  };

}();
alert(typeof(mescaline.graph_group()));
