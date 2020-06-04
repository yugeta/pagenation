var $$pagenation = (function(){

  var __options = {
    target        : ".pagenation",
    page_total    : 10,     // ページの総数
    page_count    : 5,      // ページ表示数（奇数にしないと、中間表示されない）
    page_current  : 0,      // 現在ページ番号(0スタート)
    query_current : "num",  // URLクエリの任意keyの値を元にcurrent値を取得する（優先 > page_current , 0スタート）
    
    link_click    : null,  // function(num){console.log()}

    // item_total    : 100,
    // num_page_links_to_display : 3,
    // items_per_page : 6,
    // wrap_around: true,

    show_prev_next  : true,
    show_first_last : false
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

  LIB.prototype.urlinfo = function(uri){
    uri = (uri) ? uri : location.href;
    var data={};
		//URLとクエリ分離分解;
    var urls_hash  = uri.split("#");
    var urls_query = urls_hash[0].split("?");
		//基本情報取得;
		var sp   = urls_query[0].split("/");
		var data = {
      uri      : uri
		,	url      : sp.join("/")
    , dir      : sp.slice(0 , sp.length-1).join("/") +"/"
    , file     : sp.pop()
		,	domain   : sp[2]
    , protocol : sp[0].replace(":","")
    , hash     : (urls_hash[1]) ? urls_hash[1] : ""
		,	query    : (urls_query[1])?(function(urls_query){
				var data = {};
				var sp   = urls_query.split("#")[0].split("&");
				for(var i=0;i<sp .length;i++){
					var kv = sp[i].split("=");
					if(!kv[0]){continue}
					data[kv[0]]=kv[1];
				}
				return data;
			})(urls_query[1]):[]
		};
		return data;
  };
  
  LIB.prototype.construct = function(){
    switch(document.readyState){
      case "complete"    : new MAIN();break;
      case "interactive" : this.event(window , "DOMContentLoaded" , (function(){new MAIN()}).bind(this));break;
      default            : this.event(window , "load"             , (function(){new MAIN()}).bind(this));break;
		}
  };

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
    this.init();
    this.setCSS();
    this.template(); // -> view
  };

  MAIN.prototype.init = function(){
    var urlinfo = new LIB().urlinfo();
    if(this.options.query_current){
      this.options.page_current = urlinfo.query[this.options.query_current] ? urlinfo.query[this.options.query_current] : 0;
    }
  };

  MAIN.prototype.setOptions = function(options){
    options = options ? options : {};
    var res = JSON.parse(JSON.stringify(__options));
    for (var i in options) {res[i] = options[i];}
    return res;
  };

  MAIN.prototype.setCSS = function(){
    if(document.querySelector("link[data-picview='1']")){return}
    var myScript = new LIB().currentScriptTag;
    var href = myScript.replace(".js",".css");
    var link = document.createElement("link");
    link.setAttribute("data-picview","1");
    link.rel = "stylesheet";
    link.href = href;
    var head = document.getElementsByTagName("head");
    head[0].appendChild(link);
  };

  MAIN.prototype.template = function(){
    var myScript = new LIB().currentScriptTag;
    var url = myScript.replace(".js",".html");
    new AJAX({
      url : url,
      method : "get",
      onSuccess : (function(res){
        if(!res){return;}
        this.options.template = res;
        this.view();
      }).bind(this)
    });
  };

  MAIN.prototype.view = function(){
    var area = document.querySelector(this.options.target);
    if(!area){
      console.log("Error ! not selector '"+this.options.target+"'");
    }
    var html = this.options.template;
    area.innerHTML = html;

    var page_area = area.querySelector("ul.pagenation-page-area");
    this.getPages(page_area);
    this.showButtons();
    this.setLinkEvent();
  };

  MAIN.prototype.showButtons = function(){
    var area = document.querySelector(this.options.target);
    if(!area){return;}
    
    var elm_first = area.querySelector(".prev-area .first");
    if(elm_first){
      if(this.options.show_first_last
      && this.options.page_current > 0
      && this.options.page_total > this.options.page_count){
        elm_first.setAttribute("data-view" , "1");
        if(!elm_first.hasAttribute("data-event")){
          elm_first.setAttribute("data-event" , "1");
          new LIB().event(elm_first , "click" , (function(e){this.click_button(e)}).bind(this));
        }
      }
      else{
        elm_first.setAttribute("data-view" , "0");
      }
    }
    var elm_last = area.querySelector(".next-area .last");
    if(elm_last){
      if(this.options.show_first_last
      && this.options.page_current < this.options.page_total-1
      && this.options.page_total > this.options.page_count){
        elm_last.setAttribute("data-view" , "1");
        if(!elm_last.hasAttribute("data-event")){
          elm_last.setAttribute("data-event","1");
          new LIB().event(elm_last , "click" , (function(e){this.click_button(e)}).bind(this));
        }
        
      }
      else{
        elm_last.setAttribute("data-view" , "0");
      }
    }
    var elm_prev = area.querySelector(".prev-area .prev");
    if(elm_prev){
      if(this.options.show_prev_next
      && this.options.page_current > 0
      && this.options.page_total > this.options.page_count){
        elm_prev.setAttribute("data-view" , "1");
        if(!elm_prev.hasAttribute("data-event")){
          elm_prev.setAttribute("data-event","1");
          new LIB().event(elm_prev , "click" , (function(e){this.click_button(e)}).bind(this));
        }
      }
      else{
        elm_prev.setAttribute("data-view" , "0");
      }
    }
    var elm_next = area.querySelector(".next-area .next");
    if(elm_next){
      if(this.options.show_prev_next
      && this.options.page_current < this.options.page_total-1
      && this.options.page_total > this.options.page_count){
        elm_next.setAttribute("data-view" , "1");
        if(!elm_next.hasAttribute("data-event")){
          elm_next.setAttribute("data-event" , "1");
          new LIB().event(elm_next , "click" , (function(e){this.click_button(e)}).bind(this));
        }
      }
      else{
        elm_next.setAttribute("data-view" , "0");
      }
    }
  };

  MAIN.prototype.getPages = function(page_area){
    if(!page_area){return;}
    if(!this.options.page_total){return null;}
    var page_current;
    if(this.options.query_current){
      var urlinfo = new LIB().urlinfo();
      if(typeof urlinfo.query[this.options.query_current] !== "undefined"){
        page_current = Number(urlinfo.query[this.options.query_current]);
      }
      else{
        page_current = 0;
      }
    }
    else if(this.options.page_current){
      page_current = Number(this.options.page_current);
    }
    else{
      page_current = 0;
    }

    var page_counts = this.getPage_start_end(
      Number(this.options.page_total),
      Number(this.options.page_count),
      page_current
    );

    if(!page_counts){return;}
    for(var i in page_counts){
      var li = document.createElement("li");
      if(typeof page_counts[i] === "number"){
        li.innerHTML = (page_counts[i]+1);
        li.setAttribute("data-num" , page_counts[i]);
        if(page_current === page_counts[i]){
          li.className = "active";
        }
      }
      else{
        li.innerHTML = page_counts[i];
        li.className = "between";
      }
      
      page_area.appendChild(li);
    }
    return true;
  };

  MAIN.prototype.getPage_start_end = function(page_total , page_count , page_current){
    if(!page_total || !page_count){return;}

    page_current = page_current ? page_current : 0;

    // page_countが偶数の場合は奇数に変換(+1)
    if(page_count % 2 === 0){
      page_count = Number(page_count) + 1;
    }
    
    var status = this.getPage_status(page_total , page_count , page_current);

    switch(status){
      case "full":
        var nums = [];
        for(var i=0; i<page_total; i++){
          nums[i] = i;
        }
        return nums;

      case "forward":
        var nums = [];
        for(var i=0; i<page_count-1; i++){
          nums[i] = i;
        }
        nums.push(this.options.between_str);
        nums.push(page_total-1);
        return nums;

      case "rear":
        var nums = [0,this.options.between_str];
        for(var i=page_total - page_count + 1; i<page_total; i++){
          nums.push(i);
        }
        return nums;

      case "middle":
      default:
        // 閾値
        var threshold = Math.floor(page_count / 2) -1;
        var nums = [0,this.options.between_str];
        for(var i=page_current - threshold; i<=page_current + threshold; i++){
          nums.push(i);
        }
        nums.push(this.options.between_str);
        nums.push(page_total-1);
        return nums;
    }
  };

  // 現在地の状態確認 (totalに対して @ 前方:forward , 後方:rear , 中間:middle , between処理なし:full)
  MAIN.prototype.getPage_status = function(page_total , page_count , page_current){

    // 閾値
    var threshold = Math.floor(page_count / 2);

    // full
    if(page_total <= page_count){
      return "full";
    }
    // forward
    else if(page_current <= threshold){
      return "forward";
    }
    // rear
    else if(page_current + 1 >= page_total - threshold){
      return "rear";
    }
    // middle
    else{
      return "middle";
    }
  };

  MAIN.prototype.setLinkEvent = function(){
    var area = document.querySelector(this.options.target);
    if(!area){return;}
    var links = area.querySelectorAll("ul.pagenation-page-area li");
    for(var i=0; i<links.length; i++){
      if(!links[i].hasAttribute("data-num")){continue;}
      new LIB().event(links[i] , "click" , (function(e){this.clickPage(e)}).bind(this));
    }
  };

  MAIN.prototype.clickPage = function(e){
    var target = e.currentTarget;
    if(!target
    || !target.hasAttribute("data-num")){return;}
    var num = target.getAttribute("data-num");
    this.changeUrl(num);
  };

  MAIN.prototype.click_button = function(e){
    var target = e.currentTarget;
    if(!target){return;}
    var type = target.getAttribute("class");
    var num = this.options.page_current ? this.options.page_current : 0;
    num = Number(num);
    switch(type){
      case "first":
        num = 0;
        break;
      case "last":
        num = this.options.page_total-1;
        break;
      case "prev":
        num -= 1;
        break;
      case "next":
        num += 1;
        break;
      default:
        return;
    }
    // check
    if(num > this.options.page_total-1){
      num = this.options.page_total-1;
    }
    else if(num < 0){
      num = 0;
    }

    this.changeUrl(num);
  };
  MAIN.prototype.changeUrl = function(num){
    if(this.options.link_click !== null){
      this.options.link_click(num);
    }
    else{
      var urlinfo = new LIB().urlinfo();
      urlinfo.query[this.options.query_current] = num ? num : 0;
      var querys = [];
      for(var i in urlinfo.query){
        querys.push(i+"="+ urlinfo.query[i]);
      }
      location.href = urlinfo.url +"?"+ querys.join("&");
    }
  };


  // MAIN.prototype.refresh = function(options){

  // };
  




  return MAIN;
})();