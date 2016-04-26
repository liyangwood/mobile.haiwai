
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
	'$rootScope',
	function($rootScope){
		var C = {

		};
		var F = {
			initData : function(data, $scope){
				var rs = {};
				rs.article = data.view;
				rs.article.msgbody = util.replaceHtmlImgSrcToAbsolute(data.view.msgbody);
				rs.article.time = moment.unix(data.view.dateline).format('MM/DD/YYYY');

				rs.list = data.relative;

				rs.hotList = [];
				rs.category = data.category;

				KG.request.getSiteArticleList({
					category : rs.category.category_id
				}, function(flag, list){
					if(flag){
						$scope.hotList = list.list;
						$scope.$apply();
					}

				});

				return rs;
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
				$scope.fn = $rootScope.fn;

				var un = $scope.$watch('articleData', function(data){
					if(data){
						_.extend($scope, F.initData(data, $scope));


						un();
					}
				});
			},


			link : function($scope){

			}
		};
	}
]);