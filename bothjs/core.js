(function(){
	var KG = {};

	var site = 'http://beta.haiwai.com';
	KG.config = {
		APP_NAME : 'HaiWaiApp',

		SERVER : site,

		SiteRoot : site,
		ApiRoot : site+'/service/api/',
		MD5_KEY : 'm.y^w8oP01K#gs',
		SJAPP_AppleStore_Url : 'https://itunes.apple.com/us/app/hai-wai-tong-cheng-shang-jia/id974815137',
		GoogleMapApiKey : 'AIzaSyCjKJoA5eBc75v5pQurBQ3IjP4vNkfoOzw',
		WeixinAppID : 'wx4c519e506d840934',
		WeixinAppSecret : 'a160e78f682317dbf6ed8ffe4e56bc30'
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