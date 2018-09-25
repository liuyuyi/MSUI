var menu = new FlMenu(),
    devId = Public.getUrlItem()['devId'],
    devName = Public.getUrlItem()['devName'],
    showPicUrl = [],
    swpierObj = null;

function getListData() {

    var shtml = '',
        allChecked = $('#checkAll').prop('checked'),
        swiperShtml = '';

    $('#media-list-data').html('');
    $('.swiper-wrapper').html('');

    // Public.showPreloader('加载中...');

    $('.noMoreData').hide();
    if (swpierObj) swpierObj.destroy(false);
    
    Public.ajaxCall({
        type: 'GET',
        url: PublicUrl.deviceGetPicUrl() + devId,
        data: {},
        successCallBack: function (data) {

            // Public.hidePreloader();

            if (data.response) {

                var len = data.response.length;

                if (len === 0) $('.noMoreData').show();
                showPicUrl = [];

                for (var i = 0; i < len; i++) {

                    var itemData = data.response[i],
                        itemTime = itemData.time,
                        itemUrl = PublicUrl.ip + PublicUrl.resources + itemData.url,
                        itemName = itemData.name;

                    itemUrl = itemUrl.replace(/\\/g, '/');
                    showPicUrl.push(itemUrl);

                    materialHtml = '<div class="picture" data-index="' + i + '"><img onerror="this.src=\'./../images/default.jpg\'" data-echo="' + itemUrl + '" src="./../images/default.jpg" alt=""></div>';

                    shtml += '<div class="col-50" id="material-' + i + '">' +
                        '<div class="item">' +
                        '<div class="label-checked-box pull-left">' +
                        '<input type="checkbox" ' + (allChecked ? 'checked' : '') + ' id="check-' + i + '" value="' + itemData.url + '" />' +
                        '<label for="check-' + i + '">' +
                        '</label>' +
                        '</div>' +
                        '<div class="item-in"><div class="pic">' +
                        materialHtml +
                        '</div>' +

                        '<div class="info material-info" data-json=\'' + JSON.stringify(itemData) + '\'>' +
                        '<div class="name">' +
                        itemName +
                        '</div>' +

                        '<div class="row">' +
                        '<div class="col-80">' +
                        '<span class="iconStyle"><i class="iconfont icon-shijian"></i></span>' +
                        '<span class="type">' +
                        Public.momentFormat(itemTime, 'YYYY-MM-DD HH:mm:ss') +
                        '</span>' +
                        '</div>' +
                        '</div>' +

                        // '<div class="row">' +
                        // '<div class="col-80">' +
                        // '<span class="iconStyle">' +
                        // '<i class="iconfont icon-duochicun"></i>' +
                        // '</span>' +
                        // '<span class="size" id="size-' + itemTime + '">' +
                        // materialSize +
                        // '</span>' +
                        // '</div>' +
                        // '</div>' +

                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';

                    swiperShtml += '<div class="swiper-slide"><div class="slide-item" style="background-image: url(' + itemUrl + ');"></div></div>';


                }

                $('#media-list-data').html(shtml);
                $('.swiper-wrapper').html('');
                $('.swiper-wrapper').append(swiperShtml);

                echo.init({
                    offset: 0,
                    throttle: 0,
                    container: document.getElementById('content-list'),
                    callback: function (element, op) {
                        // console.log(element, 'has been', op + 'ed')
                    }
                });

                swpierObj = new Swiper('.swiper-container', {
                    autoplay: false,
                    autoHeight: true,
                    pagination: '.swiper-pagination',
                    paginationType: 'fraction',
                    initialSlide: 0,
                    observer: true, //修改swiper自己或子元素时，自动初始化swiper
                    observeParents: true //修改swiper的父元素时，自动初始化swiper
                });

            } else {
                $('.noMoreData').show();
            }

        },
        errorCallBack: function () {

            // Public.hidePreloader();

        }
    })

}

$(function () {

    $.init();

    getListData();

    // 删除按钮
    $(document).on('click', '.confirm-ok', function () {

        var $checkboxList = $('#media-list-data input:checked'),
            len = $checkboxList.length,
            checkboxUrl = '',
            reg = /\,?$/;

        for (var i = 0; i < len; i++) {

            var val = $($checkboxList[i]).val();

            checkboxUrl += val + ',';
            
        }

        if (len > 0) {

            checkboxUrl = checkboxUrl.replace(reg, '');

            Public.msuiConfirm(locales.promptDelete, function () {

                Public.ajaxCall({
                    type: 'POST',
                    url: PublicUrl.deviceGetPicUrl() + devId,
                    data: {
                        _method: 'delete',
                        url: checkboxUrl
                    },
                    successCallBack: function (data) {

                        Public.customToast(data.response);

                        setTimeout(function () {

                            getListData();

                        }, 1000);

                    }
                });

            });

        } else {

            Public.toast(locales.promptChecked);

        }

    });

    // 刷新
    $(document).on('click', '#pic-refresh', function () {

        getListData();

    });

    // 图片预览
    $(document).on('click', '.picture', function () {

        var len = showPicUrl.length,
            shtml = '',
            index = $(this).attr('data-index')*1;
        
        $('.swiper-wrapper').append(shtml);

        $('#preview-view').show().addClass('preview-in');
        
        swpierObj.slideTo(index, 1000, false);
        
    });

    $(document).on('click', '#preview-close', function () {

        $('#preview-view').removeClass('preview-in').hide();
        
    });

})