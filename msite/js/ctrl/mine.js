KG.App.controller('MineStoreListCtrl', [
	'$scope',
	function($scope){


		KG.helper.loading.show();
		KG.request.getBizList({}, function(flag, rs){
			KG.helper.loading.hide();
			if(flag){
				console.log(rs);
			}
		});
	}
]);