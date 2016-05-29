KG.App.controller('MineStoreListCtrl', [
	'$scope',
	'$rootScope',
	'LoginBox',
	function($scope, $rootScope, LoginBox){

		$rootScope.initPage = function(){

			var user = KG.user.get();

			if(!user.isLogin){
				//show login box
				LoginBox.showLoginModal({
					showCloseButton : false,
					loginSuccessCallback : function(){
						location.reload();
					}
				});

				return;
			}


			KG.helper.loading.show();
			KG.request.getBizList({}, function(flag, rs){
				KG.helper.loading.hide();
				if(flag){
					console.log(rs);

					$scope.list = rs;
				}
			});
		};




	}
]);

KG.App.controller('MineCreateStoreStep1', [
	'$scope',
	'$rootScope',
	function($scope, $rootScope){
		$rootScope.initPage = function(){
			var user = KG.user.get();
			console.log('[USER]', user, user.isLogin);
			if(!user.isLogin){
				_.delay(function(){
					util.path.go('user.login.html');
				}, 100);


				return;
			}
		};

		$scope.submitCallback = function(){
			KG.helper.goPath('/step2');
		};

		$scope.goHome = function(){
			util.path.go('mine.storelist.html');
		};
	}
]);

KG.App.controller('MineCreateStoreStep2', [
	'$scope',
	'$rootScope',
	function($scope, $rootScope){
		$rootScope.initPage = function(){
			var user = KG.user.get();
			if(!user.isLogin){
				util.path.go('user.login.html');

				return;
			}
		};

		$scope.submitCallback = function(bizID, json){
			KG.helper.goPath('/step3');
		}
	}
]);

KG.App.controller('MineCreateStoreStep3', [
	'$scope',
	'$rootScope',
	function($scope, $rootScope){
		$rootScope.initPage = function(){
			var user = KG.user.get();
			if(!user.isLogin){
				util.path.go('user.login.html');

				return;
			}
		};

		$scope.submitCallback = function(){
			util.path.go('mine.storelist.html');
		};

		$scope.errorParamCallback = function(){
			util.path.go('mine.createstore.html');
		};
	}
]);