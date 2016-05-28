KG.App.run(function($helper){
	$helper.init();
});


KG.App.run(function(
	$rootScope
){
	$rootScope.fn = {
		logoPath : function(biz){
			var path = biz.logo[0].path;
			if(!/^http/.test(path)){
				path = KG.config.SiteRoot+path;
			}
			return path;
		},
		absPath : function(path){
			if(!/^http/.test(path)){
				path = KG.config.SiteRoot+path;
			}
			return path;
		},
		bizName : function(biz){
			return biz.name_cn || biz.name_en;
		},
		fullAddress : function(biz){
			return KG.helper.biz.fullAddress(biz);
		},
		path : util.path,
		formatPhone : function(phone){
			return KG.helper.biz.formatPhone(phone);
		},
		goBack : function(){
			try{
				history.go(-1);
			}catch(e){}
		}
	};


	//$rootScope.$on('$ionicView.loaded', function(e){
		console.log('---- view loaded ----');
		KG.user.checkLogin(function(){

			var user = KG.user.get();
			if(user.isLogin){
				$rootScope.user = KG.user.get();
			}

			_.delay(function(){
				if(_.isFunction($rootScope.initPage)){
					$rootScope.initPage.call(null, user);
				}
			}, 100);



		});

	//});


});