var menu = new FlMenu(),
    mobileListData = new MobileListData({
        url: PublicUrl.deviceListUrl(),
        data: {
            onlineState: $('#mornitor-eqstate').val(),
            type: $('#mornitor-eqstate').val(),
            languageType: Public.languageType,
            devName: $('#mornitor-searcheq').val(),
            startTime: $('#datetime-start').val(),
            endTime: $('#datetime-end').val(),
            equipType: JSON.stringify([])
        },
        listObj: '#mornitor-list-data',
        getListHtml: getListHtml
    }),
    pageEqInit = false,
    treeMap = null,
    treeEq = null,
    $document = $(document),
    searchDateObj = null;

var BaiduMap = {
    map: null,
    markerClusterer: null,
    // myStyles: [{
    //     url: './../images/icon-jh.png',  //图标路径
    //     size: new BMap.Size(64, 64),  //图标大小
    //     textColor: '#fff',  //文字颜色
    //     textSize: 14  //字体大小
    // }],
    carDataArr: [], // 车辆数据
    carMarkarr: [], // 地图坐标数组
    init: function () {

        var self = this,
            geolocation = new BMap.Geolocation();
        gc = new BMap.Geocoder();


        self.map = new BMap.Map("baiduMapView");
        self.map.enableScrollWheelZoom(true);
        geolocation.getCurrentPosition(function (r) { //定位结果对象会传递给r变量  

            if (this.getStatus() == BMAP_STATUS_SUCCESS) { //通过Geolocation类的getStatus()可以判断是否成功定位。  

                var pt = r.point;

                gc.getLocation(pt, function (rs) {
                    var addComp = rs.addressComponents;
                    Public.toast(addComp.city);
                    self.map.centerAndZoom(addComp.city, 14);
                });

            } else {

                switch (this.getStatus()) {
                    case 2:
                        Public.toast('获取位置失败.');
                        break;
                    case 3:
                        Public.toast('获取位置失败..');
                        break;
                    case 4:
                        Public.toast('获取位置失败.');
                        break;
                    case 5:
                        Public.toast('获取位置失败.');
                        break;
                    case 6:
                        Public.toast('对不起,当前 没有权限 获取位置失败.');
                        break;
                    case 7:
                        Public.toast('对不起,服务不可用 获取位置失败.');
                        break;
                    case 8:
                        Public.toast('对不起,请求超时 获取位置失败.');
                        break;
                }
            }

        }, {
            enableHighAccuracy: true
        });

    },
    // 传入坐标设置地图显示中心
    setMapCenter: function (points) {

    },
    // 添加车辆坐标
    addMarkers: function () {

        var self = this,
            marker = self.carMarkarr;

        // if (self.markerClusterer !== null) {
        //     self.markerClusterer.clearMarkers();
        // };

        var getmapBound = self.map.getBounds();

        for (i = 0, len = marker.length; i < len; i++) {

            var mPoint = marker[i].point;
            var result = BMapLib.GeoUtils.isPointInRect(mPoint, getmapBound);

            self.map.addOverlay(marker[i]);

            var label = new BMap.Label(marker[i].devName, {
                offset: new BMap.Size(-20, -20)
            }); // 标签
            label.setStyle({
                backgroundColor: '#ffffff',
                backgroundPosition: '0 0',
                backgroundSize: 'cover',
                padding: '0px 5px',
                border: '1px solid #dddddd',
                borderRadius: '5px',
                boxShadow: '0px 0px 4px 0px #7b7b7b',
                fontSize: '12px',
                border: 'none',
                width: 'auto',
                height: '25px',
                lineHeight: '25px',
                textAlign: 'center'
            });
            marker[i].setLabel(label);

            (function (i) {

                var thePoint = marker[i];
                thePoint.addEventListener("click", function () {

                    var devCode = thePoint.devCode,
                        devEquipmentType = thePoint.devEquipmentType,
                        devMac = thePoint.devMac,
                        devName = thePoint.devName,
                        state = thePoint.state;

                    $('#eq-state').addClass(Public.leaveLineStyle(state));
                    $('#eq-state').text(Public.leaveLineName(state));
                    $('#eq-devCode').text(devCode)
                    $('#eq-mac').text(devMac)
                    $('#eq-name').text(devName)

                    Public.popup('.popup-map-eq');

                });

            })(i);

        }

        // self.markerClusterer = new BMapLib.MarkerClusterer(self.map, { markers: marker });
        // self.markerClusterer.setStyles(Public.myStyles);

    }
}

function getListHtml(data) {

    var shtml = '',
        allChecked = $('#checkAll').prop('checked');

    for (var i = 0, len = data.length; i < len; i++) {

        var itemData = data[i],
            devId = itemData.devId,
            devName = itemData.devName,
            devCode = itemData.devCode,
            devMac = itemData.devMac,
            lastOnlineDate = Public.leaveLine(itemData.lastOnlineDate),
            groupName = itemData.groupName,
            devEquipmentType = itemData.devEquipmentType,
            updateDate = Public.momentFormat(itemData.updateDate, 'YYYY-MM-DD HH:mm:ss'),
            classStyle = Public.leaveLineStyle(lastOnlineDate),
            lineName = Public.leaveLineName(lastOnlineDate),
            imgSrc = PublicUrl.imgSrc(),
            typeSrc = '';

        devEquipmentType = Public.isEqType(devEquipmentType);

        typeSrc = Public.getEqImage(devEquipmentType);

        shtml += '<div class="col-50">' +
            '<div class="item ' + classStyle + '">' +
            '<div class="label-checked-box pull-left">' +
            '<input type="checkbox" ' + (allChecked ? 'checked' : '') + ' id="check-' + devId + '" value="' + devId + '" />' +
            '<label for="check-' + devId + '"></label>' +
            '</div>' +
            '<div class="eq-type">' +
            devEquipmentType +
            '</div>' +
            '<div class="item-in">' +
            '<div class="pic">' +
            '<img src="' + imgSrc + typeSrc + '" alt="">' +
            '<div class="icon">' +
            '<span class="iconfont icon-yijianjieping eq-control" data-devid="' + devId + '" data-sendtype="110"></span>' +
            '<span class="iconfont icon-kaibo eq-control" data-devid="' + devId + '" data-sendtype="180"></span>' +
            '<span class="iconfont icon-stop-playing eq-control" data-devid="' + devId + '" data-sendtype="190"></span>' +
            '<span class="iconfont icon-jiaocha eq-signal" data-devid="' + devId + '" style="display:' + ((devEquipmentType === 'VP1000U' || devEquipmentType === 'VP-U') ? 'inline-block' : 'none') + '"></span>' +
            '</div>' +
            '</div>' +
            '<div class="info">' +
            '<div class="name">' +
            devName +
            ' </div>' +
            '<div class="row">' +
            '<div class="col-100">' +
            '<span class="iconStyle">' +
            '<i class="iconfont icon-icon-"></i>' +
            '</span>' +
            '<span class="line">' +
            lineName +
            '</span>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-100">' +
            '<span class="iconStyle">' +
            '<i class="iconfont icon-none"></i>' +
            '</span>' +
            '<span class="no">' +
            devCode +
            '</span>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-100">' +
            '<span class="iconStyle">' +
            '<i class="iconfont icon-MAC"></i>' +
            '</span>' +
            '<span class="mac">' +
            devMac +
            '</span>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-100">' +
            '<span class="iconStyle">' +
            '<i class="iconfont icon-fenzu"></i>' +
            '</span>' +
            '<span class="date text-hide">' +
            groupName +
            '</span>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-100">' +
            '<span class="iconStyle">' +
            '<i class="iconfont icon-shijian"></i>' +
            '</span>' +
            '<span class="date">' +
            updateDate +
            '</span>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-100">' +
            '<a href="screenshot.html?devId=' + devId + '&devName=' + devName + '" class="button button-light" external>截屏信息</a>' +
            '</div>' +
            '</div>' +
            '</div>' +
            ' </div>' +
            '</div>' +
            '</div>';

    }

    return shtml;

}

function refreshData() {

    var eqstate = $('#mornitor-eqstate').val(),
        eqtype = ($('#multi-select').attr('data-items') === '' || $('#multi-select').attr('data-items') === null) ? [] : $('#multi-select').attr('data-items').split(','),
        devName = $('#mornitor-searcheq').val(),
        starTime = $('#datetime-start').val(),
        endTime = $('#datetime-end').val(),
        paramData = getAllChecked(treeEq),
        gid = JSON.stringify(paramData.gid),
        pid = JSON.stringify(paramData.pid),
        did = JSON.stringify(paramData.did),
        param = {
            onlineState: eqstate,
            type: eqstate,
            languageType: Public.languageType,
            devName: devName,
            startTime: starTime,
            endTime: endTime
        };

    eqtype = JSON.stringify(eqtype);

    Public.isArry(gid) ? param.gid = gid : '';
    Public.isArry(pid) ? param.pid = pid : '';
    Public.isArry(did) ? param.did = did : '';
    param.equipType = eqtype;

    mobileListData.options.data = param;
    mobileListData.options.initData = true;
    mobileListData.init();
    $('#mornitor-submit').removeAttr('disabled');

}

// 树结构所有选中项
function getAllChecked(tree) {

    var allChecked = tree.getAllChecked().split(','),
        gid = [], // 组id已经打开
        pid = [], // 组未打开  
        did = []; // 车辆

    for (var i = 0, len = allChecked.length; i < len; i++) {

        var id = allChecked[i];

        if (tree.getUserData(id, 'isParent')) {

            if (tree.getOpenState(id) === 1) {
                gid.push(id);
            } else {
                pid.push(id);
            }

        } else {
            if (id !== '') {
                did.push(id);
            }
        }

    }

    return {
        gid: gid,
        pid: pid,
        did: did
    }
}

// 设备删除
function deleteEq(itemId) {

    Public.ajaxCall({
        type: 'DELETE',
        url: PublicUrl.deviceOneUrl() + itemId,
        successCallBack: function (data) {

            Public.toast(data.response);

            setTimeout(function () {
                refreshData();
            }, 800);

        }
    });

}

// 设备控制发送
function sendEqControl(type, param) {

    Public.ajaxCall({
        type: 'POST',
        url: PublicUrl.sendPlayTaskUrl() + type,
        data: param,
        successCallBack: function (data) {

            Public.toast(data.response);

        }
    });

}

/*输入源切换  */
function getSignal(a) {
    switch (a) {
        case "1":
            return "0x02"; // DVI
        case "2":
            return "0x03"; // HDMI
        case "3":
            return "0x01";  // VGA
        case "4":
            return "0x04"; // CV1
        case "5":
            return "0x05"; // CV2
        case "9":
            return "0x07"; // SDI
        case "7":
            return "0x06"; // DP
        case "8":
            return "0x08"; // USB
        default:
            return "0x09";
    }
}

/*输入源切换  回显*/
function getSignalBack(a) {
    switch (a) {

        case "HDMI":
            return "2";
        case "VGA":
            return "3";
        case "CV1":
            return "4";
        case "CV2":
            return "5";
        case "DP":
            return "7";
        case "DVI":
            return "1";
        case "SDI":
        case "USB":
            return "8";
        default:
            return "1";
    }
}

// function getParamsString(param, flag) {
//     var str = '';
//     var newStr = '';
//     if (flag.devId && flag.devId.length > 0) {
//         if (param.nId && param.nId.length > 0) {
//             newStr = "content=" + flag.content + "&did=" + JSON.stringify([flag.nId]);
//         }
//         if (param.devId && param.devId.length > 0) {
//             str = "content=" + flag.content + "&did=" + JSON.stringify([flag.devId]);
//         }
//     } else {
//         if (param.nId && param.nId.length > 0) {
//             newStr = "content=" + flag.content + "&did=" + JSON.stringify(param.nId);
//         }
//         if (param.devId && param.devId.length > 0) {
//             str = "content=" + flag.content + "&did=" + JSON.stringify(param.devId);
//         }
//     }

//     return {
//         newStr: newStr,
//         str: str
//     };
// }

// 信号源回读
function singleAlready(did) {

    Public.showPreloader('数据回读中...');

    Public.ajaxCall({
        type: 'POST',
        url: PublicUrl.deviceTaskUrl() + 277,
        data: {
            did: did
        },
        successCallBack: function (data) {

            if (data.code > 0) {

                Public.ajaxCall({
                    type: 'GET',
                    url: PublicUrl.singleAreadyUrl(),
                    data: {
                        did: did,
                        taskType: 277
                    },
                    successCallBack: function (data) {

                        Public.hidePreloader();

                        if (data.code > 0 && data.response) {

                            var jsonStr = data.response.content,
                                dataJson = JSON.parse(jsonStr),
                                changeSourceIn = dataJson.changeSourceIn[0],
                                screenAll = dataJson.screenAll[0],
                                brightness = dataJson.brightness[0],
                                freeze = dataJson.freeze.value,
                                screenBlack = dataJson.screenBlack.value,
                                pip = dataJson.pip.value,
                                $freezeSwitch = $('#freeze-switch'),
                                $pipSwicth = $('#pip-switch');

                            //输入源切换	
                            $('#signal-screenWin').attr('data-json', JSON.stringify(dataJson.changeSourceIn)).val(changeSourceIn.screenWin)
                            $('#signal-sourc').val(getSignalBack(changeSourceIn.value));

                            //局部全屏切换	
                            $('#signal-local-win').attr('data-json', JSON.stringify(dataJson.screenAll)).val(screenAll.screenWin);
                            $('#signal-local').val((screenAll.value == 1 ? 0 : 1));

                            //亮度调节	
                            if (brightness) {
                                $("#range-value").val(brightness.value);
                                $('.range').customSlider({
                                    initVal: brightness.value
                                });
                                $("#signal-light-win").attr('data-json', JSON.stringify(dataJson.brightness)).val(brightness.screenWin);
                            }else{
                                $('.range').customSlider({
                                    initVal: 0
                                });
                            }

                            //画面冻结
                            if (freeze == 0) {
                                $freezeSwitch.prop('checked', false);
                            } else {
                                $freezeSwitch.prop('checked', true);
                            }

                            //黑屏
                            $('#signal-screen').val(screenBlack);

                            //画中画
                            if (pip == 0) {
                                $pipSwicth.prop('checked', false);
                            } else {
                                $pipSwicth.prop('checked', true);
                            }

                            //场景
                            // var saveValue = dataJson.scenario.save;
                            // $('#winWrapA .itemWin').removeClass('activeOn');
                            // // var  loadValue= parseInt(dataJson.scenario.load.value) +1;
                            // for (var i = 0; i < saveValue.length; i++) {
                            //     $("#scenario" + saveValue[i]).addClass("activeOn");
                            // }
                            /* if(loadValue != null)
                                $(".scenarioNow").html("场景"+loadValue);
                            else
                                $(".scenarioNow").html();  */

                        } else {

                            if (data.response) {
                                Public.toast(data.response);
                            } else if (data.response == null) {
                                Public.customToast('暂无数据！');
                            };

                        }

                    }
                });

            } else {

                if (data.response) {
                    Public.customToast(data.response);
                } else if (data.response == null) {
                    Public.customToast('暂无数据！');
                };

            }

        }
    });


}

$(function () {

    Public.showPreloader('加载中...');

    $.init();
    menu.init();
    mobileListData.init();
    treeEq = Public.dhtmlxTreeGroup();
    treeEq.attachEvent("onCheck", function (id, state) {
        
        refreshData();

    });

    // 时间
    Public.datetimePicker({
        obj: '#datetime-start, #datetime-end',
        format: 'YYYY-MM-DD', // 'YYYY-MM-DD' 'YYYY-MM-DD hh:mm:ss' 'YYYY-MM-DD hh:mm' ' hh:mm:ss'
    });

    $(document).on('pageInit', '#routers-map', function (e, pageId, $page) {

        BaiduMap.init();
        $('#float-menu-map').hide();
        $('#float-menu-eq').show();

    });

    $(document).on('pageInit', '#routers-equipment', function (e, pageId, $page) {

        $('#float-menu-map').show();
        $('#float-menu-eq').hide();

    });

    $(document).on("click", "#map-popup", function () {
        Public.popup(".popup-map"),
            null === treeMap && (treeMap = Public.dhtmlxTreeEqGroup()).attachEvent("onCheck", function (id, state) {
                var paramData = getAllChecked(treeMap),
                    gid = JSON.stringify(paramData.gid),
                    pid = JSON.stringify(paramData.pid),
                    did = JSON.stringify(paramData.did);
                Public.ajaxCall({
                    type: "GET",
                    url: PublicUrl.deviceListUrl(),
                    data: {
                        languageType: Public.languageType,
                        pid: pid,
                        gid: gid,
                        did: did
                    },
                    successCallBack: function (data) {
                        var dataLists = data.response.list,
                            dataLen = dataLists.length;
                        if (0 !== dataLen) {
                            for (var i = 0; i < dataLen; i++) {
                                var lat = dataLists[i].devLatitudeValue,
                                    lng = dataLists[i].devLongitudeValue,
                                    carState = dataLists[i].state,
                                    devName = dataLists[i].devName,
                                    devId = dataLists[i].devId,
                                    devMac = dataLists[i].devMac,
                                    devEquipmentType = dataLists[i].devEquipmentType,
                                    devCode = dataLists[i].devCode,
                                    iconStyle = "";
                                iconStyle = 1 == carState ? "./../images/icon-online.png" : 2 == carState ? "./../images/icon-offline.png" : 3 == carState ? "./../images/icon-fault.png" : "./../images/icon-unknow.png";
                                var myIcon = new BMap.Icon(iconStyle, new BMap.Size(20, 30)),
                                    marker = new BMap.Marker(new BMap.Point(lng, lat), {
                                        icon: myIcon,
                                        enableMassClear: !0
                                    });
                                marker.devName = devName,
                                    marker.state = state,
                                    marker.id = devId,
                                    marker.devMac = devMac,
                                    marker.devEquipmentType = devEquipmentType,
                                    marker.devCode = devCode,
                                    BaiduMap.carMarkarr.push(marker)
                            }
                            BaiduMap.addMarkers()
                        } else
                            Public.toast("暂无数据！")
                    }
                })
            })
    });

    // 监控树结构
    $(document).on('click', '#eq-popup', function () {

        // $('#eq-tree').empty();
        Public.popup('.popup-eq');

    });

    // 搜索
    $(document).on('click', '#search-popup', function () {

        Public.popup('.popup-search');
        if (searchDateObj === null) {
            searchDateObj = Public.datetimePicker({
                obj: '#map-beginTime,#map-endTime'
            });
        }
    });

    // 搜索按钮
    $(document).on('click', '#mornitor-submit', function () {

        var starTime = $('#datetime-start').val(),
            endTime = $('#datetime-end').val(),
            params = {
                starDate: starTime,
                endDate: endTime
            };

        $('#mornitor-submit').attr('disabled', 'disabled');

        if (Public.momentIsBefore(params) || Public.momentIsSame(params) || (!Public.isDefine(starTime) && !Public.isDefine(endTime))) {
            Public.closeModal('.popup-search');
            refreshData();
        } else {
            $('#mornitor-submit').removeAttr('disabled');
            Public.toast(locales.dateMoment);
        }

    });

    // 设备控制
    $(document).on('click', '.eq-control', function () {

        var $this = $(this),
            devid = $this.attr('data-devid'),
            sendtype = $this.attr('data-sendtype'),
            devidArr = [],
            msg = '';

        devidArr.push(devid);

        msg = Public.isPramStatue(sendtype * 1);

        Public.msuiConfirm('确定下发' + msg + '任务？', function () {

            var param = {
                did: JSON.stringify(devidArr),
                content: ''
            };

            sendEqControl(sendtype, param);

        });

    });

    // 信号源切换
    $(document).on('click', '.eq-signal', function () {

        var devid = $(this).attr('data-devid'),
            did = [];

        did.push(devid);

        $('.popup-signal').attr('data-devid', devid);

        Public.popup('.popup-signal');

        singleAlready(JSON.stringify(did));

    });

    // 信号源回读
    $(document).on('click', '#signalAready', function () {

        var did = $('.popup-signal').attr('data-devid'),
            didArr = [];

        didArr.push(did);

        singleAlready(JSON.stringify(didArr));


    });

    // 信号源保存
    $(document).on('click', '.signal-btn', function () {

        var flag = $(this).attr('data-flag') * 1,
            windowOption = null,
            value = null,
            content = {},
            devId = $('.popup-signal').attr('data-devid'),
            devidArr = [];

        devidArr.push(devId);

        if (flag === 801) {

            windowOption = $("#signal-screenWin").val() == 0 ? "0x00" : "0x01";
            value = getSignal($("#signal-sourc").val());

            content = {
                "value": value,
                "param": windowOption
            };

        } else if (flag === 804) {

            windowOption = $("#signal-local-win").val();
            windowOption = windowOption == 0 ? "0x00" : (windowOption == 1 ? "0x01" : (windowOption == 2 ? "0x02" : "0x03"));
            value = $("#signal-local").val() == 0 ? "0x01" : "0x00"; /*0 局部显示0x01   1 全屏0x00  */
            content = {
                "value": windowOption,
                "param": value
            };

        } else if (flag === 810) {

            windowOption = $("#signal-light-win").val();
            value = $("#range-value").val();
            content = {
                "value": value,
                "adjustmentType": "0x01",
                "windowNumber": windowOption
            }

        } else if (flag === 802) {

            value = $("#freeze-switch").prop('checked') ? '1' : '0';
            content = {
                "value": value
            }

        } else if (flag === 803) {

            value = $("#signal-screen").val();
            content = {
                "value": value
            }
            console.log(content);
        } else if (flag === 814) {

            value = $("#pip-switch").prop('checked') ? '1' : '0';
            content = {
                "value": value
            }

        }
        // else if (flag === 845) {

        // value = $("#scenario .active").attr("value");
        // content = {
        //     "param": "2",
        //     "value": value
        // }

        // }

        var params = {
            did: JSON.stringify(devidArr),
            // type: flag,
            content: JSON.stringify(content),
        };

        Public.ajaxCall({
            type: 'POST',
            url: PublicUrl.deviceTaskUrl() + flag,
            data: params, //getParamsString(devid, params),
            successCallBack: function (data) {

                Public.customToast(data.response);

            }
        })

    });

    // 设备删除
    $(document).on('click', '.eq-delete', function () {

        var $checkboxList = $('#mornitor-list-data input:checked'),
            len = $checkboxList.length,
            checkboxIdArr = [];

        for (var i = 0; i < len; i++) {

            var val = $($checkboxList[i]).val();

            checkboxIdArr.push(val);

        }

        if (len > 0) {

            Public.msuiConfirm('是否删除所选设备？', function () {

                deleteEq(checkboxIdArr);

            });

        } else {
            Public.toast(locales.promptChecked);
        }

    });

    $('#multi-select').multiSelect();

    // 输入源切换
    $('#signal-screenWin').on('change', function () {

        var dataJson = JSON.parse($(this).attr('data-json')),
            val = $(this).val()*1;
            
        if(dataJson){
            $('#signal-sourc').val(getSignalBack(dataJson[val].value));
        }

    });

    //局部/全屏
    $('#signal-local-win').on('change', function () {

        var dataJson = JSON.parse($(this).attr('data-json')),
            val = $(this).val()*1;

        if (dataJson){
            $('#signal-local').val((dataJson[val].value == 1 ? 0 : 1));
        }

    });

    //亮度
    $('#signal-light-win').on('change', function () {

        var dataJson = JSON.parse($(this).attr('data-json')),
            val = $(this).val()*1;

        if (dataJson){
            $('.range').customSlider({
                initVal: dataJson[val].value
            });
        }

    });

})
















var HistoryRoute = {};
HistoryRoute._isOver = true; // 播放结束标志
HistoryRoute._isPlay = false; // 正在播放的状态
HistoryRoute.timerId = null; // 定时器ID
HistoryRoute.playSpeed = 300; // 播放速度
HistoryRoute.totalNum = 0; // 总记录数
HistoryRoute.markArryData = [];
HistoryRoute.carMark = null; // 
HistoryRoute.clearOverlayArr = [];
HistoryRoute.mapZoom = 0;
HistoryRoute.routePlayTime = 0; // 

// 获取数据并播放
HistoryRoute.getMarkPoint = function () {

    var _this = this,
        pointArry = [];

    _this.nCount = 0;
    _this.nCountPage = 0;
    _this.totalNum = _this.markArryData.length;

    _this.stop();
    // 清空已有数据
    _this.claerMapData();

    // 画线
    for (var i = 0; i < _this.totalNum; i++) {
        pointArry.push(new BMap.Point(_this.markArryData[i].lng, _this.markArryData[i].lat));
    }
    _this.drawRoute(pointArry);

    // 调整视野
    _this.getViewport(pointArry);

    // 加入开始点图标
    _this.addMraker('images/icon_begin.png', 60, 60, _this.markArryData[0]);

    _this.removeDisabledBtn('#routeStop');
    // 播放
    _this.play();

}
// 调整视野
HistoryRoute.getViewport = function (pointArry) {

    var _this = this,
        view = map.getViewport(pointArry);
    map.centerAndZoom(view.center, view.zoom);
    _this.mapZoom = view.zoom;

}
// 播放
HistoryRoute.play = function () {

    var _this = this,
        speed = $('#sliderSpeedText').attr('data-speed'),
        nowTime = Date.parse(new Date());

    if (_this._isPlay) return;

    // 获取数据
    if (speed === '0') {
        _this.playSpeed = 20;
    } else if (speed === '1') {
        _this.playSpeed = 10;
    } else if (speed === '2') {
        _this.playSpeed = 1;
    }

    if (_this.routePlayTime !== 0) {
        if (nowTime - _this.routePlayTime < 1000) return;
    }

    _this.removeDisabledBtn('#routePause');
    _this.removeDisabledBtn('#routeStop');
    _this.addDisabledBtn('#routePlay');

    // 开启计时器
    _this.timerId = window.setInterval(function () {

        _this._isOver = false;
        _this.PlayWithRoute();
        _this.routePlayTime = Date.parse(new Date());

    }, _this.playSpeed);

}
// 暂停
HistoryRoute.pause = function () {

    var _this = this;
    clearInterval(_this.timerId);
    _this.removeDisabledBtn('#routePlay');
    _this.addDisabledBtn('#routePause');

}
// 停止
HistoryRoute.stop = function () {

    var _this = this;

    clearInterval(_this.timerId);
    _this.removeDisabledBtn('#routePlay');
    _this.nCount = 0;
    _this.addDisabledBtn('#routePause');
    _this.addDisabledBtn('#routeStop');
    map.removeOverlay(_this.carMark);

}
// 移动点
HistoryRoute.PlayWithRoute = function () {

    var _this = this;

    if (_this.totalNum == _this.nCount) {

        clearInterval(_this.timerId);
        _this._isOver = true

        if (hasAjax) {
            _this.pause();
            pageLoading('#tabMapIn');
            return;
        }

        _this.nCount = 0;
        map.removeOverlay(_this.carMark);
        _this.removeDisabledBtn('#routePlay');
        _this.addDisabledBtn('#routeStop');
        return;
    }

    var record = _this.markArryData[_this.nCount],
        point = new BMap.Point(record.lng, record.lat);

    _this.carMarkRun(point, record);

    _this.nCount++;

}
// 移动箭头
HistoryRoute.carMarkRun = function (point, record) {

    var _this = this,
        icon = new BMap.Icon('images/car.png', new BMap.Size(45, 45)),
        marker = new BMap.Marker(point, {
            icon: icon
        }),
        html = '<div><font>' + record.html + '</font></div>' + '<div><font style="color:#d70000">速度：' + Math.round(record.speed) + '</font></div>' + '<div><font style="color:#76da00">GPS：' + record.satellite + '</font></div>',
        label = new BMap.Label(html, {
            offset: new BMap.Size(-20, -80)
        }),
        viewMarkArr = [];

    marker.setLabel(label);
    label.setStyle({
        fontSize: '14px',
        border: '1px solid #cdcdcd',
        borderRadius: '5px',
        padding: '0px 6px',
        lineHeight: '22px'
    });
    if (_this.carMark) map.removeOverlay(_this.carMark);
    _this.carMark = marker;

    // 偏向
    marker.setRotation(record.direction);
    map.addOverlay(marker);

    var bound = map.getBounds(); //地图可视区域
    if (bound.containsPoint(point) !== true) {
        map.centerAndZoom(point, _this.mapZoom);
    }

}
// 添加点
HistoryRoute.addMraker = function (img, sizeW, sizeH, markData) {

    var _this = this
    point = new BMap.Point(markData.lng, markData.lat),
        icon = new BMap.Icon(img, new BMap.Size(sizeW, sizeH)),
        marker = new BMap.Marker(point, {
            icon: icon
        }),
        label = new BMap.Label(GetDateTimeformat(markData.time, 'yyyy-MM-dd HH:mm:ss'), {
            offset: new BMap.Size(55, 5)
        });

    marker.setLabel(label);
    label.setStyle({
        backgroundImage: 'url(images/time_bg.png)',
        backgroundColor: 'rgba(0,0,0,0)',
        backgroundPosition: '0 0',
        width: '142px',
        height: '27px',
        backgroundSize: 'cover',
        border: 'none',
        lineHeight: '27px',
        textAlign: 'center'
    });
    marker.setOffset(new BMap.Size(0, -30));
    map.addOverlay(marker);

    // marker.addEventListener('click', function (){  
    //     _this.showInfo(this, marker);  
    // });  

    _this.clearOverlayArr.push(marker);

}
// 画路线
HistoryRoute.drawRoute = function (points) {

    var _this = this,
        polyline = new BMap.Polyline(points, {
            strokeColor: '#00c600',
            strokeWeight: 4,
            strokeOpacity: 1
        });

    map.addOverlay(polyline);
    _this.clearOverlayArr.push(polyline);

}
// 按钮禁用
HistoryRoute.addDisabledBtn = function (obj) {

    $(obj).addClass('disabled');

}
// 按钮启用
HistoryRoute.removeDisabledBtn = function (obj) {

    $(obj).removeClass('disabled');

}
// 清空地图已有的数据
HistoryRoute.claerMapData = function () {

    var _this = this,
        overlayLen = _this.clearOverlayArr.length;

    _this.stop();
    _this.addDisabledBtn('#routePlay');

    for (var i = 0; i < overlayLen; i++) {
        map.removeOverlay(_this.clearOverlayArr[i]);
    }

}
// 弹窗显示
HistoryRoute.showInfo = function (thisMaker, point) {

    var sContent = '<ul class="baiduMapInfoWin">' +
        '<li class="item">' +
        '<span class="title">司机</span><span class="info">' + '李某' + '</span>' +
        '</li>' +
        '<li class="item">' +
        '<span class="title">车牌</span><span class="info"> ' + '粤S85585' + '</span>' +
        '</li>' +
        '<li class="item">' +
        '<span class="title">时间</span><span class="info"> ' + '2017-02-05 15:20:20' + '</span>' +
        '</li>' +
        '<li class="item">' +
        '<span class="title">省市</span><span class="info"> ' + '广东省深圳市宝安区' + '</span>' +
        '</li>' +
        '<li class="item">' +
        '<span class="title">道路</span><span class="info"> ' + '石岩街道创维天桥创维数字' + '</span>' +
        '</li>' +
        '<li class="item">' +
        '<span class="title">附近</span><span class="info"> ' + '' + '</span>' +
        '</li>' +
        '</ul>';

    var opts = {
        width: 300, // 信息窗口宽度
        height: 180, // 信息窗口高度
        //   title : thisMaker.devName ,   // 信息窗口标题
        enableMessage: false //设置允许信息窗发送短息
    }

    var infoWindow = new BMap.InfoWindow(sContent, opts); // 创建信息窗口对象  
    thisMaker.openInfoWindow(infoWindow); //图片加载完毕重绘infowindow

}