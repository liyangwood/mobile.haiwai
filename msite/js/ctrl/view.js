
KG.App.controller('StoreViewCtrl', [
	'$scope',
	'$rootScope',
	function($scope, $rootScope){


		var storeID = util.url.param('id');

		KG.helper.loading.show();
		KG.request.getStoreDetail({
			id : storeID
		}, function(flag, rs, json){
			KG.helper.loading.hide();
			console.log(rs);

			if(json.status === 404){
				KG.helper.goPath('/404');
				return;
			}

			if(flag){
				util.storage.set('hw-store-baseinfo', rs);
				$scope.store = rs;
			}

			KG.helper.setWeixinShare({
				title : rs.name_cn || rs.name_en,
				description : rs.briefintro,
				image : KG.helper.getWeixinShareImage(rs.logo[0].path)
			});

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

KG.App.controller('ArticleListCtrl', [
	'$scope',
	function($scope){
		$scope.hasMore = false;

		var id = util.url.param('id') || 'hot';

		KG.helper.loading.show();
		KG.request.getSiteArticleList({
			category : id
		}, function(flag, rs){
			KG.helper.loading.hide();
			if(flag){
				rs.category = [{
					category_id : 'hot',
					name : '热门文章'
				}].concat(rs.category).concat([{
						category_id : '30',
						name : '商家专栏'
					}]);

				$scope.catList = rs.category;
				$scope.list = rs.list;

				$scope.catIndex = _.findIndex(rs.category, {category_id : id});

				if(rs.list.length > 14){
					$scope.hasMore = true;
				}
			}
		});

		$scope.loadMoreData = function(){
			if(!$scope.hasMore){
				$scope.$broadcast('scroll.infiniteScrollComplete');
				return false;
			}
			var lastid = _.last($scope.list)?_.last($scope.list).id:null;
			if(!lastid){
				$scope.$broadcast('scroll.infiniteScrollComplete');
				return false;
			}
			else{
				KG.request.getSiteArticleList({
					category : id,
					lastid : lastid
				}, function(flag, rs){
					if(rs.list && rs.list.length > 0){
						$scope.list = $scope.list.concat(rs.list);
					}
					else{
						$scope.hasMore = false;
						KG.helper.toast('没有更多文章了');
						$scope.loadMoreData = function(){

							$scope.$broadcast('scroll.infiniteScrollComplete');
						};
					}

					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
			}
		};

	}
]);