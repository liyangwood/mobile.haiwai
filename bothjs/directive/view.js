
KG.App.directive('hwStoreViewComp', [
	'$rootScope',
	'ImagePreviewFactory',
	'$ionicSlideBoxDelegate',
	function($rootScope, ImagePreviewFactory, $ionicSlideBoxDelegate){
		var C = {};
		var F = {
			goToMap : function(address, city){
				var url = 'https://www.google.com/maps/place/'+address+' '+city;
				KG.helper.openUrl(url);
			},
			initData : function(data, $scope, elem){
				$scope.store = data;
				C.store = data;
				C.elem = elem;
				C.scope = $scope;

				$scope.num = {
					total : data.files.length,
					current : 1
				};

				$scope.slideChange = function(index){
					$scope.num.current = index+1;

				};

				var filesList = _.map($scope.store.files, function(item){
					return $scope.fn.absPath(item.path);
				});
				$scope.store.filesList = filesList;
				if(filesList.length === 2){
					//TODO 这里是因为slidebox的item＝2的时候，会自动复制item到4个，导致错误
					// https://github.com/driftyco/ionic/issues/3609
					$scope.store.filesLoop = false;
				}
				else{
					$scope.store.filesLoop = true;
				}



				$scope.clickSlideImage = function(index){
					ImagePreviewFactory.show($scope.store.filesList[index], $scope.store.filesList);
				};

				$scope.store.tagNameList = _.map(data.tags, function(item){
					return item.name;
				}).join(', ');

				F.initDescription();
				F.initMoreInfo();
				F.initTimeinfo();

				$scope.goToMap = function(){
					F.goToMap($scope.store.address, $scope.store.city);
				};

				F.initReplyBox();



			},
			initDescription : function(){
				C.scope.description = util.removeHtmlTag(C.store.briefintro);

				_.delay(function(){
					var box = C.elem.find('.js_desc');
					var hh = box.height();
					if(hh>56){
						box.height(56);
					}
					else{
						box.height('auto');
						box.removeClass('item-icon-right');
						box.find('i.icon').remove();
					}

					C.scope.slideDownDesc = function(){
						box.height('auto');
						box.removeClass('item-icon-right');
						box.find('i.icon').remove();
					};
				}, 100);

			},
			initMoreInfo : function(){
				C.scope.showMoreBtn = false;
				if((C.store.dyfields && C.store.dyfields.length > 0) || C.store.website){
					_.each(C.store.dyfields, function(item){
						if(item.value){
							C.scope.showMoreBtn = true;
						}
					});

				}
			},
			initTimeinfo : function(){
				var ST = [
					['sunday', '周日'],
					['monday', '周一'],
					['tuesday', '周二'],
					['wednesday', '周三'],
					['thursday', '周四'],
					['friday', '周五'],
					['saturday', '周六']

				];
				C.timeinfo = {
					today : '营业时间未设置',
					flag : false
				};
				var today = moment().day();
				_.each(C.store.timeinfo.unformat, function(item){
					if(item[ST[today][0]] === '1'){
						C.timeinfo.flag = 'down';
						C.timeinfo.today = '今天 : '+item.datetime1+' - '+item.datetime2;
					}
				});

				//var xx = '', arr = [];
				//_.each(C.store.timeinfo.unformat, function(val){
				//	_.each(ST, function(day){
				//
				//	});
				//});

				var xx = '';
				_.each(C.store.timeinfo.format, function(val, key){
					key = key.split(' - ');
					var s = key[0],
						e = key[1];
					console.log(e);
					s = _.find(ST, function(one){
						return one[0] === s;
					});
					e = _.find(ST, function(one){
						return one[0] === e;
					});
					console.log(s, e);

					_.each(val, function(one){
						xx += s[1]+' - '+e[1]+' : '+one.replace(',', ' - ')+'<br/>';
					});
				});
				C.timeinfo.all = xx;


				C.scope.timeinfo = C.timeinfo;
				C.scope.timeinfoDown = function(){
					C.scope.timeinfo.flag = 'up';
				};
				C.scope.timeinfoUp = function(){
					C.scope.timeinfo.flag = 'down';
				};
			},

			initReplyBox : function(){
				C.scope.reply = {
					list : [],
					lastid : null,
					imgClass : $(window).width()>330 ? 'hw-big' : 'hw-small',
					loadmore : false,
					clickLoadMore : function(){
						C.scope.reply.loadmore = 'loading';
						getData(function(json){

							util.angular.apply(C.scope, function(){});
						});
					}
				};

				var getData = function(callback){
					KG.request.getStoreCommentData({
						lastid : C.scope.reply.lastid,
						bizId : C.store.entityID
					}, function(flag, rs){
						if(flag){

							C.scope.reply.list = C.scope.reply.list.concat(rs.list);
							if(_.last(rs.list)){
								C.scope.reply.lastid = _.last(rs.list).id;
							}

							if(rs.list.length > 9){
								C.scope.reply.loadmore = 'normal';
							}
							else{
								C.scope.reply.loadmore = false;
							}

							callback(rs);
						}
					});
				};

				getData(function(json){
					C.scope.reply.total = json.count.all;
					util.angular.apply(C.scope, function(){});


					C.scope.reply.clickImage = function(index, n){
						var list = C.scope.reply.list[index].pic;
						console.log(index, n);
						ImagePreviewFactory.show(list[n], list);
					};


				});


			}
		};

		return {
			restrict : 'E',
			replace : true,
			templateUrl : util.getTplPath('view/StoreView'),
			scope : {
				store : '='
			},
			controller : function($scope, $element){
				var un = $scope.$watch('store', function(val){
					if(val){
						$scope.fn = $rootScope.fn;
						F.initData(val, $scope, util.jq($element[0]));
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