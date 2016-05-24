
KG.App.directive('hwCreateStoreStep1', [
	function(){

		var F = {
			changeCategory : function(id, $scope){
				KG.request.getAllStoreTagByCategory({
					catId : id
				}, function(flag, rs){
					if(flag){
						console.log(rs);
						$scope.$apply(function(){
							$scope.cat.detail = rs;
						});

					}
				});
			},

			getFormData : function($scope){

			},

			validate : function($scope){

			}
		};

		return {
			restrict : 'E',
			replace : true,
			templateUrl : util.getTplPath('mine/createstore.step1'),
			controller : function($scope, $element, $attrs){
				$scope.cat = $scope.name = $scope.tel = {};

				KG.request.getAllStoreCategoryList({}, function(flag, rs){
					if(flag){
						$scope.$apply(function(){
							$scope.cat.list = _.map(rs, function(item){
								return {
									name : item.name,
									value : item.pk_id
								};
							});
							$scope.cat.value = rs[0].pk_id;
							F.changeCategory($scope.cat.value, $scope);
						});

					}
				});

				$scope.$watch('cat.value', function(val, old){
					console.log(val);

					if(val){
						F.changeCategory(val, $scope);
					}
				});

				_.extend($scope, {
					toggleCategoryDetail : function(index){
						$scope.cat.detail[index].active = !$scope.cat.detail[index].active;
					},

					submit : function(){

					}
				});
			}
		};
	}
]);

KG.App.directive('hwCreateStoreStep2', [
	function(){
		var F = {
			init : function($scope){
				$scope.city = $scope.address = $scope.zip = $scope.state = {};
			}
		};

		return {
			restrict : 'E',
			replace : true,
			templateUrl : util.getTplPath('mine/createstore.step2'),
			controller : function($scope, $element, $attrs){
				F.init($scope);
			}
		};
	}
]);