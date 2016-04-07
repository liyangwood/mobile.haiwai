(function(){
	var KG = {};

	KG.config = {
		APP_NAME : 'HaiWaiApp',

		SERVER : 'http://beta.haiwai.com',
		MD5_KEY : 'm.y^w8oP01K#gs'
	};

	KG.App = angular.module(KG.config.APP_NAME, ['ionic', 'ngCordova']);
	KG.App.config([
		'$ionicConfigProvider',
		'$sceDelegateProvider',

		function($ionicConfigProvider, $sceDelegateProvider){

			//tabs强制放到底部，否则android默认是放到顶部的
			$ionicConfigProvider.tabs.position('bottom');

			//$ionicConfigProvider.views.maxCache(0);
			$ionicConfigProvider.backButton.text('返回');
			$ionicConfigProvider.backButton.previousTitleText('');


			//load google map
			//uiGmapGoogleMapApiProvider.configure({
			//    //    key: 'your api key',
			//    china : true,
			//    v: '3.17',
			//    libraries: 'weather,geometry,visualization'
			//});

			//禁用页面的侧滑返回的功能
			$ionicConfigProvider.views.swipeBackEnabled(false);


		}]);

	window.KG = KG;
})();