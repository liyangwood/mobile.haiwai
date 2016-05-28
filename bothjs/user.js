(function(){
	var user = {
		image : 'http://www.sinomedianet.com/haiwai2015.3.19/images/default_avatar.png',
		defaultImage : 'http://www.sinomedianet.com/haiwai2015.3.19/images/default_avatar.png',
		email : '',
		userid : '',
		tel : '',
		token : '',
		isLogin : false
	};

	KG.user = {
		get : function(key){
			if(key){
				return user[key];
			}
			return user;
		},

		reset : function(){
			user = _.extend(user, {
				image : '',
				email : '',
				userid : '',
				token : '',
				isLogin : false
			});
		},

		logout : function(){
			var data = {
				act : 'logout',
				func : 'passport'
			};
			data = util.addUserIdToRequestData(data);
			return KG.request.ajax(data, function(flag, rs){
				if(flag){
					KG.user.reset();
					util.storage.set('current-login-user', null);
					location.reload();
				}
			});
		},

		getUserDetailWithToken : function(opts, success){
			if(opts.pk_id){
				user.userid = opts.pk_id;
				user.token = opts.token;
				user.email = opts.email;

				KG.request.getUserDetailInfo({}, function(f, json){
					if(f){
						user.image = json.avatar_url;
						if(/^http/.test(user.image)){
							user.image = KG.config.SiteRoot+user.image;
						}
						user.isLogin = true;
						_.extend(user, json);

						util.storage.set('current-login-user', user);

						success(user);
					}

				});
			}
		},

		login : function(opts, success, error){
			var successFN = function(flag, rs){
				if(rs.pk_id){
					KG.user.getUserDetailWithToken(rs, success);
				}
				else{
					error(rs.msg?rs.msg:rs);
				}
			};

			KG.request.login(opts, successFN, error);
		},

		register : function(opts, success, error){
			return KG.request.register(opts, success, error);
		},

		update : function(){
			KG.request.getUserDetailInfo({}, function(f, json){
				if(f){
					user.image = json.avatar_url;
					if(/^http/.test(user.image)){
						user.image = KG.config.SiteRoot+user.image;
					}
					user.isLogin = true;
					_.extend(user, json);

					util.storage.set('current-login-user', user);

				}
			});
		},

		checkLogin : function(next){
			next = next || function(){};
			var u = util.storage.get('current-login-user');
			if(u && u.token){
				_.extend(user, u);
				KG.request.checkLogin({}, function(flag, rs){
					if(flag){
						user.image = KG.config.SiteRoot+rs.avatar_url;
						_.extend(user, rs);
						user.isLogin = true;
						next();
					}
					else{
						KG.user.reset();
						next();
					}
				});
			}
			else{
				KG.user.reset();
				next();
			}
		}
	};
})();