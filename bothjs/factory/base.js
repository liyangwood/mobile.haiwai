'use strict';

KG.App.factory('LoginBox', [
	'$helper',
	'$rootScope',
	'$ionicModal',
	function($helper, $rootScope, $ionicModal){

		var modal = null,
			modalSetting = {},
			modalScope = null;

		var user = KG.user.get();

		var F = {
			init : function(){

			},

			initModal : function(){
				if(modalScope) return;
				modalScope = $rootScope.$new();



				$ionicModal.fromTemplateUrl(util.getTplPath('modal/UserLoginModal'), {
					scope : modalScope,
					focusFirstInput : true,
					animation : 'slide-in-up'
				}).then(function(obj){
					modal = obj;
				});

				modalScope.username = user.username;
				modalScope.password = user.password;

				//modalScope.style = {
				//	top : util.getStatusBarHeight()+'px'
				//};

				util.extend(modalScope, {
					openModal : function(){
						modal.show();
					},
					closeModal : function(){
						modal.hide();
						modal.remove();
						modal = null;
						modalScope = null;
					},
					loginSuccessCallback : function(){

						modalScope.closeModal();

						modalSetting.loginSuccessCallback();
					},
					registerSuccessCallback : function(){
						modalScope.closeModal();
						modalSetting.loginSuccessCallback();
					},
					showCloseButton : modalSetting.showCloseButton
				});

				//Cleanup the modal when we're done with it!
				modalScope.$on('$destroy', function() {
					modal.remove();
				});

			},

			showModal : function(opts){
				modalSetting = opts;
				if(!modal){
					this.initModal();
					util.delay(function(){
						F.showModal(opts);
					}, 200);
				}
				else{

					modal.show();
				}
			}
		};

		var out = {


			showLoginModal : function(opts){
				opts = util.extend({
					loginSuccessCallback : util.noop,
					loginErrorCallback : util.noop,
					registerSuccessCallback : util.noop,

					showCloseButton : true
				}, opts||{});

				F.showModal(opts);
			},
			closeLoginModal : function(){
				modalScope.closeModal();
			}
		};


		F.init();
		return out;
	}
]);