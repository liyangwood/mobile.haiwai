
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
				var un = $scope.$watch('articleData', function(data){
					if(data){
						$scope.fn = $rootScope.fn;
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

KG.App.directive('hwCouponViewComp', [
	'$rootScope',
	function($rootScope){
		var C = {

		};
		var F = {
			goToMap : function(address, city){
				var url = 'https://www.google.com/maps/place/'+address+' '+city;
				KG.helper.openUrl(url);
			},
			getStaticMap : function(latitude, longitude){
				var w = $(window).width();

				var url = 'http://maps.googleapis.com/maps/api/staticmap?';
				url += 'center='+latitude+','+longitude;
				url += '&zoom=15';
				url += '&markers=size:mid%7Ccolor:red%7Clabel:%7C'+latitude+','+longitude;
				url += '&size='+w+'x120';
				url += '&key='+KG.config.GoogleMapApiKey;

				return url;
			},
			initData : function(data, $scope){
				$scope.coupon = data;

				var duration = '',
					format = 'YYYY年MM月DD日';
				if(data.top_end_time === 'unlimit'){
					duration = '不限时间';
				}
				else{
					duration = moment.unix(data.top_start_time).format(format)+' - '+moment.unix(data.top_end_time).format(format);
				}
				$scope.coupon.duration = duration;

				var address = $scope.fn.fullAddress(data.bizinfo);
				util.getLatAndLongWithAddress(address, function(json){
					util.angular.apply($scope, function(){
						$scope.googleMapImage = F.getStaticMap(json.lat, json.lng);
					});

					$scope.goToMap = function(){
						F.goToMap($scope.coupon.bizinfo.address, $scope.coupon.bizinfo.city);
					};

				});
			}
		};

		return {
			restrict : 'E',
			replace : true,
			templateUrl : util.getTplPath('view/CouponView'),
			scope : {
				couponData : '='
			},
			controller : function($scope, $element, $attrs){

				var un = $scope.$watch('couponData', function(data){
					if(data){
						$scope.fn = $rootScope.fn;
						F.initData(data, $scope);
						un();
					}
				});
			}
		};
	}
]);