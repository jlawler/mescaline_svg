mescaline=function(){
  var mescaline_struct={
    graph_group: Array.new [{}]
  };
  return {
    graph_group: function(){return mescaline_struct['graph_group'][0]}
  };

}();
alert(mescaline.graph_group());
