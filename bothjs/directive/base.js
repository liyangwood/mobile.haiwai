KG.App.directive('hwSiteHomeHeader', [
	function(){
		return {
			restrict : 'E',
			replace : true,
			template : function(){
				return [
					'<div class="bar bar-header cp-site-header">',
					'<button class="c1">旧金山</button>',
					'<label class="item item-input c-lb">',
					'<i class="icon ion-ios-search-strong placeholder-icon"></i>',
					'<input type="text" placeholder="输入商铺，地点">',
					'</label>',
					'<button class="c1 c2"><i class="icon ion-social-github-outline"></i></button>',
					'</div>'
				].join('');
			}
		};
	}
]);

KG.App.directive('hwSiteHomeSearchHeader', [

	function(){
		return {
			restrict : 'E',
			replace : true,
			templateUrl : util.getTplPath('home/HomeSearchHeader'),

			controller : function($scope, $element){
				var searchInput = $($element).find('input');

				searchInput.keyup(function(e){
					if(e.keyCode !== 13){
						return false;
					}
					var val = searchInput.val();
					if(!val){
						return false;
					}

					util.path.go('search.html?keyword='+val);
				});
			}

		};
	}
]);

KG.App.directive('hwSiteHomeTopNav', [
	function(){
		return {
			restrict : 'E',
			replace : true,
			templateUrl : util.getTplPath('home/HomeTopNav')
		};
	}
]);

KG.App.directive('hwSiteFooter', [
	function(){
		return {
			restrict : 'E',
			replace : true,
			templateUrl : util.getTplPath('home/Footer')
		};
	}
]);

KG.App.directive('hwLoadingMore', [
	function(){
		return {
			restrict : 'E',
			replace : true,
			template : function(){
				return [
					'<div ng-show="state!==3" class="hw-loading-more">',
						'<ion-spinner ng-show="state===2" class="js_loading"></ion-spinner>',
						'<label ng-click="loadMore()" ng-show="state===1">点击加载更多</label>',
					'</div>'
				].join('');
			},
			scope : {
				state : '=',
				clickCallback : '&'
			},
			controller : function($scope, $element){

				$scope.loadMore = function(){
					//$scope.state = 2;
					$scope.clickCallback();
				}
			}
		};
	}
]);

KG.App.directive('hwLoadingImage', function(){

	var F = {
		restrict : 'E',
		replace : true,
		template : function(){
			return '<div class="hw-center-image"><ion-spinner></ion-spinner></div>';
		},

		controller : function($scope, $element, $attrs){
			var elem = util.jq($element);
			$attrs.$observe('imgSrc', function(val){
				if(val === 'loading') return;
				var w = elem.width(),
					h = elem.height();
				var ww, hh;

				var img = new Image();
				img.src = val;


				var sy = 'position:absolute;',
					f = 'width';
				util.jq(img).bind('load', function(){
					if(img.width/img.height >= w/h){
						ww = Math.ceil(img.width*h/img.height);
						sy += 'width:'+ww+'px;height:100%;top:0;left:'+((w-ww)/2)+'px';

					}
					else{
						sy += 'width:100%;height:auto;left:0;top:0;';
						f = 'height';
					}

					$(this).attr('style', sy);
					$element.empty().append(img);

				});


			});

		}
	};


	return F;
});

KG.App.directive('hwStarNum', [
	function(){
		return {
			restrict : 'E',
			replace : true,
			template : function(){
				var h = '<label class="hw-star-num">';
				return h+'</label>';
			},
			controller : function($scope, $element, $attrs){

				$attrs.$observe('starNum', function(val){
					var h = '';
					var len = parseFloat(val) || 0;

					for(var i= 0; i<5; i++){
						if(i+0.5 === len){
							h += '<i class="icon ion-android-star-half" ></i>';
						}
						else if(i<len){
							h += '<i class="icon ion-android-star"></i>';
						}
						else{
							h += '<i class="icon ion-android-star-outline"></i>';
						}

					}

					$element.html(h);
				});


			}
		};
	}
]);

KG.App.directive('kgBaseInput', [
	function(){
		return {
			restrict : 'E',
			replace : true,
			scope : {
				value : '=',
				error : '=',
				blueEvent : '='
			},
			template : function(elem, attr){
				var sy = '';
				if(attr.gap){
					sy += 'margin-left:'+attr.gap+'px;';
					sy += 'margin-right:'+attr.gap+'px;';
				}
				if(attr.top){
					sy += 'margin-top:'+attr.top+'px;';
				}

				sy = 'style="'+sy+'"';
				var h = [
					'<label '+sy+' class="hw-kgBaseInput">',
						'<span class="lb ',(attr.require?'require':''),'">',(attr.label||''),'</span>',

						'<span class="error">{{error}}</span>',
						'<input ng-blur="blurEvent()" ng-model="value" type="',(attr.type?attr.type:"text"),'" placeholder="'+(attr.placeholder||'')+'" />',
					'<label>'
				].join('');


				return h;
			},
			link : function(scope, elem, attr){
				//scope.blueEvent = _.noop()
			}
		};
	}
]);

KG.App.directive('kgBaseSelect', [
	function(){
		return {
			restrict : 'E',
			replace : true,
			scope : {
				value : '=',
				error : '=',
				list : '='
			},
			template : function(elem, attr){
				var sy = '';
				if(attr.gap){
					sy += 'margin-left:'+attr.gap+'px;';
					sy += 'margin-right:'+attr.gap+'px;';
				}
				if(attr.top){
					sy += 'margin-top:'+attr.top+'px;';
				}

				sy = 'style="'+sy+'"';
				var h = [
					'<label '+sy+' class="hw-kgBaseInput">',
					'<span class="lb ',(attr.require?'require':''),'">',(attr.label||''),'</span>',

					'<span class="error">{{error}}</span>',
					//'<input ng-model="value" type="',(attr.type?attr.type:"text"),'" placeholder="'+(attr.placeholder||'')+'" />',

					'<select ng-change="change(value)" ng-model="value">',
						'<option ng-selected="value===item.value" ng-repeat="item in list" value="{{::item.value}}">{{::item.name}}</option>',
					'</select>',

					'<label>'
				].join('');


				return h;
			},
			controller : function($scope, $element, $attrs){

				var un = $scope.$watch('list', function(val){
					if(val){
						$scope.list = val;
						un();
					}
				});

			}
		};
	}
]);

KG.App.directive('kgNewsHeader', function($ionicModal){
	return {
		restrict : 'E',
		replace : true,
		templateUrl : util.getTplPath('comp/ArticleListHeader'),

		scope : {
			hwCurrentData : '=',
			hwCurrentIndex : '='
		},

		link : function($scope, $elem, $attr){


			var modal = null;
			var unwa = $scope.$watch('hwCurrentData', function(newData){
				if(newData){
					//console.log($scope.hwCurrentIndex)
					$elem.find('ion-scroll').children().eq(0).css('width', $scope.hwCurrentData.length * 80 + 5 +'px');
					initModal();
					unwa();
				}

			});

			$scope.slideToIndexPage = function(index){
				$scope.currentIndex = index;

			};

			$elem.on('click', function(e){
				var o = util.jq(e.target);
				if(o.hasClass('hw-one')){
					if($scope.currentIndex == o.attr('title')) return;

					var index = o.attr('title');
					$scope.slideToIndexPage(index);
					$scope.$digest();
				}

				var st = ionic.DomUtil.getParentOrSelfWithClass(o[0], 'hw-down');
				if(st){

					$scope.showAll = !$scope.showAll;
					if($scope.showAll){

						modal.show();
					}
				}
			});


			function initModal(){

				var top = 44;

				if(util.inDevice()){
					top += util.getStatusBarHeight();
				}

				var tpl = '<ion-modal-view style="top:'+top+'px" ng-click="hideModal()" class="hw-news-header-modal"><div class="hw-box">';

				util.each($scope.data, function(item, index){
					tpl += '<div class="hw-col"><b ng-click="slideToIndexPageForModal('+index+')">'+item.name+'</b></div>';
				});

				tpl += '</div></ion-modal-view>';
				$scope.slideToIndexPageForModal = function(index){
					$scope.slideToIndexPage(index);

					//TODO 以后需要控制ion-scroll到对应的栏目处
				};
				modal = $ionicModal.fromTemplate(tpl, {
					scope: $scope,
					animation: 'slide-in-up'
				});
				$scope.$on('$destroy', function() {
					modal.remove();
				});
				$scope.$on('modal.hidden', function(){
					$scope.showAll = false;
				});
				$scope.hideModal = function(){
					modal.hide();
				};
			}



			$scope.showAll = false;

		}
	};
});