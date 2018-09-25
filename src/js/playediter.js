var allPageResolution = '',
    pargarmId = Public.getUrlItem(window.location.href)['id'],
    pargarmEq = Public.getUrlItem(window.location.href)['eq'],
    pargarmPageIndex = 0,
    dragResize = null,
    serverData = null,
    menu = new FlMenu(),
    editerDataStore = null,
    nowPageScriptPath = '', // 当前加载JSON的js文件
    pageNo = 1, // 媒体素材初始页面
    mediaType = 1, // 媒体素材获取地址
    mediaChooseType = 0, // 判断区域新增或修改 0为新增 1为修改 2为原区域新增
    listColor = ['#434343', '#666666', '#b7b7b7', '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ffff', '#0000ff',
        '#9900ff', '#ff00ff', '#228b22', '#008000', '#87cefa'
    ],
    nowPageId = Public.getUrlItem(window.location.href)['pageId'];

window.addEventListener('error', function (err) {

    Editer_stage.tool.hideLoading();

    if (err.target.tagName === 'SCRIPT') {

        Editer_stage.tool.toast('当前节目不存在！');

        setTimeout(function () {

            // window.history.go(-1);
            window.location.href = 'play.html';

        }, 800);

    }

}, true)

// 进入页面初始化
function pageInit() {

    var shtml = '',
        editerData = null,
        maxPageTime = 0;

    // 清除舞台数据
    Editer_stage.tool.clearEditerAreaData();

    // 服务器请求数据 实例化  Editer_stage.editAreaData
    editerDataStore = new Editer_stage.editAreaData(serverData);
    editerData = editerDataStore.returnData();

    // 设置背景
    Editer_stage.tool.intEditerAreaBg(editerData);
    // Editer_stage.tool.setPageMsg(editerData.pageEle[0].bgColor)
    Editer_stage.tool.setEditerAreaBg();

    // 循环获取数据
    if (is_define(editerData.mediaEle)) {

        picJsonId = [];

        for (var i = 0, len = editerData.mediaEle.length; i < len; i++) {

            shtml += Editer_stage.tool.initEditareaItem(editerData.mediaEle[i]);

        }

    }

    // 加入舞台
    Editer_stage.tool.addEditerAreaData(shtml);

    // Editer_stage.tool.setZoom(50);
    // Editer_stage.tool.setTopSlider(50);
    Editer_stage.tool.siderbuildEditerArea(50);

    dragResize = new Editer_stage.dragResize({
        'panel': $('#editerCanvas-wrap')[0],
        'editerArea': $('.editerCanvas-main')[0],
        'resolutionWidth': Editer_stage.tool.getProgramResolutionWidth(),
        'resolutionHeight': Editer_stage.tool.getProgramResolutionHeight(),
        'eventDown': 'touchstart',
        'eventUp': 'touchend',
        'eventMove': 'touchmove'
        // 'objContextmenu': contextMenuHandler,
    });
    dragResize.addMouseListener();

    Editer_stage.tool.hideLoading();

}

function getJsPageInit() {

    // 加载JS文件
    Public.loadJs(nowPageScriptPath, function () {

        serverData = picDate;
        pageInit();

    });

}

// 图片 视频素材弹窗数据请求
function getMediaAjax() {

    Editer_stage.tool.showLoading('加载中...');

    Public.ajaxCall({
        type: 'GET',
        url: PublicUrl.materialListUrl() + mediaType,
        data: {
            isCommon: $('#isCommon').val(),
            name: $('#media-search').val(),
            pageNo: pageNo,
            pageSize: 6
        },
        successCallBack: function (data) {

            Editer_stage.tool.hideLoading();

            var shtml = '';

            if (pageNo === 1) $('#media-list-data').empty();

            for (var i = 0, len = data.response.list.length; i < len; i++) {

                shtml += getMediaHtml(data.response.list[i]);

            }

            if (data.response.pageNum !== data.response.lastPage && len > 0) {

                $('.more-media').show();
                $('.no-more-media').hide();

            } else {

                $('.more-media').hide();
                $('.no-more-media').show();

            };

            $('#media-list-data').append(shtml);
            
            echo.init({
                offset: 200,
                // throttle: 0,
                container: document.getElementById('content-list'),
                callback: function (element, op) {
                    console.log(element, 'has been', op + 'ed')
                }
            });

            setTimeout(function () {
                echo.render();
            }, 1000);

        }
    });

}

// 素材选择列表点击更多加载
function clickMore() {

    pageNo++;
    getMediaAjax();

}

// 打开素材搜索弹窗
function openMediaModal() {

    var titleName = '';

    if (mediaType === '1') {

        titleName = '图片素材';

    } else if (mediaType === '2') {

        titleName = '视频素材';

    }

    $('.popup-title').text(titleName);
    getMediaAjax();

    setTimeout(function () {

        $('.popup-media').addClass('silde-in').show();

    }, 800);

}

// 关闭素材搜索弹窗
function closeMediaModal() {

    var $modal = $('.popup-media');

    $modal.addClass('silde-out').removeClass('silde-in');

    pageNo = 1;
    $('#isCommon').val('');
    $('#media-search').val('');
    $('.media-list').scrollTop(0);

    setTimeout(function () {

        $modal.removeClass('silde-out').hide();

    }, 300);

}

// 图片数据
function getMediaHtml(data) {

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
        materialUrl = PublicUrl.materialResourceUrl() + materialRelativePath + materialStorageName;

    if (materialContentType.match('image.*')) {

        materialHtml = '<div class="picture" data-url="' + materialUrl + '"><img onerror="this.src=\'./../images/default.jpg\'" data-echo="' + materialUrl + '" src="./../images/default.jpg" alt=""></div>';
        // materialHtml = '<div class="picture" data-url="' + materialUrl + '"><img onerror="this.src=\'./../images/default.jpg\'" src="' + materialUrl + '" alt=""></div>';
        icon = '<i class="iconfont icon-tupian"></i>';

    } else if (materialContentType.match('video.*')) {

        materialHtml = '<div class="video" data-src="' + materialUrl + '"><i class="iconfont icon-qidong"></i></div>';
        icon = '<i class="iconfont icon-shipin"></i>';

    }

    var shtml = '<div class="media-list-item left">\
        <div class="item">\
            <div class="label-checked-box pull-left">\
                <input type="checkbox" id="check-' + materialId + '" value="' + materialId + '" data-json=\'' + JSON.stringify(data) + '\'>\
                    <label for="check-' + materialId + '"></label>\
                            </div>\
                <div class="item-in">\
                    <div class="pic">\
                        ' + materialHtml + '\
                        </div>\
                        <div class="info material-info" >\
                            <div class="material-info-item">' + materialOriginalName + '</div>\
                            <div class="material-info-item">\
                                <span class="iconStyle">\
                                    ' + icon + '\
                                </span>\
                                <span class="type">' + materialContentType + '</span>\
                            </div>\
                            <div class="material-info-item">\
                                <span class="iconStyle">\
                                    <i class="iconfont icon-duochicun"></i>\
                                </span>\
                                <span class="size">' + materialSize + '</span>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>';

    return shtml;

}

// 打开页面管理
function openPageInfo() {

    Editer_stage.tool.showLayout('page');
    $('.editer-page').addClass('silde-in');

}

// 关闭页面管理
function closePageInfo() {

    Editer_stage.areaDataShow.hideLeftSideBar('.editer-page');

}

// 添加颜色列表
function setColorList(color) {

    var shtml = '';

    $('.color-list').empty();

    for (var i = 0, len = color.length; i < len; i++) {

        var col = color[i];
        shtml += '<span data-color="' + col + '" style="background: ' + col + '"></span>'

    }

    $('.color-list').append(shtml);

}
// 保存页面
function savePage(flag) {

    var $li = $($('#editer-page-list li')[pargarmPageIndex]),
        pageJsonData = $li.attr('data-json'),
        pageId = Editer_stage.tool.getPageJsonData(pageJsonData, 'pageId'),
        pageFilePath = Editer_stage.tool.getPageJsonData(pageJsonData, 'pageFilePath'),
        pageData = editerDataStore.returnData(),
        pageSort = $li.index(),
        newPage = pageId === '' ? true : false,
        pageName = $('#page-name').val();

    Editer_stage.tool.showLoading('保存中...');

    Public.ajaxCall({
        type: 'POST',
        url: PublicUrl.programContListUrl(),
        data: {
            jsJson: JSON.stringify(pageData),
            pageFilePath: pageFilePath,
            pageId: pageId,
            pageName: pageName,
            pagePlaytime: $('#page-pauseTime').val(),
            programId: pargarmId,
            pageSort: pageSort
        },
        successCallBack: function (data) {

            Editer_stage.tool.hideLoading();


            var pageId = data.response.pageId,
                stringJson = JSON.stringify(data.response);

            // 改保存页面为新建页面时
            if (newPage) {

                Public.removeJs(nowPageScriptPath, 'js');
                $('#editer-page-list li[data-state="new"]').attr('data-pageid', pageId).attr('data-json', stringJson).removeAttr('data-state').find('.title').text(pageName);
                nowPageScriptPath = PublicUrl.materialResourceUrl() + data.response.pageFilePath;
                Public.loadJs(nowPageScriptPath, function () {

                    serverData = picDate;

                });

            } else {
                $('#editer-page-list li[data-pageid="' + pageId + '"]').attr('data-json', stringJson).find('.title').text(pageName);
            }

            Editer_stage.tool.toast('保存成功！');

            // 新建页面
            if (flag === 0) {
                addNewPage();
            }

            // 返回上一页
            if (flag === -1) {
                // window.history.go(-1);
                window.location.href = 'play.html';
            }

            // 预览
            if (flag === 1) {

                var js = nowPageScriptPath.replace(/\\/g, '/'),
                    width = Editer_stage.tool.getProgramResolutionWidth(),
                    height = Editer_stage.tool.getProgramResolutionHeight();

                window.location.href = 'show/demo.html?js=' + js + '&width=' + width + '&height=' + height + '&pageId=' + nowPageId + '&id=' + pargarmId + '&eq=' + pargarmEq;

            }

        }
    });

}
// 页面顺序
function controlPage(ajaxType, pageId, param, $list) {

    var sortType = param.type;

    Public.ajaxCall({
        type: ajaxType,
        url: PublicUrl.programContPageUrl() + pageId,
        data: param,
        successCallBack: function (data) {

            Editer_stage.tool.toast(data.response);

            if (sortType === 'up') {

                Editer_stage.tool.listSortUp($list);

            } else if (sortType === 'down') {

                Editer_stage.tool.listSortDown($list);

            } else {

                Editer_stage.tool.listSortRemove($list);
                setTimeout(function () {

                    changeRemovePage();

                }, 500);

            }

        }
    });

}

// 当前页面移除加载另一个页面
function changeRemovePage() {

    var $list = $('#editer-page-list li.active'),
        jsonData = JSON.parse($list.attr('data-json')),
        pageFilePath = PublicUrl.materialResourceUrl() + jsonData.pageFilePath,
        pageName = jsonData.pageName,
        pagePlaytime = jsonData.pagePlaytime;

    if (nowPageScriptPath !== pageFilePath) {

        Public.removeJs(nowPageScriptPath, 'js');

        nowPageScriptPath = pageFilePath;
        pargarmPageIndex = $list.index();
        Editer_stage.tool.setPageInfo(pageName, pagePlaytime);
        getJsPageInit();

    }

}

// 打开边框弹窗
function openBorderModal() {

    var elem = dragResize.getElemByBorder(),
        id = $(elem).attr('data-id'),
        jsonData = editerDataStore.getMediaData(id),
        borderSW = jsonData.borderSW,
        borderSpeed = jsonData.borderSpeed,
        borderType = jsonData.borderType,
        borderEffect = jsonData.borderEffect,
        displayBorder = 'none';

    if (borderSW) {
        $('#open-off').prop('checked', true);
        displayBorder = 'block';
    } else {
        $('#open-off').prop('checked', false);
        displayBorder = 'none';
    }

    $('.border-set').css('display', displayBorder);
    $('#area-border-speed').val(borderSpeed);
    $('#area-border-effects').val(borderEffect);
    $('#area-border-type').val(borderType);
    $('.border-img').css('background-image', 'url(./../images/editer_border/border' + borderType + '.png)');
    $('.popup-border').show().addClass('silde-in');

}
// 关闭边框弹窗
function closeBorderModal() {

    var $modal = $('.popup-border');

    $modal.addClass('silde-out').removeClass('silde-in');

    setTimeout(function () {

        $modal.hide().removeClass('silde-out');

    }, 300);

}

// 添加新页面
function addNewPage() {

    // 清除舞台区域
    Editer_stage.tool.clearEditerAreaData();
    serverData = {
        mediaEle: [],
        pageEle: [{
            bgImg: '',
            bgColor: '',
            bgName: '',
            eqType: pargarmEq
        }]
    };

    var $pageList = $('#editer-page-list'),
        $pageLi = $pageList.find('li'),
        len = $pageLi.length;

    $pageLi.removeClass('active');
    $pageList.append('<li class="active" data-state="new"><span class="title">页面</span></li>');
    Editer_stage.tool.setPageInfo('页面', 0);
    $('#page-name').attr('data-index', $pageLi.length)
    pargarmPageIndex = len;
    nowPageId = -1;
    pageInit();

}

// 复制页面
function copyPage() {

    var $li = $('#editer-page-list li.active'),
        pageId = $li.attr('data-pageid');

    if (pageId) {

        Public.ajaxCall({
            type: 'POST',
            url: PublicUrl.programContListUrl(),
            data: {
                pageId: pageId,
                _method: 'PUT'
            },
            successCallBack: function (data) {

                var response = data.response,
                    pageName = response.pageName,
                    pageId = response.pageId,
                    pagePlaytime = response.pagePlaytime,
                    pageFilePath = PublicUrl.materialResourceUrl() + response.pageFilePath;

                Public.removeJs(nowPageScriptPath, 'js');
                nowPageScriptPath = pageFilePath;

                $('#editer-page-list li').removeClass('active');
                $('#editer-page-list').append('<li class="active" data-json=\'' + JSON.stringify(response) + '\' data-pageid="' + pageId + '"><span class="title">' + pageName + '</span></li>');
                pargarmPageIndex = $('#editer-page-list li.active').index();
                $('#page-name').attr('data-index', pargarmPageIndex);
                Editer_stage.tool.setPageInfo(pageName, pagePlaytime);
                getJsPageInit();

            }
        });

    } else {

        Editer_stage.tool.toast('该页面暂未保存，请先保存！');

    }

}

function valChange(obj) {

    var $obj = $(obj),
        val = $obj.val();

    val = val.replace(/^[0]+[0-9]*$/gi, 1);
    if (val === '') val = 1;
    $obj.val('').val(val);
}

$(function () {

    Editer_stage.tool.showLoading('页面加载...');
    menu.init();

    setColorList(listColor);

    // 首次加载
    Public.ajaxCall({
        type: 'GET',
        url: PublicUrl.programContPageUrl() + pargarmId,
        successCallBack: function (data) {

            var response = data.response,
                jsonData = JSON.parse(response.showList).showInfo,
                width = jsonData.programWidthPoints,
                height = jsonData.programHeightPoints,
                pageList = jsonData.pageList;

            // 设置左下角分辨率
            Editer_stage.tool.setViewResolution(width, height);

            if (nowPageId) {

                for (var i = 0, len = pageList.length; i < len; i++) {

                    var pageId = pageList[i].pageId;

                    if (nowPageId == pageId) {

                        nowPageScriptPath = PublicUrl.materialResourceUrl() + pageList[i].pageFilePath;

                    }

                }

            } else {

                nowPageScriptPath = PublicUrl.materialResourceUrl() + pageList[0].pageFilePath;

                nowPageId = pageList[0].pageId;

            }

            // 设置页面信息
            Editer_stage.tool.setPageInfoList(response.showInfo.pageList);

            getJsPageInit();

        },
        errorCallBack: function () {


        }
    });

    // 加载更多数据
    $(document).on('tap', '.more-media', function () {
        clickMore();
    });

    // 图片 视频素材添加
    $(document).on('tap', '.editer-list-addBtn', function () {

        var $this = $(this);

        mediaType = $this.attr('data-flag');

        mediaChooseType = 1;

        openMediaModal();

    });

    // 选择素材弹窗确定
    $(document).on('tap', '#choose-media-sure', function () {

        var checkboxArr = $('#media-list-data input[type=checkbox]:checked'),
            len = checkboxArr.length;

        if (len > 0) {

            var srcGroup = [],
                time = 0,
                areaType = mediaType * 1 === 1 ? 1 : 0,
                addNewListsHtml = '',
                areaTypeName = Editer_stage.tool.getMediaType(areaType),
                editerId = $('#editer-info-' + areaTypeName).attr('data-id');

            if (mediaChooseType === 2 || mediaChooseType == 3) {

                if (len >= 2) {

                    Editer_stage.tool.toast('只能选择一个素材')
                    return;

                }

            }

            for (var i = 0; i < len; i++) {

                var jsonData = JSON.parse($(checkboxArr[i]).attr('data-json')),
                    time = jsonData.materialTime,
                    srcGroupsItem = {};

                srcGroupsItem.name = jsonData.materialOriginalName;
                srcGroupsItem.id = jsonData.materialId;
                srcGroupsItem.src = jsonData.materialRelativePath + jsonData.materialStorageName;
                srcGroupsItem.size = jsonData.materialSize;

                // 视频素材时
                if (areaType === 0) {

                    srcGroupsItem.time = time;
                    time += time;

                }

                srcGroup.push(srcGroupsItem);

                if (mediaChooseType === 1) {


                    addNewListsHtml += Editer_stage.tool.getItemListHtml(srcGroupsItem, mediaChooseType, editerId);
                    editerDataStore.setItemListGroupData(editerId, srcGroupsItem);

                }

            }

            // 新增区域
            if (mediaChooseType === 0) {

                editerDataStore.addItemToData(areaType, srcGroup, (areaType === 1 ? 5 : time));

            }
            // 原区域添加素材
            else if (mediaChooseType === 1) {

                $('#editer-' + areaTypeName + '-list').append(addNewListsHtml);

            }
            // 原文件修改
            else if (mediaChooseType === 2) {

                var $list = $('#editer-' + areaTypeName + '-list li.active'),
                    jsoData = JSON.parse($list.attr('data-json')),
                    itemIndex = $list.attr('data-itemindex'),
                    itemId = jsoData.id;

                editerDataStore.setItemListData(editerId, itemId, itemIndex, srcGroup[0]);
                Editer_stage.tool.setListItemData(areaTypeName, editerId, itemId, itemIndex, srcGroup);

            }
            // 背景图片
            else if (mediaChooseType === 3) {

                var src = srcGroup[0].src,
                    name = srcGroup[0].name,
                    param = {
                        bgImg: src,
                        bgName: name
                    };

                editerDataStore.setDataBg(param);

                Editer_stage.tool.setEditerAreaBg();

            }

            editerDataStore.getMediaMaxTime();

            closeMediaModal();

        } else {

            Editer_stage.tool.toast('请至少选择一个素材');

        }

    });

    // 点击搜索按钮
    $(document).on('tap', '#media-search-btn', function () {

        pageNo = 1;
        getMediaAjax();

    });

    // 添加区域
    $(document).on('tap', '.float-menu-item', function () {

        mediaType = $(this).attr('data-flag');
        mediaChooseType = 0;
        Editer_stage.tool.showLoading('数据加载...');
        openMediaModal();

    });

    // 关闭
    $(document).on('tap', '.close-media-modal', function (params) {

        closeMediaModal();

    });

    // 点击隐藏信息框
    $(document).on('tap', '.custom-overlay', function () {

        var type = $(this).attr('data-flag'),
            hideObj = '';

        if (type === 'area') {

            hideObj = '.editer-area-msg';

        } else if (type === 'page') {

            hideObj = '.editer-page';

        }

        Editer_stage.tool.hideLayout();
        Editer_stage.areaDataShow.hideLeftSideBar(hideObj);

    });

    // 素材列表选择
    $(document).on('tap', '.editer-area-list li', function () {

        var $this = $(this),
            suffix = $this.attr('data-itemsuffix');

        $this.addClass('active').siblings().removeClass('active');

        if (suffix.match(/\.(gif|png|jpe?g)$/i)) {

            var jsonData = JSON.parse($this.attr('data-json')),
                src = PublicUrl.ip + PublicUrl.resources + jsonData.src,
                imgindex = $(this).index(),
                id = $($this.parents('.item')).attr('data-id');

            $('#controlItem_' + id).find('img').attr('src', src).attr('data-imgindex', imgindex);

        }

    });

    // 编辑视频的文件名
    $(document).on('tap', '#editer-video-list li', function () {

        var jsonData = JSON.parse($(this).attr('data-json')),
            name = jsonData.editName ? jsonData.editName : jsonData.name,
            id = jsonData.id,
            itemSuffix = $(this).attr('data-itemsuffix'),
            itemIndex = $(this).attr('data-itemIndex');

        name = name.replace(/([.][^.]+)$/, '');

        Editer_stage.tool.videoEditObj = $(this);
        $(this).addClass('active').siblings().removeClass('active');

        $('input[data-flag=videoName]').attr('data-itemSuffix', itemSuffix)
            .attr('data-itemid', id)
            .attr('data-itemIndex', itemIndex)
            .val(name);

    });

    // 编辑
    $(document).on('tap', '.editer-list-editerBtn', function () {

        var $parents = $(this).parents('.editer-list-tool-btn');

        mediaType = $parents.attr('data-flag');
        mediaChooseType = 2;

        openMediaModal();

    });

    // 素材 上移 下移 移除
    $(document).on('tap', '.editer-list-upBtn,.editer-list-downBtn,.editer-list-deleteBtn', function () {

        var checkedBtn = $(this).attr('data-flag'),
            typeName = $(this).parents('.editer-list-tool-btn').attr('data-typename'),
            id = $('#editer-info-' + typeName).attr('data-id'),
            $list = $(this).parents('.item-in-areaList').find('.editer-media-list');

        if (checkedBtn === 'up') {

            Editer_stage.tool.listSortUp($list);

        } else if (checkedBtn === 'down') {

            Editer_stage.tool.listSortDown($list);

        } else if (checkedBtn === 'delete') {

            Editer_stage.tool.listSortRemove($list);

        }

        Editer_stage.tool.listSortUpData($list, id, typeName); // 更新内容

    });

    // 放大舞台
    $(document).on('tap', '.rang-btn-big', function () {

        var $rangValue = $('#range-value'),
            value = $rangValue.val() * 1;

        value = value + 10;
        if (value > 500) {
            value = 500
        } else if (value < 10) {
            value = 10;
        };

        $rangValue.val(value);
        Editer_stage.tool.siderbuildEditerArea(value);

    });

    // 缩小舞台
    $(document).on('tap', '.rang-btn-small', function () {

        var $rangValue = $('#range-value'),
            value = $rangValue.val() * 1;

        value = value - 10;
        if (value < 10) value = 10;

        $rangValue.val(value);
        Editer_stage.tool.siderbuildEditerArea(value);

    });

    // 保存页面
    $(document).on('tap', '#save-page', function () {

        savePage();

    });

    // 页面管理
    $(document).on('tap', '#canvas-page', function () {

        openPageInfo();

    });

    // 颜色选择
    $(document).on('tap', '.color-list span', function () {

        var $this = $(this),
            color = $this.attr('data-color');

        $('#page-color').css('background-color', color);
        editerDataStore.setDataBg({
            bgColor: color
        });
        color = color.replace(/(#)+/, '');
        $('#page-color').val(color);
        Editer_stage.tool.setEditerAreaBg();

    });

    // 页面背景移除
    $(document).on('tap', '.page-bg-delete', function () {

        $('#page-bg').val('');
        editerDataStore.setDataBg({
            bgImg: '',
            bgName: ''
        });

        Editer_stage.tool.setEditerAreaBg();

    });

    // 页面背景颜色移除
    $(document).on('tap', '.page-bgCol-delete', function () {

        $('#page-color').val('')
            .css('background-color', '');
        editerDataStore.setDataBg({
            bgColor: ''
        });
        Editer_stage.tool.setEditerAreaBg();

    });

    // 页面背景添加
    $(document).on('tap', '.page-bg-add', function () {

        mediaType = 1;

        mediaChooseType = 3;

        openMediaModal();

    });

    // 添加新页面
    $(document).on('tap', '.editer-page-addBtn', function () {

        Editer_stage.tool.confirm('添加新页面并保存当前页面？', function () {

            savePage(0);

        })

    });

    // 页面列表选择
    $(document).on('tap', '#editer-page-list li', function () {

        $(this).addClass('active').siblings().removeClass('active');

    });

    // 页面 上移 下移 移除
    $(document).on('tap', '.editer-page-upBtn, .editer-page-downBtn, .editer-page-deleteBtn', function () {

        var checkedBtn = $(this).attr('data-flag'),
            $list = $(this).parents('.item-in-areaList').find('.editer-media-list'),
            len = $list.find('li').length,
            pageId = $list.find('li.active').attr('data-pageid'),
            param = {},
            ajaxType = 'POST';

        if (checkedBtn === 'up') {

            param.type = 'up';

        } else if (checkedBtn === 'down') {

            param.type = 'down';

        } else if (checkedBtn === 'delete') {

            if (len < 2) {
                Editer_stage.tool.toast('节目数小于2，无法删除！');
                return;
            }

            param.pageId = pageId;
            ajaxType = 'DELETE';

        }

        if (checkedBtn === 'up' || checkedBtn === 'down') {

            param._method = 'PUT';
            controlPage(ajaxType, pageId, param, $list);

        } else {

            Editer_stage.tool.confirm('确定删除？',
                function () { // 确定

                    controlPage(ajaxType, pageId, param, $list);

                });

        }

    });

    // 双击切换页面
    $(document).on('doubleTap', '#editer-page-list li', function () {

        var $this = $(this),
            clickLiIndex = $this.index(),
            jsonData = JSON.parse($this.attr('data-json'));

        pargarmPageIndex = clickLiIndex;

        if (jsonData) {

            if (nowPageId !== jsonData.pageId) {

                if (nowPageId === -1) $('#editer-page-list li[data-state="new"]').remove();

                $('#page-name').attr('data-index', $this.index());
                Public.removeJs(nowPageScriptPath);
                nowPageScriptPath = PublicUrl.materialResourceUrl() + jsonData.pageFilePath;
                Editer_stage.tool.setPageInfo($this.find('.title').text(), jsonData.pagePlaytime);
                nowPageId = jsonData.pageId;
                getJsPageInit();

            }

        }


    });

    // 按钮操作
    $(document).on('tap', '.editer-area-tool span', function () {

        var flag = $(this).attr('data-flag');

        if (flag === 'fullscreen') {

            dragResize.fullScreen();

        } else if (flag === 'delete') {

            Editer_stage.tool.confirm('是否确定移除该区域？', function () {

                dragResize.delete();

            });

        } else if (flag === 'lock') {

            dragResize.lock();

        } else if (flag === 'unlock') {

            dragResize.unlock();

        } else if (flag === 'rightalign') {

            dragResize.alignRight();

        } else if (flag === 'leftalign') {

            dragResize.alignLeft();

        } else if (flag === 'verticalcenter') {

            dragResize.alignYCenter();

        } else if (flag === 'levelcenter') {

            dragResize.alignXCenter();

        } else if (flag === 'topalign') {

            dragResize.alignTop();

        } else if (flag === 'bottomalign') {

            dragResize.alignBottom();

        } else if (flag === 'tobottom') {

            dragResize.upToLast();

        } else if (flag === 'totop') {

            dragResize.upToFirst();

        } else if (flag === 'godown') {

            dragResize.downZindex();

        } else if (flag === 'goup') {

            dragResize.upZindex();

        }

    });

    // 点击打开边框设置弹窗
    $(document).on('tap', '#canvas-layer', function () {

        openBorderModal();

    });

    // 点击关闭边框设置弹窗
    $(document).on('tap', '.close-border-modal', function () {

        closeBorderModal();

    });

    // 边框开关
    $(document).on('change', '#open-off', function () {

        var val = $(this).prop('checked');

        if (val) {
            $('.border-set').show();
        } else {
            $('.border-set').hide();
        }

    });

    // 监听边框弹窗选择
    $(document).on('change', '.popup-border input, .popup-border select', function () {

        var $this = $(this),
            flag = $this.attr('data-flag'),
            elem = dragResize.getElemByBorder(),
            id = $(elem).attr('data-id'),
            val = $this.val();

        if (flag === 'borderSW') {


            val = $this.prop('checked') ? 1 : 0;

        }

        if (flag === 'borderType') {
            $('.border-img').css('background-image', 'url(./../images/editer_border/border' + val + '.png)');
        }

        editerDataStore.setMediaProjectData(id, flag, val);
        Editer_stage.tool.changeEditareaItemPrivate(flag, id);

    });

    // 返回
    $(document).on('tap', '#go-back', function () {

        Editer_stage.tool.confirm('保存当前页面？', function () {

            savePage(-1);

        });

    });

    // 监听页面颜色改变
    $(document).on('change', '#page-color', function () {

        var val = $(this).val();
        editerDataStore.setDataBg({
            bgColor: '#' + val
        });

        Editer_stage.tool.setEditerAreaBg();

    });

    $(document).on('tap', '.editer-page-copy', function () {

        copyPage();

    });

    // 播放
    $(document).on('tap', '#play-page', function () {

        savePage(1);

    });

    // 页面修改
    $('#page-name').bind('input change', function () {

        var index = $(this).attr('data-index') * 1,
            val = $(this).val();

        $('#editer-page-list li').eq(index).find('.title').text(val);

    });

})