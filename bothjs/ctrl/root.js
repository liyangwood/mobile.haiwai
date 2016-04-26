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
		bizName : function(biz){
			return biz.name_cn || biz.name_en;
		},
		fullAddress : function(biz){
			var rs = biz.address;
			if(biz.city){
				rs += ', '+biz.city;
			}
			if(biz.state){
				rs += ', '+biz.state;
			}
			if(biz.zip){
				rs += ' '+biz.zip;
			}

			return rs;
		},
		path : util.path
	};
});