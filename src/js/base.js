var Public = {
    languageType: 'zh',
    turnOut: function (code) {

        try {

            var mobileSystem = Public.isMobile();

            if (!mobileSystem.weixin) {

                if (mobileSystem.ios) {
                    ios_onResultCode(code);
                } else if (mobileSystem.android) {
                    Android.onResultCode(code);
                }

            } else {
                window.location.href = 'login.html';
            }

        } catch (e) {

            window.location.href = 'login.html';

        }


    },
    setCookie: function (key, value, iDay) {
        // var oDate = new Date();
        //     oDate.setDate(oDate.getDate() + iDay);
        document.cookie = key + '=' + value + ';';
    },
    getCookie: function (key) {
        var cookieArr = document.cookie.split('; ');
        for (var i = 0, len = cookieArr.length; i < len; i++) {
            var arr = cookieArr[i].split('=');
            if (arr[0] === key) {
                return arr[1];
            }
        }
        return false;
    },
    clearAllCookie: function () {
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;)
                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
        }
    },
    isMobile: function () {

        var u = navigator.userAgent,
            app = navigator.appVersion;

        return {
            // trident: u.indexOf('Trident') > -1, //IE内核
            // presto: u.indexOf('Presto') > -1, //opera内核
            // webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            // gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            // mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
            // iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            // iPad: u.indexOf('iPad') > -1, //是否iPad
            // webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
            // qq: u.match(/\sQQ/i) == " qq" //是否QQ
        };
    },
    //值判断
    isDefine: function (value) {
        if (value === null || value === "" || value === undefined || typeof (value) === 'undefined' || value === 0) {
            return false;
        } else {
            value = value + "";
            value = value.replace(/\s/g, "");
            if (value == "") {
                return false;
            }
            return true;
        }
    },
    // 判断数据组是否有值
    isArry: function (arr) {
        return JSON.parse(arr).length === 0 ? false : true;
    },
    // 输入框清空按钮
    inputClean: function () {

        $('input').attr('required', 'required');
        setTimeout(function () {
            $('input[required]').each(function () {
                $(this).after('<div class="iss-close"><i class="iconfont icon-shanchu"></i></div>');
            });
        }, 300);

        $('body').on('click', '.iss-close', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).prev('input').val('');
        });

    },
    // 数组去重
    uniqueArray: function (data) {
        data = data || [];
        var a = {};
        for (var i = 0, len = data.length; i < len; i++) {
            var v = data[i];
            if (typeof (a[v]) == 'undefined') {
                a[v] = 1;
            }
        };
        data.length = 0;
        for (var pop in a) {
            data[data.length] = pop;
        }
        return data;
    },
    /********** 校验正则 *************/
    // 只能输入字母或数字
    checkLetNum: function (obj) {
        return obj.value.replace(/[^A-Za-z0-9]/g, '');
    },
    // 数字，英文，中文
    checkInputVal: function (val) {
        return val.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '');
    },
    /************* 弹窗选择 ***************/
    msuiPicker: function (params) {
        $(params.obj).picker({
            cols: [{
                textAlign: params.textAlign,
                values: params.values
            }]
        });
    },
    msuiConfirm: function (info, okFn) {
        $.confirm(info, okFn);
    },
    msuiAlert: function (info) {
        $.alert(info);
    },
    toast: function (info) {
        $.toast(info);
    },
    customToast: function (info) {

        var $toast = $('<div class="custom-toast">' + info + '</div>');

        $toast.appendTo(document.body);
        $toast.show();
        setTimeout(function () {
            $toast.addClass('fade-in');
        }, 50);

        setTimeout(function () {
            $toast.addClass('fade-out').remove();
        }, 800);

    },
    popup: function (popup) {
        $.popup(popup);
    },
    closeModal: function (popup) {
        $.closeModal(popup);
    },
    //遮罩
    showMask: function () {
        var $layout = $('.custom-overlay');

        $layout.show();

        setTimeout(function () {

            $layout.addClass('fade-in');

        }, 50);
    },
    hideMask: function () {
        var $layout = $('.custom-overlay');

        $layout.addClass('fade-out');

        setTimeout(function () {

            $layout.hide();
            $layout.removeClass('fade-out').removeClass('fade-in');

        }, 300);
    },
    /*************** 日期格式化插件(moment.min封装) ***************/
    // 时间戳格式化 （YYYY-MM-DD HH:mm:ss）
    momentFormat: function (time, format) {
        return moment(time).format(format);
    },
    // 开始时间在结束时间之前
    momentIsBefor: function (starDate, endDate) {
        return moment(starDate).isBefore(endDate);
    },
    /**
     * 开始时间是否在结束时间之前
     */
    momentIsBefore: function (params) {
        return moment(params.starDate).isBefore(params.endDate);
    },
    momentIsSame: function (params) {
        return moment(params.starDate).isSame(params.endDate);
    },
    /************* 日期插件 ***************/
    // 日期
    datetimePicker: function (params) {
        var datetimePicker = $(params.obj).datetimePicker({
            value: params.value,
            format: params.format
        });
        return datetimePicker
    },
    // 日历
    calendar: function (obj, params) {
        $(obj).calendar(params);
    },
    /*************** loading加载器 ***************/
    // 显示
    showPreloader: function (info) {
        $.showPreloader(info);
    },
    // 隐藏
    hidePreloader: function () {
        $.hidePreloader();
    },
    showPageInitLoading: function () {
        $('.list-init-refresh-layer-wrap').show();
    },
    hidePageInitLoading: function () {
        $('.list-init-refresh-layer-wrap').hide();
    },
    /*************** ajax封装 ***************/
    ajaxCall: function (params) {

        $.ajax({
            type: params.type,
            url: params.url,
            data: params.data,
            dataType: 'json',
            beforeSend: function (xhr) {

                xhr.setRequestHeader("Token", "sso1122334455xmnds");
                xhr.setRequestHeader("UserName", "admin");
                // xhr.setRequestHeader("token", Public.getCookie('token'));
                // xhr.setRequestHeader("username", Public.getCookie('username'));

            },
            success: function (data) {

                if (data) {

                    if (data.code > 0) {

                        params.successCallBack(data);

                    } else if (data.code === -9001) {

                        try {

                            Public.customToast(data.response);

                        } catch (e) {

                            Editer_stage.tool.toast(data.response);

                        }
                        setTimeout(function () {

                            Public.turnOut(data.code);

                        }, 500);

                        if (params.errorCallBack) params.errorCallBack(data);

                    } else {

                        try {

                            Public.customToast(data.response);

                        } catch (e) {

                            Editer_stage.tool.toast(data.response);

                        }

                        if (params.errorCallBack) params.errorCallBack(data);

                    }

                }

            },
            error: function (xhr, type) {

                if (params.errorCallBack) params.errorCallBack(xhr, type);

            }
        })

    },
    /*************** swiper预览 ***************/
    swiper: function (data, obj, initialSlide) {

        var mySwiper = null,
            shtml = '';

        for (var i = 0, len = data.length; i < len; i++) {

            shtml += '<div class="swiper-slide"><div class="slide-item swiper-lazy" style="background-image: url(./../images/loading.gif);" data-background="' + data[i].currentSrc + '"></div></div>';
            // shtml += '<div class="swiper-slide"><img src="' + data[i].currentSrc+'"/></div>';  style="background-image: url(' + data[i].currentSrc + ');"
        }

        $(obj).html('');
        $(obj).append(shtml);

        mySwiper = new Swiper('.swiper-container', {
            autoplay: false,
            autoHeight: false,
            slidesPerView: 'auto',
            pagination: '.swiper-pagination',
            paginationType: 'fraction',
            initialSlide: initialSlide,
            observer: true, //修改swiper自己或子元素时，自动初始化swiper
            observeParents: true, //修改swiper的父元素时，自动初始化swiper
            width: window.innerWidth,
            height: 100,
            lazyLoading: true,
            onInit: function (swiper) {

                $('#preview-view').show().addClass('preview-in');

                setTimeout(function () {

                    swiper.slideTo(initialSlide, 0, false);

                }, 100);


            }
        });

        // $('#preview-view').show().addClass('preview-in');

    },
    formatFileSize: function (fileSize) {
        if (fileSize < 1024) {
            return fileSize + 'B';
        } else if (fileSize < (1024 * 1024)) {
            var temp = fileSize / 1024;
            temp = temp.toFixed(2);
            return temp + 'KB';
        } else if (fileSize < (1024 * 1024 * 1024)) {
            var temp = fileSize / (1024 * 1024);
            temp = temp.toFixed(2);
            return temp + 'MB';
        } else {
            var temp = fileSize / (1024 * 1024 * 1024);
            temp = temp.toFixed(2);
            return temp + 'GB';
        }
    },
    isCommon: function (data) {
        if (data == 2) {
            return "<font color='red'>私有</font>";
        } else if (data == 1) {
            return "<font color='green'>公开</font>";
        }
    },
    isStatus: function (data) {
        if (data == 2) {
            return "<font color='green'>已审核</font>";
        } else {
            return "<font color='red'>未审核</font>";
        }
    },
    isTaskStatue: function (data) {
        if (data == 0) {
            return "<font color='blue'>待处理</font>";
        } else if (data == 1) {
            return "<font color='orange'>正在处理</font>";
        } else if (data == 2) {
            return "<font color='green'>处理成功</font>";
        } else if (data == 3) {
            return "<font color='red'>处理失败</font>";
        } else if (data == 4) {
            return "<font color='red'>异常</font>";
        } else if (data == 5) {
            return "<font color='red'>未审核</font>";
        }
    },
    isPramStatue: function (value) {

        if (value == 10) {
            return "设备开屏";
        } else if (value == 40) {
            return "设备关屏";
        } else if (value == 50) {
            return "设备重启";
        } else if (value == 80) {
            return "同步时钟";
        } else if (value == 90) {
            return "音量调整";
        } else if (value == 100 || value == 101) {
            return "亮度调整";
        } else if (value == 110) {
            return "截屏";
        } else if (value == 120) {
            return "日志上传";
        } else if (value == 60) {
            return "系统升级";
        } else if (value == 70) {
            return "软件升级";
        } else if (value == 140) {
            return "下发频道";
        } else if (value == 150) {
            return "下发节目";
        } else if (value == 130) {
            return "策略设置";
        } else if (value == 20) {
            return "设备待机";
        } else if (value == 180) {
            return "开启播放";
        } else if (value == 190) {
            return "紧急停播";
        } else if (value == 121) {
            return "日志下载";
        } else if (value == 160) {
            return "插播节目";
        } else if (value == 170) {
            return "插播字幕";
        } else if (value == 30) {
            return "设备开机";
        } else if (value == 135) {
            return "围栏任务";
        } else if (value == 125) {
            return "删除频道";
        } else if (value == 126) {
            return "删除节目";
        } else if (value == 127) {
            return "更新设备节目信息";
        } else if (value == 128) {
            return "删除围栏";
        } else if (value == 129) {
            return "更新设备围栏信息";
        } else if (value == 65) {
            return "Model升级";
        } else if (value == 400) {
            return "清理缓存";
        } else if (value == 210) {
            return "设置板卡参数";
        } else if (value == 230) {
            return "固件升级";
        } else if (value == 240) {
            return "更新配置文件";
        } else if (value == 260) {
            return "GPS开关";
        } else if (value == 801) {
            return "输入源切换";
        } else if (value == 804) {
            return "局部全屏";
        } else if (value == 810) {
            return "亮度";
        } else if (value == 802) {
            return "画面冻结";
        } else if (value == 803) {
            return "黑屏";
        } else if (value == 814) {
            return "PIP（画中画）";
        } else if (value == 845) {
            return "场景";
        } else if (value == 277) {
            return "信号源回显";
        } else if (value == 265) {
            return "节目点播";
        } else if (value == 266) {
            return "节目停播";
        } else if (value == 280) {
            return "日志开关";
        } else if (value == 285) {
            return "音频开关";
        } else if (value == 829) {
            return "播放模式";
        } else if (value == 255) {
            return "频道点播";
        } else if (value == 288) {
            return "语言切换";
        } else if (value == 289) {
            return "亮度管理";
        } else if (value == 290) {
            return "电源管理";
        } else if (value == 291) {
            return "GPS同步播放";
        } else if (value == 292) {
            return "设备同步";
        }

    },
    isPramStatueName: function (value) {
        if (value == "设备开屏") {
            return 10;
        } else if (value == "设备关屏") {
            return 40;
        } else if (value == "设备重启") {
            return 50;
        } else if (value == "同步时钟") {
            return 80;
        } else if (value == "音量调整") {
            return 90;
        } else if (value == "亮度调整") {
            return 100;
        } else if (value == "截屏") {
            return 110;
        } else if (value == "日志上传") {
            return 120;
        } else if (value == "系统升级") {
            return 60;
        } else if (value == "软件升级") {
            return 70;
        } else if (value == "下发频道") {
            return 140;
        } else if (value == "下发节目") {
            return 150;
        } else if (value == "策略设置") {
            return 130;
        } else if (value == "设备待机") {
            return 20;
        } else if (value == "开启播放") {
            return 180;
        } else if (value == "紧急停播") {
            return 190;
        } else if (value == "日志下载") {
            return 121;
        } else if (value == "插播节目") {
            return 160;
        } else if (value == "插播字幕") {
            return 170;
        } else if (value == "设备开机") {
            return 30;
        } else if (value == "围栏任务") {
            return 135;
        } else if (value == "删除频道") {
            return 125;
        } else if (value == "删除节目") {
            return 126;
        } else if (value == "更新设备节目信息") {
            return 127;
        } else if (value == "删除围栏") {
            return 128;
        } else if (value == "更新设备围栏信息") {
            return 129;
        } else if (value == "Model升级") {
            return 65;
        } else if (value == "清理缓存") {
            return 400;
        } else if (value == "设置板卡参数") {
            return 210;
        } else if (value == "固件升级") {
            return 230;
        } else if (value == "更新配置文件") {
            return 240;
        } else if (value == "GPS开关") {
            return 260;
        } else if (value == "输入源切换") {
            return 801;
        } else if (value == "局部全屏") {
            return 804;
        } else if (value == "亮度") {
            return 810;
        } else if (value == "画面冻结") {
            return 802;
        } else if (value == "黑屏") {
            return 803;
        } else if (value == "PIP（画中画）") {
            return 814;
        } else if (value == "场景") {
            return 845;
        } else if (value == "信号源回显") {
            return 277;
        } else if (value == "节目点播") {
            return 265;
        } else if (value == "节目停播") {
            return 266;
        } else if (value == "日志开关") {
            return 280;
        } else if (value == "音频开关") {
            return 285;
        } else if (value == "播放模式") {
            return 829;
        } else if (value == "频道点播") {
            return 255;
        } else if (value == "语言切换") {
            return 288;
        } else if (value == "亮度管理") {
            return 289;
        } else if (value == "电源管理") {
            return 290;
        } else if (value == "GPS同步播放") {
            return 291;
        } else if (value == "设备同步") {
            return 292;
        }
    },
    // 表单校验插件
    mvalidate: function (params) {

        var defaults = {
            obj: '#form',
            validCall: function (event, options) {},
            invalidCall: function (event, status, options) {},
            eachFieldCall: function (event, status, options) {},
            eachValidFieldCall: function (val) {},
            conditional: {}
        };

        params = $.extend({}, defaults, params);

        $(params.obj).mvalidate({
            type: 1,
            onKeyup: false,
            sendForm: false,
            firstInvalidFocus: true,
            valid: function (event, options) { //点击提交按钮时,表单通过验证触发函数
                params.validCall(event, options)
                event.preventDefault();
            },
            invalid: function (event, status, options) { //点击提交按钮时,表单未通过验证触发函数
                params.invalidCall(event, options)
            },
            eachField: params.eachField,
            eachValidField: function (val) {
                params.eachValidFieldCall(val)
            },
            eachInvalidField: function (event, status, options) {
                params.eachFieldCall(event, status, options)
            },
            conditional: params.conditional,
            descriptions: params.descriptions
        });

    },
    // 设备在线判断
    leaveLine: function (time) {
        var m = (new Date()).getTime();

        if (time > m) {
            return 0;
        }

        var n = (m - time) / (1000 * 60);

        if (n >= 0 && n <= 5) {
            return 0;
        } else if (n <= 30 && n > 5) {
            return 1;
        } else if (n > 30 && n <= 60) {
            return 2;
        } else if (n > 60) {
            return 3;
        }

    },
    // 等级颜色
    leaveLineStyle: function (state) {

        var classStyle = '';

        // 联网
        if (state === 0) {
            classStyle = 'online';
        }
        // 脱机
        else if (state === 1) {
            classStyle = 'offline';
        }
        // 异常
        else if (state === 2) {
            classStyle = 'abnormal';
        }
        // 未知
        else if (state === 3) {
            classStyle = 'unknow';
        }

        return classStyle;

    },
    leaveLineName: function (state) {

        var stateName = '',
            className = '';

        // 联网
        if (state === 0) {
            stateName = '联网';
            className = 'onlineColor';
        }
        // 脱机
        else if (state === 1) {
            stateName = '脱机';
            className = 'offlineColoe';
        }
        // 异常
        else if (state === 2) {
            stateName = '异常';
            className = 'fontRed';
        }
        // 未知
        else if (state === 3) {
            stateName = '未知';
            className = 'unknowColor';
        }

        return '<span class="' + className + '">' + stateName + '</span>';

    },
    dhtmlxTreeGroupAjax: function (tree, id) {

        id = id === 0 ? 0 : id;

        Public.ajaxCall({
            type: 'GET',
            url: PublicUrl.ip + PublicUrl.api + PublicUrl.version + "group/listWithoutDevice",
            data: {
                parentId: id
            },
            successCallBack: function (data) {

                if (data.code > 0) {

                    var dataLen = data.response.length;
                    if (dataLen == 0) {
                        // Public.toast('加载成功，暂无数据！');
                        tree.insertNewItem(id, -1, '暂无更多记录', '', 0, 0, 0, 0);
                        return;
                    }
                    tree.deleteChildItems(id);
                    for (var i = 0; i < dataLen; i++) {

                        var itemData = data.response[i],
                            itemId = itemData.id,
                            isParent = itemData.isParent,
                            name = itemData.name;

                        tree.insertNewItem(id, itemId, name, '', 'folderClosed.gif', 'folderOpen.gif', 'folderClosed.gif', 0);
                        tree.setUserData(itemId, 'isParent', isParent);
                    }


                }
            }
        })

    },
    dhtmlxTreeGroup: function () {

        var tree = new dhtmlXTreeObject("eq-tree", "100%", "100%", 0);

        tree.setImagePath("./../images/treeimgs/");
        tree.enableDragAndDrop(0);
        tree.enableCheckBoxes(1);
        tree.enableTreeLines(true);
        tree.enableThreeStateCheckboxes(true);

        Public.dhtmlxTreeGroupAjax(tree, 0);

        tree.setOnClickHandler(function (id) {

            if (id < 0) return;

            if (tree.getOpenState(id) === 0) {

                Public.dhtmlxTreeGroupAjax(tree, id);

            }

        }); //单机事件

        return tree;

    },
    dhtmlxTreeGroupNoCheck: function (checkedCall) {

        var tree = new dhtmlXTreeObject("eq-tree", "100%", "100%", 0);

        tree.setImagePath("./../images/treeimgs/");
        tree.enableDragAndDrop(0);
        tree.enableCheckBoxes(0);
        tree.enableTreeLines(true);
        tree.enableThreeStateCheckboxes(true);

        Public.dhtmlxTreeGroupAjax(tree, 0);

        tree.setOnClickHandler(function (id) {

            if (id < 0) return;

            if (tree.getOpenState(id) === 0) {

                checkedCall();

                Public.dhtmlxTreeGroupAjax(tree, id);

            }

        }); //单机事件

        return tree;

    },
    dhtmlxTreeEqGroupAjax: function (tree, id) {

        id = id === 0 ? 0 : id;

        Public.ajaxCall({
            type: 'GET',
            url: PublicUrl.ip + PublicUrl.api + PublicUrl.version + "group/list",
            data: {
                parentId: id
            },
            successCallBack: function (data) {

                if (data.code > 0) {

                    var dataLen = data.response.length;
                    if (dataLen == 0) {
                        Public.toast('加载成功，暂无数据！');
                        return
                    };
                    tree.deleteChildItems(id);
                    for (var i = 0; i < dataLen; i++) {

                        var itemData = data.response[i],
                            showImg = '',
                            itemId = itemData.id,
                            isParent = itemData.isParent,
                            name = itemData.name,
                            aliveTime = itemData.aliveTime;

                        if (isParent) {
                            tree.insertNewChild(id, itemId, name, '', 'folderClosed.gif', 'folderOpen.gif', 'folderClosed.gif', '');
                            tree.setUserData(itemId, 'isParent', isParent);
                        } else {
                            var state = Public.leaveLine(aliveTime);
                            // 联网
                            if (state === 0) {
                                showImg = 'on.gif';
                            }
                            // 脱机
                            else if (state === 1) {
                                showImg = 'no.gif';
                            }
                            // 异常
                            else if (state === 2) {
                                showImg = 'abnormal.gif';
                            }
                            // 未知
                            else if (state === 3) {
                                showImg = 'un.gif';
                            }
                            tree.insertNewChild(id, itemId, name, '', showImg, 0, 0, 0);
                            tree.setUserData(itemId, 'isParent', isParent);
                        }

                    }

                }
            }
        });

    },
    dhtmlxTreeEqGroup: function () {

        var tree = new dhtmlXTreeObject("map-tree", "100%", "100%", 0);

        tree.setImagePath("./../images/treeimgs/");
        tree.enableDragAndDrop(0);
        tree.enableCheckBoxes(1);
        tree.enableTreeLines(true);
        tree.enableThreeStateCheckboxes(true);

        Public.dhtmlxTreeEqGroupAjax(tree, 0);

        tree.setOnClickHandler(function (id) {

            if (tree.getOpenState(id) === 0) {

                Public.dhtmlxTreeEqGroupAjax(tree, id);

            }

        }); //单机事件

        return tree;
    },
    getUrlItem: function (urls) {

        if (!urls) urls = window.location.href;

        var thisDay = urls.substring(urls.indexOf('?') + 1, urls.length),
            args = {},
            items = thisDay.split("&"),
            name = null,
            value = null,
            item = null;

        for (var i = 0, len = items.length; i < len; i++) {
            item = items[i].split("=");
            name = decodeURIComponent(item[0]);
            value = decodeURIComponent(item[1]);
            args[name] = value;
        }

        return args;
    },
    // 动态加载JS文件
    loadJs: function (url, callback) {
        var script = document.createElement('script');
        script.type = "text/javascript";
        if (typeof (callback) != "undefined") {

            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                }
            } else {
                script.onload = function () {
                    callback();
                }
            }

        }
        script.src = url;
        document.body.appendChild(script);
    },
    removeJs: function (filename, filetype) {

        var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none",
            targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none",
            allsuspects = document.getElementsByTagName(targetelement);

        for (var i = allsuspects.length; i >= 0; i--) {

            if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1) {
                allsuspects[i].parentNode.removeChild(allsuspects[i])
            }

        }

    },
    getEqImage: function (type) {

        var typeUrl = '';

        switch (type) {
            case 'X3':
                typeUrl = 'x3.jpg';
                break;
            case 'X3C':
                typeUrl = 'x3.jpg';
                break;
            case 'Q5':
                typeUrl = 'q5.jpg';
                break;
            case 'Q5C':
                typeUrl = 'q5.jpg';
                break;
            case 'Q5S':
                typeUrl = 'q5.jpg';
                break;
            case 'X3M':
                typeUrl = 'x3m.jpg';
                break;
            case 'X3T':
                typeUrl = 'x3m.jpg';
                break;
            case 'X3M-Z1':
                typeUrl = 'x3m.jpg';
                break;
            case 'X3T-Z1':
                typeUrl = 'x3m.jpg';
                break;
            case 'VP1000U':
                typeUrl = 'vp1000u.jpg';
                break;
            case 'VP-U':
                typeUrl = 'vp1000u.jpg';
                break;
            case 'H2':
                typeUrl = 'h2.jpg';
                break;
            default:
                typeUrl = 'defaultEq.jpg';
                break;
        }

        return typeUrl;

    },
    isEqType: function (type) {
        return type !== 'null' ? type : '未知';
    }
}

var PublicUrl = {
    // ip: 'http://192.168.0.109:8082/',
    ip: 'http://116.62.172.55:8080/',
    api: 'ListenHtmlApi/',
    version: 'v1/',
    resources: 'resources/',
    material: 'material',
    upload: 'upload',
    audit: 'audit',
    program: 'program',
    programList: 'Program',
    list: 'list',
    capList: 'List',
    info: 'info',
    device: 'Device',
    task: 'Task',
    loginUrl: function () {
        return this.ip + this.api + 'loginIn';
    },
    publicHeadUrl: function (params) {
        return this.ip + this.api + this.version;
    },
    // 素材地址
    materialResourceUrl: function () {
        return this.ip + this.resources
    },
    /******** 任务API ********/
    // 删除或者重新下发 / 更新任务已读状态
    taskInfoUrl: function () {
        return this.publicHeadUrl() + 'Task/info';
    },
    // 查询任务列表
    taskListUrl: function () {
        return this.publicHeadUrl() + 'Task/List';
    },
    // 查询任务列表
    taskNumberUrl: function () {
        return this.publicHeadUrl() + 'Task/number';
    },
    // 给设备创建任务
    taskForEqUrl: function () {
        return this.publicHeadUrl() + 'Device/task/';
    },
    /******** 素材API ********/
    // 删除素材
    materialDeleteUrl: function () {
        return this.publicHeadUrl() + 'material/';
    },
    // 新增素材
    materialInfoUrl: function () {
        return this.publicHeadUrl() + 'material/info';
    },
    // 素材分页查询
    materialListUrl: function () {
        return this.publicHeadUrl() + 'material/list/';
    },
    // 素材上传
    materialUploadUrl: function () {
        return this.publicHeadUrl() + 'material/upload/';
    },
    /******** 节目和素材审核api ********/
    // 查询所有素材信息
    auditMaterialUrl: function () {
        return this.publicHeadUrl() + 'audit/material';
    },
    auditStateMaterialUrl: function () {
        return this.publicHeadUrl() + 'audit/material';
    },
    /******** 节目编排api ********/
    // 查询节目绑定的设备id / 删除指定的节目
    programContUrl: function () {
        return this.publicHeadUrl() + 'Program/';
    },
    // 新增节目 / 节目修改
    programContInfoUrl: function () {
        return this.publicHeadUrl() + 'Program/info';
    },
    // 节目保存页面 / 节目复制页面
    programContListUrl: function () {
        return this.publicHeadUrl() + 'Program/Page';
    },
    // 节目排序 / 节目删除页面  // 节目回读数据programId
    programContPageUrl: function () {
        return this.publicHeadUrl() + 'Program/Page/';
    },
    // 查询所有的节目列表
    programListUrl: function () {
        return this.publicHeadUrl() + 'Program/list';
    },
    /******** 节目下发api ********/
    programSendUrl: function () {
        return this.publicHeadUrl() + 'sendPlay/';
    },
    /******** 节目和素材审核 api ********/
    // 查询所有素材信息
    auditMaterialUrl: function () {
        return this.publicHeadUrl() + 'audit/material';
    },
    // 更改媒体审核状态
    auditMaterialStateUrl: function () {
        return this.publicHeadUrl() + 'audit/material/';
    },
    // 查找单个素材信息
    auditOneMaterialUrl: function () {
        return this.publicHeadUrl() + 'audit/Material';
    },
    // 查询所有节目信息
    auditProgramUrl: function () {
        return this.publicHeadUrl() + 'audit/program';
    },
    // 更改节目审核状态
    auditProgramStateUrl: function () {
        return this.publicHeadUrl() + 'audit/program/';
    },
    // 通过节目id查询节目详情（页面信息）
    auditProgramInfoUrl: function () {
        return this.publicHeadUrl() + 'audit/Program/';
    },
    /******** 设备管理 api ********/
    // 查询单个设备 / 删除设备
    deviceOneUrl: function () {
        return this.publicHeadUrl() + 'Device/';
    },
    // 删除设备  /  更新设备信息
    deviceInfoUrl: function () {
        return this.publicHeadUrl() + 'Device/info';
    },
    // 查询全部设备
    deviceListUrl: function () {
        return this.publicHeadUrl() + 'Device/list';
    },
    // 给设备创建任务
    deviceTaskUrl: function () {
        return this.publicHeadUrl() + 'Device/task/';
    },
    // 查询设备截屏图片
    deviceGetPicUrl: function () {
        return this.publicHeadUrl() + 'Device/detail/pic/';
    },
    /******** 设备组树管理 api ********/
    // 设备组排序更新
    deviceGroupUrl: function () {
        return this.publicHeadUrl() + 'group/';
    },
    // 查询分组树(含设备)
    deviceGroupListUrl: function () {
        return this.publicHeadUrl() + 'group/list';
    },
    // 查询分组树(不含设备)
    deviceWidthOutListUrl: function () {
        return this.publicHeadUrl() + 'group/listWithoutDevice';
    },
    // 查询分组树(含设备、带回显功能)
    deviceListWithRecallUrl: function () {
        return this.publicHeadUrl() + 'group/listWithRecall';
    },
    // 查询分组树(含设备、选中设备不显示)
    deviceListWithRemoveUrl: function () {
        return this.publicHeadUrl() + 'group/listWithRemove';
    },
    // 节目任务下发
    sendPlayTaskUrl: function () {
        return this.publicHeadUrl() + 'sendPlay/Task/';
    },
    // 依设备id查询任务列表
    findAllTaskUrl: function () {
        return this.publicHeadUrl() + 'sendPlay/findAllTask';
    },
    // 信号源回显
    singleAreadyUrl: function () {
        return this.publicHeadUrl() + 'Device/detail';
    },
    imgSrc: function () {
        return './../images/';
    }
}

var PublicDataHtml = {
    getMediaHtml: function (data, allChecked) {

        var itemData = data,
            materialContentType = itemData.materialContentType,
            materialTypeName = itemData.materialTypeName,
            materialRelativePath = itemData.materialRelativePath,
            materialStorageName = itemData.materialStorageName,
            materialOriginalName = itemData.materialOriginalName,
            materialAuditStatus = itemData.materialAuditStatus,
            createBy = itemData.createBy,
            createDate = itemData.createDate,
            materialLabel = itemData.materialLabel,
            materialSize = Public.formatFileSize(itemData.materialSize),
            materialTypeId = itemData.materialTypeId,
            materialId = itemData.materialId,
            materialHtml = '',
            shtml = '',
            icon = '',
            materialUrl = PublicUrl.ip + PublicUrl.resources + materialRelativePath + materialStorageName;

        if (materialContentType.match('image.*')) {

            materialHtml = '<div class="picture" data-url="' + materialUrl + '"><img onerror="this.src=\'./../images/default.jpg\'" data-echo="' + materialUrl + '" src="./../images/default.jpg" alt=""></div>';
            icon = '<i class="iconfont icon-tupian"></i>';

        } else if (materialContentType.match('video.*')) {

            materialHtml = '<div class="video" data-src="' + materialUrl + '"><i class="iconfont icon-qidong"></i></div>';
            // materialHtml = '<div class="video-player" id="video-' + materialId + '"><video style="height: 6.1rem;" webkit-playsinline="true" x-webkit-airplay="true" playsinline="true" x5-video-player-type="h5" x5-video-player-fullscreen="true" src="' + materialUrl + '" preload="none"></video></div>';
            icon = '<i class="iconfont icon-shipin"></i>';

        } else if (materialContentType === 'application/octet-stream') {
            materialContentType = 'other';
            materialHtml = '<div class="picture" data-url="' + materialUrl + '"><img onerror="this.src=\'./../images/default.jpg\'" data-echo="' + materialUrl + '" src="./../images/default.jpg" alt=""></div>';
            icon = '<i class="iconfont icon-tags2"></i>';
        } else {
            materialContentType = 'other';
            materialHtml = '<div class="picture" data-url="' + materialUrl + '"><img onerror="this.src=\'./../images/default.jpg\'" data-echo="' + materialUrl + '" src="./../images/default.jpg" alt=""></div>';
            icon = '<i class="iconfont icon-tags2"></i>';
        }

        var shtml = '<div class="col-50" id="material-' + materialId + '">' +
            '<div class="item">' +
            '<div class="label-checked-box pull-left">' +
            '<input type="checkbox" ' + (allChecked ? 'checked' : '') + ' id="check-' + materialId + '" value="' + materialId + '" />' +
            '<label for="check-' + materialId + '">' +
            '</label>' +
            '</div>' +
            '<div class="item-in">' +
            '<div class="pic"><div class="state">' + Public.isStatus(materialAuditStatus) + '</div>' +
            materialHtml +
            ' </div>' +
            '<div class="info material-info" data-json=\'' + JSON.stringify(itemData) + '\'>' +
            '<div class="name">' +
            materialOriginalName +
            '</div>' +
            '<div class="row">' +
            '<div class="col-80">' +
            '<span class="iconStyle">' +
            icon +
            '</span>' +
            '<span class="type">' +
            materialContentType +
            '</span>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-80">' +
            '<span class="iconStyle">' +
            '<i class="iconfont icon-duochicun"></i>' +
            '</span>' +
            '<span class="size" id="size-' + materialId + '">' +
            materialSize +
            '</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        return shtml;
    }
}

// 浮动图标
function FlMenu(params) {
    this.obj = '.float-menu';
    // this.menuList = [{}];
    this.initPagX = 0;
    this.initPagY = 0;
    this.initTop = 0;
    this.initLeft = 0;
    this.innerHeight = 0;
    this.innerWidth = 0;
    this.menuWidth = 0;
    this.menuHeight = 0;
}
FlMenu.prototype.init = function () {
    this.mouseDown();
    this.mouseMove();
    this.mouseUp();
    this.onclick();
    this.innerHeight = $(window).height();
    this.innerWidth = $(window).width();
    this.menuWidth = $(this.obj).width();
    this.menuHeight = $(this.obj).height();
}
FlMenu.prototype.onclick = function () {
    $(document).on('click', '.float-menu-icon', function (e) {

        var $this = $(this),
            attrData = $this.attr('data-flm');

        if (attrData === 'closed') {
            $this.attr('data-flm', 'open');
        } else {
            $this.attr('data-flm', 'closed');
        }

    })
}
FlMenu.prototype.mouseDown = function () {
    var _this = this;
    $(document).on('touchstart', _this.obj, function (e) {

        var _targetTouches = e.targetTouches[0],
            _position = $(_this.obj).position();

        _this.initTop = _position.top;
        _this.initLeft = _position.left;

        _this.initPagX = _targetTouches.pageX;
        _this.initPagY = _targetTouches.pageY;

    })
}
FlMenu.prototype.mouseMove = function () {
    var _this = this;
    $(document).on('touchmove', _this.obj, function (e) {

        var _targetTouches = e.targetTouches[0],
            nowLeft = _this.initLeft + (_targetTouches.pageX - _this.initPagX),
            nowTop = _this.initTop + (_targetTouches.pageY - _this.initPagY);

        if (nowLeft + _this.menuWidth > _this.innerWidth) {
            nowLeft = _this.innerWidth - _this.menuWidth;
        } else if (nowLeft < 0) {
            nowLeft = 0;
        }

        if (nowTop + _this.menuHeight > _this.innerHeight) {
            nowTop = _this.innerHeight - _this.menuHeight;
        } else if (nowTop < 0) {
            nowTop = 0;
        }

        $(_this.obj).css({
            left: nowLeft,
            top: nowTop
        });

    })
}
FlMenu.prototype.mouseUp = function () {
    var _this = this;
    $(document).on('touchend', _this.obj, function (e) {
        $(this).off('touchstart', 'touchmove');
    })
}

// 列表数据加载实例
function MobileListData(params) {
    this.pageNum = 1;
    this.pageSize = 8;
    this.request = false;
    this.initData = true;
    this.initVideoArr = [];
    this.noMoreDataText = '暂无更多记录';
    this.defaults = {
        listObj: null,
        getListHtml: null,
        url: '',
        data: {},
        noMoreDataObj: '.noMoreData',
        dataSuccessCall: function () {

        }
    }
    this.options = $.extend({}, this.defaults, params);

}
// 初始化
MobileListData.prototype.init = function () {

    $(this.options.listObj).empty();
    this.pageNum = 1;
    this.getData();
    this.refresh();
    this.infinite();
    this.addNoDataBlock();
}
// 获取数据
MobileListData.prototype.getData = function () {

    var self = this,
        dataParam = {
            pageNo: self.pageNum,
            pageSize: self.pageSize
        };

    self.request = true;

    dataParam = $.extend({}, self.options.data, dataParam);

    $(self.options.noMoreDataObj).hide();

    Public.ajaxCall({
        type: 'GET',
        url: self.options.url,
        data: dataParam,
        successCallBack: function (data) {

            Public.hidePreloader();

            if (data.code > 0) {

                if (self.initData) {
                    $(self.options.listObj).empty();
                    $.pullToRefreshDone('.pull-to-refresh-content');
                };

                if (data.response !== '{}' && data.response !== undefined && data.response.list) {

                    if (data.response.list.length > 0) {

                        var response = data.response,
                            lastPage = response.lastPage;

                        if (lastPage === self.pageNum) {
                            $.detachInfiniteScroll($('.infinite-scroll'));
                            $(self.options.noMoreDataObj).show();
                            $('.infinite-scroll-preloader').hide();
                        };

                        var shtml = self.options.getListHtml(data.response.list);

                        $(self.options.listObj).append(shtml);
                        Public.customToast('加载成功！');

                        self.request = false;

                        $.refreshScroller();

                    } else {

                        self.options.dataSuccessCall(data);
                        Public.customToast('加载成功！');
                        self.noData();

                    }

                } else {
                    self.options.dataSuccessCall(data);
                    Public.customToast('加载成功！');
                    self.noData();
                }

            } else {
                self.noData();
            }

            self.options.dataSuccessCall(data);

        },
        errorCallBack: function (data) {

            Public.hidePreloader();
            self.noData();

        }
    });

}
// 下拉刷新
MobileListData.prototype.refresh = function () {

    var self = this;

    $(document).on('refresh', '.pull-to-refresh-content', function (e) {

        $('.infinite-scroll-preloader').hide();

        if (self.request) return;

        self.pageNum = 1;
        self.initData = true;
        $(self.options.noMoreDataObj).hide();
        self.init();

    });

}
// 底部上滑加载
MobileListData.prototype.infinite = function () {

    var self = this;

    $.initInfiniteScroll($('.infinite-scroll'));

    $(document).on('infinite', '.infinite-scroll-bottom', function (e) {

        if (self.request) return;

        $('.infinite-scroll-preloader').show();
        self.pageNum++;
        self.initData = false;
        self.getData();

    });

}
// 添加无数据元素
MobileListData.prototype.addNoDataBlock = function () {

    var self = this;

    $(self.options.noMoreDataObj).text(self.noMoreDataText);

}
// 搜索
MobileListData.prototype.search = function (params) {

    var self = this;

    self.options.data = params;
    self.init();

}
//  无数据
MobileListData.prototype.noData = function () {

    var self = this;

    self.request = false;
    $.pullToRefreshDone('.pull-to-refresh-content');
    $.detachInfiniteScroll($('.infinite-scroll'));
    $(self.options.noMoreDataObj).show();
    $('.infinite-scroll-preloader').hide();
    Public.hidePreloader();

}

$(function () {

    $('.iss-close').on('click', function (e) {
        $(this).prev('input').val('');
    });

    // 全选按钮
    $(document).on('click', '.checkAll', function () {

        var listId = $(this).attr('data-list'),
            $checkboxList = $('#' + listId + ' input[type=checkbox]');

        if ($(this).prop('checked')) {

            $checkboxList.prop('checked', true);

        } else {

            $checkboxList.prop('checked', false);

        }

    });

    // 登出
    $(document).on('click', '#login-out', function () {

        try {

            var mobileSystem = Public.isMobile();

            if (!mobileSystem.weixin) {

                if (mobileSystem.ios) {
                    ios_logout();
                } else if (mobileSystem.android) {
                    Android.logout();
                }

            } else {

                Public.clearAllCookie();

                window.location.href = 'login.html';

            }

        } catch (e) {

            Public.clearAllCookie();
            window.location.href = 'login.html';

        }

    });


});


// 滑块插件
;
(function ($) {

    var Slider = function (ele, opt) {
        this.ele = ele;
        this.defaults = {
            'initVal': 0,
            'range': '.range',
            'bar': '.range-bar',
            'progress': '.range-progress',
            'text': '#range-value',
            'initBarX': 0,
            'initBarL': 0,
            'initRangL': 0,
            'isMove': false,
            'changeVal': function (data) {

            }
        }
        this.options = $.extend({}, this.defaults, opt)
    }

    Slider.prototype = {
        constructor: Slider,
        init: function () {

            var self = this,
                $ele = this.ele,
                rangeWidth = $ele[0].offsetWidth,
                options = self.options,
                barWidth = $ele.find(options.bar)[0].offsetWidth;

            options.maxRang = rangeWidth - barWidth;
            options.barWidth = barWidth;

            self.mouserDown();
            self.mouserMove();
            self.mouserUp();
            console.log(options.initVal)
            self.setInitRang(options.initVal);

        },
        // 点击按下
        mouserDown: function () {

            var self = this,
                options = self.options;

            $(self.ele).off('touchstart').on('touchstart', function (e) {

                if (e.target.className === 'range-bar') {

                    var val = e.touches[0].pageX,
                        valL = $(e.target).position().left;

                    options.initBarX = val;
                    options.initBarL = valL;
                    options.isMove = true;

                }

            });


        },
        // 移动
        mouserMove: function () {

            var self = this,
                options = self.options;

            $(self.ele).off('touchmove').on('touchmove', function (e) {

                if (options.isMove) {

                    var movePageX = e.touches[0].pageX,
                        rangx = self.ele[0].offsetLeft;

                    self.setRang(options.initBarL - (options.initBarX - movePageX));

                }

            });

        },
        // 弹起
        mouserUp: function () {

            var self = this,
                options = self.options;

            $(self.ele).off('touchend').on('touchend', function (event) {

                options.isMove = false;

            });

        },
        // 显示位置
        setRang: function (value) {

            var self = this,
                options = self.options,
                maxRang = options.maxRang,
                percent = 0;

            if (value <= 0) {
                value = 0;
            }
            if (value >= maxRang) {
                value = maxRang;
            }

            self.ele.find(options.bar)[0].style.left = value + 'px';
            self.ele.find(options.progress)[0].style.width = value + options.barWidth / 2 + 'px';

            $(options.text).val(Math.ceil(value / maxRang * 100));
            options.changeVal(Math.ceil(value / maxRang * 100));

        },
        // 百分比显示
        setInitRang: function (val) {

            var self = this,
                options = self.options,
                maxRang = options.maxRang;

            self.setRang(Math.floor(maxRang * (val / 100)));

        }
    }

    $.fn.customSlider = function (options) {

        return this.each(function () {

            var $this = $(this),
                slider = new Slider($this, options);

            slider.init();

        })

    }

})(Zepto);