mescaline=function(){
  var mescaline_struct={
    graph_group: [{}]
  };
  return {
    graph_group: function(){return mescaline_struct['graph_group']}
  };

}();
alert(mescaline.graph_group());
