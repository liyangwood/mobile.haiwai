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