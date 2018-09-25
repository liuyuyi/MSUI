var menu = new FlMenu(),
    // 节目审核列表
    pageUrl = PublicUrl.auditProgramUrl(),
    // 素材审核列表
    materialUrl = PublicUrl.auditMaterialUrl(),
    mobileListData = new MobileListData({
        url: pageUrl,
        data: {
            programName: $('#search-name').val(),
            isAuditStatus: $('#search-auditState').val()
        },
        listObj: '#audit-list-data',
        getListHtml: getListHtml
    }),
    auditType = '2',
    videoPlayer = null;

function getListHtml(data) {

    var shtml = '',
        allChecked = $('#checkAll').prop('checked');

    for (var i = 0, len = data.length; i < len; i++) {

        var itemData = data[i],
            programId = itemData.programId,
            programName = itemData.programName,
            isAuditStatusData = itemData.isAuditStatus
        isAuditStatus = Public.isStatus(isAuditStatusData),
            updateBy = itemData.updateBy,
            updateDate = Public.momentFormat(itemData.updateDate, 'YYYY-MM-DD HH:mm:ss'),
            isCommonStatus = Public.isCommon(itemData.isCommonStatus);

        shtml += '<div class="item">' +
            '<div class="head">' +
            '<div class="label-checked-box pull-left">' +
            '<input type="checkbox" ' + (allChecked ? 'checked' : '') + ' id="check-' + programId + '" value="' + programId + '" data-state="' + isAuditStatusData + '" />' +
            '<label for="check-' + programId + '">' +
            '</label>' +
            '</div>' +
            '<div class="pull-left">' +
            '<span class="name">' +
            programName +
            ' </span>' +
            ' </div>' +
            '<div class="icon pull-right clearfix">' +
            // '<a href="javascript:void(0);" data-id="' + programId +'" class="iconfont icon-check-a pull-right audit-pass"></a>' +
            '<a href="javascript:void(0);" class="iconfont icon-chakan pull-right item-play" data-id="' + programId + '"></a>' +
            '</div>' +
            '</div>' +
            '<div class="info">' +
            '<div class="row">' +
            '<div class="col-50">' +
            '<div class="name pull-left">' +
            '审核状态：' +
            ' </div>' +
            '<div class="data pull-left">' +
            '<span class="font-green">' + isAuditStatus + '</span>' +
            '</div>' +
            '</div>' +
            '<div class="col-50">' +
            '<div class="name pull-left">' +
            '公开状态：' +
            '</div>' +
            '<div class="data pull-left">' +
            '<span class="font-green">' + isCommonStatus + '</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-50">' +
            '<div class="name pull-left">' +
            '更新人：' +
            '</div>' +
            '<div class="data pull-left">' +
            updateBy +
            ' </div>' +
            '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-80">' +
            '<div class="name pull-left">' +
            '更新时间：' +
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

function getMediaListHtml(data) {

    var shtml = '<div class="row">',
        allChecked = $('#checkAll').prop('checked');

    for (var i = 0, len = data.length; i < len; i++) {

        shtml += PublicDataHtml.getMediaHtml(data[i], allChecked);

    }

    return shtml + '</div>';

}

// 素材审核搜索
function searchMaterial() {

    mobileListData.options.data = {
        materialAuditStatus: $('#search-auditState').val(),
        materialLabel: $('#search-name').val(),
    };
    mobileListData.options.getListHtml = getMediaListHtml;
    mobileListData.options.dataSuccessCall = function (data) {

        echo.init({
            offset: 0,
            throttle: 0,
            container: document.getElementById('content-list'),
            callback: function (element, op) {}
        });

    }

}

// 节目审核搜索
function searchProgram() {

    mobileListData.options.data = {
        isAuditStatus: $('#search-auditState').val(),
        programName: $('#search-name').val(),
    };
    mobileListData.options.getListHtml = getListHtml;
    mobileListData.options.dataSuccessCall = function () {


    }

}

// 数据刷新
function refreshData() {

    mobileListData.options.initData = true;
    mobileListData.init();

}

// 1取消审核 2 通过审核
function auditAjax(url, params, ids) {
   
    Public.ajaxCall({
        type: 'POST',
        url: url + ids,
        data: params,
        successCallBack: function (data) {

            Public.toast(data.response);

            setTimeout(function () {
                refreshData();
            }, 300);

        }
    });

}


$(function () {

    Public.showPreloader('加载中...');
    $.init();
    menu.init();
    mobileListData.init();

    videoPlayer = $('#video-player').videoPlayer();

    Public.calendar('#datetime-start,#datetime-end', {
        value: [Public.momentFormat(new Date(), 'YYYY-MM-DD')]
    });

    // 图片预览
    $(document).on('click', '.picture', function () {

        var url = $(this).attr('data-url');

        $('.popup-picture').find('img').attr('src', url);
        Public.popup('.popup-picture');

    });
    // 视频预览
    $(document).on('click', '.video', function () {

        var url = $(this).attr('data-src');

        $('#video-player video').attr('src', url)
        Public.popup('.popup-video');

        videoPlayer.btnInit();

    });

    // 视频预览关闭停止播放
    $(document).on('click', '.video-close-popup', function () {
        videoPlayer.stopVideo();
    });

    // 审核页面切换
    $(document).on('click', '.fl-menu-btn', function () {

        auditType = $(this).attr('data-type');

        var $title = $('#header-title'),
            $contentPage = $('.content-page-list'),
            url = '';


        $('#checkAll').prop('checked', false);

        if (auditType === '1') {

            $title.text('素材审核');

            url = materialUrl;
            searchMaterial();
            $contentPage.removeClass('content-play-list').addClass('content-media-list');

        } else if (auditType === '2') {

            $title.text('节目审核');

            url = pageUrl;
            searchProgram();
            $contentPage.removeClass('content-media-list').addClass('content-play-list');

        }

        mobileListData.options.url = url;
        refreshData();

    });

    // 审核
    $(document).on('click', '.confirm-audit', function () {

        var $checkboxList = $('#audit-list-data input:checked'),
            len = $checkboxList.length,
            checkboxIdArr = [],
            type = $(this).attr('data-type'),
            confirmTitle = '',
            isAuditFinArr = [],
            ajaxUrl = '',
            ajaxData = {};

        for (var i = 0; i < len; i++) {

            var $check = $($checkboxList[i]),
                val = $check.val(),
                state = $check.attr('data-state');

            isAuditFinArr.push(state);
            checkboxIdArr.push(val);

        }

        isAuditFinArr = Public.uniqueArray(isAuditFinArr);

        if (len > 0) {

            if (isAuditFinArr.length >= 2) {

                Public.toast('包含已审核的内容');
                return;
            }

            if (type === '1') {

                if (isAuditFinArr[0] !== '1') {

                    confirmTitle = '确定被选中的项目取消审核？';

                } else {
                    Public.toast('该项目未通过审核！');
                    return;
                }

            } else if (type === '2') {

                if (isAuditFinArr[0] !== '2') {
                    confirmTitle = '确定被选中的项目通过审核？';
                } else {
                    Public.toast('该项目已通过审核！');
                    return;
                }

            }

            // 素材审核
            if (auditType === '1') {

                ajaxUrl = PublicUrl.auditMaterialStateUrl();
                ajaxData = {
                    materialAuditStatus: type,
                    _method: 'put'
                };

            } else if (auditType === '2') {

                ajaxUrl = PublicUrl.auditProgramStateUrl();
                ajaxData = {
                    isAuditStatus: type,
                    _method: 'put'
                };

            }

            Public.msuiConfirm(confirmTitle,
            function () {

                auditAjax(ajaxUrl, ajaxData, checkboxIdArr);

            });

        } else {

            Public.toast(locales.promptChecked);

        }

    });

    // 搜索表单提交
    Public.mvalidate({
        obj: '#audit-form',
        descriptions: {
            name: {
                required: locales.validateName,
                pattern: locales.validateRq
            },
        },
        validCall: function () {

            $('#audit-submit').attr('disabled', 'disabled');

            var url = '';

            // 素材审核
            if (auditType === '1') {

                url = materialUrl;
                searchMaterial();

            } else if (auditType === '2') {

                url = pageUrl;
                searchProgram();

            }

            mobileListData.options.url = url;
            refreshData();
            Public.closeModal('.popup-search');

            setTimeout(function () {
                $('#audit-submit').removeAttr('disabled');
            }, 300);

        }
    });

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
                    </li>'

                }

                $('#popup-program-show-list').empty();
                $('#popup-program-show-list').append(shtml);

                Public.popup('.popup-program-show');

            }
        })

    });

})