
KG.App.controller('StoreViewCtrl', [
	'$scope',
	function($scope){

		var storeID = util.url.param('id');

		KG.helper.loading.show();
		KG.request.getStoreDetail({
			id : storeID
		}, function(flag, rs){
			KG.helper.loading.hide();
			console.log(rs);
			if(flag){
				util.storage.set('hw-store-baseinfo', rs);
				$scope.store = rs;
			}

		});

	}
]);

KG.App.controller('StoreViewMoreInfoCtrl', [
	'$scope',
	function($scope){
		var store = util.storage.get('hw-store-baseinfo');

		store.dyfields = _.map(store.dyfields, function(item){
			if(_.isArray(item.value)){
				item.value = item.value.join(', ');
			}
			return item;
		});

		$scope.store = store;
	}
]);

KG.App.controller('ArticleViewCtrl', [
	'$scope',
	function($scope){
		var articleID = util.url.param('id');
		KG.helper.loading.show();
		KG.request.getStoreArticleDetail({
			id : articleID
		}, function(flag, rs){
			KG.helper.loading.hide();
			console.log(rs);
			if(flag){
				$scope.article = rs;
			}
		});
	}
]);

KG.App.controller('CouponViewCtrl', [
	'$scope',
	function($scope){
		var couponID = util.url.param('id');
		KG.helper.loading.show();
		KG.request.getCouponDetail({
			id : couponID
		}, function(flag, rs){
			KG.helper.loading.hide();
			console.log(rs);
			if(flag){
				$scope.coupon = rs;
			}
		});
	}
]);