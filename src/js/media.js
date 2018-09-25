var menu = new FlMenu(),
    mediaType = '1',
    materialDeleteUrl = PublicUrl.materialDeleteUrl(),
    materialList = PublicUrl.materialListUrl(),
    mobileListData = new MobileListData({
        url: materialList + mediaType,
        data: { name: $('#search-name').val()},
        listObj: '#media-list-data',
        getListHtml: getListHtml,
        dataSuccessCall: function (data) {

            echo.init({
                offset: 0,
                throttle: 0,
                container: document.getElementById('content-list'),
                callback: function (element, op) {
                    // console.log(element, 'has been', op + 'ed')
                }
            });

        }
    }),
    videoPlayer = null;

function getListHtml(data) {
    
    var shtml = '',
        allChecked = $('#checkAll').prop('checked');

    for(var i=0,len=data.length;i<len;i++){

        shtml += PublicDataHtml.getMediaHtml(data[i], allChecked);

    }
    
    return shtml;

}

function refreshData() {

    mobileListData.options.url = materialList + mediaType;
    mobileListData.options.initData = true;
    mobileListData.init();

}

$(function () {

    Public.showPreloader('加载中...');
    
    menu.init();

    $.init();

    mobileListData.init();

    videoPlayer = $('#video-player').videoPlayer();

    // 删除按钮
    $(document).on('click', '.confirm-ok', function () {

        var $checkboxList = $('#media-list-data input:checked'),
            len = $checkboxList.length,
            checkboxIdArr = [];
        
        for(var i=0;i<len;i++){

            var val = $($checkboxList[i]).val();

            checkboxIdArr.push(val);

        }
        
        if (len > 0){
            Public.msuiConfirm(locales.promptDelete, function () {
    
                Public.ajaxCall({
                    type: 'DELETE',
                    url: materialDeleteUrl + checkboxIdArr,
                    data: {},
                    successCallBack: function (data) {

                        Public.toast(data.response);

                        setTimeout(function() {
                            refreshData();
                        }, 800);
                            
                    }
                });
    
            });
        }else{
            Public.toast(locales.promptChecked);
        }

    });

    // 详情
    $(document).on('click', '.material-info', function (e) {
        
        var $this = $(this),
            dataJson = JSON.parse($this.attr('data-json')),
            createBy = dataJson.createBy,
            createDate = dataJson.createDate,
            isCommon = dataJson.isCommon,
            updateBy = dataJson.updateBy,
            updateDate = dataJson.updateDate,
            materialOriginalName = dataJson.materialOriginalName;
        
        createDate = Public.momentFormat(createDate, 'YYYY-MM-DD HH:mm:ss');
        updateDate = Public.momentFormat(updateDate, 'YYYY-MM-DD HH:mm:ss');
        isCommon = Public.isCommon(isCommon);

        $('#materialOriginalName').text(materialOriginalName);
        $('#createBy').text(createBy);
        $('#createDate').text(createDate);
        $('#isCommon').html(isCommon);
        $('#updateBy').text(updateBy);
        $('#updateDate').text(updateDate);
        
        $.popup('.popup-details');

    });
    
    // 图片 视频  列表切换
    $(document).on('click', '.fl-menu-btn', function () {
        
        var _this = $(this);

        mediaType = _this.attr('data-type');
        $('#checkAll').prop('checked', false);

        refreshData();
        
    });

    $(document).on('click', '#search-btn',function () {
        
        var searchName = $('#search-name').val();

        // if (searchName === ''){

        //     Public.toast(locales.promptNullValue);
        //     return;
        // }

        mobileListData.search({ name: searchName});

        Public.closeModal('.popup-search');

    });

    $(document).on('click', '.close', function () {
        
        $('#preview-video').removeClass('preview-in').hide();

        $('#preview-video video').attr('src','');
        videoPlayer.stopVideo();
        videoPlayer.btnInit();

    });

    $(document).on('click', '.video', function () {
        
        var url = $(this).attr('data-src');

        $('#preview-video video').attr('src', url);
        $('#preview-video').show().addClass('preview-in');

    });

})
