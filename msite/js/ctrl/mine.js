KG.App.controller('MineStoreListCtrl', [
	'$scope',
	function($scope){


		KG.helper.loading.show();
		KG.request.getBizList({}, function(flag, rs){
			KG.helper.loading.hide();
			if(flag){
				console.log(rs);

				$scope.list = rs;
			}
		});
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