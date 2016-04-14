
KG.App.directive('hwStoreViewComp', [
	function(){
		var F = {
			makeStoreData : function(data){
				var store = data;
				store.bg = data.background_pic;
				store.fullAddress = KG.helper.biz.fullAddress(data);

				return store;
			}
		};

		return {
			restrict : 'E',
			replace : true,
			templateUrl : util.getTplPath('view/StoreView'),
			scope : {
				store : '='
			},



			link : function($scope){

				var un = $scope.$watch('store', function(val){
					if(val){
						$scope.store = F.makeStoreData(val);
						un();
					}
				});



			}
		};
	}
]);