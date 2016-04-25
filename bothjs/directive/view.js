
KG.App.directive('hwStoreViewComp', [
	function(){
		var F = {
			makeStoreData : function(data){
				var store = data;
				store.bg = data.background_pic;
				store.fullAddress = KG.helper.biz.fullAddress(data);

				return store;
			}
		};

		return {
			restrict : 'E',
			replace : true,
			templateUrl : util.getTplPath('view/StoreView'),
			scope : {
				store : '='
			},



			link : function($scope){

				var un = $scope.$watch('store', function(val){
					if(val){
						$scope.store = F.makeStoreData(val);
						un();
					}
				});



			}
		};
	}
]);

KG.App.directive('hwArticleViewComp', [
	function(){
		var C = {

		};
		var F = {
			initData : function(data, $scope){
				$scope.article = data.view;
			}
		};

		return {
			restrict : 'E',
			replace : true,
			templateUrl : util.getTplPath('view/ArticleView'),
			scope : {
				articleData : '='
			},
			controller : function($scope, $element, $attrs){
				var un = $scope.$watch('articleData', function(data){
					if(data){
						F.initData(data, $scope);
						un();
					}
				});
			},


			link : function($scope){

			}
		};
	}
]);