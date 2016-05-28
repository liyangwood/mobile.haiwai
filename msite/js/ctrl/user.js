
KG.App.controller('UserLoginCtrl', [
	'$scope',
	function($scope){
		$scope.loginSuccessCallback = function(){
			util.path.go('mine.storelist.html');
		}
	}
]);