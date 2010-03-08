mescaline=function(){
  var mescaline_struct={
    graph_group: new Array({})
  };
  return {
    graph_group: function(){return mescaline_struct['graph_group']}
  };

}();
alert(mescaline.graph_group());
