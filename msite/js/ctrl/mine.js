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
	function($scope){

	}
]);

KG.App.controller('MineCreateStoreStep2', [
	'$scope',
	function($scope){

	}
]);