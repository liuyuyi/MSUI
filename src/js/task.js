var menu = new FlMenu(),
    mobileListData = new MobileListData({
        url: PublicUrl.taskListUrl(),
        data: {
            groupId: 0,
            taskStatus: $('#task-state').val(),
            type: 2,
            taskType: '',
            languageType: Public.languageType,
            devCode: $('#mornitor-searcheq').val(),
            startTime: $('#datetime-start').val(),
            endTime: $('#datetime-end').val()
        },
        listObj: '#mornitor-list-data',
        getListHtml: getListHtml
    }),
    searchDateObj = null;

function getListHtml(data) {

    var shtml = '';

    for (var i = 0, len = data.length; i < len; i++) {

        var itemData = data[i]
        devCode = itemData.devCode,
            devName = itemData.devName,
            taskId = itemData.taskId,
            programName = itemData.programName,
            taskStatus = Public.isTaskStatue(itemData.taskStatus),
            taskPercent = itemData.taskPercent,
            taskType = Public.isPramStatue(itemData.taskType),
            updateDate = Public.momentFormat(itemData.updateDate, 'YYYY-MM-DD HH:mm:ss'),
            taskContent = itemData.taskContent,
            statusDisplay = 'none',
            deleteDisplay = 'none';

        if (taskStatus == 3) {
            statusDisplay = 'block';
        }

        if (taskPercent == 0 || taskPercent == null) {
            deleteDisplay = 'block';
        }

        shtml += '<div class="item" data-info="' + taskContent + '">' +
            '<div class="head">' +
            '<span class="name">' +
            devCode +
            '</span>' +
            '<div class="icon pull-right clearfix">' +
            '<a href="javascript:void(0);" class="iconfont icon-iconfontfasong pull-right task-sendagin" data-taskid="' + taskId + '" style="display:' + statusDisplay + '"></a>' +
            '<a href="javascript:void(0);" class="iconfont icon-shanchu1 pull-right task-delete" data-taskid="' + taskId + '" style="display:' + deleteDisplay + '"></a>' +
            '</div>' +
            '</div>' +
            '<div class="info">' +
            '<div class="row">' +
            '<div class="col-100">' +
            '<div class="name pull-left">' +
            '节目名称：' +
            '</div>' +
            '<div class="data pull-left">' +
            (programName ? programName : '') +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-100">' +
            '<div class="name pull-left">' +
            '设备名称：' +
            '</div>' +
            '<div class="data pull-left">' +
            devName +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-50">' +
            '<div class="name pull-left">' +
            '任务进度：' +
            '</div>' +
            '<div class="data pull-left">' +
            taskPercent +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-100">' +
            '<div class="name pull-left">' +
            '下发类型：' +
            '</div>' +
            '<div class="data pull-left">' +
            taskType +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-100">' +
            '<div class="name pull-left">' +
            '任务状态：' +
            '</div>' +
            '<div class="data pull-left">' +
            taskStatus +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-80">' +
            '<div class="name pull-left">' +
            '创建时间：' +
            '</div>' +
            '<div class="data pull-left">' +
            updateDate +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

    }

    return shtml;

}

// 刷新
function refreshData() {

    var state = $('#task-state').val(),
        sendTypeArr = [],
        taskType = [],
        devCode = $('#task-searcheq').val(),
        starTime = $('#datetime-start').val(),
        endTime = $('#datetime-end').val(),
        groupId = treeEq.getSelectedItemId(),
        param = {
            groupId: groupId,
            taskStatus: state,
            languageType: Public.languageType,
            devCode: devCode,
            startTime: starTime,
            endTime: endTime,
            type: 2
        },
        dataItems = $('#multi-select').attr('data-items');

    sendTypeArr = (dataItems === '' || dataItems === null) ? [] : dataItems.split(',');

    for (var i = 0, len = sendTypeArr.length; i < len; i++) {

        var typeId = 0;

        if (sendTypeArr[i] === '下发频道') {
            typeId = 140;
        } else if (sendTypeArr[i] === '下发节目') {
            typeId = 150;
        } else if (sendTypeArr[i] === '插播节目') {
            typeId = 160;
        } else if (sendTypeArr[i] === '插播字幕') {
            typeId = 170;
        }

        taskType.push(typeId);

    }

    param.taskType = JSON.stringify(taskType);

    mobileListData.options.data = param;
    mobileListData.options.initData = true;
    mobileListData.init();
    $('#task-submit').removeAttr('disabled');


}
// 删除或重新发送
function setTaskStatus(taskId, status) {

    Public.ajaxCall({
        type: 'POST',
        url: PublicUrl.taskInfoUrl(),
        data: {
            taskId: taskId,
            taskStatus: status
        },
        successCallBack: function (data) {

            Public.toast(data.response);
            refreshData();

        }
    });

}

$(function () {

    Public.showPreloader('加载中...');

    $.init();
    menu.init();
    mobileListData.init();

    treeEq = Public.dhtmlxTreeGroupNoCheck(function () {

        refreshData();

    });

    treeEq.attachEvent("onClick", function (id, state) {

        refreshData();

    });

    // 搜索弹窗
    $(document).on('click', '#search-popup', function () {

        Public.popup('.popup-search');

        if (searchDateObj === null) {

            searchDateObj = Public.datetimePicker({
                obj: '#map-beginTime,#map-endTime'
            });

        }

    });

    // 提交搜索
    $(document).on('click', '#task-submit', function () {

        var starTime = $('#datetime-start').val(),
            endTime = $('#datetime-end').val(),
            params = {
                starDate: starTime,
                endDate: endTime
            };

        $('#task-submit').attr('disabled', 'disabled');

        if (Public.momentIsBefore(params) || Public.momentIsSame(params) || (!Public.isDefine(starTime) && !Public.isDefine(endTime))) {
            Public.closeModal('.popup-search');
            refreshData();
        } else {
            $('#task-submit').removeAttr('disabled');
            Public.toast(locales.dateMoment);
        }

    });

    // 多选
    $('#multi-select').multiSelect({
        title: '选择任务类型',
        select: ['下发频道', '下发节目', '插播节目', '插播字幕']
    });

    // 监控树结构
    $(document).on('click', '#eq-popup', function () {

        Public.popup('.popup-eq');

    });

    // 重新发送任务
    $(document).on('click', '.task-sendagin', function () {

        var taskId = $(this).attr('data-taskid');

        Public.msuiConfirm('确定重新发送该任务？', function () {

            setTaskStatus(taskId, 0);

        });

    });

    // 删除任务
    $(document).on('click', '.task-delete', function () {

        var taskId = $(this).attr('data-taskid');

        Public.msuiConfirm('确定删除该任务？', function () {

            setTaskStatus(taskId, 6);

        });

    });

    // 详情
    $(document).on('click', '#mornitor-list-data .item', function () {

        var info = $(this).attr('data-info');
        $('#task-info').text(info);
        Public.popup('.popup-program-show');

    });

    // 时间
    Public.datetimePicker({
        obj: '#datetime-start, #datetime-end',
        format: 'YYYY-MM-DD hh:mm:ss', // 'YYYY-MM-DD' 'YYYY-MM-DD hh:mm:ss' 'YYYY-MM-DD hh:mm' ' hh:mm:ss'
    });

})