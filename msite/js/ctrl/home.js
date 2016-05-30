
KG.App.controller('HomePageCtrl', [
	'$scope',
	'LoginBox',
	function($scope, LoginBox){

		KG.helper.loading.show();
		KG.request.getSiteHomePageData({}, function(flag, rs){
			KG.helper.loading.hide();
			console.log(rs);

			$scope.couponList = rs.classifiedinfo;
			$scope.bizList = rs.biz;
		});

		$scope.goToCreateStore = function(){
			var user = KG.user.get();
			if(!user.isLogin){
				LoginBox.showLoginModal({
					showCloseButton : true,
					loginSuccessCallback : function(){
						location.reload();
					}
				});

				return;
			}
			else{
				util.path.go('mine.createstore.html');
			}


		};

		KG.helper.setWeixinShare({
			title : '海外同城',
			description : '海外同城首页'
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

KG.App.controller('HomeStoreListCtrl', [
	'$scope',
	'$element',
	function($scope, $element){

		$scope.emptyText = '';
		var C =  $scope.C = {
			page : 1,

			tag : util.url.param('tag'),
			subtag : util.url.param('subtag') || '-1'
		};
		$scope.more = null;
		var F = {
			getListData : function(callback){
				KG.request.getStoreListByTag({
					tag : C.tag,
					subtag : C.subtag>0 ? C.subtag : null,
					publisher_type : 0,

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
						$scope.list = rs.list;
						F.setSubtagList(rs);

						$scope.more = F.checkMoreState(rs.list);
					}
					else{
						$scope.list = [];

						$scope.emptyText = '暂无本类商家';
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
			},

			setSubtagList : function(rs){
				var map = rs.second_tagid;
				$scope.subtaglist = [{
					name : '全部分类', //rs.magin_tagid.name,
					tag_id : -1
				}].concat(_.toArray(map));
				console.log($scope.subtaglist);
			}
		};

		$scope.loadMoreList = function(){

			$scope.more = 2;
			F.getListData(function(flag, rs){
				console.log(rs);

				$scope.$apply(function(){
					$scope.list = $scope.list.concat(rs.list);

					$scope.more = F.checkMoreState(rs.list);

				});

			})
		};

		$scope.changeSubtag = function(val){
			C.subtag = val;
			C.page = 1;

			KG.helper.loading.show();
			F.getListData(function(flag, rs){
				KG.helper.loading.hide();
				if(flag){
					$scope.list = rs.list;
					$scope.more = F.checkMoreState(rs.list);
				}
				else{
					$scope.list = [];

					$scope.emptyText = '暂无本类商家';
					$scope.more = 3;
				}
			});
		};

		$scope.clickSelectIcon = function(){

		};

		$scope.goToCoupon = function(e, id){
			util.path.go(util.path.coupon(id));
			e.preventDefault();
			//return false;
		};

		F.init();
	}
]);