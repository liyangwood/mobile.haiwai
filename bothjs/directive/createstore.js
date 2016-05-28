
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
				var arr = _.filter($scope.cat.detail, function(item){
					return !!item.active;
				});
				var data = {
					name : $scope.name.value,
					tel : $scope.tel.value,
					category : $scope.cat.value,
					taglist : _.map(arr, function(item){
						return item.name;
					})
				};
				console.log(data);

				return data;
			},

			validate : function($scope, data){
				var f = true;
				if(!data.name){
					$scope.name.error = '请输入名称';
					f = false;
				}
				else{
					$scope.name.error = '';
				}

				if(!util.validate.AmericanPhone(data.tel)){
					$scope.tel.error = '电话格式不正确';
					f = false;
				}
				else{
					$scope.tel.error = '';
				}

				if(!data.category){
					$scope.cat.error = '请选择店铺类别';
					f = false;
				}
				else{
					$scope.cat.error = '';
				}

				return f;
			}
		};

		return {
			restrict : 'E',
			replace : true,
			templateUrl : util.getTplPath('mine/createstore.step1'),
			controller : function($scope, $element, $attrs){
				$scope.cat = {};
				$scope.name = {};
				$scope.tel = {};


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
						var data = F.getFormData($scope);
						if(!F.validate($scope, data)){
							KG.helper.goTop();
						}
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