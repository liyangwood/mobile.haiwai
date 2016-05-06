
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
					},

					clickLoginBtn : function(){
						var email = $scope.login_email,
							pwd = $scope.login_password;

						KG.user.login({
							username : email,
							password : pwd
						}, function(user){
							console.log(user);
						});
					},
					clickRegBtn : function(){
						var email = $scope.reg_email,
							pwd = $scope.reg_password;
						if(!util.validate.email(email)){
							$scope.reg_email_error = '注册邮箱格式错误';
							return false;
						}
						else{
							$scope.reg_email_error = '';
						}

						if(!util.validate.password(pwd)){
							$scope.reg_password_error = '密码格式错误';
							return false;
						}
						else{
							$scope.reg_password_error = '';
						}
					}
				});
			}
		};
	}
]);