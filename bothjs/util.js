(function(){
	var _uuid = 1;

	var util = {};

	//merge underscore
	_.extend(util, _);

	util.extend(util, {
		jq : function(angulerElement){
			return $(angulerElement);
		},

		addUserIdToRequestData : function(data){
			data = data || {};
			data.userid = KG.user.get('userid');
			data.token = KG.user.get('token');

			return data;
		},


		getUuid : function(){
			return 'uuid_'+_uuid++;
		},

		uploadImage : function(file, callback){

			if(!file) return;

			var fr = new FileReader();
			fr.onload = function(e){
				var binary = e.target.result;

				KG.request.uploadImage({
					image : binary
				}, function(flag, rs){
					if(flag){
						callback(rs.files[0]);
					}
				});
			};

			fr.readAsDataURL(file);
		},

		readFile : function(file, callback){
			var fr = new FileReader();
			fr.onload = function(e){
				var binary = e.target.result;
				callback(binary);
			};
			fr.readAsDataURL(file);
		},

		replaceHtmlImgSrcToAbsolute : function(html){
			var reg = new RegExp('<img\.*src=(\"|\')([^\"\']+)(\"|\')\\s*([\\w]+=(\"|\')([^\"\']*)(\"|\')\\s*)*/>', 'g');
			return html.replace(reg, function(match){

				var src = arguments[2];

				if(/^http/.test(src)){
					return match;
				}
				else{
					return match.replace(src, KG.config.SiteRoot+src);
				}

			});
		},

		removeHtmlTag : function(html){
			return html.replace(/<([^>]*)>/g, '');
		},

		getLatAndLongWithAddress : function(address, callback){
			var url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key='+KG.config.GoogleMapApiKey;
			$.getJSON(url, {}, function(rs){
				if(rs.status === 'OK'){
					callback(rs.results[0].geometry.location);
				}
			});
		},

		formatDate : function(format, date){
			var d = date ? new Date(parseInt(date.length>12?date:date*1000, 10)) : new Date();
			var year = d.getFullYear(),
				month = addZero(d.getMonth() + 1),
				day = addZero(d.getDate()),
				hour = addZero(d.getHours()),
				min = addZero(d.getMinutes()),
				sec = addZero(d.getSeconds());

			function addZero(x){
				if(x<10) return '0'+x;
				return x;
			}

			return format.replace('yy', year).replace('mm', month).replace('dd', day).replace('h', hour).replace('m', min).replace('s', sec);
		},

		getRecentDate : function(timestamp){
			if(timestamp.length < 5) return timestamp;
			nd = parseInt(timestamp)*1000;
			var xd = new Date().getTime();

			var tmp = (xd - nd) / 1000,
				rs = '';
			if(tmp < 60){
				rs = Math.floor(tmp)+'秒前';
			}
			else if(tmp < 60 * 60){
				rs = Math.floor(tmp/(60))+'分钟前';
			}
			else if(tmp < 60*60*24){
				rs = Math.floor(tmp/(60*60))+'小时前';
			}
			else{
				rs = util.formatDate('yy-mm-dd h:m', Math.floor(nd/1000));
			}

			return rs;
		},

		inDevice : function(){
			return window.cordova ? true : false;
		},

		getStatusBarHeight : function(){
			var rs =  this.inDevice() ? 20 : 0;

			if(ionic.Platform.isAndroid()){
				rs = 0;
			}

			return rs;
		},

		isAndroid : ionic.Platform.isAndroid,
		isIOS : ionic.Platform.isIOS,

		getTplPath : function(name){
			return '../bothtpl/'+name+'.html';
		}
	});

	util.angular = {
		apply : function(scope, fn){
			var phase = scope.$root.$$phase;
			if(phase == '$apply' || phase == '$digest') {
				if(fn && (typeof(fn) === 'function')) { fn();
				}
			} else {
				scope.$apply(fn);
			}
		}
	};


	util.cookie = {
		get : function(name) {
			var tmp, reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)","gi");
			if( tmp = reg.exec( unescape(document.cookie) ) )
				return(tmp[2]);
			return null;
		},

		set : function(name, value, expires, path, domain) {
			path = path || "/";
			expires = expires || 'never';
			var str = name + "=" + escape(value);
			if(expires){
				if (expires == 'never') {
					expires = 100*365*24*60;
				}
				var exp = new Date();
				exp.setTime(exp.getTime() + expires*60*1000);
				str += "; expires="+exp.toGMTString();
			}
			if(path){
				str += "; path=" + path;
			}
			if(domain){
				str += "; domain=" + domain;
			}
			document.cookie = str;
		},

		remove: function(name, path, domain) {
			document.cookie = name + "=" +
				((path) ? "; path=" + path : "") +
				((domain) ? "; domain=" + domain : "") +
				"; expires="+new Date(0).toGMTString();
		}
	};

	util.dom = {
		scrollTo : function(top){
			var win = $(window);

			//TODO;
			win.scrollTop(top);
		}
	};

	//TODO 优化逻辑
	var MessageParam = {};
	util.message = {
		register : function(name, fn){
			var callback = function(e, data){
				data = MessageParam[name] ? MessageParam[name].data : data;
				fn(e, data);
			};

			$('body').unbind(name).bind(name, callback);

			if(MessageParam[name]){
				var tmp = MessageParam[name];
				fn(null, tmp.data);

				//delete(MessageParam[name]);
			}
		},
		publish : function(name, data){
			MessageParam[name] = {
				data : data
			};

			$('body').trigger(name, data);
		}
	};





	util.url = {
		param : function(key, url){
			url = url || location.search;

			key = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + key + "=([^&#]*)"),
				results = regex.exec(url);
			return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		},
		hash : function(){
			return location.hash.replace(/^#/, '');
		}
	};


	util.storage = {
		set : function(key, value, opts){
			opts = util.extend({
				expires : 'max'
			}, opts||{});

			//if(util.isObject(value) || util.isArray(value)){
			//    value = JSON.stringify(value);
			//}
			var json = JSON.stringify({
				data : value
			});
			//TODO 处理数据存储过期时限

			window.localStorage.setItem(key, json);
		},
		get : function(key){
			var data = window.localStorage.getItem(key);
			if(!data) return null;
			return JSON.parse(data).data;
		}
	};

	util.path = {
		go : function(url){
			location.href = url;
		},

		article : function(id){
			return 'article.view.html?id='+id;
		},
		store : function(id){
			return 'store.view.html?id='+id;
		},
		coupon : function(id){
			return 'coupon.view.html?id='+id;
		}
	};

	util.validate = {
		email : function(email){
			var reg = /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;

			return reg.test(email);
		},
		AmericanPhone : function(phone){
			var reg = /^[0-9]{10}$/;
			return reg.test(phone);
		},
		password : function(pwd){
			if(!pwd || pwd.length < 6){
				return false;
			}

			return true;
		}
	};



	window.util = KG.util = util;


	//debug
	if(!util.url.param('debug')){
		//console.log = console.error = function(){};
	}
})();



