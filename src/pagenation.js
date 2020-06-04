var $$pagenation = (function(){

  var __options = {
    target   : ".pagenation",
    template : ""
  };

  var LIB = function(){};

  LIB.prototype.event = function(target, mode, func , flg){
    flg = (flg) ? flg : false;
		if (target.addEventListener){target.addEventListener(mode, func, flg)}
		else{target.attachEvent('on' + mode, function(){func.call(target , window.event)})}
  };

  LIB.prototype.currentScriptTag = (function(){
    var scripts = document.getElementsByTagName("script");
    return this.currentScriptTag = scripts[scripts.length-1].src;
  })();

  // LIB.prototype.urlinfo = function(uri){
  //   uri = (uri) ? uri : location.href;
  //   var data={};
	// 	//URLとクエリ分離分解;
  //   var urls_hash  = uri.split("#");
  //   var urls_query = urls_hash[0].split("?");
	// 	//基本情報取得;
	// 	var sp   = urls_query[0].split("/");
	// 	var data = {
  //     uri      : uri
	// 	,	url      : sp.join("/")
  //   , dir      : sp.slice(0 , sp.length-1).join("/") +"/"
  //   , file     : sp.pop()
	// 	,	domain   : sp[2]
  //   , protocol : sp[0].replace(":","")
  //   , hash     : (urls_hash[1]) ? urls_hash[1] : ""
	// 	,	query    : (urls_query[1])?(function(urls_query){
	// 			var data = {};
	// 			var sp   = urls_query.split("#")[0].split("&");
	// 			for(var i=0;i<sp .length;i++){
	// 				var kv = sp[i].split("=");
	// 				if(!kv[0]){continue}
	// 				data[kv[0]]=kv[1];
	// 			}
	// 			return data;
	// 		})(urls_query[1]):[]
	// 	};
	// 	return data;
  // };
  // LIB.prototype.construct = function(){
  //   switch(document.readyState){
  //     case "complete"    : new MAIN();break;
  //     case "interactive" : this.event(window , "DOMContentLoaded" , (function(){new MAIN()}).bind(this));break;
  //     default            : this.event(window , "load"             , (function(){new MAIN()}).bind(this));break;
	// 	}
  // };

  var AJAX = function(options){
    if(!options){return}
		var httpoj = this.createHttpRequest();
		if(!httpoj){return;}
		// open メソッド;
		var option = this.setOption(options);

		// queryデータ
		var data = this.setQuery(option);
		if(!data.length){
			option.method = "get";
		}

		// 実行
		httpoj.open( option.method , option.url , option.async );
		// type
		if(option.type){
			httpoj.setRequestHeader('Content-Type', option.type);
		}
		
		// onload-check
		httpoj.onreadystatechange = function(){
			//readyState値は4で受信完了;
			if (this.readyState==4 && httpoj.status == 200){
				//コールバック
				option.onSuccess(this.responseText);
			}
		};

		// FormData 送信用
		if(typeof option.form === "object" && Object.keys(option.form).length){
			httpoj.send(option.form);
		}
		// query整形後 送信
		else{
			//send メソッド
			if(data.length){
				httpoj.send(data.join("&"));
			}
			else{
				httpoj.send();
			}
		}
		
  };
	AJAX.prototype.dataOption = {
		url:"",
		query:{},				// same-key Nothing
		querys:[],			// same-key OK
		data:{},				// ETC-data event受渡用
		form:{},
		async:"true",		// [trye:非同期 false:同期]
		method:"POST",	// [POST / GET]
		type:"application/x-www-form-urlencoded", // ["text/javascript" , "text/plane"]...
		onSuccess:function(res){},
		onError:function(res){}
	};
	AJAX.prototype.option = {};
	AJAX.prototype.createHttpRequest = function(){
		//Win ie用
		if(window.ActiveXObject){
			//MSXML2以降用;
			try{return new ActiveXObject("Msxml2.XMLHTTP")}
			catch(e){
				//旧MSXML用;
				try{return new ActiveXObject("Microsoft.XMLHTTP")}
				catch(e2){return null}
			}
		}
		//Win ie以外のXMLHttpRequestオブジェクト実装ブラウザ用;
		else if(window.XMLHttpRequest){return new XMLHttpRequest()}
		else{return null}
	};
	AJAX.prototype.setOption = function(options){
		var option = {};
		for(var i in this.dataOption){
			if(typeof options[i] != "undefined"){
				option[i] = options[i];
			}
			else{
				option[i] = this.dataOption[i];
			}
		}
		return option;
	};
	AJAX.prototype.setQuery = function(option){
		var data = [];
		if(typeof option.datas !== "undefined"){
			for(var key of option.datas.keys()){
				data.push(key + "=" + option.datas.get(key));
			}
		}
		if(typeof option.query !== "undefined"){
			for(var i in option.query){
				data.push(i+"="+encodeURIComponent(option.query[i]));
			}
		}
		if(typeof option.querys !== "undefined"){
			for(var i=0;i<option.querys.length;i++){
				if(typeof option.querys[i] == "Array"){
					data.push(option.querys[i][0]+"="+encodeURIComponent(option.querys[i][1]));
				}
				else{
					var sp = option.querys[i].split("=");
					data.push(sp[0]+"="+encodeURIComponent(sp[1]));
				}
			}
		}
		return data;
	};




  var MAIN = function(options){
    this.options = this.setOptions(options);
    // this.init();
    // this.setCSS();
    // this.setHTML();
    this.view();
  };

  MAIN.prototype.setOptions = function(options){
    options = options ? options : {};
    var res = JSON.parse(JSON.stringify(__options));
    for (var i in options) {res[i] = options[i];}
    return res;
  };

  // MAIN.prototype.init = function(){
  //   if(){

  //   }
  // };

  // MAIN.prototype.setCSS = function(){
  //   if(document.querySelector("link[data-picview='1']")){return}
  //   var myScript = new LIB().currentScriptTag;
  //   var href = myScript.replace(".js",".css");
  //   var link = document.createElement("link");
  //   link.setAttribute("data-picview","1");
  //   link.rel = "stylesheet";
  //   link.href = href;
  //   var head = document.getElementsByTagName("head");
  //   head[0].appendChild(link);
  // };

  // MAIN.prototype.setHTML = function(){
  //   var myScript = new LIB().currentScriptTag;
  //   var url = myScript.replace(".js",".html");
  //   new AJAX({
  //     url : url,
  //     method : "get",
  //     onSuccess : (function(res){
  //       if(!res){return;}
  //       this.options.template = res;
  //     }).bind(this)
  //   });
  // };

  MAIN.prototype.view = function(){
    var area = document.querySelector(this.options.target);
    if(!area){
      console.log("Error ! not selector '"+this.options.target+"'");
    }

    console.log(this.options);
  };

  // load-css
  var myScript = new LIB().currentScriptTag;
  var href = myScript.replace(".js",".css");
  var link = document.createElement("link");
  link.setAttribute("data-picview","1");
  link.rel = "stylesheet";
  link.href = href;
  var head = document.getElementsByTagName("head");
  head[0].appendChild(link);

 // load-template(html)
  var url = myScript.replace(".js",".html");
  new AJAX({
    url       : url,
    method    : "get",
    onSuccess : (function(res){
      if(!res){return;}
      console.log(res);
      __options.template = res;
    }).bind(this)
  });
  




  return MAIN;
})();