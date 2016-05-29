
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

							if($scope.initDefaultValue){
								$scope.initDefaultValue();

								$scope.initDefaultValue = null;
							}
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
						return item.pk_id;
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
			},

			setDefaultValue : function($scope, data){
				$scope.name.value = data.name;
				$scope.tel.value = data.tel;
				$scope.cat.value = data.category;

				$scope.initDefaultValue = function(){
					$scope.cat.detail = _.map($scope.cat.detail, function(one){
						if(_.contains(data.taglist, one.pk_id)){
							one.active = true;
						}

						return one;
					});
				};
			}
		};

		return {
			restrict : 'E',
			replace : true,
			templateUrl : util.getTplPath('mine/createstore.step1'),
			scope : {
				submitCallback : '&'
			},
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

							return false;
						}

						// store into localstorage
						util.storage.set('createstore-step1', data);


						$scope.submitCallback();
					}
				});
			}
		};
	}
]);

KG.App.directive('hwCreateStoreStep2', [
	function(){
		var C = {
			scope : null,
			elem : null
		};
		var F = {
			init : function($scope, $element){
				C.scope = $scope;
				C.elem = $($element);

				$scope.city = {};
				$scope.address = {};
				$scope.zip = {};
				$scope.state = {};

				$scope.timeinfo = {
					error : '',

					start : '',
					end : '',
					DAY : [],
					list : []
				};

				$scope.const = {
					timelist : [
						'休业',
						'04:00AM','04:30AM',
						'05:00AM','05:30AM','06:00AM','06:30AM','07:00AM','07:30AM','08:00AM','08:30AM',
						'09:00AM','09:30AM','10:00AM','10:30AM','11:00AM','11:30AM',

						'12:00PM','12:30PM',
						'01:00PM','01:30PM','02:00PM','02:30PM','03:00PM','03:30PM','04:00PM','04:30PM',
						'05:00PM','05:30PM','06:00PM','06:30PM','07:00PM','07:30PM','08:00PM','08:30PM',
						'09:00PM','09:30PM','10:00PM','10:30PM','11:00PM','11:30PM',
						'12:00AM','12:30AM',
						'01:00AM','01:30AM','02:00AM','02:30AM','03:00AM','03:30AM'

					],
					DAY : ['周一','周二','周三','周四','周五','周六','周日'],
					SD : [
						'monday',
						'tuesday',
						'wednesday',
						'thursday',
						'friday',
						'saturday',
						'sunday'
					]
				};

				F.initElement();
				F.resetTimeInfo();
			},

			initElement : function(){
				var zip = C.elem.find('.js_zip').find('input');

				zip.keyup(function(){
					var val = zip.val();
					if(val.length === 5){
						KG.request.getRegionInfoByZipcode({
							zip : val
						}, function(flag, rs){
							if(flag){
								C.scope.$apply(function(){
									if(rs.city){
										C.scope.city.value = rs.city;
									}
									if(rs.state){
										C.scope.state.value = rs.state;
									}
								});

							}
						});
					}
				});
			},


			resetTimeInfo : function(){
				C.scope.timeinfo.DAY = [
					{name : '周一', active : false},
					{name : '周二', active : false},
					{name : '周三', active : false},
					{name : '周四', active : false},
					{name : '周五', active : false},
					{name : '周六', active : false},
					{name : '周日', active : false}
				];

				C.scope.timeinfo.start = '08:00AM';
				C.scope.timeinfo.end = '09:00PM';

			},

			checkDayTime : function(dt){
				if(util.indexOf(dt, C.scope.const.timelist[0]) !== -1) return true;

				var st = dt[0],
					et = dt[1];
				st = {
					x : parseInt(st.substr(0, 2), 10),
					z : parseInt(st.substr(3, 2), 10),
					y : st.substr(5, 2)
				};

				var stt = st.x%12;
				if(st.y === 'PM'){
					stt = stt+12;
				}
				stt = stt*100+st.z;

				et = {
					x : parseInt(et.substr(0, 2), 10),
					z : parseInt(et.substr(3, 2), 10),
					y : et.substr(5, 2)
				};
				var ett = et.x%12;
				if(et.y === 'PM'){
					ett = ett+12;
				}
				ett = ett*100+et.z;

				console.log(stt,ett);
				if(ett > stt){
					return true;
				}


				return false;
			},

			dealWeektime : function(wt){
				var arr = [];
				util.each(wt, function(val, index){
					if(val=='1'){
						arr.push(C.scope.const.DAY[index]);
					}
				});

				return arr.join('  ');
			},
			dealDaytime : function(dt){
				var timelist = C.scope.const.timelist;

				if(util.indexOf(dt, timelist[0]) !== -1){
					return timelist[0];
				}

				if(dt[0] === '0' || dt[1] === '0'){
					return timelist[0];
				}
				return dt.join(' - ')
			},

			getFormData : function(){
				var ds1 = util.storage.get('createstore-step1');
				var rs = {
					bizName : ds1.name,
					bizTel : ds1.tel,
					bizTagId : ds1.category,
					tags : ds1.taglist.join(',')
				};

				rs.address = C.scope.address.value;
				rs.city = C.scope.city.value;
				rs.zip = C.scope.zip.value;
				rs.state = C.scope.state.value;

				rs.timeinfo = C.scope.timeinfo.list;


				return rs;
			},

			validate : function(data){
				if(!data.zip || data.zip.length < 5){
					C.scope.zip.error = '格式错误';
					return false;
				}
				else{
					C.scope.zip.error = '';
				}

				return true;
			}
		};

		var S = {
			addTimeList : function(){
				var d = C.scope.timeinfo;
				var daytime = [d.start, d.end],
					weektime = _.map(d.DAY, function(item){
						return item.active ? '1':'0';
					});


				if(!F.checkDayTime(daytime)){
					C.scope.timeinfo.error = '开始时间不能晚于结束时间';
					return false;
				}
				else if(!F.dealWeektime(weektime)){
					C.scope.timeinfo.error = '请选择每周时间';
					return false;
				}
				else{
					C.scope.timeinfo.error = '';
				}

				C.scope.timeinfo.list.push({
					daytimeData : F.dealDaytime(daytime),
					weektimeData : F.dealWeektime(weektime),
					daytime : daytime,
					weektime : weektime
				});
				console.log(C.scope.timeinfo.list);
				F.resetTimeInfo();
			},
			changeStartTime : function(){
				if(C.scope.timeinfo.start === C.scope.const.timelist[0]){
					C.scope.timeinfo.end = C.scope.const.timelist[0];
				}
			},
			changeEndTime : function(){
				if(C.scope.timeinfo.end === C.scope.const.timelist[0]){
					C.scope.timeinfo.start = C.scope.const.timelist[0];
				}
			},
			clickTimeinfoDate : function(item){
				item.active = !item.active;
			},
			deleteTimeinfoItem : function(index){
				C.scope.timeinfo.list.splice(index, 1);
			},


			submit : function(){
				var data = F.getFormData();
				if(!F.validate(data)){
					return false;
				}

				console.log(data);

				KG.helper.loading.show();
				KG.request.createStoreByStep1(data, function(flag, rs){
					KG.helper.loading.hide();
					console.log(flag, rs);
					if(flag){
						util.storage.set('createstore-step2-bizID', rs.entityID);
						C.scope.submitCallback(rs.entityID, rs);
					}
					else{
						KG.helper.toast(rs);
					}
				});
			}
		};

		return {
			restrict : 'E',
			replace : true,
			templateUrl : util.getTplPath('mine/createstore.step2'),
			scope : {
				submitCallback : '='
			},
			controller : function($scope, $element, $attrs){
				F.init($scope, $element);

				_.extend($scope, S);

			}
		};
	}
]);

KG.App.directive('hwCreateStoreStep3', [
	'$q',
	'$ionicActionSheet',
	function($q, $ionicActionSheet){
		var C = {
			scope : null,
			elem : null,

			bizID : util.storage.get('createstore-step2-bizID')
		};
		var F = {
			init : function(scope, elem){
				C.scope = scope;
				C.elem = $(elem);

				if(!C.bizID){
					C.scope.errorParamCallback();
					return false;
				}

				C.scope.logo = {};
				C.scope.imageList = [];
				C.scope.desc = {};

				C.scope.loadingImageList = [];

				F.initElement();
			},
			initElement : function(){
				var logo = C.elem.find('.js_logo');
				logo.bind('change', function(){
					var file = this.files[0];
					if(!file) return false;

					var fr = new FileReader();
					fr.onload = function(e){
						KG.helper.loading.show('正在上传店铺头像');
						var binary = e.target.result;

						KG.helper.zipLocalImage(binary, file.type, function(nb){
							//create
							KG.request.uploadTmpBizLogo({
								type : 'tmp',
								bizId : C.bizID,
								image : nb
							}, function(flag, rs){
								KG.helper.loading.hide();

								if(flag){
									KG.helper.toast('上传成功');
									C.scope.logo.value = KG.config.SiteRoot + rs.files[0];
								}
								else{
									KG.helper.toast(rs);
								}
							});
						});

					};
					fr.readAsDataURL(file);
				});

				var glist = C.elem.find('.js_glist');
				glist.bind('change', function(){
					var deferList = [];

					var files = this.files,
						arr = [];
					_.each(files, function(one){
						var defer = $q.defer();

						var fr = new FileReader();

						C.scope.$apply(function(){
							C.scope.loadingImageList.push('loading');
						});

						fr.onload = function(e){
							var binary = e.target.result;
							KG.helper.zipLocalImage(binary, one.type, function(nb){

								KG.request.uploadStoreImage({
									type : 'tmp',
									bizId : C.bizID,
									image : [nb]
								}, function(flag, rs){
									defer.resolve();
									if(flag){
										var tmp = _.map(rs.files, function(src){
											return KG.config.SiteRoot+src;
										});

										console.log(tmp);

										if(C.scope.loadingImageList.length > 0){
											C.scope.loadingImageList.splice(0, 1);
										}

										C.scope.imageList = tmp.concat(C.scope.imageList);



									}
									else{
										KG.helper.toast(rs);
									}

								});

							});
						};
						fr.readAsDataURL(one);

						deferList.push(defer.promise);
					});

					//KG.helper.loading.show('正在上传图片');
					$q.all(deferList).then(function(){
						KG.helper.toast('上传成功');
					});

					glist.val('');
				});

			},
			getFormData : function(){
				return {
					description : C.scope.desc.value,
					logo : C.scope.logo.value,
					imageList : C.scope.imageList
				};
			}
		};
		var S = {
			submit : function(){
				var data = F.getFormData();

				KG.helper.loading.show('正在创建店铺');

				var createStore = function(){
					KG.request.createStoreByStep3({
						bizTmpId : C.bizID,
						logo : data.logo,
						imageList : data.imageList
					}, function(flag, rs){
						KG.helper.loading.hide();
						util.storage.set('createstore-step2-bizID', null);
						if(flag){
							KG.helper.toast('店铺创建成功');
							_.delay(function(){
								C.scope.submitCallback();
							}, 500);
						}
						else{
							KG.helper.toast(rs);
						}
					});
				};

				if(data.description){
					KG.request.createStoreByStep2({
						bizTmpId : C.bizID,
						description : data.description
					}, function(flag, rs){
						createStore();
					});
				}
				else{
					createStore();
				}
			},
			deleteImage : function(index){
				var hide = $ionicActionSheet.show({
					buttons: [
						{
							text : '删除图片'
						}
					],
					//titleText: '',
					cancelText: '关闭',
					cancel: function(){
						// add cancel code..
					},
					buttonClicked : function(n){
						hide();
						C.scope.imageList.splice(n, 1);
					}
				});
			}
		};

		return {
			restrict : 'E',
			replace : true,
			templateUrl : util.getTplPath('mine/createstore.step3'),
			scope : {
				submitCallback : '=',
				errorParamCallback : '&'
			},

			controller : function($scope, $element, $attrs){
				F.init($scope, $element);

				_.extend($scope, S);
			}
		};
	}
]);