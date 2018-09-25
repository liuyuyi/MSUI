var mobileListData = new MobileListData({
        url: PublicUrl.deviceListUrl(),
        data: {
            type: $('#mornitor-eqstate').val(),
            languageType: Public.languageType,
            devName: $('#mornitor-searcheq').val(),
            startTime: $('#datetime-start').val(),
            endTime: $('#datetime-end').val(),
            equipType: $('#popup-program-eq').val()
        },
        listObj: '#mornitor-list-data',
        getListHtml: getListHtml
    }),
    treeEq = null,
    $document = $(document),
    searchDateObj = null,
    urlItem = Public.getUrlItem(window.location.href),
    pargarmId = urlItem['programId'],
    pargarmName = urlItem['name'];

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
    Public.isArry(eqtype) ? param.equipType = eqtype : '';

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

$(function () {

    Public.showPreloader('加载中...');

    $('.program-title').text('节目：' + pargarmName);

    $.init();

    // 时间
    Public.datetimePicker({
        obj: '#datetime-start, #datetime-end',
        format: 'YYYY-MM-DD', // 'YYYY-MM-DD' 'YYYY-MM-DD hh:mm:ss' 'YYYY-MM-DD hh:mm' ' hh:mm:ss'
    });

    mobileListData.init();

    if (treeEq === null) {
        treeEq = Public.dhtmlxTreeGroup();
        treeEq.attachEvent("onCheck", function (id, state) {

            refreshData();

        });
    }

    // 发送按钮
    $document.on('click', '.program-send', function () {

        var $checkboxList = $('#mornitor-list-data input:checked'),
            len = $checkboxList.length,
            checkboxIdArr = [];

        if (len === 0) {

            Public.toast('请至少选择一个设备！');
            return;

        }

        Public.msuiConfirm('是否确定发送？', function () {

            Public.showPreloader('发送中...');

            for (var i = 0; i < len; i++) {

                var val = $($checkboxList[i]).val() * 1;

                checkboxIdArr.push(val);

            }

            Public.ajaxCall({
                type: 'POST',
                url: PublicUrl.programSendUrl() + pargarmId,
                data: {
                    did: JSON.stringify(checkboxIdArr),
                    type: 2
                },
                successCallBack: function (data) {

                    Public.hidePreloader();
                    Public.toast(data.response);

                }
            });

        });

    });

    // 监控树结构
    $document.on('click', '#eq-popup', function () {

        // $('#eq-tree').empty();
        Public.popup('.popup-eq');

    });

    // 搜索
    $document.on('click', '#search-popup', function () {

        Public.popup('.popup-search');
        if (searchDateObj === null) {
            searchDateObj = Public.datetimePicker({
                obj: '#map-beginTime,#map-endTime'
            });
        }
    });

    // 搜索按钮
    $document.on('click', '#mornitor-submit', function () {

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
            $('#task-submit').removeAttr('disabled');
            Public.toast(locales.dateMoment);
        }

    });

    // 返回
    $document.on('click', '.go-back', function () {

        window.history.go(-1);

    });

    $('#multi-select').multiSelect();

})