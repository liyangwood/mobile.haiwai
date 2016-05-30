

KG.App.factory('$helper', function(
    $ionicLoading,
    $window,
    $location,
    $state,
    $http,
    $ionicPopup,

    $ionicScrollDelegate,
    $cordovaCamera,
    $cordovaToast,
    $cordovaGeolocation,
    $cordovaAppVersion,
    $cordovaInAppBrowser,
    $cordovaDialogs,
    $ionicActionSheet,
    $cordovaKeyboard
){

    var WEIXIN_INSTALL = null,


        END = null;

    var F = {
        init : function(){
            if($window.navigator.userAgent.indexOf('MicroMessenger')>0)
                F.initWeiXinConfig();
            console.log('helper init success');
        },

        initWeiXinConfig : function(){
            $http.get('http://130.211.186.174/wxapi/js_ticket?url='+encodeURIComponent($window.location.href.replace(location.hash, '')), {}).then(function(rs){
                var config = rs.data;
                $window.wx.paramConfig = config;
                $window.wx.config({
                    debug : false,
                    appId : config.appId,
                    timestamp : config.timestamp,
                    nonceStr : config.nonceStr,
                    signature : config.signature,
                    jsApiList : config.jsApiList
                });

                console.log('init weixin');
                $window.wx.error(function(res){

                });
            });


        },

        setWeixinShare : function(opts){
            var content = opts.description,
                title = opts.title;

            var desc = '海外同城 | haiwai.com',
                imgUrl = 'http://www.haiwai.com/pc/image/haiwai1.png';
            try{
                desc = content.replace(/\n/g,'').replace(/<[^>]+>/gm, '').substr(0, 60);
                var reg = /<img[^>]*src="([^"]*)"[^>]*>/gm;

                var tmp;
                if(tmp = reg.exec(content.replace(/\n/g,''))){
                    imgUrl = tmp[1];
                }
            }catch(e){}

            console.log(title, desc, opts.image||imgUrl);

            var wx = KG.helper.getWeixinObject();
            wx.ready(function(){

                wx.onMenuShareAppMessage({
                    title: title, // 分享标题
                    desc: desc, // 分享描述
                    link: $window.location.href, // 分享链接
                    imgUrl: opts.image || imgUrl, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空

                    trigger: function (res) {
                    },
                    success: function () {
                    },
                    cancel: function () {
                    }
                });


            });
        },

        getWeixinObject : function(){
            return $window.wx;
        },


        alert : function(str, callback){
            callback = callback || util.noop;

            if(!util.inDevice()){
                $window.alert(str);
                callback();
                return;
            }

            $cordovaDialogs.alert(str, '提示信息', '确定').then(callback);
        },

        getAppVersion : function(callback){
            if(!util.inDevice()){
                callback('1.1.1');
                return;
            }

            if(KG.config.App_Version){
                callback(KG.config.App_Version);
                return;
            }
            $cordovaAppVersion.getAppVersion().then(function(version){
                KG.config.App_Version = version;
                callback(version);
            });
        },


        openUrl : function(url, opts){
            var setting = {
                location: 'no',
                clearcache: 'yes',
                toolbar: 'yes',
                toolbarposition : 'top'
            };
            $cordovaInAppBrowser.open(url, '_blank', setting);
        },

        reload : function(){
            $state.reload();
        },

        reloadToIndex : function(){
            $window.location.href = 'index.html';
        },

        goPath : function(path){
            $location.path(path);
        },

        goTop : function(){
            $ionicScrollDelegate.scrollTop(true)
        },


        checkUpdateForIos : function(){
            if(!util.isIOS()) return;

            //var url = 'http://itunes.apple.com/lookup?id='+KG.config.appleAppId;
        },

        checkWeixinInstall : function(callback){
            if(!util.inDevice()){
                return callback(false);
            }
            if(!util.isNull(WEIXIN_INSTALL)){
                return callback(WEIXIN_INSTALL);
            }

            // check weixin is install
            if(util.inDevice()){
                Wechat.isInstalled(function(installed){
                    if(installed){
                        WEIXIN_INSTALL = true;
                    }
                    else{
                        WEIXIN_INSTALL = false;
                    }
                    callback(WEIXIN_INSTALL);
                }, function (reason) {
                    alert(reason);
                    KG.helper.toast(reason);
                    WEIXIN_INSTALL = false;
                    callback(WEIXIN_INSTALL);
                });
            }
        },

        loginWithWeixin : function(callback){
            var scope = "snsapi_userinfo";
            Wechat.auth(scope, function (response) {
                //TODO 这里的逻辑以后要放在server上处理，隐藏secret，不能在client处理
                var code = response.code;
                var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+KG.config.appid+'&secret='+KG.config.appsecret+'&code='+code+'&grant_type=authorization_code';

                $http.get(url).success(function(rs){

                    var url = 'https://api.weixin.qq.com/sns/userinfo?access_token='+rs.access_token+'&openid='+rs.openid;

                    $http.get(url).success(function(data){
                        KG.helper.alert(JSON.stringify(data));


                        callback(data);
                    });

                });


            }, function (reason) {
                KG.helper.toast(reason);
            });
        },

        getNewImageBySize : function(url, opts){
            var width = opts.width || 50,
                height = opts.height || 50;

            return KG.config.SiteRoot + '/images/'+width+'/'+height+url;
        },

        getWeixinShareImage : function(path){
            if(/^http/.test(path)){
                return path;
            }

            return F.getNewImageBySize(path, {});
        },

        rotateImg : function(img, direction, canvas){
            //alert(img);
            //最小与最大旋转方向，图片旋转4次后回到原方向
            var min_step = 0;
            var max_step = 3;
            //var img = document.getElementById(pid);
            if (img == null)return;
            //img的高度和宽度不能在img元素隐藏后获取，否则会出错
            var height = img.height;
            var width = img.width;
            //var step = img.getAttribute('step');
            var step = 2;
            if (step == null) {
                step = min_step;
            }
            if (direction == 'right') {
                step++;
                //旋转到原位置，即超过最大值
                step > max_step && (step = min_step);
            } else {
                step--;
                step < min_step && (step = max_step);
            }
            //img.setAttribute('step', step);
            /*var canvas = document.getElementById('pic_' + pid);
             if (canvas == null) {
             img.style.display = 'none';
             canvas = document.createElement('canvas');
             canvas.setAttribute('id', 'pic_' + pid);
             img.parentNode.appendChild(canvas);
             }  */
            //旋转角度以弧度值为参数
            var degree = step * 90 * Math.PI / 180;
            var ctx = canvas.getContext('2d');
            switch (step) {
                case 0:
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0);
                    break;
                case 1:
                    canvas.width = height;
                    canvas.height = width;
                    ctx.rotate(degree);
                    ctx.drawImage(img, 0, -height);
                    break;
                case 2:
                    canvas.width = width;
                    canvas.height = height;
                    ctx.rotate(degree);
                    ctx.drawImage(img, -width, -height);
                    break;
                case 3:
                    canvas.width = height;
                    canvas.height = width;
                    ctx.rotate(degree);
                    ctx.drawImage(img, -width, 0);
                    break;
            }
        },

        zipLocalImage : function(binary, type, callback){
            var image = new Image();
            image.src = binary;
            image.onload = function(){


                var canvas = document.createElement('canvas');
                var max_size = 600,
                    width = image.width,
                    height = image.height;
                if (width > height) {
                    if (width > max_size) {
                        height *= max_size / width;
                        width = max_size;
                    }
                } else {
                    if (height > max_size) {
                        width *= max_size / height;
                        height = max_size;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(image, 0, 0, width, height);


                //根据exif信息处理图片方向
                EXIF.getData(image, function(){
                    var a = EXIF.getAllTags(this);

                    if(a.Orientation){
                        switch(a.Orientation){
                            case 6:
                                KG.helper.rotateImg(image, 'left', canvas);
                                break;
                            case 8:
                                KG.helper.rotateImg(image, 'right', canvas);
                                break;
                            case 3:
                                KG.helper.rotateImg(image, 'right', canvas);
                                KG.helper.rotateImg(image, 'right', canvas);
                                break;
                        }
                    }

                    var dataUrl = canvas.toDataURL('image/jpeg');
                    console.log(dataUrl.length);
                    callback(dataUrl);
                });


            };


        }
    };


    F.popup = {

        /*
         * popup.confirm
         * @param opts.title
         * @param opts.text
         * @param opts.Yes {text:, callback: }
         * #param opts.No {text:, callback: }
         * */
        showConfirm : function(opts){
            opts = util.extend({
                title : '信息提示',
                text : '',
                okText : '确定',
                cancelText : '取消'
            }, opts||{});

            if(util.inDevice()){

                //在APP中，使用native方式
                $cordovaDialogs.confirm(opts.text, opts.title, [opts.cancelText, opts.okText]).then(function(buttonIndex){
                    if(buttonIndex === 2){
                        opts.Yes();
                    }
                    else if(buttonIndex === 1){
                        if(opts.No){
                            opts.No();
                        }
                    }
                });

                return;
            }


            var confirmPopup = $ionicPopup.confirm({
                title: opts.title,
                template: opts.text,
                okText : opts.okText,
                cancelText : opts.cancelText
            });
            confirmPopup.then(function(res) {
                if(res) {
                    opts.Yes();

                } else {
                    if(opts.No){
                        opts.No();
                    }
                }
            });
        }

        //TODO 把alert也迁移过来
    };

    F.keyboard = {
        close : function(){
            try{
                $cordovaKeyboard.close();
            }catch(e){}
        }
    };

    F.loading = {
        show : function(str, opts){
            str = str || '';
            angular.extend({}, opts||{});

            $ionicLoading.show({
                template : '<ion-spinner style="stroke: #fff;" icon="ios-small"></ion-spinner><span style="position: relative;top: -8px;">'+str+'</span>'
            });
        },
        hide : function(){
            $ionicLoading.hide();
        }
    };

    F.toast = function(str){
        if(util.inDevice()){
            $cordovaToast.show(str, 'short', 'bottom');

            return;
        }

        $ionicLoading.show({
            template : str,
            noBackdrop : true,
            duration : 1000
        });
    };

    /*
     * 一些测试性能或效率的方法，只在调试阶段使用
     * */
    F.test = {
        getWatchersSize : function(){
            var $ = angular.element;
            var root = $(document.getElementsByTagName('body'));
            var watchers = [];

            var f = function (element) {
                if (element.data().hasOwnProperty('$scope')) {
                    angular.forEach(element.data().$scope.$$watchers, function (watcher) {
                        watchers.push(watcher);
                    });
                }

                angular.forEach(element.children(), function (childElement) {
                    f($(childElement));
                });
            };

            f(root);

            //util.log(watchers);

            return watchers.length;
        }
    };


    F.data = {


        saveCurrentUser : function(data){
            var key = 'hw-current-user';
            util.storage.set(key, data);
        },
        getCurrentUser : function(){
            return util.storage.get('hw-current-user');
        }
    };

    function getCacheKey(key){
        return 'hw-cache-'+key;
    }
    F.cache = {
        save : function(key, data){
            util.cache.set(getCacheKey(key), data);
        },
        get : function(key){
            return util.cache.get(getCacheKey(key));
        }
    };


    F.camera = {
        check : function(){
            if(!navigator.camera){
                F.toast('没有照相机环境');
                return false;
            }

            return true;
        },

        getPicture : function(opts, successFn, failFn){
            if(!this.check()) return;

            var options = {
                quality: 5,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: false,
                encodingType: Camera.EncodingType.PNG,
                targetWidth: 480,
                targetHeight: 400,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            opts = util.extend(options, opts||{});

            $cordovaCamera.getPicture(opts).then(successFn, failFn||util.noop);
        },

        getFromLibrary : function(opts, successFn, failFn){
            this.getPicture(opts, successFn, failFn);
        },
        getFromCamera : function(opts, successFn, failFn){
            opts = opts || {};
            opts.sourceType = Camera.PictureSourceType.CAMERA;

            this.getPicture(opts, successFn, failFn);
        },


        dataURIToBlob : function(dataURI){
            var byteString = atob(dataURI.split(',')[1]);
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++)
            {
                ia[i] = byteString.charCodeAt(i);
            }

            var bb = new Blob([ab], { "type": mimeString });
            return bb;
        }

    };

    F.geolocation = {
        getPosition : function(opts, successFn, failFn){
            if(!util.inDevice()){
                F.toast('无法获得当前位置');
                return;
            }

            var posOptions = {
                timeout: 10000,
                enableHighAccuracy: false
            };
            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                F.toast(position.coords.latitude+' - '+position.coords.longitude);
                successFn(position);
            }, failFn||util.noop);
        }
    };

    F.share = {
        showBox : function(opts){

            return false;

            var pyqBtn = { text: '微信朋友圈', id : 'wx_pyq'},
                hyBtn = { text: '微信好友', id : 'wx_hy'},
                sqBtn = { text: '添加到书签', id : 'bookmark'},
                fbBtn = { text: 'Facebook', id : 'fb'},
                xtBtn = { text: '更多', id : 'system'};
            var buttons = null;
            if(!util.inDevice()){
                buttons = [sqBtn];
            }
            else{
                if(ionic.Platform.isIOS()){
                    buttons = [pyqBtn, hyBtn, fbBtn, sqBtn, xtBtn];
                }
                else if(ionic.Platform.isAndroid()){
                    buttons = [pyqBtn, hyBtn, sqBtn, xtBtn];
                }
                else{
                    buttons = [sqBtn];
                }
            }


            var hideSheet = $ionicActionSheet.show({
                buttons: buttons,
                //destructiveText: 'Delete',
                titleText: '<b>分享</b>',
                cancelText: '关闭',
                cancel: function() {
                    // add cancel code..
                },
                buttonClicked: function(index) {
                    switch(buttons[index]['id']){
                        case 'bookmark':
                            F.share.toMyBookmarkList(opts);
                            break;
                        case 'wx_pyq':
                            F.share.toWechatTimeline(opts);
                            break;
                        case 'wx_hy':
                            F.share.toWechatSession(opts);
                            break;
                        case 'fb':
                            F.share.toFacebook(opts);
                            break;
                        case 'system':
                            F.share.toSystemShare(opts);
                            break;

                    }

                    return true;
                }
            });

            return hideSheet;

        },

        toWechat : function(target, opts){
            if(util.isUndefined(window.Wechat)){
                F.toast('当前环境不能分享');
                return false;
            }

            var config = util.extend({
                title : '',
                description : '',
                url : '',
                success : util.noop,
                error : util.noop
            }, opts||{});

            var successFn = config.success,
                errorFn = config.error;

            target = target || 'FAVORITE';

            Wechat.share({
                message: {
                    title: config.title,
                    description: config.description,
                    //mediaTagName: "wenxuecity",
                    //thumb: "www/image/logo-20140515.png",
                    media: {
                        type: Wechat.Type.WEBPAGE,
                        webpageUrl: config.url
                    }
                },
                scene: Wechat.Scene[target]
            }, function () {
                util.log('share success');
                F.toast('分享成功');

                successFn();
            }, function (reason) {
                F.toast(reason);
                errorFn(reason);
            });


        },

        //到微信朋友圈
        toWechatTimeline : function(opts){
            return this.toWechat('TIMELINE', opts);
        },


        //到微信好友
        toWechatSession : function(opts){
            return this.toWechat('SESSION', opts);
        },


        toSystemShare : function(opts){
            if(!util.inDevice()){
                F.toast('当前环境不能分享');
                return false;
            }
            window.plugins.socialsharing.share(opts.title, opts.title, null, opts.url);
        },

        toFacebook : function(opts){
            if(!util.inDevice()){
                F.toast('当前环境不能分享');
                return false;
            }

            // title, img, url, successFn, errorFn
            window.plugins.socialsharing.shareViaFacebook(
                opts.title,
                null,
                opts.url,
                function(){
                    F.toast('分享成功');
                }, function(error){
                    F.toast('分享失败');
                    util.error(error);
                }
            );
        }

    };



    F.biz = {
        fullAddress : function(biz){
            var rs = '';
            if(biz.address){
                rs += biz.address + ', ';
            }
            if(biz.city){
                rs += biz.city + ', ';
            }
            if(biz.state){
                rs += biz.state + ' ';
            }
            if(biz.zip){
                rs += biz.zip
            }

            return rs;
        },

        formatPhone : function(num){
            var rs = num.toString().split('');
            rs.splice(3, 0, '-');
            rs.splice(7, 0, '-');
            return rs.join('');
        }
    };



    KG.helper = F;
    return F;
});
