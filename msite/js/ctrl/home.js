
KG.App.controller('HomePageCtrl', [
	'$scope',
	function($scope){

		KG.helper.loading.show();
		KG.request.getSiteHomePageData({}, function(flag, rs){
			KG.helper.loading.hide();
			console.log(rs);

			$scope.couponList = rs.classifiedinfo;
		});

	}
]);

KG.App.controller('HomeSearchStoreCtrl', [
	'$scope',
	function($scope){

		var keyword = util.url.param('keyword');
		$scope.emptyText = '对不起，没有“'+keyword+'”的搜索结果。您可以试着换换搜索词。';
		var C = {
			page : 1
		};
		$scope.more = null;
		var F = {
			getListData : function(callback){
				KG.request.searchStoreByKeyword({
					keyword : keyword,
					page : C.page
				}, function(flag, rs){
					if(flag){
						C.page++;
					}

					callback(flag, rs);
				});
			},

			init : function(){
				KG.helper.loading.show();
				F.getListData(function(flag, rs){
					KG.helper.loading.hide();
					console.log(rs);
					if(flag){
						$scope.list = rs;

						$scope.more = F.checkMoreState(rs);
					}
					else{
						$scope.list = [];

						$scope.emptyText = '请在顶部输入框中输入您想要搜索的关键字.';
						$scope.more = 3;
					}
				});
			},

			checkMoreState : function(list){
				if(list.length < 20){
					return 3;
				}
				else{
					return 1;
				}
			}
		};

		$scope.loadMoreList = function(){

			$scope.more = 2;
			F.getListData(function(flag, rs){
				console.log(rs);

				$scope.$apply(function(){
					$scope.list = $scope.list.concat(rs);

					$scope.more = F.checkMoreState(rs);

				});

			})
		};

		$scope.goToCoupon = function(e, id){
			util.path.go(util.path.coupon(id));
			e.preventDefault();
			//return false;
		};

		F.init();
	}
]);