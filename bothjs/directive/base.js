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
						'<input type="',(attr.type?attr.type:"text"),'" placeholder="'+attr.placeholder+'" />',
					'<label>'
				].join('');


				return h;
			}
		};
	}
]);