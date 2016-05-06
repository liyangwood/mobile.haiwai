
KG.App.directive('hwUserLoginComp', [
	function(){

		return {
			restrict : 'E',
			replace : true,
			templateUrl : util.getTplPath('user/LoginAndReg'),
			controller : function($scope, $element){
				$scope.isLoginBox = true;

				_.extend($scope, {
					showLoginBox : function(){
						$scope.isLoginBox = true;
					},
					showRegBox : function(){
						$scope.isLoginBox = false;
					}
				});
			}
		};
	}
]);