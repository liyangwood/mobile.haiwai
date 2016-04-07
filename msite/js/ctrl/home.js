
KG.App.controller('HomePageCtrl', [
	'$scope',
	function($scope){

		KG.helper.loading.show();
		KG.request.getSiteHomePageData({}, function(flag, rs){
			KG.helper.loading.hide();
			console.log(rs);

			$scope.couponList = rs.classifiedinfo;
		});

	}
]);