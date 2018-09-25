var menu = new FlMenu(),
    type = 'picture',
    mobileListData = new MobileListData({
        url: PublicUrl.programListUrl(),
        data: {
            programName: $('#search-name').val(),
            beginTime: $('#datetime-start').val(),
            endTime: $('#datetime-end').val(),
            isAuditStatus: 0,
            isCommonStatus: 0
        },
        listObj: '#play-list-data',
        getListHtml: getListHtml,
        dataSuccessCall: function () {

        }
    });

function getListHtml(data) {

    var shtml = '',
        allChecked = $('#checkAll').prop('checked');

    for (var i = 0, len = data.length; i < len; i++) {

        var itemData = data[i]
        programId = itemData.programId,
            programName = itemData.programName,
            devEquipmentType = itemData.devEquipmentType,
            isAudit = itemData.isAuditStatus,
            isAuditStatus = Public.isStatus(isAudit),
            updateBy = itemData.updateBy,
            updateDate = Public.momentFormat(itemData.updateDate, 'YYYY-MM-DD HH:mm:ss'),
            isCommonStatus = Public.isCommon(itemData.isCommonStatus);

        shtml += '<div class="item">' +
            '<div class="head">' +

            '<div class="item-title pull-left">' +
            '<div class="label-checked-box">' +
            '<input type="checkbox" ' + (allChecked ? 'checked' : '') + ' id="check-' + programId + '" value="' + programId + '" />' +
            '<label for="check-' + programId + '">' +
            // '<span class="name">' +
            // programName +
            // '</span>' +
            '</label>' +
            '</div>' +
            '<div class="item-name">' +
            programName +
            '</div>' +
            '</div>' +

            '<div class="icon pull-right clearfix">' +
            '<a href="javascript:void(0);" class="iconfont icon-shanchu1 pull-right item-remove" data-id="' + programId + '"></a>' +
            '<a href="javascript:void(0);" class="iconfont icon-bofang pull-right item-play" data-id="' + programId + '"></a>' +
            '<a href="javascript:void(0);" class="iconfont icon-bianji pull-right item-info" data-json=\'' + JSON.stringify(itemData) + '\'></a>' +
            '<a href="playediter.html?id=' + programId + '&eq=' + devEquipmentType + '" class="iconfont icon-bianpai pull-right" external></a>' +
            '<a href="javascript:void(0);" data-programName="' + programName + '" data-programId="' + programId + '" data-audit="' + isAudit + '" class="iconfont icon-iconfontfasong pull-right play-send" external></a>' +
            '</div>' +
            '</div>' +
            '<div class="info">' +
            '<div class="row">' +
            '<div class="col-50">' +
            '<div class="name pull-left">' +
            locales.auditState +
            '</div>' +
            '<div class="data pull-left">' +
            isAuditStatus +
            '</div>' +
            '</div>' +
            '<div class="col-50">' +
            '<div class="name pull-left">' +
            locales.eqModal +
            '</div>' +
            '<div class="data pull-left">' +
            devEquipmentType +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-50">' +
            '<div class="name pull-left">' +
            locales.updateMan +
            '</div>' +
            '<div class="data pull-left">' +
            updateBy +
            '</div>' +
            '</div>' +
            '<div class="col-50">' +
            '<div class="name pull-left">' +
            locales.isCommonState +
            '</div>' +
            '<div class="data pull-left">' +
            '<span class="font-green">' + isCommonStatus + '</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-80">' +
            '<div class="name pull-left">' +
            locales.updateTime +
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

// 刷新数据
function refreshData() {

    mobileListData.options.data = {
        programName: $('#search-name').val(),
        beginTime: $('#datetime-start').val(),
        endTime: $('#datetime-end').val(),
        isAuditStatus: 0,
        isCommonStatus: 0
    }
    mobileListData.options.initData = true;
    mobileListData.init();
    $('#program-search').removeAttr('disabled');

}

// 删除节目
function deleteProgram(itemId) {

    Public.ajaxCall({
        type: 'DELETE',
        url: PublicUrl.programContUrl() + itemId,
        successCallBack: function (data) {

            Public.toast(data.response);

            setTimeout(function () {
                refreshData();
            }, 800);

        }
    });

}

// 节目编辑 修改
function programAjax() {

    var $program = $('.popup-program'),
        flag = $program.attr('data-flag'),
        name = $('#popup-program-name').val(),
        lable = $('#popup-program-lable').val(),
        devEquipmentType = $('#popup-program-eq').val(),
        isCommon = $('input[name="isCommon"]:checked').val(),
        resolution = $('input[name="resolution"]:checked').val(),
        resolutionSize = $('#popup-program-resolution').val(),
        width = $('#popup-program-width').val(),
        height = $('#popup-program-height').val(),
        remark = $('#popup-program-remark').val(),
        data = {},
        ajaxType = '';

    if (resolution === '0') {
        width = resolutionSize.split('*')[0];
        height = resolutionSize.split('*')[1];
    }

    data = {
        devEquipmentType: devEquipmentType,
        isCommonStatus: isCommon,
        programLabel: lable,
        programName: name,
        programWidthPoints: width,
        programHeightPoints: height,
        remarks: remark
    };

    // 新建
    if (flag === '0') {

        ajaxType = 'POST';

    }
    // 编辑
    else if (flag === '1') {

        data.programId = $program.attr('data-programid');
        data._method = 'put';
        ajaxType = 'POST';

    }
    
    Public.showPreloader('提交中...');

    Public.ajaxCall({
        type: ajaxType,
        url: PublicUrl.programContInfoUrl(),
        data: data,
        successCallBack: function (data) {
            
            Public.hidePreloader();

            Public.customToast(data.response);

            Public.closeModal('.popup-program');
            $('#program-submit').removeAttr('disabled');
            setTimeout(function () {
                refreshData();
            }, 800);

        },
        errorCallBack: function (data) {
            
            Public.hidePreloader();
            Public.customToast(data.response);
            $('#program-submit').removeAttr('disabled');

        }
    });

}

$(function () {

    Public.showPreloader('加载中...');

    $.init();
    menu.init();
    mobileListData.init();

    // 预览节目
    $(document).on('click', '.item-play', function () {

        var programId = $(this).attr('data-id');

        Public.ajaxCall({
            type: 'GET',
            url: PublicUrl.programContPageUrl() + programId,
            successCallBack: function (data) {

                var response = data.response,
                    jsonData = JSON.parse(response.showList).showInfo,
                    width = jsonData.programWidthPoints,
                    height = jsonData.programHeightPoints,
                    pageList = jsonData.pageList,
                    len = pageList.length,
                    shtml = '';

                for (var i = 0; i < len; i++) {

                    var pageListItem = pageList[i],
                        pageName = pageListItem.pageName,
                        pagePlaytime = pageListItem.pagePlaytime,
                        pageFilePath = PublicUrl.materialResourceUrl() + pageListItem.pageFilePath,
                        js = pageFilePath.replace(/\\/g, '/'),
                        width = width,
                        height = height;

                    shtml += '<li>\
                        <div class="row">\
                            <div class="col-40">\
                               ' + pageName + '\
                            </div>\
                            <div class="col-40">\
                                ' + pagePlaytime + 'S\
                            </div>\
                            <div class="col-20">\
                                <a class="iconfont icon-bofang play" href=\'show/demo.html?js=' + js + '&width=' + width + '&height=' + height + '\'></a>\
                            </div>\
                        </div>\
                    </li>';

                }

                $('#popup-program-show-list').empty();
                $('#popup-program-show-list').append(shtml);

                Public.popup('.popup-program-show');

            }
        })

    });

    // 修改节目
    $(document).on('click', '.item-info', function () {

        var $this = $(this),
            dataJson = JSON.parse($this.attr('data-json')),
            programId = dataJson.programId,
            devEquipmentType = dataJson.devEquipmentType,
            isCommonStatus = dataJson.isCommonStatus,
            programLabel = dataJson.programLabel,
            programName = dataJson.programName,
            programWidthPoints = dataJson.programWidthPoints,
            programHeightPoints = dataJson.programHeightPoints,
            remarks = Public.isDefine(dataJson.remark) ? dataJson.remark : '';

        var $program = $('.popup-program');

        $program.attr('data-flag', '1');
        $program.attr('data-programid', programId);
        $program.find('.popup-title').text(locales.editProgram);
        $('#program-submit').removeAttr('disabled');
        $('#popup-program-name').val(programName);
        $('#popup-program-lable').val(programLabel);
        $('#popup-program-eq').val(devEquipmentType);
        $('input[name="isCommon"]:checked').val(isCommonStatus);
        $('#public-resolutionB').prop('checked', true);
        $('#custom').show();
        $('#alternative').hide();
        $('#popup-program-width').val(programWidthPoints);
        $('#popup-program-height').val(programHeightPoints);
        $('#popup-program-remark').val(remarks);

        Public.popup('.popup-program');

    });

    // 删除按钮
    $(document).on('click', '.confirm-ok', function () {

        var $checkboxList = $('#play-list-data input:checked'),
            len = $checkboxList.length,
            checkboxIdArr = [];

        for (var i = 0; i < len; i++) {

            var val = $($checkboxList[i]).val();

            checkboxIdArr.push(val);

        }

        if (len > 0) {

            Public.msuiConfirm(locales.promptDelete, function () {

                deleteProgram(checkboxIdArr);

            });

        } else {
            Public.toast(locales.promptChecked);
        }

    });

    // 节目删除
    $(document).on('click', '.item-remove', function () {

        var itemId = $(this).attr('data-id');

        Public.msuiConfirm(locales.promptDelete, function () {

            deleteProgram(itemId);

        });

    });

    // 添加新节目
    $(document).on('click', '#program-add', function () {

        var $program = $('.popup-program');

        $program.find('input[type=text]').val('');
        $program.find('select').val('');
        $program.find('.popup-title').text(locales.newProgram);
        $program.attr('data-flag', '0');

        Public.popup('.popup-program');

    });

    // 搜索
    $(document).on('click', '#header-search', function () {

        Public.popup('.popup-search');

    });

    // 分辨率选择
    $(document).on('change', 'input[name="resolution"]', function () {

        var value = $(this).val();

        if ($(this).prop('checked')) {

            if (value === '0') {
                $('#alternative').show();
                $('#custom').hide();
            } else {
                $('#alternative').hide();
                $('#custom').show();
            }

        }

    });

    // 发送
    $(document).on('click', '.play-send', function () {

        var $this = $(this),
            programId = $this.attr('data-programId'),
            programName = $this.attr('data-programName'),
            audit = $this.attr('data-audit');

        if (audit === '1') {

            Public.toast('该节目未审核，无法发送！');

            return;

        }

        window.location.href = 'eq.html?programId=' + programId + '&name=' + programName + '';

    })

    Public.mvalidate({
        obj: '#search-Form',
        descriptions: {
            name: {
                required: locales.validateName,
                pattern: locales.validateRq
            },
        },
        validCall: function () {

            var starTime = $('#datetime-start').val(),
                endTime = $('#datetime-end').val(),
                params = {
                    starDate: starTime,
                    endDate: endTime
                };

            if (Public.momentIsBefore(params) || Public.momentIsSame(params) || (!Public.isDefine(starTime) && !Public.isDefine(endTime))) {
                $('#program-search').attr('disabled', 'disabled');
                Public.closeModal('.popup-search');

                refreshData();
            } else {
                Public.toast(locales.dateMoment);
            }

        }
    })

    // 节目表单提交
    Public.mvalidate({
        obj: '#program-Form',
        descriptions: {
            name: {
                required: locales.validateName,
                pattern: locales.validateRq
            },
            eq: {
                required: locales.validateEq,
            },
            lable: {
                required: locales.validateLable,
                pattern: locales.validateRq
            },
            resolution: {
                required: locales.validateRes,
            },
            width: {
                required: locales.validateWidth,
            },
            height: {
                required: locales.validateHeight,
            }
        },
        validCall: function () {
            $('#program-submit').attr('disabled', 'disabled');
            programAjax();
        },
        eachValidFieldCall: function (val) {

            var resolution = $('input[name="resolution"]:checked').val();

            if (resolution === '0') {

                $('#popup-program-width').attr('data-required', 'false');
                $('#popup-program-height').attr('data-required', 'false');
                $('#popup-program-resolution').attr('data-required', 'true');

            } else {

                $('#popup-program-width').attr('data-required', 'true');
                $('#popup-program-height').attr('data-required', 'true');
                $('#popup-program-resolution').attr('data-required', 'false');

            }

        }
    })

    // 时间
    Public.datetimePicker({
        obj: '#datetime-start, #datetime-end',
        format: 'YYYY-MM-DD', // 'YYYY-MM-DD' 'YYYY-MM-DD hh:mm:ss' 'YYYY-MM-DD hh:mm' ' hh:mm:ss'
    });

    $('#look').on('click', function () {
        alert($('.page-group').html())
    });

});