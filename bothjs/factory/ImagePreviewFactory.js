KG.App.factory('ImagePreviewFactory', [
	'$rootScope',
	'$ionicModal',
	'$ionicSlideBoxDelegate',
	function($rootScope, $ionicModal, $ionicSlideBoxDelegate){
		var modal = null;
		var modalScope = null;

		var F = {
			initModal : function(){
				if(modalScope) return modalScope;


				modalScope = $rootScope.$new();

				modalScope.closeModal = function(){
					modal.hide();
				};
				modalScope.slideTo = function(n){

					modalScope.currentIndex = n;

				};

				modalScope.$on('modal.hidden', function() {
					util.delay(function(){
						modalScope.currentIndex = 0;
					}, 1000);

				});

				$ionicModal.fromTemplateUrl(util.getTplPath('modal/ImagePreviewModal'), {
					scope : modalScope,
					animation : 'slide-in-up'
				}).then(function(obj){
					modal = obj;
				});



				return modalScope;

			},
			setData : function(src, data){
				var n = util.indexOf(data, src);
				//util.log(n);

				if(!modalScope){
					F.initModal();
				}
				modalScope.data = data;
				//modalScope.currentIndex = n;
				modalScope.slideTo(n);
			}
		};

		return {
			show : function(src, allData){
				F.setData(src, allData);

				if(modal){
					modal.show();
				}
				else{
					util.delay(function(){
						modal.show();
					}, 500);
				}
			}
		};
	}
]);