
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

			$scope.store = rs;
		});

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