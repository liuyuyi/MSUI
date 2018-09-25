var Editer = {},
    Editer_stage = {};

Editer.extend = function (destination, source) {

    for (var property in source) {
        destination[property] = source[property];
    }
    return destination;

};

/*************** 页面方法 ********************/
Editer_stage.tool = {
    percentName: '#range-value',
    uiSliderName: '.noUiSlider',
    resolutionName: '#thisResolution',
    editareaName: '.editerCanvas-main',
    wrapName: '.editerCanvas',
    programWidthName: '#programWidthPoints',
    programHeightName: '#programHeightPoints',
    pageBgVal: '#page-bg',
    picDefaultUrl: PublicUrl.ip + PublicUrl.resources,
    pageTimeVal: '#page-pauseTime'
};
Editer_stage.tool.calculateZoom = function (zoom) {
    return zoom / 100;
};
// 遮罩背景显示
Editer_stage.tool.showLayout = function (obj) {

    var $layout = $('.custom-overlay');

    $layout.show();
    $layout.attr('data-flag', obj)

    setTimeout(function () {

        $layout.addClass('fade-in');

    }, 50);

};
// 遮罩背景隐藏
Editer_stage.tool.hideLayout = function () {

    var $layout = $('.custom-overlay');

    $layout.addClass('fade-out');

    setTimeout(function () {

        $layout.hide();
        $layout.removeClass('fade-out');

    }, 300);

};
// 改变百分比
Editer_stage.tool.setZoom = function (val) {
    $(this.percentName).val(val);
};
// 改变顶部滑块状态
Editer_stage.tool.setTopSlider = function (val) {
    $(this.uiSliderName).slider('value', val);
};
// 获取百分比
Editer_stage.tool.getZoom = function () {
    return $(this.percentName).val();
};
// 数据宽高根据缩放计算比例
Editer_stage.tool.conversion = function (W, H, L, T) {

    var editareaW = Editer_stage.tool.getEditerSize().width,
        editareaH = Editer_stage.tool.getEditerSize().height,
        allPageResolution = Editer_stage.tool.getProgramResolution(),
        resolution = Editer_stage.tool.getViewResolution(allPageResolution),
        width = Math.round(W / editareaW * resolution.width),
        height = Math.round(H / editareaH * resolution.height),
        left = Math.round(L / editareaW * resolution.width),
        top = Math.round(T / editareaH * resolution.height);

    return {
        'width': width,
        'height': height,
        'left': left,
        'top': top
    }

};
// 获得程序赋值的分辨率(宽)
Editer_stage.tool.getProgramResolutionWidth = function () {
    return $(this.programWidthName).text();
};
// 获得程序赋值的分辨率(高)
Editer_stage.tool.getProgramResolutionHeight = function () {
    return $(this.programHeightName).text();
};
// 获得程序赋值的分辨率
Editer_stage.tool.getProgramResolution = function () {

    var width = Editer_stage.tool.getProgramResolutionWidth(),
        height = Editer_stage.tool.getProgramResolutionHeight();

    return width + 'X' + height;

};
// 设置分辨率
Editer_stage.tool.setViewResolution = function (w, h) {
    $(this.programWidthName).text(w);
    $(this.programHeightName).text(h);
};
// 获取分辨率
Editer_stage.tool.getViewResolution = function (resolution) {

    if (!resolution) return;

    var arry = resolution.split('X');

    return {
        'width': parseInt(arry[0]),
        'height': parseInt(arry[1])
    };

};
// 获取画布区域对象
Editer_stage.tool.getEditerArea = function () {

    return $(this.editareaName)[0];

};
// 获取当前画布宽高
Editer_stage.tool.getEditerSize = function () {

    var editareaW = Editer_stage.tool.getEditerArea().offsetWidth,
        editareaH = Editer_stage.tool.getEditerArea().offsetHeight;

    return {
        'width': editareaW,
        'height': editareaH
    }

};
// 最外围
Editer_stage.tool.getWrap = function () {
    return $(this.wrapName)[0];
};
// 最外围宽、高
Editer_stage.tool.getWrapSize = function () {

    var panel = Editer_stage.tool.getWrap();

    return {
        width: panel.offsetWidth, // 画布宽
        height: panel.offsetHeight // 画布高
    };

};
// 求最大公约数
Editer_stage.tool.gcd = function (a, b) {

    var temp;

    /* 交换两个数，使大数放在a上 */
    if (a < b) {
        temp = a;
        a = b;
        b = temp;
    }
    /* 利用辗除法，直到b为0为止 */
    while (b != 0) {
        temp = a % b;
        a = b;
        b = temp;
    }
    return a;

};
// 调整分辨率显示及比例
Editer_stage.tool.getEditorSize = function (h, f) {

    var k = h.width,
        g = h.height;
    var a = f.width,
        d = f.height;
    var i = Math.max(a, d);
    var c = Editer_stage.tool.gcd(k, g);
    var j = k;
    var e = g;

    while (j >= c && j % c == 0 && e >= c && e % c == 0) {
        if (c == 1) {
            break;
        }
        j = j / c;
        e = e / c
    }

    var b = 0;
    b = a / j;
    if (b * e > d) {
        b = d / e
    }

    var l = {
        min: 0,
        max: 100,
        current: parseInt(b * j / h.width * 100)
    };

    if (l.current > l.max) {
        l.max = l.current
    }

    return {
        width: b * j,
        height: b * e,
        zoom: l
    }

};
// 清除舞台数据
Editer_stage.tool.clearEditerAreaData = function () {

    $(this.editareaName).html('');
    Editer_stage.tool.clearEditerAreaBgData();

};
// 清除舞台数据
Editer_stage.tool.clearEditerAreaBgData = function () {

    $(this.pageBgVal).val('');
    $(this.editareaName).css('background-image', '');

};
// 向舞台添加数据
Editer_stage.tool.addEditerAreaData = function (shtml) {

    $(this.editareaName).append(shtml);

};
// 初始化舞台背景
Editer_stage.tool.intEditerAreaBg = function (data) {

    if (is_define(data.pageEle)) {

        var editerBgImg = data.pageEle[0].bgImg,
            editerBgColor = data.pageEle[0].bgColor,
            editerBgName = data.pageEle[0].bgName;

        editerBgColor = editerBgColor ? editerBgColor : '';

        // 设置舞台背景
        Editer_stage.tool.setEditerAreaBg();
        // 右侧页面颜色插件
        // Editer_stage.tool.setMinicolors('#hue-demo', '#pageColor', editerBgColor);

        // $('#pageColor').on('change', function (){
        //     console.log(1212)
        //     editerDataStore.setDataBg({bgColor: $(this).val()});
        // });

        // $('#pageName_1').blur(function (){

        //     savePage();

        // });

    }

};
// 设置舞台背景
Editer_stage.tool.setEditerAreaBg = function () {

    var data = editerDataStore.returnData().pageEle[0],
        bgImg = data.bgImg,
        bgColor = data.bgColor,
        bgName = data.bgName;

    $(this.editareaName).css("background-color", bgColor);

    $(this.editareaName).css({
        'background-image': bgImg ? 'url(' + this.picDefaultUrl + bgImg + ')' : '',
        'background-size': 'cover'
    });
    $(this.pageBgVal).val(bgName);
    $('#page-color').val(bgColor.replace(/(#)+/, ''));

};
// 修改舞台宽高
Editer_stage.tool.setEditerAreaSize = function (W, H) {

    $(Editer_stage.tool.getEditerArea()).css({
        'width': W,
        'height': H
    });

};
// 修改舞台位置
Editer_stage.tool.setEditerAreaLocation = function (L, R) {

    $(Editer_stage.tool.getEditerArea()).css({
        'left': L,
        'top': R
    });

};
// 舞台缩放宽高
Editer_stage.tool.siderbuildEditerArea = function (zoom) {

    zoom = Editer_stage.tool.calculateZoom(zoom);

    var wrapSize = Editer_stage.tool.getWrapSize(),
        allPageResolution = Editer_stage.tool.getProgramResolution(),
        resolution = Editer_stage.tool.getViewResolution(allPageResolution),
        editAreaWidth = resolution.width * zoom, // 当前舞台宽度
        editAreaHeight = resolution.height * zoom, // 当前舞台高度
        left = Math.round((wrapSize.width - editAreaWidth) / 2),
        top = Math.round((wrapSize.height - editAreaHeight) / 2),
        // 计算舞台位置和大小
        width = Math.round(editAreaWidth),
        height = Math.round(editAreaHeight);

    // 设置舞台位置和大小
    Editer_stage.tool.setEditerAreaSize(width, height);
    Editer_stage.tool.setEditerAreaLocation(left, top);

    // 修改舞台每个区域的大小和位置
    Editer_stage.tool.setItemSize(zoom);

};
// 修改舞台每个区域的大小和位置
Editer_stage.tool.setItemSize = function (zoom) {

    $(this.editareaName).find('.item').each(function () {

        var itemData = editerDataStore.getMediaData($(this).attr('data-id'));

        // 模块公有样式缩放
        Editer_stage.tool.setMainZoom($(this), itemData, zoom);
        // 各个模块缩放
        // setTypeZoom($(this),itemSize,zoom);

    })

};
// 修改舞台单个区域公共的大小和位置
Editer_stage.tool.setMainZoom = function (obj, itemData, zoom) {

    // 元素的属性乘百分比
    var itemWidth = Math.round(itemData.width * zoom),
        itemHeight = Math.round(itemData.height * zoom),
        itemLeft = Math.round(itemData.left * zoom),
        itemTop = Math.round(itemData.top * zoom);

    obj.css({
        'left': itemLeft,
        'top': itemTop,
        'width': itemWidth,
        'height': itemHeight
    });

    if (obj.attr('data-type') === '15') {

        var mapDataArry = obj.find('.map-data');

        for (var i = 0; i < itemData.srcGroup.length; i++) {

            var groupItem = itemData.srcGroup[i],
                dataItemId = groupItem.id,
                dataItemWidth = groupItem.width,
                dataItemHeight = groupItem.height,
                dataItemLeft = groupItem.left,
                dataItemTop = groupItem.top;

            for (var j = 0; j < mapDataArry.length; j++) {

                if ($(mapDataArry[j]).attr('data-id') == dataItemId) {

                    $(mapDataArry[j]).css({
                        'left': Math.round(dataItemLeft * zoom),
                        'top': Math.round(dataItemTop * zoom),
                        'width': Math.round(dataItemWidth * zoom),
                        'height': Math.round(dataItemHeight * zoom)
                    })

                }

            }

        }
    }

};
// 修改私有属性
Editer_stage.tool.changeEditareaItemPrivate = function (flag, id) {

    var $objItem = $('#controlItem_' + id),
        itemData = editerDataStore.getMediaData(id),
        itemType = itemData.type,
        itemFlag = Editer_stage.tool.checkItemFlag(flag),
        itemDataVal = itemData[flag];

    if (itemFlag === 'font-size' || itemFlag === 'width') {
        itemDataVal = (itemDataVal + 'px');
    }

    if (flag === 'borderSW' || flag === 'borderType') {

        if (itemType == 0 || itemType == 1 || itemType == 2 || itemType == 3 || itemType == 4 || itemType == 5 || itemType == 6 || itemType == 7 || itemType == 8 || itemType == 9 || itemType == 11 || itemType == 12 || itemType == 13) {

            var $lineBox = $objItem.find('#line_box_' + id);
            var findObj = '';

            if (itemType == 0 || itemType == 1 || itemType == 4 || itemType == 5 || itemType == 6 || itemType == 7 || itemType == 8 || itemType == 9 || itemType == 12 || itemType == 13) {
                findObj = 'img';
            } else if (itemType == 2) {
                findObj = '.textCont';
            } else if (itemType == 3) {
                // findObj = 
            }

            if (flag === 'borderSW') {
                if (itemDataVal == 1) {
                    $objItem.find(findObj).css('padding', '3px');
                    $lineBox.show();
                } else {
                    $objItem.find(findObj).css('padding', '0');
                    $lineBox.hide();
                }
            }

            if (flag === 'borderType') {
                $lineBox.removeClass();
                $lineBox.addClass('lineType' + itemDataVal);
            }

        }

    }

    if (itemType == 2) {

        if (flag === 'text') {
            itemDataVal = itemData.textGroup[0][flag];
            $objItem.find('.textCont').text(itemDataVal);
        } else if (itemFlag !== undefined) {
            $objItem.find('.textCont').css(itemFlag, itemDataVal);
        }

    } else if (itemType == 3) {

        if (flag === 'bgColor') {

            $objItem.find('div').css(itemFlag, itemDataVal);

        } else if (flag === 'fontSize' || flag === 'fontColor') {

            $objItem.find('.weather_day').css(itemFlag, itemDataVal);

        } else if (flag === 'rowType') {

            if (itemDataVal == 1) {

                var msgHtml = Editer_stage.tool.setWeatherHtmlTempA(itemData);

            } else if (itemDataVal == 2) {

                var msgHtml = Editer_stage.tool.setWeatherHtmlTempB(itemData);

            } else if (itemDataVal == 3) {

                var msgHtml = Editer_stage.tool.setWeatherHtmlTempC(itemData);

            } else if (itemDataVal == 4) {

                var msgHtml = Editer_stage.tool.setWeatherHtmlTempD(itemData);

            }

            $objItem.find('.weather_content>tbody').html('');
            $objItem.find('.weather_content>tbody').html(msgHtml);

        } else if (flag === 'todayShow') {

            var nowDisplay = itemDataVal == 1 ? 'table-cell' : 'none';

            $objItem.find('.todayShow').css('display', nowDisplay);

        } else if (flag === 'tomShow') {

            var nowDisplay = itemDataVal == 1 ? 'table-cell' : 'none';

            $objItem.find('.tomShow').css('display', nowDisplay);

        } else if (flag === 'afterShow') {

            var nowDisplay = itemDataVal == 1 ? 'table-cell' : 'none';

            $objItem.find('.afterShow').css('display', nowDisplay);

        } else if (flag === 'scale') {

            var nowDisplay = itemDataVal == 1 ? 'inline-block' : 'none';

            $objItem.find('.scale').css('display', nowDisplay);

            if (nowDisplay === 'none' && $objItem.find('.wind').css('display') === 'none') {
                $objItem.find('.windLine').css('display', 'none');
            } else {
                $objItem.find('.windLine').css('display', 'block');
            }

        } else if (flag === 'wind') {

            var nowDisplay = itemDataVal == 1 ? 'inline-block' : 'none';

            $objItem.find('.wind').css('display', nowDisplay);

            if (nowDisplay === 'none' && $objItem.find('.scale').css('display') === 'none') {
                $objItem.find('.windLine').css('display', 'none');
            } else {
                $objItem.find('.windLine').css('display', 'block');
            }

        } else if (flag === 'hum') {

            var nowDisplay = itemDataVal == 1 ? 'block' : 'none';

            $objItem.find('.hum').css('display', nowDisplay);

        } else if (flag === 'air') {

            var nowDisplay = itemDataVal == 1 ? 'inline-block' : 'none';

            $objItem.find('.air').css('display', nowDisplay);

            if (nowDisplay === 'none' && $objItem.find('.pm').css('display') === 'none') {
                $objItem.find('.airLine').css('display', 'none');
            } else {
                $objItem.find('.airLine').css('display', 'block');
            }

        } else if (flag === 'pm') {

            var nowDisplay = itemDataVal == 1 ? 'inline-block' : 'none';

            $objItem.find('.pm').css('display', nowDisplay);

            if (nowDisplay === 'none' && $objItem.find('.air').css('display') === 'none') {
                $objItem.find('.airLine').css('display', 'none');
            } else {
                $objItem.find('.airLine').css('display', 'block');
            }

        } else if (flag === 'icon') {

            var nowDisplay = itemDataVal == 1 ? 'table-cell' : 'none';

            $objItem.find('.weather_icon').css('display', nowDisplay);

        } else if (flag === 'fontFamily') {

            $objItem.find('.weather_day').css(itemFlag, itemDataVal);

        } else if (flag === 'temperature') {

            var nowDisplay = itemDataVal == 1 ? 'inline-block' : 'none';

            $objItem.find('.temperature').css('display', nowDisplay);

            if (nowDisplay === 'none' && $objItem.find('.state').css('display') === 'none') {
                $objItem.find('.stateLine').css('display', 'none');
            } else {
                $objItem.find('.stateLine').css('display', 'block');
            }

        } else if (flag === 'state') {

            var nowDisplay = itemDataVal == 1 ? 'inline-block' : 'none';

            $objItem.find('.state').css('display', nowDisplay);

            if (nowDisplay === 'none' && $objItem.find('.temperature').css('display') === 'none') {
                $objItem.find('.stateLine').css('display', 'none');
            } else {
                $objItem.find('.stateLine').css('display', 'block');
            }

        } else if (flag === 'area') {

            var nowDisplay = itemDataVal == 1 ? 'block' : 'none';

            $objItem.find('.city').css('display', nowDisplay);

        } else if (flag === 'date') {

            var nowDisplay = itemDataVal == 1 ? 'block' : 'none';

            $objItem.find('.weather_date').css('display', nowDisplay);

        } else if (flag === 'iconSize') {

            itemDataVal = itemDataVal + 'px';

            $objItem.find('img').css({
                width: itemDataVal,
                height: itemDataVal
            });

        }

    } else if (itemType == 4) {

        if (itemFlag === 'font-weight') {
            itemDataVal = itemDataVal == 1 ? 'bold' : '';
        }

        if (flag === 'fontFamily' || flag === 'fontColor') {

            $objItem.find('.clock').css(itemFlag, itemDataVal);

        } else if (flag === 'dateFontSize') {

            $objItem.find('.date').css(itemFlag, itemDataVal);

        } else if (flag === 'timeFontSize') {

            $objItem.find('.digits').css(itemFlag, itemDataVal);

        } else if (flag === 'dateWeight') {

            $objItem.find('.date_a').css(itemFlag, itemDataVal);

        } else if (flag === 'weekWeight') {

            $objItem.find('.date_b').css(itemFlag, itemDataVal);

        } else if (flag === 'timeWeight') {

            $objItem.find('.digits').css(itemFlag, itemDataVal);

        } else if (flag === 'clockW') {

            $objItem.find('.clockimg').css(itemFlag, itemDataVal);

        } else if (flag === 'weekFormat') {

            var weekHtml = '';

            if (itemDataVal === '1') {
                weekHtml = '星期一';
            } else if (itemDataVal === '2') {
                weekHtml = '周一';
            } else if (itemDataVal === '3') {
                weekHtml = 'Mon';
            }

            $objItem.find('.date_b').text(dataHtml);

        } else if (flag === 'dateFormat') {

            var dataHtml = '';

            dataHtml = Editer_stage.tool.setClockHtmlTempA(itemData);
            $objItem.find('.date_a').html(dataHtml);

        } else if (flag === 'timeFormat') {

            var timeHtml = '';

            if (itemDataVal === '1') {
                timeHtml = '00:00:00';
            } else if (itemDataVal === '2') {
                timeHtml = '00:00';
            }

            $objItem.find('.digits').text(timeHtml);

        } else if (flag === 'yearShow') {

            var nowDisplay = itemDataVal == 1 ? 'inline-block' : 'none';

            $objItem.find('.date_year').css('display', nowDisplay);
            $objItem.find('.markYear').css('display', nowDisplay)

        } else if (flag === 'monthShow') {

            var nowDisplay = itemDataVal == 1 ? 'inline-block' : 'none';

            $objItem.find('.date_month').css('display', nowDisplay);
            $objItem.find('.markMonth').css('display', nowDisplay)

        } else if (flag === 'dateShow') {

            var nowDisplay = itemDataVal == 1 ? 'inline-block' : 'none';

            $objItem.find('.date_date').css('display', nowDisplay);

        } else if (flag === 'hourShow') {

            var nowDisplay = itemDataVal == 1 ? 'inline-block' : 'none';

            $objItem.find('.date_hours').css('display', nowDisplay);

        } else if (flag === 'minutesShow') {

            var nowDisplay = itemDataVal == 1 ? 'inline-block' : 'none';

            $objItem.find('.date_minutes').css('display', nowDisplay);

        } else if (flag === 'secondsShow') {

            var nowDisplay = itemDataVal == 1 ? 'inline-block' : 'none';

            $objItem.find('.date_seconds').css('display', nowDisplay);

        } else if (flag === 'weekShow') {

            var nowDisplay = itemDataVal == 1 ? 'inline-block' : 'none';

            $objItem.find('.date_week').css('display', nowDisplay);

        } else if (flag === 'clockType') {

            $objItem.find('.clockDigital').css('display', (itemDataVal == 1 ? 'inline-block' : 'none'));
            $objItem.find('.clockSimulation').css('display', (itemDataVal == 0 ? 'inline-block' : 'none'));

        }

    }

};
// 判断 返回修改属性 
Editer_stage.tool.checkItemFlag = function (flag) {

    switch (flag) {
        case 'background':
            return 'background';
            break;
        case 'fontColor':
            return 'color';
            break;
        case 'fontFamily':
            return 'font-family';
            break;
        case 'fontSize':
            return 'font-size';
            break;
        case 'text':
            return 'text';
            break;
        case 'textAlign':
            return 'text-align';
            break;
        case 'fontStyle':
            return 'font-style';
            break;
        case 'fontWeight':
            return 'font-weight';
            break;
        case 'textDecoration':
            return 'text-decoration';
            break;
        case 'bgColor':
            return 'background';
            break;
        case 'refreshTime':
            return 'refreshTime';
            break;
        case 'tomShow':
            return 'tomShow';
            break;
        case 'todayShow':
            return 'todayShow';
            break;
        case 'afterShow':
            return 'afterShow';
            break;
        case 'dateFontSize':
            return 'font-size';
            break;
        case 'weekFormat':
            return 'weekFormat';
            break;
        case 'dateFormat':
            return 'dateFormat';
            break;
        case 'timeFontSize':
            return 'font-size';
            break;
        case 'timeFormat':
            return 'timeFormat';
            break;
        case 'dateWeight':
            return 'font-weight';
            break;
        case 'weekWeight':
            return 'font-weight';
            break;
        case 'timeWeight':
            return 'font-weight';
            break;
        case 'clockW':
            return 'width';
            break;
        case 'clockShow':
            return 'clockShow';
            break;
        case 'dateShow':
            return 'dateShow';
            break;
        case 'weekShow':
            return 'weekShow';
            break;
        case 'timeShow':
            return 'timeShow';
            break;
        case 'rowType':
            return 'rowType';
            break;

    }

};
// 颜色选择器
Editer_stage.tool.setMinicolors = function (obj, objVal, defColor) {

    var bEmpty = true;

    if (obj === '#hue-demo' || obj === '#fontColor' || obj === '#hue-weatherFontColor' || obj === '#hue-clock') {
        bEmpty = false;
    }

    $(obj).spectrum({
        flat: true,
        allowEmpty: bEmpty,
        color: defColor,
        showInput: true,
        containerClassName: 'full-spectrum',
        showInitial: false,
        showPalette: true,
        showSelectionPalette: false,
        showAlpha: false,
        maxPaletteSize: 10,
        preferredFormat: 'hex',
        localStorageKey: 'spectrum.demo',
        inputClass: objVal,
        move: function (color) {
            if (color) {
                $(objVal).val(color.toHexString())
                $(objVal).css('background-color', color.toHexString());
                $(objVal).change();
            } else {
                $(objVal).removeAttr('style');
            }
        },
        palette: [
            ['rgb(0, 0, 0)', 'rgb(67, 67, 67)', 'rgb(102, 102, 102)', 'rgb(153, 153, 153)', 'rgb(183, 183, 183)',
                'rgb(204, 204, 204)', 'rgb(217, 217, 217)', 'rgb(239, 239, 239)', 'rgb(243, 243, 243)', 'rgb(255, 255, 255)',
                'rgb(152, 0, 0)', 'rgb(255, 0, 0)', 'rgb(255, 153, 0)', 'rgb(255, 255, 0)',
                'rgb(0, 255, 255)', 'rgb(74, 134, 232)', 'rgb(0, 0, 255)', 'rgb(153, 0, 255)', 'rgb(255, 0, 255)', 'rgb(50, 205, 50)',
                'rgb(0, 255, 0)', 'rgb(34, 139, 34)', 'rgb(0, 128, 0)', 'rgb(70, 130, 180)', 'rgb(135, 206, 250)', 'rgb(135, 206, 235)',
                'rgb(0, 191, 255)', 'rgb(173, 216, 230)', 'rgb(176, 224, 230)',
            ]
        ]
    });

};
// 顶部滑块初始化
Editer_stage.tool.noUiSlider = function () {

    $(this.uiSliderName).slider({
        range: "max",
        min: 0,
        max: 500,
        step: 10,
        slide: function (event, ui) {

            var values = ui.value;

            Editer_stage.tool.setZoom(values);
            Editer_stage.tool.siderbuildEditerArea(values);

        }
    });

};
// 左侧显示
Editer_stage.tool.showItemMsg = function (dateId, typeId) {

    var editerData = editerDataStore.returnData(),
        editerDataMediaEle = editerData.mediaEle,
        jsonLen = editerDataMediaEle.length;

    for (var i = 0; i < jsonLen; i++) {

        if (editerDataMediaEle[i].id == dateId) {

            var editerDataItem = editerDataMediaEle[i],
                thisId = editerDataItem.id,
                thisLeft = editerDataItem.left,
                thisTop = editerDataItem.top,
                thisWidth = editerDataItem.width,
                thisHeight = editerDataItem.height,
                thisTypeName = Editer_stage.tool.getMediaType(typeId);

            // || typeId === 5 || typeId === 6 || typeId === 7 || typeId === 8 || typeId === 10 || typeId === 13 || typeId === 15

            if (typeId === 0 || typeId === 1) {

                Editer_stage.areaDataShow.showLeftSideBar(thisTypeName);
                Editer_stage.areaDataShow.publicItem(thisTypeName, thisId, i, thisWidth, thisHeight, thisLeft, thisTop);
                Editer_stage.areaDataShow.showItemPrivateMsg(thisId, typeId, editerDataItem);
                Editer_stage.tool.showItemListMsg(editerDataItem, typeId, thisId);

            }

        }

    }

};
// 显示诱导图位置信息
Editer_stage.tool.setMapLoca = function (obj) {

    var $obj = $(obj),
        width = $obj.attr('data-width'),
        height = $obj.attr('data-height'),
        left = $obj.attr('data-left'),
        top = $obj.attr('data-top'),
        id = $obj.attr('data-id'),
        itemid = $obj.attr('data-itemid'),
        name = $obj.find('input').val();

    $('#map-item-left').val(left);
    $('#map-item-top').val(top);
    $('#map-item-width').val(width);
    $('#map-item-height').val(height);
    $('#map-set-data').text(name);
    $('.map-tool input').attr('data-id', id);
    $('.map-tool input').attr('data-itemid', itemid);

}
// 修改诱导图显示数据及list数据
Editer_stage.tool.setMapInitData = function (type, val, itemId) {

    var zoom = Editer_stage.tool.calculateZoom(Editer_stage.tool.getZoom());

    $('#map-list li[data-itemid=' + itemId + ']').attr('data-' + type + '', val);

    $('#map-data' + itemId + '').css(type, val * zoom + 'px');

    if (type === 'height') {
        $('#map-data' + itemId + '').css('line-height', val * zoom + 'px');
    }

}
// 获取列表区域html
Editer_stage.tool.getItemListHtml = function (data, typeId, id, index) {

    var itemSuffix = data.name.substring(data.name.lastIndexOf('.'), data.name.length),
        itemGroupName = data.editName ? data.editName + itemSuffix : data.name,
        itemGroupSrc = data.src,
        itemGroupSize = Public.formatFileSize(data.size),
        itemGroupId = data.id,
        itemGroupTime = data.time,
        showHtml = '',
        imgIndex = typeId == 1 ? $('#controlItem_' + id).find('img').attr('data-imgindex') : '',
        typeName = Editer_stage.tool.getMediaType(typeId),
        className = (index === 0 ? 'active' : ''),
        shtml = '';

    if (imgIndex) {

        if (imgIndex == index) {

            className = 'active';

        } else {

            className = '';

        }

    }

    shtml += '<li class="' + className + '" data-editName="' + itemGroupName + '" data-itemIndex="' + index + '" data-itemSuffix=' + itemSuffix + ' data-json=\'' + JSON.stringify(data) + '\'>\
                <span class="title"> ' + itemGroupName + (typeId === 0 ? '</span ><span class="size">(' + itemGroupSize + ')</span>' : '') + '\
            </li >';

    return shtml;
    // if(typeId === 15){

    //     var itemGroupId = data.id,
    //         itemDataVal = data.dataVal,
    //         itemWidth = data.width,
    //         itemHeight = data.height,
    //         itemLeft = data.left,
    //         itemTop = data.top;

    //     shtml = '<li class="clearfix" data-id="'+ id +'" onclick="Editer_stage.tool.setMapLoca(this)" data-itemId="'+ itemGroupId +'" data-width="'+ itemWidth +'" data-height="'+ itemHeight +'" data-left="'+ itemLeft +'" data-top="'+ itemTop +'">' +
    //             '<div class="mItem-l"><input type="text" value="'+itemDataVal+'" data-flag="mapDataVal" onkeyup="Editer_stage.tool.mapInputKeyUp(this)" data-id="'+ id +'" data-itemId="'+ itemGroupId +'"/></div>'+
    //             '<div class="mItem-r">' +
    //                 '<a href="javascript:void(0);" data-id="'+ id +'" data-itemId="'+ itemGroupId +'" data-type="'+ typeId +'" onclick="Editer_stage.tool.listMapRemove(this)" title="移除">' +
    //                 '<i class="fa fa-times-circle fa-lg"></i></a>'+
    //             '</div>'+
    //             '</li>';

    // }else{

    //     var itemGroupName = data.editName ? data.editName : data.name,
    //         itemGroupSrc = data.src,
    //         itemGroupSize = data.size,
    //         itemGroupId = data.id,
    //         itemGroupTime = data.time,
    //         showHtml = '',
    //         itemSuffix = data.name.substring(data.name.lastIndexOf('.'), data.name.length);

    //     if(itemGroupName.lastIndexOf('.') > 0){
    //         itemGroupName = itemGroupName.substring(0, itemGroupName.lastIndexOf('.'));
    //     };

    //     if(typeId == 0){

    //         showHtml = '<a href="javascript:void(0);" onclick="Editer_stage.tool.listItemShow(this)" data-id="'+ id +'" data-itemId="'+ itemGroupId +'" title="预览">' +
    //         '<i class="fa fa-play-circle fa-lg"></i></a>' ;

    //     }

    //     var shtml = '<li class="clearfix" data-id="'+ id +'" data-suffix="'+itemSuffix+'" title="' + data.name + '" data-itemId="'+ itemGroupId +'" data-editName="'+ itemGroupName +'" data-name="' + data.name + '" data-src="'+ this.picDefaultUrl + itemGroupSrc + '" data-size="' + itemGroupSize + '" data-itemId="'+ itemGroupId +'" data-time="'+ itemGroupTime +'">' +
    //                 '<div class="list-item" onclick="Editer_stage.tool.showItemListControl('+ typeId +', this)">'+
    //                 '<div class="mItem-l">' + itemGroupName+itemSuffix + '</div>' +
    //                 '</div>'+
    //                 '<div class="mItem-r">' +
    //                 showHtml +
    //                 '<a href="javascript:void(0);" onclick="Editer_stage.tool.listItemEditer(this,'+ typeId +')" data-id="'+ id +'" data-itemId="'+ itemGroupId +'" title="修改">' +
    //                 '<i class="fa fa-edit fa-lg"></i></a>' +
    //                 '<a href="javascript:void(0);" data-id="'+ id +'" data-type="'+ typeId +'" onclick="Editer_stage.tool.listSortUp(this)" title="'+ lang.upMove +'">' +
    //                 '<i class="fa fa-arrow-circle-up fa-lg"></i></a>' +
    //                 '<a href="javascript:void(0);" data-id="'+ id +'" data-type="'+ typeId +'" onclick="Editer_stage.tool.listSortDown(this)" title="'+ lang.downMove +'">' +
    //                 '<i class="fa fa-arrow-circle-down fa-lg"></i></a>' +
    //                 '<a href="javascript:void(0);" data-id="'+ id +'" data-type="'+ typeId +'" onclick="Editer_stage.tool.listSortRemove(this)" title="'+ lang.deleteMove +'">' +
    //                 '<i class="fa fa-times-circle fa-lg"></i></a></div>'+
    //                 '</li>';
    // }


};
// 列表区域信息
Editer_stage.tool.showItemListMsg = function (jsonData, typeId, id) {

    var itemGroup = jsonData.srcGroup,
        itemGroupLen = itemGroup.length,
        typeName = Editer_stage.tool.getMediaType(typeId),
        shtml = '',
        $list = $('#editer-' + typeName + '-list');

    for (var i = 0; i < itemGroupLen; i++) {

        var itemData = itemGroup[i];

        shtml += Editer_stage.tool.getItemListHtml(itemData, typeId, id, i);
        if (typeId === 0) {
            $('input[data-flag=videoName]').val('');
            $('input[data-flag=videoName]').removeAttr('data-itemid');
        }
    }

    $list.html('');
    $list.append(shtml);
    // $('#material-tab-'+ typeName).find('.green_btn').attr('data-id', id);
    // $('#material-tab-'+ typeName).find('.orange_btn').attr('data-id', id);

};
// 控制左侧列表点击操作
Editer_stage.tool.showItemListControl = function (typeId, obj) {

    var $parent = $(obj).parent('li');

    if (typeId == 0) {

        var thisSize = formatFileSize($parent.attr('data-size')),
            thisName = $parent.attr('data-editName'),
            thisItemId = $parent.attr('data-itemid'),
            thisSuffix = $parent.attr('data-suffix'),
            thisIndex = $parent.index();

        // 存编辑对象
        Editer_stage.tool.videoEditObj = $parent;
        $('#video-size').text(thisSize);
        $('#video-name').val(thisName);
        $('#video-name').attr('data-itemid', thisItemId);
        $('#video-name').attr('data-itemIndex', thisIndex);
        $('#video-name').attr('data-suffix', thisSuffix);

    } else if (typeId == 1) {

        var thisSrc = $parent.attr('data-src'),
            thisId = $parent.attr('data-id'),
            thisSize = getPicSize(thisSrc);

        $('#photo-size').text(thisSize);
        $('#controlItem_' + thisId).find('img').attr('src', thisSrc);

    } else if (typeId == 10) {

        var thisSize = formatFileSize($parent.attr('data-size'));
        $('#audio-size').text(thisSize);

    }

};
// 获取类型
Editer_stage.tool.getMediaType = function (typeNum) {

    switch (typeNum) {
        case 0:
            return 'video';
            break;
        case 1:
            return 'photo';
            break;
        case 2:
            return 'text';
            break;
        case 3:
            return 'weather';
            break;
        case 4:
            return 'clock';
            break;
        case 5:
            return 'mixed';
            break;
        case 6:
            return 'word';
            break;
        case 7:
            return 'ppt';
            break;
        case 8:
            return 'pdf';
            break;
        case 9:
            return 'webpage';
            break;
        case 10:
            return 'audio';
            break;
        case 11:
            return 'number';
            break;
        case 12:
            return 'streamMedia';
            break;
        case 13:
            return 'rtf';
            break;
        case 14:
            return 'information';
            break;
        case 15:
            return 'map';
            break;
    }

};
// 获取弹出框id名称
Editer_stage.tool.getModalName = function (typeId) {

    switch (typeId) {
        case 0:
            return '#editerAddVideo';
            break;
        case 1:
            return '#editerAddPic';
            break;
        case 5:
            return '#editerAddMixed';
            break;
        case 6:
            return '#editerAddword';
            break;
        case 7:
            return '#editerAddppt';
            break;
        case 8:
            return '#editerAddpdf';
            break;
        case 10:
            return '#editerAddaudio';
            break;
        case 13:
            return '#editerAddRtf';
            break;
    }

}
// 弹出层
Editer_stage.tool.judgeMediaType = function (obj, typeId, editerType) {

    var modalName = Editer_stage.tool.getModalName(typeId);

    if (editerType === 0) {

        if (typeId == 10) {
            var dataAudioId = editerDataStore.judgeAudio();
            if (dataAudioId != 0) {
                Editer_stage.tool.showItemMsg(dataAudioId, 10);
                return;
            }
        }

        Editer_stage.tool.openModal(modalName, {
            typeId: typeId,
            editerType: editerType
        });

    } else if (editerType === 1) {

        var id = $(obj).attr('data-id');

        Editer_stage.tool.openModal(modalName, {
            id: id,
            typeId: typeId,
            editerType: editerType
        });

    }

};
/**
 * 打开弹出层
 * @param  {[type]} obj           [description]
 * @param  {[type]} id            [description]
 * @param  {[type]} listItemId    [description]
 * @param  {[type]} listItemIndex [description]
 * @param  {[type]} typeId        [description]
 * @param  {[type]} editerType    [新增为0，编辑为1，添加为2]
 * @return {[type]}               [description]
 */
Editer_stage.tool.openModal = function (obj, attrItem) {

    $(obj).modal('show');

    var count = 0;
    $(obj).on('shown.bs.modal', function (event) {

        var _this = $(this);

        if (++count == 1) {

            if (attrItem) {

                var id = attrItem.id,
                    listItemId = attrItem.listItemId,
                    listItemIndex = attrItem.listItemIndex,
                    typeId = attrItem.typeId,
                    editerType = attrItem.editerType;

                if (id !== undefined) {
                    _this.attr('data-id', id);
                };

                if (listItemId !== undefined) {
                    _this.attr('data-listitemid', listItemId);
                };

                if (listItemIndex !== undefined) {
                    _this.attr('data-listItemindex', listItemIndex);
                };

                if (editerType !== undefined) {
                    _this.attr('data-editertype', editerType);
                };

                if (typeId !== undefined) {
                    _this.attr('data-typeid', typeId);
                };

                if (typeId == 0) {
                    videoModalBindEvent(_this);
                } else if (typeId == 1) {
                    picModalBindEvent(_this);
                } else if (typeId == 5) {
                    mixedModalBindEvent(_this);
                } else if (typeId == 6) {
                    wordModalBindEvent(_this);
                } else if (typeId == 7) {
                    pptModalBindEvent(_this);
                } else if (typeId == 8) {
                    pdfModalBindEvent(_this);
                } else if (typeId == 10) {
                    audioModalBindEvent(_this);
                } else if (typeId == 13) {
                    rtfModalBindEvent(_this);
                } else if (typeId == 15) {
                    mapModalBindEvent(_this);
                }

            } else {
                addBgModalBindEvent(_this);
            }

        }

    });

};
// 列表单独修改
Editer_stage.tool.listItemEditer = function (obj, typeId) {

    var listItem = $(obj).parents('ul').find('li'),
        listItemIndex = 0,
        id = $(obj).attr('data-id'),
        listItemId = $(obj).attr('data-itemid');

    listItem.removeAttr('data-flag');
    $(obj).parents('li').attr('data-flag', '0');

    for (var i = 0, len = listItem.length; i < len; i++) {
        if ($(listItem[i]).attr('data-flag')) {
            listItemIndex = i;
        }
    }

    var modalName = Editer_stage.tool.getModalName(typeId);
    var attrItem = {
        id: id,
        listItemId: listItemId,
        listItemIndex: listItemIndex,
        typeId: typeId,
        editerType: 2
    }

    Editer_stage.tool.openModal(modalName, attrItem);

};
// 预览
Editer_stage.tool.listItemShow = function (obj) {

    var url = $(obj).parents('li').attr('data-src'),
        str = url.substring(0, url.lastIndexOf(".")),
        type = url.substring(url.lastIndexOf("."), url.length),
        path = url.substring(0, url.lastIndexOf("."));

    if (type == '.mp4') {

        path = path + "_copy.mp4";

    } else {

        path = path + ".mp4";

    }

    $('#showVideoPlayConl').attr('src', path);
    $('#showVideoPlay').modal('show');

};
// 列表向'+ lang.upMove +'
Editer_stage.tool.listSortUp = function (list) {

    var c = list.find('li.active'); // 当前项

    if (c.prev('li').length == 0) {
        return
    }

    var b = c.clone();
    c.prev('li').eq(0).before(b);
    c.remove();

};
// 列表向下移
Editer_stage.tool.listSortDown = function (list) {

    var c = list.find('li.active'); // 当前项

    if (c.next('li').length == 0) {
        return
    }

    var b = c.clone();
    c.next('li').eq(0).after(b);
    c.remove();

    // if(typeId == 1){
    //     var imgSrc = $($list.find('li')[0]).attr('data-src');
    //     Editer_stage.tool.chageEditerItemImg(id, imgSrc);
    // }

};
// 列表向移除
Editer_stage.tool.listSortRemove = function (list) {

    var b = list.find('li.active'),
        index = b.index(),
        // $list = $('#editer-' + typeName + '-list'),
        // id = $('#editer-info-' + typeName).attr('data-id');
        // listIdName = 'editer-' + typeName + '-list',
        liLen = list.find('li').length; // 列表对象

    if (index === 0 && liLen - 1 > 0) {

        b.next('li').addClass('active').siblings().removeClass('active');

    } else if (index < liLen - 1 || index === liLen - 1) {

        b.prev('li').addClass('active').siblings().removeClass('active');

    }

    b.remove();

    // Editer_stage.tool.listSortUpData($list, id, typeName);   // 更新内容

};
// 列表更新数据(单一信息修改)
Editer_stage.tool.listSortUpDataSingle = function (id, itemIndex, itemId, name) {

    var dataStoreMediaLen = editerDataStore.data.mediaEle.length;

    for (var i = 0; i < dataStoreMediaLen; i++) {

        var dataMediaEle = editerDataStore.data.mediaEle[i],
            dataId = dataMediaEle.id;

        if (dataId == id) {

            var dataMediaEleGroupLen = dataMediaEle.srcGroup.length;

            for (var e = 0; e < dataMediaEleGroupLen; e++) {

                if (dataMediaEle.srcGroup[e].id == itemId && e == itemIndex) {

                    dataMediaEle.srcGroup[e].editName = name;

                }

            }

        }

    }

};
// 列表向移除
Editer_stage.tool.listMapRemove = function (obj) {

    var b = $(obj).parent().parent(),
        id = $(obj).attr('data-id') * 1,
        itemId = $(obj).attr('data-itemid') * 1,
        removeItemNum = 0,
        $removeItem = $('#map-data' + itemId);

    for (var i = 0, len = editerDataStore.data.mediaEle.length; i < len; i++) {

        if (editerDataStore.data.mediaEle[i].id === id) {

            var mediaEle = editerDataStore.data.mediaEle[i];

            for (var j = 0, jLen = mediaEle.srcGroup.length; j < jLen; j++) {

                if (mediaEle.srcGroup[j].id === itemId) {

                    removeItemNum = j;

                }

            }

            mediaEle.srcGroup.splice(removeItemNum, 1);

        }

    }

    b.remove();

    $removeItem.remove();

};
// 列表更新数据
Editer_stage.tool.listSortUpData = function (obj, id, typeName) {
    console.log(obj)
    var liObjs = obj.find('li'),
        liObjsLen = liObjs.length,
        newSrcGroup = [],
        editerItemObjs = $('.editerCanvas-main').find('.item'),
        mediaTime = 0,
        maxPageTime = 0, // 获取最大的时间设置为页面切换时间
        deleteMediaIndex = -1;

    // 获取当前列表数据
    for (var i = 0; i < liObjsLen; i++) {

        var newSrc = {},
            $li = $(liObjs[i]),
            dataJson = JSON.parse($li.attr('data-json')),
            name = dataJson.name,
            src = dataJson.src,
            size = dataJson.size,
            itemId = dataJson.id;

        if (typeName === 'video') {
            var time = dataJson.time * 1;
            newSrc.time = time;
            mediaTime += time;
        }

        newSrc.name = name;
        newSrc.src = src;
        newSrc.size = size;
        newSrc.id = itemId;

        newSrcGroup.push(newSrc);

    }

    for (var j = 0, dataStoreMediaLen = editerDataStore.data.mediaEle.length; j < dataStoreMediaLen; j++) {

        var dataMediaEle = editerDataStore.data.mediaEle[j],
            dataType = dataMediaEle.type,
            dataPauseTime = dataMediaEle.pauseTime,
            dataId = dataMediaEle.id;

        if (dataId == id) {

            dataMediaEle.srcGroup = newSrcGroup;

            if (typeName === 'video') {
                dataMediaEle.pauseTime = mediaTime;
            }

            if (dataMediaEle.srcGroup.length === 0) {

                deleteMediaIndex = j;
                // 移除舞台区域和数据
                for (var e = 0; e < editerItemObjs.length; e++) {

                    var editerItemId = $(editerItemObjs[e]).attr('data-id');

                    if (editerItemId === id) {

                        $(editerItemObjs[e]).remove();
                        Editer_stage.areaDataShow.hideLeftSideBar('.editer-area-msg');
                        Editer_stage.tool.hideLayout();
                        Editer_stage.tool.hideAreaTool();

                    }

                }

            }

        }

    }

    if (deleteMediaIndex !== -1) editerDataStore.deleteMediaDataItem(deleteMediaIndex);

    editerDataStore.getMediaMaxTime();

};
// 列表修改一条信息
Editer_stage.tool.setListItemData = function (typeName, editerId, editerItemId, editerItemIndex, srcGroupsItem) {

    var liList = $('#editer-' + typeName + '-list li');

    // 遍历图片列表数据
    for (var i = 0; i < liList.length; i++) {

        var jsonData = $(liList[i]).attr('data-json'),
            listItemId = JSON.parse(jsonData).id;

        if (listItemId == editerItemId && editerItemIndex == i) {

            var $liList = $(liList[i]),
                item = srcGroupsItem[0],
                name = item.name,
                itemsuffix = name.substring(name.lastIndexOf('.'), name.length),
                src = PublicUrl.ip + PublicUrl.resources + item.src;

            $liList.attr('data-editname', name).attr('data-itemindex', editerItemIndex).attr('data-itemsuffix', itemsuffix).attr('data-json', JSON.stringify(item));
            $liList.find('.title').text(name);
            if (typeName === 'photo') $('#controlItem_' + editerId).find('img').attr('src', src);

        }

    }

};
// 改变舞台单个属性
Editer_stage.tool.changeEditareaItem = function (id) {

    var $objItem = $('#controlItem_' + id),
        itemData = editerDataStore.getMediaData(id),
        zoom = Editer_stage.tool.calculateZoom(Editer_stage.tool.getZoom());

    Editer_stage.tool.setMainZoom($objItem, itemData, zoom);

};
//移动端获取默认图片
Editer_stage.tool.mobileItemImgName = function (type) {

    var imgName = '';

    switch (type) {
        // 字幕
        case 2:
            imgName = 'default_text';
            break;
            // 天气
        case 3:
            imgName = 'default_weather';
            break;
            // 时钟
        case 4:
            imgName = 'default_clock';
            break;
            // 混播
        case 5:
            imgName = 'default_mix';
            break;
            // world
        case 6:
            imgName = 'default_world';
            break;
            // PPT
        case 7:
            imgName = 'default_ppt';
            break;
            // PDF
        case 8:
            imgName = 'default_pdf';
            break;
            // 网页
        case 9:
            imgName = 'default_web';
            break;
            // 音频
        case 10:
            imgName = 'default_audio';
            break;
            // 流媒体 
        case 12:
            imgName = 'default_stream';
            break;
            // 数据
        case 14:
            imgName = 'default_db';
            break;
            // 交通诱导
        case 15:
            imgName = 'default_traffic';
            break;
    }

    return imgName;
}

// 初始化区域数据
Editer_stage.tool.initEditareaItem = function (itemData) {

    var shtml = '',
        itemId = itemData.id,
        itemType = itemData.type * 1,
        itemTop = itemData.top,
        itemLeft = itemData.left,
        itemWidth = itemData.width,
        itemHeight = itemData.height,
        itemZindex = itemData.zIndex,
        iteBorderShow = itemData.borderSW,
        itemBorderType = itemData.borderType !== undefined ? itemData.borderType : '0';

    if (itemType == 10) {
        return '';
    }


    shtml += '<div id="controlItem_' + itemId + '" class="item" data-drag="true" data-type="' + itemType + '" data-id="' + itemId + '" style="position: absolute; top:' + itemTop + 'px; left: ' + itemLeft + 'px; width: ' + itemWidth + 'px; height: ' + itemHeight + 'px;z-index:' + itemZindex + ';overflow:hidden;">' +
        '<div id="line_box_' + itemId + '" class="lineType' + itemBorderType + '" style="display:' + (iteBorderShow == 1 ? 'inline-block' : 'none') + ';">' +
        '<div class="line line_t line_X"></div>' +
        '<div class="line line_l line_y"></div>' +
        '<div class="line line_r line_y"></div>' +
        '<div class="line line_b line_X"></div>' +
        '</div>';

    if (itemType === 0 || itemType === 13) {

        var imgSrc = Editer_stage.tool.editerAreaImg(itemType);

        shtml += '<img style="width: 100%;height: 100%;vertical-align: top;" onerror= "this.src=\'./../images/default.jpg\'" src="' + imgSrc + '" alt="">';

    } else if (itemType === 1) {

        var firstImg = itemData.srcGroup.length > 0 ? itemData.srcGroup[0].src : './../images/default.jpg',
            imgId = itemData.srcGroup[0].id,
            imgIndex = editerDataStore.setItemListGroupDataIndex(itemId, imgId);

        shtml += '<img style="width: 100%;height: 100%;vertical-align: top;" onerror= "this.src=\'./../images/default.jpg\'" data-imgIndex="' + imgIndex + '"  src="' + this.picDefaultUrl + firstImg + '" alt="">';

    } else {

        shtml += '<img style="width: 100%;height: 100%;vertical-align: top;" onerror= "this.src=\'./../images/default.jpg\'"  src="./../images/' + Editer_stage.tool.mobileItemImgName(itemType) + '.jpg" alt="">'

    }

    //  type：0为视频，1为图片，2为字幕，3为天气，4为时钟，5为混播，6为world，7为PPT，8为PDF，9为网页，10为音频，11为叫号,12流媒体,13为rtf,14为数据
    // if(itemType === 0 || itemType === 5 || itemType === 6 || itemType === 7 || itemType === 8 || itemType === 9 || itemType === 12 || itemType === 13){  

    //     var imgSrc = Editer_stage.tool.editerAreaImg(itemType);

    //     shtml +=  '<img style="width: 100%;height: 100%;vertical-align: top;" onerror= "this.src=\'./../images/default.jpg\'" src="' + imgSrc + '" alt="">';

    // }else if(itemType === 1){

    //     var firstImg = itemData.srcGroup.length > 0 ? itemData.srcGroup[0].src : './../images/default.jpg';
    //     shtml +=  '<img style="width: 100%;height: 100%;vertical-align: top;" onerror= "this.src=\'./../images/default.jpg\'"  src="'+ this.picDefaultUrl + firstImg +'" alt="">'; 

    // }else if(itemType === 2){

    //     var mediaText = itemData.text,
    //         mediaTextFm = itemData.fontFamily,
    //         mediaTextTa = itemData.textAlign,
    //         mediaTextFst = itemData.fontStyle,
    //         mediaTextTd = itemData.textDecoration,
    //         mediaTextFs = itemData.fontSize,
    //         mediaTextFw = itemData.fontWeight,
    //         mediaTextFc = itemData.fontColor,
    //         mediaTextBg = itemData.background,
    //         mediaTextLt = itemData.listType,
    //         mediaStyle = '';

    //     mediaStyle += (mediaTextFm != '') ? 'font-family:'+ mediaTextFm +';' : '';
    //     mediaStyle += (mediaTextTa != '') ? 'text-align:'+ mediaTextTa +';' : '';
    //     mediaStyle += (mediaTextFst != '') ? 'font-style:'+ mediaTextFst +';' : '';
    //     mediaStyle += (mediaTextTd != '') ? 'text-decoration:'+ mediaTextTd +';' : '';
    //     mediaStyle += (mediaTextFs != '') ? 'font-size:'+ mediaTextFs +'px;' : '';
    //     mediaStyle += (mediaTextFw != '') ? 'font-weight:'+ mediaTextFw +';' : '';
    //     mediaStyle += (mediaTextFc != '') ? 'color:'+ mediaTextFc +';' : '';
    //     mediaStyle += (mediaTextBg != '') ? 'background:'+ mediaTextBg + ';' : '';
    //     mediaText = itemData.textGroup[0].text;

    //     shtml += '<div class="mediaItem textCont" style=\"'+ mediaStyle +'border:1px solid #eee;\">'+ mediaText +'</div>';

    // }else if(itemType === 3){

    //     var rowType = itemData.rowType,
    //         bgColor = itemData.bgColor,
    //         msgHtml = '';

    //     if(rowType == 1){

    //         msgHtml = Editer_stage.tool.setWeatherHtmlTempA(itemData);

    //     }else if(rowType == 2){

    //         msgHtml = Editer_stage.tool.setWeatherHtmlTempB(itemData);

    //     }else if(rowType == 3){

    //         msgHtml = Editer_stage.tool.setWeatherHtmlTempC(itemData);

    //     }else if(rowType == 4){

    //         msgHtml = Editer_stage.tool.setWeatherHtmlTempD(itemData);

    //     }

    //     shtml +=    '<div class="weatherCont" style="width:100%;height:100%;overflow:hidden;background-color:'+ bgColor +'">'+
    //                     '<table cellspacing="0" cellpadding="0" border="0" class="weather_content" style="width:100%;">'+
    //                         msgHtml +
    //                     '</table>'+
    //                 '</div>';

    // }else if(itemType === 4){

    //     var clockW = itemData.clockW,
    //         dateFontSize = itemData.dateFontSize,
    //         timeFontSize = itemData.timeFontSize,
    //         timeFormat = itemData.timeFormat,
    //         dateFormat = itemData.dateFormat,
    //         weekFormat = itemData.weekFormat,
    //         fontFamily = itemData.fontFamily,
    //         fontColor = itemData.fontColor,
    //         dateWeight = itemData.dateWeight,
    //         weekWeight = itemData.weekWeight,
    //         timeWeight = itemData.timeWeight,
    //         clockType = itemData.clockType,
    //         clockStyle = (clockType == 0) ? "display:inline-block;" : "display:none;",
    //         dateStyle = (clockType == 1) ? "display:inline-block;" : "display:none;",
    //         weekStyle = (weekWeight == 1) ? "font-weight:bold;" : "font-weight:normal;",
    //         timeStyle = (timeWeight == 1) ? "font-weight:bold;" : "font-weight:normal;",        
    //         hourShow = itemData.hourShow,
    //         minutesShow = itemData.minutesShow,
    //         secondsShow = itemData.secondsShow,
    //         weekShow = itemData.weekShow,
    //         hourStyle = (hourShow == 1) ? "display:inline-block;" : "display:none;",
    //         minutesStyle = (minutesShow == 1) ? "display:inline-block;" : "display:none;",
    //         secondsStyle = (secondsShow == 1) ? "display:inline-block;" : "display:none;",
    //         weekshowStyle = (weekShow == 1) ? "display:inline-block;" : "display:none;",
    //         dateHtml = '',
    //         timeHtml = '',
    //         weekHtml = '';

    //         dateStyle += (dateWeight == 1) ? "font-weight:bold;" : "font-weight:normal;";
    //         timeStyle += "font-size:"+ timeFontSize +"px";

    //         dateHtml = Editer_stage.tool.setClockHtmlTempA(itemData);
    //         timeHtml = '<span class="date_hours" style="'+ hourStyle +'">00</span>'+
    //                    '<span class="date_minutes" style="'+ minutesStyle +'">:00</span>'+
    //                    '<span class="date_seconds" style="'+ secondsStyle +'">:00</span>';

    //         if(weekFormat == 1){
    //             weekHtml = '<span class="date_week" style="'+ weekshowStyle +'">星期一</span>';
    //         } else if(weekFormat == 2){
    //             weekHtml = '<span class="date_week" style="'+ weekshowStyle +'">周一</span>';
    //         } else {
    //             weekHtml = '<span class="date_week" style="'+ weekshowStyle +'">Mon</span>';
    //         }

    //         shtml +=    '<div class="light clock clockDigital" style="'+ dateStyle +'font-family:'+ fontFamily +';color:'+ fontColor +';border:1px solid #eeeeee">'+
    //                         '<table cellspacing="0" cellpadding="0" border="0" width="100%">'+
    //                             '<tbody>'+
    //                                ' <tr>'+
    //                                     // '<td class="clock_td" style="'+ clockStyle +'">'+
    //                                     //     '<img class="clockimg" style="width:'+clockW+'px;" src="./images/icon-clock.png"/>'+
    //                                     // '</td>'+
    //                                     '<td class="text_td" style="text-align: center;white-space:nowrap;">'+
    //                                         '<div class="display">'+
    //                                             '<div class="date" style="font-size:'+ dateFontSize +'px"><span class="date_a" >'+ dateHtml +'</span></div>'+
    //                                             '<div class="digits" style="'+ timeStyle +'">'+ timeHtml +'</div>'+
    //                                             '<div><span class="date_b" style="'+ weekStyle +'">'+ weekHtml +'</span></div>'+
    //                                         '</div>'+
    //                                     '</td>'+
    //                                 '</tr>'+
    //                            ' </tbody>'+
    //                         '</table>'+
    //                     '</div>';

    //         shtml += '<div class="clockSimulation" style="'+ clockStyle +'overflow:hidden;width:100%;height:100%;"><img width="100%" height="100%" src="./images/icon-clock.png"/></div>';

    // }else if(itemType === 14){

    //     shtml += '<div class="dnyTable" style="height: 100%;overflow: hidden;">'+ itemData.html + '</div>';

    // }else if(itemType === 15){

    //     var fontFamily = itemData.fontFamily,
    //         fontSize = itemData.fontSize,
    //         fontColor = itemData.fontColor,
    //         backgroundImage = itemData.bgImg,
    //         dataItem = itemData.srcGroup,
    //         dataItemHtml = '';

    //     backgroundImage = backgroundImage ? backgroundImage : '';

    //     for(var i=0,len=dataItem.length;i<len;i++){

    //         var groupItem = dataItem[i];

    //         dataItemHtml +=  Editer_stage.tool.mapHtml(groupItem);

    //     }

    //     shtml += '<div class="map" style="color:'+ fontColor +';font-size:'+ fontSize +'px;line-height: initial;overflow:hidden;font-family:'+ fontFamily +';background-image: url(' + Editer_stage.tool.picDefaultUrl + backgroundImage +');background-repeat: no-repeat;background-size: cover;">'+
    //               dataItemHtml +
    //               '</div>';

    // }

    shtml += '</div>';

    return shtml;

};
// 地图字段区域添加
Editer_stage.tool.mapHtml = function (groupItem) {

    var shtml = '<div class="map-data" id="map-data' + groupItem.id + '" style="width:' + groupItem.width + 'px;height:' + groupItem.height + 'px;overflow:hidden;line-height:' + groupItem.height + 'px;left:' + groupItem.left + 'px;top:' + groupItem.top + 'px;" data-id="' + groupItem.id + '" data-val="' + groupItem.dataVal + '">' + groupItem.dataVal + '</div>';

    return shtml;

};
// 返回类型舞台默认 图片
Editer_stage.tool.editerAreaImg = function (type) {

    switch (type) {
        case 0: // 视频
            return './../images/default_video.jpg'
            break;
        case 5: // 混播
            return './../images/default_mix.jpg'
            break;
        case 6: // WORLD
            return './../images/default_world.jpg'
            break;
        case 7: // PPT
            return './../images/default_ppt.jpg'
            break;
        case 8: // PDF
            return './../images/default_pdf.jpg'
            break;
        case 9: // 网页
            return './../images/default_web.jpg'
            break;
        case 12: // 流媒体
            return './../images/default_stream.jpg'
            break;
        case 13: // rtf
            return './../images/default_rtf.jpg'
            break;
    }

};
// 时钟类型  YYYY.MM.DD HH:MM:SS
Editer_stage.tool.setClockHtmlTempA = function (data) {

    var dateFormat = data.dateFormat,
        yearShow = data.yearShow,
        monthShow = data.monthShow,
        dateShow = data.dateShow,
        yearStyle = (yearShow == 1) ? "display:inline-block;" : "display:none;",
        monthStyle = (monthShow == 1) ? "display:inline-block;" : "display:none;",
        dateshowStyle = (dateShow == 1) ? "display:inline-block;" : "display:none;",
        yearShtml = '',
        monthShtml = '',
        dateShtml = '',
        markYearStyle = ((yearShow == 1) ? "display:inline-block;" : "display:none;"),
        markMonthStyle = ((monthShow == 1) ? "display:inline-block;" : "display:none;"),
        markYearShtml = '<span class="markYear" style="' + markYearStyle + '">',
        markMonthShtml = '<span class="markMonth" style="' + markMonthStyle + '">';

    if (dateFormat == 1) {

        markYearShtml += '.';
        markMonthShtml += '.';
        yearShtml = '<span class="date_year" style="' + yearStyle + '">2017</span>';
        monthShtml = '<span class="date_month" style="' + monthStyle + '">07</span>';
        dateShtml = '<span class="date_date" style="' + dateshowStyle + '">18</span>';

    } else if (dateFormat == 2) {

        markYearShtml += '-';
        markMonthShtml += '-';
        yearShtml = '<span class="date_year" style="' + yearStyle + '">2017</span>';
        monthShtml = '<span class="date_month" style="' + monthStyle + '">07</span>';
        dateShtml = '<span class="date_date" style="' + dateshowStyle + '">18</span>';

    }

    markYearShtml += '</span>';
    markMonthShtml += '</span>';

    return yearShtml + markYearShtml + monthShtml + markMonthShtml + dateShtml;

};
// 天气数据
Editer_stage.tool.getWeatherData = function (data) {

    var weatherData = {},
        wind = data.wind == 0 ? 'none' : 'inline-block',
        scale = data.scale == 0 ? 'none' : 'inline-block',
        hum = data.hum == 0 ? 'none' : 'block',
        air = data.air == 0 ? 'none' : 'inline-block',
        pm = data.pm == 0 ? 'none' : 'inline-block',
        icon = data.icon == 0 ? 'none' : 'table-cell',
        lineShow01 = 'block',
        lineShow02 = 'block',
        fontFamily = data.fontFamily,
        fontColor = data.fontColor,
        fontSize = data.fontSize,
        todayShow = data.todayShow,
        tomShow = data.tomShow,
        afterShow = data.afterShow,
        iconSize = data.iconSize,
        shtml = '',
        dayName = [lang.today, lang.tomorrow, lang.afterTomorrow];

    weatherData.wind = wind;
    weatherData.scale = scale;
    weatherData.hum = hum;
    weatherData.air = air;
    weatherData.pm = pm;
    weatherData.icon = icon;
    weatherData.lineShow01 = lineShow01;
    weatherData.lineShow02 = lineShow02;
    weatherData.fontFamily = fontFamily;
    weatherData.fontColor = fontColor;
    weatherData.fontSize = fontSize;
    weatherData.todayShow = todayShow;
    weatherData.afterShow = afterShow;
    weatherData.iconSize = iconSize;
    weatherData.dayName = dayName;

    if (data.wind == 0 && data.scale == 0) {
        weatherData.lineShow01 = 'none';
    }

    if (data.pm == 0 && data.air == 0) {
        weatherData.lineShow02 = 'none';
    }

    if (data.state == 0 && data.temperature == 0) {
        weatherData.lineShow03 = 'none';
    }

    return weatherData;

}
// 左右图文(横排)
Editer_stage.tool.setWeatherHtmlTempA = function (data) {

    var weatherData = Editer_stage.tool.getWeatherData(data);
    var shtml = '';

    var publicMsgHtml = '<p style="margin: 0px;white-space:nowrap; text-align: right;padding-top: 6px;display:' + weatherData.area + '" class="city">' + lang.district + '</p>' +
        '<p style="margin: 0px;white-space:nowrap;text-align:right;padding-top: 6px;display:' + weatherData.lineShow03 + '" class="stateLine"><span class="state" style="display:' + weatherData.state + '">' + lang.sunny + '</span> <span class="temperature" style="display:' + weatherData.temperature + '">14℃~23℃</span></p>' +
        '<p style="margin: 0px;text-align: right;white-space:nowrap;padding-top: 6px;display:' + weatherData.lineShow01 + '" class="windLine"><span class="wind" style="display:' + weatherData.wind + '">' + lang.northWind + '</span> <span class="scale" style="display:' + weatherData.scale + '">' + lang.breeze + '<span></p>' +
        '<p style="margin: 0px;text-align: right;white-space:nowrap;padding-top: 6px;display:' + weatherData.hum + '" class="hum">' + lang.humidity + ' 65%</p>' +
        '<p style="text-align: right;white-space:nowrap;padding-top: 6px;display:' + weatherData.lineShow02 + '" class="airLine"><span class="pm" style="display:' + weatherData.pm + '">PM2.5 16</span> <span class="air" style="display:' + weatherData.air + '">' + lang.optimal + '</span></p>';

    shtml += '<tr>';

    for (var i = 0, len = weatherData.dayName.length; i < len; i++) {

        var state = '',
            className = '';

        if (i === 0) {
            className = 'todayShow';
            state = weatherData.todayShow == 1 ? 'table-cell' : 'none';
        } else if (i === 1) {
            className = 'tomShow';
            state = weatherData.tomShow == 1 ? 'table-cell' : 'none';
        } else if (i === 2) {
            className = 'afterShow';
            state = weatherData.afterShow == 1 ? 'table-cell' : 'none';
        }

        shtml += '<td class="weather_day clearfix ' + className + '" style="font-family:' + weatherData.fontFamily + ';color:' + weatherData.fontColor + ';font-size:' + weatherData.fontSize + 'px;display:' + state + ';">' +
            '<table style="width:100%; height:100%;"><tbody><tr>' +
            '<td class="weather_pic weather_icon" style="padding-left:8px;display:' + weatherData.icon + '">' +
            '<img src="./images/weather.png" style="width:' + weatherData.iconSize + 'px;height:' + weatherData.iconSize + 'px;" border="0" alt="">' +
            '</td>' +
            '<td class="weater_text">' +
            '<p style="margin: 0px;white-space:nowrap; text-align: right;padding-top: 6px;display:' + weatherData.date + '" class="weather_date">' + weatherData.dayName[i] + '</p>' +
            publicMsgHtml +
            '</td>' +
            '</tr></tbody></table></td>';

    }

    shtml += '</tr>';

    return shtml;

};
// 左右图文(竖排)
Editer_stage.tool.setWeatherHtmlTempB = function (data) {

    var weatherData = Editer_stage.tool.getWeatherData(data);
    var shtml = '';

    var publicMsgHtml = '<div><p style="margin: 0px;white-space:nowrap;display:' + weatherData.temperature + '" class="temperature">13 / 23℃</p></div>' +
        '<div><p style="margin: 0px;white-space:nowrap;display:' + weatherData.state + '" class="state">' + lang.sunny + '</p></div>' +
        '<div><p style="margin: 0px;white-space:nowrap;display:' + weatherData.lineShow01 + '" class="windLine"><span class="wind" style="display:' + weatherData.wind + '">' + lang.northWind + '</span> <span class="scale" style="display:' + weatherData.scale + '">' + lang.breeze + '<span></p></div>' +
        '<div><p style="margin: 0px;white-space:nowrap;display:' + weatherData.hum + '" class="hum">' + lang.humidity + ' 65%</p></div>' +
        '<div><p style="margin: 0px;white-space:nowrap;display:' + weatherData.lineShow02 + '" class="airLine"><span class="pm" style="display:' + weatherData.pm + '">PM2.5 16</span> <span class="air" style="display:' + weatherData.air + '">' + lang.optimal + '</span></p></div>';

    for (var i = 0, len = weatherData.dayName.length; i < len; i++) {

        var state = '',
            className = '';

        if (i === 0) {
            className = 'todayShow';
            state = weatherData.todayShow == 1 ? 'table-cell' : 'none';
        } else if (i === 1) {
            className = 'tomShow';
            state = weatherData.tomShow == 1 ? 'table-cell' : 'none';
        } else if (i === 2) {
            className = 'afterShow';
            state = weatherData.afterShow == 1 ? 'table-cell' : 'none';
        }

        shtml += '<tr>';
        shtml += '<td class="weather_day ' + className + '" align="center" style="font-family:' + weatherData.fontFamily + ';color:' + weatherData.fontColor + ';font-size:' + weatherData.fontSize + 'px;display:' + state + '">' +
            '<div class="weather_pic" style="margin-bottom:10px;">' +
            '<p style="margin: 0px;white-space:nowrap;">' +
            '<span class="city" style="display:' + weatherData.area + '">' + lang.district + '</span>' +
            '<p class="day_name weather_date" style="margin:0px;">' + weatherData.dayName[i] + '</p>' +
            '</p>' +
            '<img src="./images/weather.png" class="weather_icon" style="width:' + weatherData.iconSize + 'px;height:' + weatherData.iconSize + 'px;display:' + weatherData.icon + '" border="0" alt="">' +
            publicMsgHtml +
            '</div>' +
            '</td>';
        shtml += '</tr>';

    }

    return shtml;

};
// 上下图文(横排)
Editer_stage.tool.setWeatherHtmlTempC = function (data) {

    var weatherData = Editer_stage.tool.getWeatherData(data);
    var shtml = '';

    var publicMsgHtml = '<p style="margin: 0px;white-space:nowrap;display:' + weatherData.temperature + '" class="temperature">13 / 23℃</p>' +
        '<p style="margin: 0px;white-space:nowrap;display:' + weatherData.state + '" class="state">' + lang.sunny + '</p>' +
        '<p style="margin: 0px;white-space:nowrap;display:' + weatherData.lineShow01 + '"class="windLine"><span class="wind" style="display:' + weatherData.wind + '">' + lang.northWind + '</span> <span class="scale" style="display:' + weatherData.scale + '">' + lang.breeze + '<span></p>' +
        '<p style="margin: 0px;white-space:nowrap;display:' + weatherData.hum + '" class="hum">' + lang.humidity + ' 65%</p>' +
        '<p style="margin: 0px;white-space:nowrap;display:' + weatherData.lineShow02 + '" class="airLine"><span class="pm" style="display:' + weatherData.pm + '">PM2.5 16</span> <span class="air" style="display:' + weatherData.air + '">' + lang.optimal + '</span></p>';

    shtml += '<tr>';

    for (var i = 0, len = weatherData.dayName.length; i < len; i++) {

        var state = '',
            className = '';

        if (i === 0) {
            className = 'todayShow';
            state = weatherData.todayShow == 1 ? 'table-cell' : 'none';
        } else if (i === 1) {
            className = 'tomShow';
            state = weatherData.tomShow == 1 ? 'table-cell' : 'none';
        } else if (i === 2) {
            className = 'afterShow';
            state = weatherData.afterShow == 1 ? 'table-cell' : 'none';
        }

        shtml += '<td class="weather_day ' + className + '" align="center" style="font-family:' + weatherData.fontFamily + ';color:' + weatherData.fontColor + ';font-size:' + weatherData.fontSize + 'px;display:' + state + '">' +
            '<div class="weather_pic" style="margin-bottom:10px;">' +
            '<p style="margin: 0px;white-space:nowrap;">' +
            '<span class="city" style="display:' + weatherData.area + '">' + lang.district + '</span>' +
            '<span class="day_name weather_date" style="display:' + weatherData.date + '>' + weatherData.dayName[i] + '</span>' +
            '</p>' +
            '<img src="./images/weather.png" style="width:' + weatherData.iconSize + 'px;height:' + weatherData.iconSize + 'px;display:' + weatherData.icon + '" border="0" alt="">' +
            publicMsgHtml +
            '</div>' +
            '</td>';

    }

    shtml += '</tr>';

    return shtml;

};
// 上下文字(横排)
Editer_stage.tool.setWeatherHtmlTempD = function (data) {

    var weatherData = Editer_stage.tool.getWeatherData(data);
    var shtml = '';

    var publicMsgHtml = '<p style="margin: 0px;white-space:nowrap;display:' + weatherData.temperature + '" class="temperature">13 / 23℃</p>' +
        '<p style="margin: 0px;white-space:nowrap;display:' + weatherData.state + '">' + lang.sunny + '</p>' +
        '<p style="margin: 0px;white-space:nowrap;display:' + weatherData.lineShow01 + '"><span style="display:' + weatherData.wind + '">' + lang.northWind + '</span> <span style="display:' + weatherData.scale + '">' + lang.breeze + '<span></p>' +
        '<p style="margin: 0px;white-space:nowrap;display:' + weatherData.hum + '">' + lang.humidity + ' 65%</p>' +
        '<p style="margin: 0px;white-space:nowrap;display:' + weatherData.lineShow02 + '"><span style="display:' + weatherData.pm + '">PM2.5 16</span> <span style="display:' + weatherData.air + '">' + lang.optimal + '</span></p>';

    shtml += '<tr>';

    for (var i = 0, len = weatherData.dayName.length; i < len; i++) {

        var state = '',
            className = '';

        if (i === 0) {
            className = 'todayShow';
            state = weatherData.todayShow == 1 ? 'table-cell' : 'none';
        } else if (i === 1) {
            className = 'tomShow';
            state = weatherData.tomShow == 1 ? 'table-cell' : 'none';
        } else if (i === 2) {
            className = 'afterShow';
            state = weatherData.afterShow == 1 ? 'table-cell' : 'none';
        }

        shtml += '<td class="weather_day ' + className + '" align="center" style="font-family:' + weatherData.fontFamily + ';color:' + weatherData.fontColor + ';font-size:' + weatherData.fontSize + 'px;display:' + state + '">' +
            '<div class="weather_pic">' +
            '<p style="margin: 0px;white-space:nowrap;">' +
            '<span class="city" style="display:' + weatherData.area + '">' + lang.district + '</span>' +
            '<span class="day_name weather_date">' + weatherData.dayName[i] + '</span>' +
            publicMsgHtml +
            '</p>' +
            '</div>' +
            '</td>';

    }

    shtml += '</tr>';

    return shtml;

};
// 修改页面最大时间
Editer_stage.tool.setMaxPageTime = function (time) {

    $(this.pageTimeVal).val(time);

};
// 项目移除
Editer_stage.tool.removeEditerItem = function (obj) {

    // 　　if(isIE() || isIE11()){

    // 　　　　obj.removeNode(true);

    // 　　}else{

    obj.remove();

    // }

};
// 移除舞台select拖拽点
Editer_stage.tool.removeEditerItemSelect = function () {

    var dataAllId = editerDataStore.getDataArryId(),
        dataAllIdLen = dataAllId.length;

    for (var i = 0; i < dataAllIdLen; i++) {

        var $elem = $('#controlItem_' + dataAllId[i]);
        dragResize.deleteSelectPoint($elem);

    }

};
// 移除数据音频
Editer_stage.tool.removeDataAudio = function (obj) {
    var itemId = $(obj).attr('data-id');
    editerDataStore.deleteMediaDataItemById(itemId);
    Editer_stage.areaDataShow.hideLeftSideBar('.editer-area-msg');
};
// 加载js
// Editer_stage.tool.loadScript = function (sScriptSrc, callbackfunction, callbackerror){

//     $.getScript(sScriptSrc).done(callbackfunction).fail(callbackerror);;

// };
// 改变舞台指定图片
Editer_stage.tool.chageEditerItemImg = function (id, thisSrc) {

    $('#controlItem_' + id).find('img').attr('src', thisSrc);

};
// 数据编辑按钮
Editer_stage.tool.editerItemData = function (obj) {

    var id = $(obj).parents('.left-sideBar-tab').attr('data-id'),
        el = '#controlItem_' + id,
        lineNum = $('#information-line').val() * 1,
        columnNum = $('#information-column').val() * 1;

    $(obj).addClass('disabled');
    $('#informationCancle').removeClass('disabled');

    $('#information-inputList').find('input,select').each(function () {

        $(this).removeAttr('disabled');

    });

    dragResize.lock();

    dnyTableObj = new DnyTable({
        el: el,
        lineNum: lineNum,
        columnNum: columnNum
    });

    $(el).attr('data-edit', '1');

    dnyTableObj.init();

};
// 数据取消编辑按钮
Editer_stage.tool.cancelItemData = function () {

    dragResize.unlock();

    if (dnyTableObj) {

        $('#information-inputList').find('input,select').each(function () {

            $(this).attr('disabled', true);

        });

        $('#informationEditer').removeClass('disabled');
        $('#informationCancle').addClass('disabled');

        dnyTableObj.saveTable();
        dnyTableObj.deleteBind();
        dnyTableObj = null;

    }

};
// 数据合并按钮
Editer_stage.tool.mergeCellBtn = function () {

    if (dnyTableObj) {

        if (dnyTableObj.judgeDnyTable()) {

            dnyTableObj.mergeCell();

        }

    }

}
// 数据不合并按钮
Editer_stage.tool.deleteMergeCellBtn = function () {

    if (dnyTableObj) {

        if (dnyTableObj.judgeDnyTable()) {

            dnyTableObj.deleteMergeCell();

        }
    }

}
// 诱导图编辑按钮
Editer_stage.tool.editerMapItemData = function (obj) {

    var id = $(obj).parents('.left-sideBar-tab').attr('data-id'),
        el = '#controlItem_' + id;

    $(obj).addClass('disabled');
    $('#mapCancle').removeClass('disabled');

    $('#map-inputList').find('input,select').each(function () {

        $(this).removeAttr('disabled');

    });

    dragResize.lock();

    mapFigure = new Editer_stage.MapFigure({
        elem: el
    });

    $(el).attr('data-edit', '1');

    mapFigure.init();

}
// 诱导图取消按钮
Editer_stage.tool.cancelMapItemData = function () {

    if (mapFigure) {

        dragResize.unlock();

        $('#map-inputList').find('input,select').each(function () {

            $(this).attr('disabled', true);

        });

        $('#mapEditer').removeClass('disabled');
        $('#mapCancle').addClass('disabled');

        mapFigure.deleteBind();
        mapFigure = null;

    }


}

// 诱导图区域添加
Editer_stage.tool.addMapData = function (obj) {

    var $materialMap = $('#material-tab-map'),
        id = $materialMap.attr('data-id'),
        srcGroupsItem = {
            id: new Date().getTime(),
            dataVal: 'dataVal',
            left: 0,
            top: 0,
            width: 50,
            height: 50
        },
        shtml = '';

    shtml += Editer_stage.tool.getItemListHtml(srcGroupsItem, 15, id);

    $('#map-list').append(shtml);

    $('#controlItem_' + id).find('.map').append(Editer_stage.tool.mapHtml(srcGroupsItem));

    editerDataStore.setItemListGroupData(id, srcGroupsItem);

}
// 诱导图input
Editer_stage.tool.mapInputKeyUp = function (obj) {

    var $this = $(obj),
        id = $this.attr('data-id'),
        itemId = $this.attr('data-itemid'),
        val = $this.val(),
        $mapData = $('#map-data' + itemId);

    $mapData.text(val);
    editerDataStore.setMapMediaData(id, val, '', '', itemId);

}

// 克隆数据
Editer_stage.tool.deepClone = function (origin, target) {

    var target = target || {},
        toStr = Object.prototype.toString,
        arrStr = '[object Array]';

    for (var prop in origin) {

        if (origin.hasOwnProperty(prop)) {

            if (typeof (origin[prop]) === 'object' && origin[prop] !== 'null') {

                if (toStr.call(origin[prop]) === arrStr) {

                    target[prop] = [];

                } else {

                    target[prop] = {};

                }

                Editer_stage.tool.deepClone(origin[prop], target[prop]);

            } else {

                target[prop] = origin[prop];

            }

        }

    }

    return target;

}
// 封装attachEvent与addEventlistener
Editer_stage.tool.addEvent = function (obj, ev, fn) {

    if (obj.attachEvent) {
        //针对IE浏览器
        obj.attachEvent('on' + ev, fn)
    } else {
        //针对FF与chrome
        obj.addEventListener(ev, fn, false)
    }

}
// px转换rem
Editer_stage.tool.pxToRem = function (pxVal) {
    return pxVal / 20 * 1 + 'rem';
}
// 无遮罩提示框
Editer_stage.tool.toast = function (msg) {

    Popup.toast(msg, 1000);

}
// 加载
Editer_stage.tool.showLoading = function (msg) {

    Popup.showLoading(msg);

}
// 隐藏加载
Editer_stage.tool.hideLoading = function (msg) {

    Popup.close();

}
// 选择弹窗
Editer_stage.tool.confirm = function (msg, sureCallBack, cancelCallBack) {
    Popup.confirm(msg, [{
            name: "取消",
            ac: cancelCallBack ? cancelCallBack : ''
        },
        {
            name: '确定',
            ac: sureCallBack ? sureCallBack : ''
        }
    ]);
}
// 页面加载
Editer_stage.tool.setPageInfoList = function (list) {

    var shtml = '';

    for (var i = 0, len = list.length; i < len; i++) {

        var className = '',
            pageName = list[i].pageName,
            pageId = list[i].pageId,
            pagePlaytime = list[i].pagePlaytime;

        if (nowPageId) {
            if (nowPageId == pageId) className = 'active';
        } else {
            className = i === 0 ? 'active' : '';
        }

        shtml += '<li data-json=' + JSON.stringify(list[i]) + ' data-pageid=' + pageId + ' class=' + className + '>\
                    <span class="title">' + pageName + '</span>\
                </li>';
        if (i === 0) {
            Editer_stage.tool.setPageInfo(pageName, pagePlaytime);
            $('#page-name').attr('data-index', i);
        };
    }

    $('#editer-page-list').append(shtml);

}
// 设置页面管理信息
Editer_stage.tool.setPageMsg = function (color) {

    $('#page-color').val(color.replace(/(#)+/, ''));
    $('#page-color').css('background-color', color);

}
// 设置页面管理名称和时间
Editer_stage.tool.setPageInfo = function (pageName, pagePlaytime) {
    $('#page-name').val(pageName);
    $('#page-pauseTime').val(pagePlaytime);
}

// 获取pageJSON里指定的字段值
Editer_stage.tool.getPageJsonData = function (json, name) {

    if (json) {

        return JSON.parse(json)[name];

    }

    return ''

}

// 显示区域编辑工具
Editer_stage.tool.showAreaTool = function () {

    var $tool = $('.editer-area-tool');

    if (!$tool.hasClass('show-in')) {

        $tool.addClass('show-in');

    }

}
// 隐藏区域编辑工具
Editer_stage.tool.hideAreaTool = function () {

    var $tool = $('.editer-area-tool');

    if ($tool.hasClass('show-in')) {

        $tool.removeClass('show-in').addClass('show-out');

        setTimeout(function () {

            $tool.removeClass('show-out');

        }, 300);

    }

}
// 显示区域边框设置按钮
Editer_stage.tool.showAreaBorderTool = function () {
    $('#canvas-layer').show();
}
// 隐藏区域边框设置按钮
Editer_stage.tool.hideAreaBorderTool = function () {
    $('#canvas-layer').hide();
}
// 层级显示
Editer_stage.tool.setAreaZindex = function (val) {
    $('#current-positionZ').text(val);
}



function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

// 判断是否是空
function is_define(value) {
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
}




/*************** 数据操作 ********************/
Editer_stage.editAreaData = function (data) {
    // this.data = {};
    this.dataArryId = [];
    if (data) {
        this.data = data;
    }
};
// 修改数据(宽，高，左，上)
Editer_stage.editAreaData.prototype.setMediaData = function (itemId, w, h, l, t) {

    var _this = this;

    $.each(_this.data['mediaEle'], function (index, item) {

        if (item.id == itemId) {

            if (item.type == 2 || item.type == 13) item.isEdit = true;
            if (w !== '') item.width = w;
            if (h !== '') item.height = h;
            if (l !== '') item.left = l;
            if (t !== '') item.top = t;

            dragResize.setOnElemInfo(itemId);

        }

    })

};
// 清空数据返回（模版）
Editer_stage.editAreaData.prototype.returnCloneData = function () {

    var _this = this,
        editerData = _this.data,
        cloneData = {};

    Editer_stage.tool.deepClone(editerData, cloneData);

    for (var i = 0, len = cloneData.mediaEle.length; i < len; i++) {

        cloneData.mediaEle[i].srcGroup = [];

    }

    cloneData['width'] = Editer_stage.tool.getProgramResolutionWidth();
    cloneData['height'] = Editer_stage.tool.getProgramResolutionHeight();

    return cloneData

};
// 修改诱导图里字段区域数据
Editer_stage.editAreaData.prototype.setMapMediaData = function (itemId, val, l, t, w, h, dataId) {

    var _this = this;

    $.each(_this.data['mediaEle'], function (index, item) {

        if (item.id == itemId) {

            for (var i = 0, len = item.srcGroup.length; i < len; i++) {
                var groupItem = item.srcGroup[i];
                if (dataId == groupItem.id) {
                    if (l !== '') groupItem.left = l;
                    if (t !== '') groupItem.top = t;
                    if (w !== '') groupItem.width = w;
                    if (h !== '') groupItem.height = h;
                    if (val !== '') groupItem.dataVal = val;
                }

            }

        }

    })

};
// 修改指定数据
Editer_stage.editAreaData.prototype.setMediaProjectData = function (id, project, val) {

    var _this = this;

    $.each(_this.data['mediaEle'], function (index, item) {

        if (item.id == id) {

            if (item.type == 2 || item.type == 13) item.isEdit = true;

            if (project === 'text') {
                item.textGroup[0][project] = val
            } else if (project !== undefined && project !== '') {
                item[project] = val;
            }

            if (project === 'pauseTime') {
                _this.getMediaMaxTime();
            }

        }

    });

};
// 修改背景数据
Editer_stage.editAreaData.prototype.setDataBg = function (param) {

    var bgName = param.bgName,
        bgImg = param.bgImg,
        bgColor = param.bgColor,
        resolution = param.resolution,
        eqType = param.eqType,
        pageTime = param.pageTime;

    if (bgImg !== undefined) {
        this.data.pageEle[0].bgImg = bgImg;
    }

    if (bgColor !== undefined) {
        this.data.pageEle[0].bgColor = bgColor;
    }

    if (resolution !== undefined) {
        this.data.pageEle[0].resolution = resolution;
    }

    if (eqType !== undefined) {
        this.data.pageEle[0].eqType = eqType;
    }

    if (pageTime !== undefined) {
        this.data.pageEle[0].pageTime = pageTime;
    }

    if (bgName !== undefined) {
        this.data.pageEle[0].bgName = bgName;
    }

};
// 获取当前数据区域播放时间，设置最大值为页面切换时间
Editer_stage.editAreaData.prototype.getMediaMaxTime = function () {

    var _this = this,
        dataMediaEleLen = _this.data.mediaEle.length,
        defaultTime = 10,
        maxPageTime = 0;

    for (var i = 0; i < dataMediaEleLen; i++) {

        var dataMediaEle = _this.data.mediaEle[i],
            dataPauseTime = dataMediaEle.pauseTime * 1,
            dataType = dataMediaEle.type,
            dataSrcGrounp = dataMediaEle.srcGroup;

        if (dataSrcGrounp) {

            var dataSrcGrounpLen = dataMediaEle.srcGroup.length;

            if (dataType == 0) {

                var videoMaxTime = 0;

                for (var e = 0; e < dataSrcGrounpLen; e++) {

                    videoMaxTime += dataSrcGrounp[e].time * 1;

                }

                maxPageTime = videoMaxTime > maxPageTime ? videoMaxTime : maxPageTime;

            } else if (dataType == 1) {

                var picMaxTime = 0;

                picMaxTime = dataPauseTime * dataSrcGrounpLen;
                maxPageTime = picMaxTime > maxPageTime ? picMaxTime : maxPageTime;

            } else if (dataType == 5) {

                var mixedMaxTime = 0;

                for (var z = 0; z < dataSrcGrounpLen; z++) {

                    var itemType = dataSrcGrounp[z].type;

                    if (itemType == 0) {
                        mixedMaxTime += (dataSrcGrounp[z].time * 1);
                    } else if (itemType == 1) {
                        mixedMaxTime += dataPauseTime;
                    }

                }

                maxPageTime = mixedMaxTime > maxPageTime ? mixedMaxTime : maxPageTime;

            } else if (dataType == 6) {

                var wordMaxTime = 0;
                wordMaxTime = dataPauseTime * dataSrcGrounpLen;

                maxPageTime = wordMaxTime > maxPageTime ? wordMaxTime : maxPageTime;

            } else if (dataType == 7) {

                var pptMaxTime = 0;
                pptMaxTime = dataPauseTime * dataSrcGrounpLen;

                maxPageTime = pptMaxTime > maxPageTime ? pptMaxTime : maxPageTime;

            } else if (dataType == 8) {

                var pdfMaxTime = 0;
                pdfMaxTime = dataPauseTime * dataSrcGrounpLen;

                maxPageTime = pdfMaxTime > maxPageTime ? pdfMaxTime : maxPageTime;

            } else if (dataType == 10) {

                var audioMaxTime = 0;

                for (var d = 0; d < dataSrcGrounpLen; d++) {

                    audioMaxTime += dataSrcGrounp[d].time * 1;

                }

                maxPageTime = audioMaxTime > maxPageTime ? audioMaxTime : maxPageTime;

            }

        }
    }

    maxPageTime = Math.round(maxPageTime);
    if (maxPageTime < defaultTime) {
        maxPageTime = defaultTime;
    }
    Editer_stage.tool.setMaxPageTime(maxPageTime);
    _this.setDataBg({
        pageTime: maxPageTime
    });
    return maxPageTime;

};
// 修改列表数据
Editer_stage.editAreaData.prototype.setItemListData = function (id, listItemId, index, selectData) {

    var mediaEle = this.data.mediaEle,
        mediaEleLen = mediaEle.length;

    for (var i = 0; i < mediaEleLen; i++) {

        if (mediaEle[i].id == id) {

            var thisType = mediaEle[i].type;

            if (thisType == 0 || thisType == 10) {
                var initPauseTime = mediaEle[i].pauseTime;
                initPauseTime = initPauseTime - (mediaEle[i].srcGroup[index].time * 1);
            }

            mediaEle[i].srcGroup[index].id = selectData.id;
            mediaEle[i].srcGroup[index].name = selectData.name;
            mediaEle[i].srcGroup[index].src = selectData.src;
            mediaEle[i].srcGroup[index].size = selectData.size;
            mediaEle[i].srcGroup[index].time = selectData.time;

            if (thisType == 0 || thisType == 10) {
                initPauseTime += selectData.time * 1;
                mediaEle[i].pauseTime = initPauseTime;
            }

        }

    }

};
// 修改srcgrounp数据
Editer_stage.editAreaData.prototype.setItemListGroupData = function (id, data) {

    for (var i = 0, len = this.data.mediaEle.length; i < len; i++) {

        if (this.data.mediaEle[i].id == id) {
            this.data.mediaEle[i].srcGroup.push(data);
        }

    }

};
// 返回srcgrounp数据项目位置
Editer_stage.editAreaData.prototype.setItemListGroupDataIndex = function (id, itemId) {

    for (var i = 0, len = this.data.mediaEle.length; i < len; i++) {

        if (this.data.mediaEle[i].id == id) {

            var scrGroups = this.data.mediaEle[i].srcGroup,
                gLen = scrGroups.length;

            for (var e = 0; e < gLen; e++) {

                var groupId = scrGroups[e].id;

                if (groupId === itemId) {

                    return e;

                }

            }

        }

    }

};
// 传id位置获取mediaEle里数据
Editer_stage.editAreaData.prototype.getMediaData = function (id) {

    var mediaEle = this.data.mediaEle,
        len = mediaEle.length;

    for (var i = 0; i < len; i++) {

        if (mediaEle[i].id == id) {
            return mediaEle[i];
        }

    }

};
// 获取数据所有id
Editer_stage.editAreaData.prototype.getDataArryId = function () {

    var dataLen = this.data.mediaEle.length;

    if (dataLen > 0) {
        for (var i = 0; i < dataLen; i++) {
            this.dataArryId.push(this.data.mediaEle[i].id);
        }
    }

    return this.dataArryId;

};
// 获取数据最大id
Editer_stage.editAreaData.prototype.getDataMaxId = function () {

    this.getDataArryId();

    var maxId = this.dataArryId[0],
        dataArryLen = this.dataArryId.length;

    if (dataArryLen > 0) {
        for (var i = 1; i < dataArryLen; i++) {
            if (this.dataArryId[i] > maxId) {
                maxId = this.dataArryId[i];
            }
        }
    } else {
        maxId = 0;
    }

    return maxId;

};
// 获取数据最大层级
Editer_stage.editAreaData.prototype.getMaxZindex = function () {

    var maxZindex = 0,
        dataLen = this.data.mediaEle.length;

    if (dataLen > 0) {
        for (var i = 0; i < dataLen; i++) {
            var thisZindex = this.data.mediaEle[i].zIndex * 1;
            maxZindex = maxZindex > thisZindex ? maxZindex : thisZindex;
        }
    }

    return maxZindex;

};
// 向数据加入区块
Editer_stage.editAreaData.prototype.addItemToData = function (itemType, srcGroup, pauseTime) {

    var maxId = this.getDataMaxId(),
        maxZindex = this.getMaxZindex(),
        minWidth = Math.round(Editer_stage.tool.getViewResolution(Editer_stage.tool.getProgramResolution()).width * 0.2),
        minHeight = Math.round(Editer_stage.tool.getViewResolution(Editer_stage.tool.getProgramResolution()).height * 0.2),
        newMediaData = null;

    if (itemType == 0 || itemType == 1 || itemType == 6 || itemType == 7 || itemType == 8) {

        newMediaData = {
            id: maxId + 1,
            type: itemType,
            top: 0,
            left: 0,
            width: minWidth,
            height: minHeight,
            zIndex: maxZindex,
            siderType: "6",
            pauseTime: pauseTime,
            borderSW: 0,
            borderType: 1,
            borderEffect: 1,
            borderSpeed: 1,
            rotation: 0,
            srcGroup: srcGroup
        };

    } else if (itemType == 2) {

        newMediaData = {
            id: maxId + 1,
            type: itemType,
            top: 0,
            left: 0,
            width: minWidth,
            height: minHeight,
            zIndex: maxZindex,
            siderType: "0",
            siderDirection: "0",
            pauseTime: "5",
            text: '请输入文字',
            fontSize: "12",
            fontWeight: "",
            textDecoration: "",
            fontStyle: "",
            textAlign: "",
            fontFamily: "Arial",
            fontColor: "#ff0000",
            lineHeight: "20",
            background: "",
            listType: "",
            textShow: '0',
            scrollSpeed: '0',
            isEdit: false,
            borderSW: 0,
            borderType: 1,
            borderEffect: 1,
            borderSpeed: 1,
            textGroup: [{
                id: 0,
                name: '字幕',
                text: '请输入文字'
            }]
        }

    } else if (itemType == 3) {

        newMediaData = {
            id: maxId + 1,
            type: itemType,
            top: 0,
            left: 0,
            width: minWidth,
            height: minHeight,
            zIndex: maxZindex,
            fontFamily: "Arial",
            fontSize: "12",
            fontColor: "#e80000",
            bgColor: "#ffffff",
            bgColorShow: "0",
            refreshTime: 2,
            rowType: 1,
            todayShow: "1",
            tomShow: "0",
            afterShow: "0",
            scale: 0,
            wind: 0,
            hum: 0,
            air: 0,
            pm: 0,
            icon: 0,
            date: 1,
            area: 1,
            state: 1,
            temperature: 1,
            iconSize: 80,
            borderSW: 0,
            borderType: 1,
            borderEffect: 1,
            borderSpeed: 1
        };

    } else if (itemType == 4) {

        newMediaData = {
            id: maxId + 1,
            type: itemType,
            top: 0,
            left: 0,
            width: minWidth,
            height: minHeight,
            zIndex: maxZindex,
            dateFontSize: "12",
            timeFontSize: "12",
            timeFormat: "1",
            dateFormat: "2",
            weekFormat: "3",
            dateWeight: "0",
            weekWeight: "0",
            timeWeight: "0",
            fontFamily: "Arial",
            fontColor: "#000000",
            clockW: "80",
            yearShow: "1",
            monthShow: "1",
            dateShow: "1",
            hourShow: "1",
            minutesShow: "1",
            secondsShow: "1",
            weekShow: "1",
            borderSW: 0,
            borderType: 1,
            borderEffect: 1,
            borderSpeed: 1,
            clockType: 1
        };

    } else if (itemType == 5) {

        newMediaData = {
            id: maxId + 1,
            type: itemType,
            top: 0,
            left: 0,
            width: minWidth,
            height: minHeight,
            zIndex: maxZindex,
            siderType: "0",
            pauseTime: pauseTime,
            borderSW: 0,
            borderType: 1,
            borderEffect: 1,
            borderSpeed: 1,
            srcGroup: srcGroup
        };

    } else if (itemType == 9) {

        newMediaData = {
            id: maxId + 1,
            type: itemType,
            top: 0,
            left: 0,
            width: minWidth,
            height: minHeight,
            zIndex: maxZindex,
            refreshTime: "0",
            refreshType: '0',
            href: 'http://www.168led.com',
            borderSW: 0,
            borderType: 1,
            borderEffect: 1,
            borderSpeed: 1
        };

    } else if (itemType == 10) {

        newMediaData = {
            id: maxId + 1,
            type: itemType,
            top: 0,
            left: 0,
            width: minWidth,
            height: minHeight,
            pauseTime: pauseTime,
            srcGroup: srcGroup,
            audioSW: 1
        };

    } else if (itemType == 11) {

        newMediaData = {
            id: maxId + 1,
            type: itemType,
            top: 0,
            left: 0,
            width: minWidth,
            height: minHeight,
            zIndex: maxZindex,
            refreshTime: "5",
            row: "5",
            titleShow: "1",
            titleText: "12121",
            titleFamily: "Arial",
            titleFontSize: "14",
            titleFontWeight: "normal",
            titleColor: "#ffffff",
            titleBg: "#ba0000",
            textFamily: "Arial",
            textFontSize: "14",
            textFontWeight: "normal",
            textColor: "#ffffff",
            textBg: "#858585",
            statemenTemplate01: "",
            statemenTemplate02: "号请到",
            statemenTemplate03: "号窗口办理",
            borderSW: 0,
            borderType: 1,
            borderEffect: 1,
            borderSpeed: 1
        };

    } else if (itemType == 12) {

        newMediaData = {
            id: maxId + 1,
            type: itemType,
            top: 0,
            left: 0,
            width: minWidth,
            height: minHeight,
            zIndex: maxZindex,
            href: 'http://www.168led.com',
            borderSW: 0,
            borderType: 1,
            borderEffect: 1,
            borderSpeed: 1
        };

    } else if (itemType == 13) {

        newMediaData = {
            id: maxId + 1,
            type: itemType,
            top: 0,
            left: 0,
            width: minWidth,
            height: minHeight,
            zIndex: maxZindex,
            siderType: "0",
            siderDirection: "0",
            pauseTime: "5",
            textAlign: "",
            scrollSpeed: '0',
            listType: "",
            textShow: "0",
            isEdit: false,
            borderSW: 0,
            borderType: 1,
            borderEffect: 1,
            borderSpeed: 1,
            srcGroup: srcGroup
        };

    } else if (itemType == 14) {

        newMediaData = {
            id: maxId + 1,
            type: itemType,
            top: 0,
            left: 0,
            width: minWidth,
            height: minHeight,
            zIndex: maxZindex,
            fontFamily: 'Arial',
            fontSize: 14,
            lineNum: 3,
            lineHeight: 30,
            column: 5,
            borderWidth: 1,
            borderColor: '#f00',
            borderWrapSw: 1,
            borderType: 0,
            headerSw: 1,
            dataUrl: '',
            refreshTime: 60,
            html: '<table border="1" bordercolor="#f00" style="width:100%;border-collapse: collapse; border-color:#f00;line-height:30px;"><caption>我的标题</caption><tbody><tr><td style="height:30px;"></td><td style="height:30px;"></td><td style="height:30px;"></td><td style="height:30px;"></td><td style="height:30px;"></td></tr><tr><td style="height:30px;"></td><td style="height:30px;"></td><td style="height:30px;"></td><td style="height:30px;"></td><td  style="height:30px;"></td></tr><tr><td style="height:30px;"></td><td style="height:30px;"></td><td style="height:30px;"></td><td style="height:30px;"></td><td style="height:30px;"></td></tr></tbody></table>'
        };

    } else if (itemType == 15) {

        newMediaData = {
            id: maxId + 1,
            type: itemType,
            top: 0,
            left: 0,
            width: minWidth,
            height: minHeight,
            zIndex: maxZindex,
            fontFamily: 'Arial',
            fontColor: '#ff0000',
            fontSize: 14,
            bgName: '',
            bgImg: '',
            dataUrl: '',
            refreshTime: 60,
            srcGroup: [{
                id: new Date().getTime(),
                dataVal: 'dataName',
                left: 50,
                top: 50,
                width: 100,
                height: 30
            }]
        };

    }

    this.data.mediaEle.push(newMediaData);
    this.dataArryId.push(newMediaData.id);

    if (itemType != 10) {

        // 向舞台加入区域 
        var shtml = Editer_stage.tool.initEditareaItem(newMediaData);

        // 加入舞台
        Editer_stage.tool.addEditerAreaData(shtml);
        // 缩放加入的区域
        Editer_stage.tool.changeEditareaItem(newMediaData.id);

        Editer_stage.areaDataShow.hideLeftSideBar('.editer-area-msg');
        Editer_stage.tool.removeEditerItemSelect();
        dragResize.addSelectPoint($('#controlItem_' + newMediaData.id));
        dragResize.changeControlElemen($('#controlItem_' + newMediaData.id));

    } else if (itemType == 10) {

        Editer_stage.tool.showItemMsg(newMediaData.id, 10);

    }

};
// 移除单个数据
Editer_stage.editAreaData.prototype.deleteMediaDataItem = function (index) {

    this.data.mediaEle.splice(index, 1);

};
// 根据ID移除数据
Editer_stage.editAreaData.prototype.deleteMediaDataItemById = function (itemId) {

    var mediaEle = this.data.mediaEle,
        len = mediaEle.length,
        itemIndex = null;

    for (var i = 0; i < len; i++) {

        var thisId = mediaEle[i].id;

        if (thisId == itemId) {
            itemIndex = i;
        }

    }

    if (itemIndex !== null) {
        this.deleteMediaDataItem(itemIndex);
    }

}
// 返回整体数据
Editer_stage.editAreaData.prototype.returnData = function () {
    return this.data;
};
// 判断音频存在
Editer_stage.editAreaData.prototype.judgeAudio = function () {

    var mediaEle = this.data.mediaEle,
        len = mediaEle.length,
        audioId = 0;

    for (var i = 0; i < len; i++) {

        if (mediaEle[i].type == 10) {

            audioId = mediaEle[i].id;
        }

    }

    return audioId;

};
// 获取当前有几个区域
Editer_stage.editAreaData.prototype.returnDataAreaLen = function () {
    return this.data.mediaEle.length;
};


/*************** 侧边栏数据显示 ********************/
Editer_stage.areaDataShow = {
    editerInfo: '#editer-info-'
};
// 宽、高、坐标、id、类型、数组Index
Editer_stage.areaDataShow.publicItem = function (typeName, dataId, arryIndex, w, h, l, t) {

    var $leftSider = $(this.editerInfo + typeName);

    if (dataId !== '') $leftSider.attr('data-id', dataId);
    if (typeName !== '') $leftSider.attr('data-type', typeName);
    if (arryIndex !== '') $leftSider.attr('data-arry', arryIndex);
    if (w !== '') $leftSider.find('input[data-flag=width]').val(w);
    if (h !== '') $leftSider.find('input[data-flag=height]').val(h);
    if (l !== '') $leftSider.find('input[data-flag=left]').val(l);
    if (t !== '') $leftSider.find('input[data-flag=top]').val(t);

};
// 判断输入宽/高/X/Y
Editer_stage.areaDataShow.judgeItemDataSize = function (flag, val, thisId) {

    var maxWidth = Editer_stage.tool.getProgramResolutionWidth() * 1,
        maxHeight = Editer_stage.tool.getProgramResolutionHeight() * 1,
        returnVal = 0,
        initData = editerDataStore.getMediaData(thisId),
        initWidth = initData.width * 1,
        initHeight = initData.height * 1,
        initLeft = initData.left * 1,
        initTop = initData.top * 1;

    if (flag === 'width') {

        var nowWidth = val + initLeft;
        returnVal = maxWidth > nowWidth ? val : maxWidth - initLeft;

    } else if (flag === 'height') {

        var nowHeight = val + initTop;
        returnVal = maxHeight > nowHeight ? val : maxHeight - initTop;

    } else if (flag === 'left') {

        var nowleft = val + initWidth;
        returnVal = maxWidth > nowleft ? val : maxWidth - initWidth;

    } else if (flag === 'top') {

        // var nowTop = val + initHeight;
        // returnVal = maxHeight > nowTop ? val : maxHeight - initHeight;
        returnVal = val;
    }

    return returnVal;

};
// 判断天气/时钟选项
Editer_stage.areaDataShow.judgeInputType = function (flag) {

    switch (flag) {
        case ('tomShow'):
            return true;
            break;
        case ('todayShow'):
            return true;
            break;
        case ('afterShow'):
            return true;
            break;
        case ('dateWeight'):
            return true;
            break;
        case ('weekWeight'):
            return true;
            break;
        case ('timeWeight'):
            return true;
            break;
        case ('clockShow'):
            return true;
            break;
        case ('dateShow'):
            return true;
            break;
        case ('weekShow'):
            return true;
            break;
        case ('timeShow'):
            return true;
            break;
        case ('scale'):
            return true;
            break;
        case ('wind'):
            return true;
            break;
        case ('hum'):
            return true;
            break;
        case ('air'):
            return true;
            break;
        case ('pm'):
            return true;
            break;
        case ('date'):
            return true;
            break;
        case ('area'):
            return true;
            break;
        case ('state'):
            return true;
            break;
        case ('temperature'):
            return true;
            break;
        case ('icon'):
            return true;
            break;
        case ('yearShow'):
            return true;
            break;
        case ('monthShow'):
            return true;
            break;
        case ('dateShow'):
            return true;
            break;
        case ('hourShow'):
            return true;
            break;
        case ('minutesShow'):
            return true;
            break;
        case ('secondsShow'):
            return true;
            break;
        case ('weekShow'):
            return true;
            break;

    }

    return false;

};
// 左侧详情显示
Editer_stage.areaDataShow.showLeftSideBar = function (typeName) {

    // Editer_stage.areaDataShow.hideLeftSideBar('.editer-area-msg');

    var $leftSider = $(this.editerInfo + typeName);
    $leftSider.find('input').prop('checked', false);

    Editer_stage.tool.showLayout('area');
    $leftSider.addClass('active').siblings('.item').removeClass('active');
    $('.editer-area-msg').addClass('silde-in');

    $leftSider.find('input[name=changeVal]').unbind('input change').bind('input change', function (e) {

        var $this = $(this),
            objParents = $this.parents('#editer-info-' + typeName),
            thisId = objParents.attr('data-id'),
            thisType = objParents.attr('data-type'),
            thisFlag = $this.attr('data-flag'),
            thisVal = $this.val();

        if (thisType === 'information') {

            if (dnyTableObj) {

                dnyTableObj.inputChange(thisFlag, thisVal);

            }

        } else if (thisType === 'map') {

            if (mapFigure) {

                mapFigure.inputChange(thisFlag, thisVal);

            }

        }

        editerDataStore.setMediaProjectData(thisId, thisFlag, thisVal);
        Editer_stage.tool.changeEditareaItemPrivate(thisFlag, thisId);

    });

    // $leftSider.find('input[type=radio],input[type=checkbox]').unbind().bind('input change',function(e){

    //     var $this = $(this),
    //         objParents = $this.parents('#material-tab-'+ typeName),
    //         thisId = objParents.attr('data-id'),
    //         thisType = objParents.attr('data-type'),
    //         thisFlag = $this.attr('data-flag'),
    //         thisVal = $this.val();


    //     // 天气判断显示日期
    //     if(Editer_stage.areaDataShow.judgeInputType(thisFlag)){

    //         thisVal = $this.prop('checked') === true ? '1' : '0';

    //     }

    //     if(thisFlag === 'borderSW'){

    //         thisVal == 1 ? $leftSider.find('.borderType').show() : $leftSider.find('.borderType').hide();
    //         thisVal == 1 ? $leftSider.find('.borderSpeed').show() : $leftSider.find('.borderSpeed').hide();
    //         thisVal == 1 ? $leftSider.find('.borderEffects').show() : $leftSider.find('.borderEffects').hide();

    //     } 

    //     if(thisType === 'information'){

    //         if(dnyTableObj){

    //             dnyTableObj.inputChange(thisFlag, thisVal);

    //         }

    //     }else if(thisType === 'map'){

    //         if(mapFigure){

    //             mapFigure.inputChange(thisFlag, thisVal);

    //         }

    //     }

    //     editerDataStore.setMediaProjectData(thisId, thisFlag, thisVal);
    //     Editer_stage.tool.changeEditareaItemPrivate(thisFlag, thisId);

    // });

    // 输入框监听
    $leftSider.find('input[name=inputVal]').unbind('input propertychange').bind('input propertychange', function (e) {

        var $this = $(this),
            objParents = $this.parents('#editer-info-' + typeName),
            thisId = objParents.attr('data-id'),
            thisType = objParents.attr('data-type'),
            thisFlag = $this.attr('data-flag'),
            thisVal = $this.val(),
            itemId = $this.attr('data-itemid');

        if (thisFlag === 'clockType') {

            // if(thisVal == 1){

            //     $leftSider.find('#clock-simulation').hide();
            //     $leftSider.find('#clock-digital').show();

            // }else {

            //     $leftSider.find('#clock-simulation').show();
            //     $leftSider.find('#clock-digital').hide();

            // }

        } else if (thisFlag === 'videoName') {

            var mListItemId = $this.attr('data-itemid'),
                itemIndex = $this.attr('data-itemIndex'),
                itemSuffix = $this.attr('data-itemsuffix');

            if (thisVal === '') thisVal = '未命名';

            if (Editer_stage.tool.videoEditObj) {
                Editer_stage.tool.videoEditObj.find('.title').text(thisVal + itemSuffix);
                Editer_stage.tool.videoEditObj.attr('data-editName', thisVal);
            }

            Editer_stage.tool.listSortUpDataSingle(thisId, itemIndex, mListItemId, thisVal)

        } else if (thisFlag === 'left' || thisFlag === 'top' || thisFlag === 'width' || thisFlag === 'height') {

            thisVal = Editer_stage.areaDataShow.judgeItemDataSize(thisFlag, thisVal * 1, thisId);

        } else if (thisFlag === 'dataVal') {

            var dataType = $('#information-dataType').val();

            if (dataType === '1') {

                if (thisVal.match(/[^a-zA-Z]/g)) {
                    layerOutAutoHid(lang.enterLetter);
                    return;
                }

            }

        } else if (thisFlag === 'mapItemLeft') {

            editerDataStore.setMapMediaData(thisId, '', thisVal * 1, '', '', '', itemId);
            Editer_stage.tool.setMapInitData('left', thisVal, itemId);

        } else if (thisFlag === 'mapItemTop') {

            editerDataStore.setMapMediaData(thisId, '', '', thisVal * 1, '', '', itemId);
            Editer_stage.tool.setMapInitData('top', thisVal, itemId);

        } else if (thisFlag === 'mapItemWidth') {

            editerDataStore.setMapMediaData(thisId, '', '', '', thisVal * 1, '', itemId);
            Editer_stage.tool.setMapInitData('width', thisVal, itemId);

        } else if (thisFlag === 'mapItemHeight') {

            editerDataStore.setMapMediaData(thisId, '', '', '', '', thisVal * 1, itemId);
            Editer_stage.tool.setMapInitData('height', thisVal, itemId);

        };

        if (thisType === 'information') {

            if (dnyTableObj) {

                dnyTableObj.inputChange(thisFlag, thisVal);

            }

        } else if (thisType === 'map') {

            if (mapFigure) {

                mapFigure.inputChange(thisFlag, thisVal);

            }

        }

        editerDataStore.setMediaProjectData(thisId, thisFlag, thisVal);

        if (thisFlag === 'left' || thisFlag === 'top' || thisFlag === 'width' || thisFlag === 'height') Editer_stage.tool.changeEditareaItem(thisId);

        Editer_stage.tool.changeEditareaItemPrivate(thisFlag, thisId);

    });

    // $leftSider.find('span').unbind('click').bind('click',function(){

    //     var $this = $(this),
    //         objParents = $this.parents('#material-tab-'+ typeName),
    //         thisId = objParents.attr('data-id'),
    //         thisFlag = $this.attr('data-flag'),
    //         thisVal = $this.attr('data-val');

    //     if(!$this.hasClass('active')){
    //         thisVal = '';
    //     }

    //     if(typeName === 'information'){

    //         if(dnyTableObj){

    //             dnyTableObj.inputChange(thisFlag, thisVal);

    //         }

    //     }

    //     editerDataStore.setMediaProjectData(thisId, thisFlag, thisVal);

    //     Editer_stage.tool.changeEditareaItemPrivate(thisFlag, thisId);

    //     return false;

    // });

    // 文本框监听
    // $leftSider.find('textarea').unbind().bind('keyup',function(){

    //     var $this = $(this),
    //         objParents = $this.parents('#material-tab-'+ typeName),
    //         thisId = objParents.attr('data-id'),
    //         thisFlag = $this.attr('data-flag'),
    //         thisVal = $this.val();

    //     editerDataStore.setMediaProjectData(thisId, thisFlag, thisVal);

    //     Editer_stage.tool.changeEditareaItemPrivate(thisFlag, thisId);

    // });

    // 下拉框监听
    $leftSider.find('select').unbind().change(function () {

        var $this = $(this),
            objParents = $this.parents('#editer-info-' + typeName),
            thisId = objParents.attr('data-id'),
            thisType = objParents.attr('data-type'),
            thisFlag = $this.attr('data-flag'),
            thisVal = $this.val();

        if ((typeName === 'text' && thisFlag === 'siderType') || (typeName === 'rtf' && thisFlag === 'siderType')) {
            if (thisVal === '0') {
                hideTextSelect('#' + typeName + '-scrollSpeed');
                showTextSelect('#' + typeName + '-pauseTime');
            } else if (thisVal === '2' || thisVal === '4') {
                showTextSelect('#' + typeName + '-scrollSpeed');
                hideTextSelect('#' + typeName + '-pauseTime');
            } else {
                showTextSelect('#' + typeName + '-scrollSpeed');
                showTextSelect('#' + typeName + '-pauseTime');
            }
        }

        if (thisType === 'information') {

            if (dnyTableObj) {

                dnyTableObj.inputChange(thisFlag, thisVal);

            }

        } else if (thisType === 'map') {

            if (mapFigure) {

                mapFigure.inputChange(thisFlag, thisVal);

            }

        }

        editerDataStore.setMediaProjectData(thisId, thisFlag, thisVal);

        Editer_stage.tool.changeEditareaItemPrivate(thisFlag, thisId);

    });

};
// 左侧详情隐藏
Editer_stage.areaDataShow.hideLeftSideBar = function (obj) {

    var $article = $(obj);

    $article.removeClass('silde-in').addClass('silde-out');

    setTimeout(function () {

        $article.removeClass('silde-out');

    }, 200);

};
// 区域私有信息显示
Editer_stage.areaDataShow.showItemPrivateMsg = function (id, typeId, data) {

    var thisTypeName = Editer_stage.tool.getMediaType(typeId),
        $leftSider = $(this.editerInfo + thisTypeName),
        $siderTypeInput = $leftSider.find('input[data-flag=siderType]'),
        $pauseTimeInput = $leftSider.find('input[data-flag=pauseTime]'),
        $rotationInput = $leftSider.find('select[data-flag=rotation]');

    if (typeId === 0) {

        var itemRotation = data.rotation;

        $rotationInput.val(itemRotation);

    } else if (typeId === 1) {

        var itemSiderType = data.siderType,
            itemPauseTime = data.pauseTime,
            itemRotation = data.rotation;

        $siderTypeInput.val(itemSiderType);
        $pauseTimeInput.val(itemPauseTime);
        $rotationInput.val(itemRotation);

    }

    // if(typeId == 0 || typeId == 1 || typeId == 2 || typeId == 3 || typeId == 4 || typeId == 5 || typeId == 6 || typeId == 7 || typeId == 8 || typeId == 9 || typeId == 11 || typeId == 12 || typeId == 13){

    //     var itemBorderShow = data.borderSW,
    //         itemBorderType = data.borderType,
    //         itemBorderSpeed = data.borderSpeed,
    //         itemBorderEffect = data.borderEffect,
    //         itemTypeName = Editer_stage.tool.getMediaType(typeId);

    //     $('#'+ itemTypeName +'-borderTypeVal').val(itemBorderType);
    //     $('#'+ itemTypeName +'-effects').val(itemBorderEffect);
    //     $('#'+ itemTypeName +'-speed').val(itemBorderSpeed);

    //     if(itemBorderShow == 0){
    //         $('#'+ itemTypeName +'-borderShow01').prop('checked', true);
    //         $('#'+ itemTypeName +'-borderType').hide();
    //         $('#'+ itemTypeName +'-borderSpeed').hide();
    //         $('#'+ itemTypeName +'-borderEffects').hide();
    //     }else if(itemBorderShow == 1){
    //         $('#'+ itemTypeName +'-borderShow02').prop('checked', true);
    //         $('#'+ itemTypeName +'-borderType').show();
    //         $('#'+ itemTypeName +'-borderSpeed').show();
    //         $('#'+ itemTypeName +'-borderEffects').show();
    //         $('#'+ itemTypeName +'-borderSelect_name').css('background-image', 'url(./images/editer_border/border'+ itemBorderType +'.png)');
    //     }else{
    //         $('#'+ itemTypeName +'-borderShow01').prop('checked', true);
    //         $('#'+ itemTypeName +'-borderType').hide();
    //         $('#'+ itemTypeName +'-borderSpeed').hide();
    //         $('#'+ itemTypeName +'-borderEffects').hide();
    //     }

    // }


    // else if(typeId === 2){

    //     var itemFontFamily = data.fontFamily,         // 字体
    //         itemTextAlign = data.textAlign,           // 文本对齐
    //         itemFontStyle = data.fontStyle,            // 字形  italic（斜体）
    //         itemTextDecoration = data.textDecoration,  // 文本修饰   underline（下划线）   line-through（删除线）
    //         itemFontSize = data.fontSize,          // 字体大小
    //         itemFontWeight = data.fontWeight,          // 字体粗细
    //         itemFontColor = data.fontColor,            // 字体颜色
    //         itemTextBackGround = data.background,      // 背景颜色
    //         itemTextType = data.siderType,
    //         itemPauseTime = data.pauseTime,
    //         itemScrollSpeed = data.scrollSpeed,
    //         itemGroup = data.textGroup,
    //         itemGroupId = itemGroup[0].id,
    //         itemGroupText = itemGroup[0].text,
    //         itemListStype = data.listType,
    //         itemTextShow = data.textShow;

    //     $('#text-fontFamSelect').val(itemFontFamily);
    //     $('#text-cont').val(itemGroupText);

    //     $('.text-align').find('span').removeClass('active');
    //     // 文本对齐
    //     if(itemTextAlign == 'center'){
    //         $('#fontCenter').addClass('active');
    //     } else if(itemTextAlign == 'left'){
    //         $('#fontLeft').addClass('active');
    //     } else if(itemTextAlign == 'right'){
    //         $('#fontRight').addClass('active');
    //     }

    //     $('#text-fontSizeSelect').val(itemFontSize);
    //     $('#text-siderTypeSelect').val(itemTextType);
    //     // $("#text-siderDirectionSelect").val(itemTextDir);
    //     // $("#text-fontlineHeightSelect").val(itemTextLh);
    //     $('#text-pauseTime').val(itemPauseTime);
    //     $('#text-scrollSpeed').val(itemScrollSpeed);

    //     if(itemTextType === '0'){
    //         hideTextSelect('#text-scrollSpeed');
    //         showTextSelect('#text-pauseTime');
    //     }else if(itemTextType === '2' || itemTextType === '4'){
    //         showTextSelect('#text-scrollSpeed');
    //         hideTextSelect('#text-pauseTime');
    //     }else{
    //         showTextSelect('#text-scrollSpeed');
    //         showTextSelect('#text-pauseTime');
    //     }

    //     if(itemTextShow === "0"){
    //         $('#text-show01').prop('checked', true);
    //     }else{
    //         $('#text-show02').prop('checked', true);
    //     }

    //     // 字形
    //     if(itemFontStyle == 'italic'){
    //         $('#fontItalic').addClass('active');
    //     }

    //     // 文本修饰
    //     if(itemTextDecoration == 'underline'){
    //         $('#fontUnderline').addClass('active');
    //     } else if(itemTextDecoration == 'line-through'){
    //         $('#fontStrike').addClass('active');
    //     }

    //     // 字体粗细
    //     if(itemFontWeight == 'bold'){
    //         $('#fontBold').addClass('active');
    //     }

    //     // 字体颜色
    //     Editer_stage.tool.setMinicolors('#fontColor', '#textColor', itemFontColor);

    //     // 背景颜色
    //     Editer_stage.tool.setMinicolors('#bgColor', '#textBgColor', itemTextBackGround);

    // }else if(typeId === 3){

    //     var fontColor = data.fontColor,
    //         fontSize = data.fontSize,
    //         bgColor = data.bgColor,
    //         refreshTime = data.refreshTime,
    //         rowType = data.rowType,
    //         todayShow = data.todayShow,
    //         tomShow = data.tomShow,
    //         afterShow = data.afterShow,
    //         province = data.province,
    //         city = data.city,
    //         district = data.district,
    //         scale = data.scale,
    //         wind = data.wind,
    //         hum = data.hum,
    //         air = data.air,
    //         pm = data.pm,
    //         icon = data.icon,
    //         iconSize = data.iconSize,
    //         area = data.area,
    //         date = data.date, 
    //         temperature = data.temperature,
    //         state = data.state;

    //     $("#weather-refreshTime").val(refreshTime);
    //     $("#weather-rowType").val(rowType);
    //     $("#weather-timeFontSize").val(fontSize);
    //     $("#weather_iconSize").val(iconSize);

    //     if(todayShow != 0) $("#weather_today").prop("checked", true);
    //     if(tomShow != 0) $("#weather_Tomorrow").prop("checked", true);
    //     if(afterShow != 0) $("#weather_after").prop("checked", true);

    //     if(scale != 0) $("#weather_scale").prop("checked", true);
    //     if(wind != 0) $("#weather_wind").prop("checked", true);
    //     if(hum != 0) $("#weather_hum").prop("checked", true);
    //     if(air != 0) $("#weather_air").prop("checked", true);
    //     if(pm != 0) $("#weather_pm").prop("checked", true);
    //     if(icon != 0) $("#weather_icon").prop("checked", true);

    //     if(area != 0) $("#weather_area").prop("checked", true);
    //     if(date != 0) $("#weather_date").prop("checked", true);
    //     if(temperature != 0) $("#weather_temperature").prop("checked", true);
    //     if(state != 0) $("#weather_state").prop("checked", true);

    //     // 右侧页面颜色插件
    //     Editer_stage.tool.setMinicolors("#hue-weatherBgColor", "#weather-textBgColor", bgColor);
    //     Editer_stage.tool.setMinicolors("#hue-weatherFontColor", "#weather-textColor", fontColor);

    //     $("#distpicker5").distpicker('destroy');
    //     $('#distpicker5').distpicker({
    //         autoSelect: false,
    //         province: (province != "") ? province : "——— "+ lang.province +" ———",
    //         city: (city != "") ? city : "—— "+ lang.city +" ——",
    //         district: (district != "") ? district : "—— "+ lang.county +" ——"
    //     });

    // }else if(typeId === 4){

    //     var dateFontSize = data.dateFontSize,
    //         timeFontSize = data.timeFontSize,
    //         timeFormat = data.timeFormat,
    //         dateFormat = data.dateFormat,
    //         dateWeight = data.dateWeight,
    //         weekWeight = data.weekWeight,
    //         timeWeight = data.timeWeight,
    //         fontFamily = data.fontFamily,
    //         fontColor = data.fontColor,
    //         yearShow = data.yearShow,
    //         monthShow = data.monthShow,
    //         dateShow = data.dateShow,
    //         hourShow = data.hourShow,
    //         minutesShow = data.minutesShow,
    //         secondsShow = data.secondsShow,
    //         weekShow = data.weekShow,
    //         clockType = data.clockType; 

    //     $('#clock-fontFamSelect').val(fontFamily);
    //     $('#clock-dateFontSize').val(dateFontSize);
    //     $('#clock-dateFormat').val(dateFormat);
    //     $('#clock-timeFontSize').val(timeFontSize);
    //     $('#clock-timeFormat').val(timeFormat);

    //     yearShow != 0 ? $('#date_show_year').prop('checked', true) : $('#date_show_year').prop('checked', false);
    //     monthShow != 0 ? $('#date_show_month').prop('checked', true) : $('#date_show_month').prop('checked', false);
    //     dateShow != 0 ? $('#date_show_date').prop('checked', true) : $('#date_show_date').prop('checked', false);
    //     hourShow != 0 ? $('#date_show_hour').prop('checked', true) : $('#date_show_hour').prop('checked', false);
    //     minutesShow != 0 ? $('#date_show_minutes').prop('checked', true) : $('#date_show_minutes').prop('checked', false);
    //     secondsShow != 0 ? $('#date_show_seconds').prop('checked', true) : $('#date_show_seconds').prop('checked', false);
    //     weekShow != 0 ? $('#date_show_week').prop('checked', true) : $('#date_show_week').prop('checked', false);

    //     if(dateWeight != 0) $('#date_bold_Date').prop('checked', true);
    //     if(weekWeight != 0) $('#date_bold_Week').prop('checked', true);
    //     if(timeWeight != 0) $('#date_bold_Time').prop('checked', true);
    //     if(clockType == 1){ 
    //         $('#clock-clockType01').prop('checked', true);
    //         // $('#clock-simulation').hide();
    //         // $('#clock-digital').show();
    //     }else {
    //         $('#clock-clockType02').prop('checked', true);
    //         // $('#clock-digital').hide();
    //         // $('#clock-simulation').show();
    //     };

    //     // 右侧页面颜色插件
    //     Editer_stage.tool.setMinicolors('#hue-clock', '#clock-textColor', fontColor);

    // }else if(typeId === 5){

    //     var itemSiderType = data.siderType,
    //         itemPauseTime = data.pauseTime;

    //     $('#mixed-select').val(itemSiderType);
    //     $('#mixed-pauseTime').val(itemPauseTime);

    // }else if(typeId === 6 || typeId === 7 || typeId === 8){

    //     var itemSize = data.size,
    //         itemSiderType = data.siderType,
    //         itemPauseTime = data.pauseTime,
    //         typeName = Editer_stage.tool.getMediaType(typeId);

    //     $('#'+ typeName +'-size').text(itemSize);
    //     $('#'+ typeName +'-select').val(itemSiderType);
    //     $('#'+ typeName +'-pauseTime').val(itemPauseTime);

    // }else if(typeId === 9){

    //     var itemHref = data.href,
    //         itemRefresh = data.refreshTime,
    //         itemRefType = data.refreshType;

    //     $('#webpage-minutesVal').hide();
    //     $('#webpage-hoursVal').hide();
    //     $('.webpage-radio').unbind('click').bind('click', function(){

    //         var thisVal = $(this).val();

    //         if(thisVal == 1){

    //             $('#webpage-hoursVal').hide();
    //             $('#webpage-minutesVal').show();

    //         }else if(thisVal == 2){

    //             $('#webpage-minutesVal').hide();
    //             $('#webpage-hoursVal').show();

    //         }else{

    //             $('#webpage-minutesVal').hide();
    //             $('#webpage-hoursVal').hide();

    //         }

    //     })

    //     $('#webpage-href').val(itemHref);

    //     if(itemRefType == 0){

    //         $('#webpage-ban').prop('checked','true');
    //         $('#webpage-minutesVal').hide();
    //         $('#webpage-hoursVal').hide();

    //     }else if(itemRefType == 1){

    //         $('#webpage-minutes').prop('checked','true');
    //         $('#webpage-hoursVal').hide();
    //         $('#webpage-minutesVal').show();
    //         $('#webpage-refreshTime').val(itemRefresh);

    //     }else{

    //         $('#webpage-hours').prop('checked','true');
    //         $('#webpage-minutesVal').hide();
    //         $('#webpage-hoursVal').show();
    //         $('#webpage-refreshTimeHours').val(itemRefresh);

    //     }

    // }else if(typeId === 10){

    //     var dateAudioSW = data.audioSW;

    //     if(dateAudioSW == 0){

    //         $('#audio-show02').prop('checked','true');

    //     }else if(dateAudioSW == 1){

    //         $('#audio-show01').prop('checked','true');

    //     }

    // }else if(typeId === 11){

    // }else if(typeId === 12){

    //     var itemStreamMediaHref = data.href; 

    //     $('#streamMedia-href').val(itemStreamMediaHref);

    // }else if(typeId === 13){

    //     var itemTextAlign = data.textAlign,           // 文本对齐
    //         itemTextType = data.siderType,
    //         itemPauseTime = data.pauseTime,
    //         itemScrollSpeed = data.scrollSpeed,
    //         itemListStype = data.listType,
    //         itemTextShow = data.textShow;

    //     $('.text-align').find('span').removeClass('active');
    //     // 文本对齐
    //     if(itemTextAlign == 'center'){
    //         $('#rtf-fontCenter').addClass('active');
    //     } else if(itemTextAlign == 'left'){
    //         $('#rtf-fontLeft').addClass('active');
    //     } else if(itemTextAlign == 'right'){
    //         $('#rtf-fontRight').addClass('active');
    //     }

    //     $('#rtf-siderTypeSelect').val(itemTextType);
    //     $('#rtf-pauseTime').val(itemPauseTime);
    //     $('#rtf-scrollSpeed').val(itemScrollSpeed);

    //     if(itemTextType === '0'){
    //         hideTextSelect('#rtf-scrollSpeed');
    //         showTextSelect('#rtf-pauseTime');
    //     }else if(itemTextType === '2' || itemTextType === '4'){
    //         showTextSelect('#rtf-scrollSpeed');
    //         hideTextSelect('#rtf-pauseTime');
    //     }else{
    //         showTextSelect('#rtf-scrollSpeed');
    //         showTextSelect('#rtf-pauseTime');
    //     }

    //     if(itemTextShow === "0"){
    //         $('#rtf-show01').prop('checked', true);
    //     }else{
    //         $('#rtf-show02').prop('checked', true);
    //     }

    // }else if(typeId === 14){

    //     var itemLine = data.lineNum,
    //         itemLineHeight = data.lineHeight,
    //         itemBorderColor = data.borderColor,
    //         itemFontColor = '#000000',
    //         itemBorderWidth = data.borderWidth,
    //         itemFontFamily = data.fontFamily,
    //         itemFontSize = data.fontSize,
    //         itemColumn = data.column,
    //         itemBorderWrapSw = data.borderWrapSw,
    //         itemHeaderSw = data.headerSw,
    //         itemDataUrl = data.dataUrl,
    //         itemRefreshTime = data.refreshTime;

    //     $('#information-refreshTime').val(itemRefreshTime);
    //     $('#information-dataUrl').val(itemDataUrl);
    //     $('#information-line').val(itemLine);
    //     $('#information-lineHeight').val(itemLineHeight);
    //     $('#information-column').val(itemColumn);
    //     $('#information-borderWidth').val(itemBorderWidth);
    //     $('#information-fontFamily').val(itemFontFamily);
    //     $('#information-fontSize').val(itemFontSize);
    //     $('#information-color').val(itemBorderColor);
    //     $('#information-fontColor').val(itemFontColor);
    //     $('input[name=borderWrapSw][value='+ itemBorderWrapSw +']').prop('checked',true);
    //     $('input[name=headerSw][value='+ itemHeaderSw +']').prop('checked',true);

    //     Editer_stage.tool.setMinicolors('#borderColor','#information-color',itemBorderColor);
    //     Editer_stage.tool.setMinicolors('#infoFontColor','#information-fontColor',itemFontColor);

    // }else if(typeId === 15){

    //     var fontFamily = data.fontFamily,
    //         fontColor = data.fontColor,
    //         fontSize = data.fontSize,
    //         bgName = data.bgName,
    //         dataUrl = data.dataUrl,
    //         refreshTime = data.refreshTime;

    //     $('#map-fontFamily').val(fontFamily);
    //     $('#map-fontSize').val(fontSize);
    //     $('#map-color').val(fontColor);
    //     $('#map-background').val(bgName);
    //     $('#map-dataUrl').val(dataUrl);
    //     $('#map-refreshTime').val(refreshTime);

    //     Editer_stage.tool.setMinicolors('#mapBorderColor','#map-color',fontColor);

    // }

};


/*************** 拖拽 ********************/
Editer_stage.dragResize = function (param) {
    this.offSetX = 0; // 外围X
    this.offSetY = 0; // 外围Y 
    this.initX = 0; // 鼠标原始X坐标
    this.initY = 0; // 鼠标原始Y坐标
    this.initW = 0; // 元素宽
    this.initH = 0; // 元素高
    this.initL = 0; // 元素left值
    this.initT = 0; // 元素top值
    this.isMove = false; // 区域是否可移动
    this.resizeElement = false; // 拖拽对象
    this.moevElement = false; // 移动对象
    this.editerAreaIsMove = false; // 舞台是否可以移动
    this.editerArea = param.editerArea; // 舞台编辑
    this.panel = param.panel; // 画布  editCanvas-inWrap
    this.resizeDirection = ['dragResize-n', 'dragResize-s', 'dragResize-w', 'dragResize-e', 'dragResize-ne', 'dragResize-nw', 'dragResize-se', 'dragResize-sw'];
    this.objContextmenu = param.objContextmenu;
    this.resolutionWidth = param.resolutionWidth * 1;
    this.resolutionHeight = param.resolutionHeight * 1;
    this.eventDown = param.eventDown;
    this.eventUp = param.eventUp;
    this.eventMove = param.eventMove;
    this.touchtime = new Date().getTime();
    this.currentX = '#current-positionX';
    this.currentY = '#current-positionY';
    this.currentW = '#current-positionW';
    this.currentH = '#current-positionH';
    this.currentZ = '#current-positionZ';
};
// 查找元素(拖拽对象、拖拽点)
Editer_stage.dragResize.prototype.findMoveElement = function (elem) {

    var moveElem,
        resizeElem;

    while (elem) {

        // 判断获取拖拽点
        if (elem.className && elem.className.indexOf('dragResize') > -1) {

            resizeElem = elem;

            while (elem) {

                if (elem.className === 'item') {
                    moveElem = elem;
                    break;
                } else {
                    elem = elem.parentNode;
                }

            }

        } else {

            if (elem.className === 'item') {
                moveElem = elem;
                break;
            } else if (elem.className === 'editerCanvas-main' || elem.className === 'editerCanvas') {
                if (elem.className === 'editerCanvas') {
                    moveElem = $(elem).find('.editerCanvas-main')[0];
                } else {
                    moveElem = elem;
                }
                break;
            } else {
                elem = elem.parentNode;
            }

        }

    }

    return {
        moveElement: moveElem,
        resizeElement: resizeElem
    }

};
// 查找控制对象
Editer_stage.dragResize.prototype.findControlElement = function (elem) {

    var obj;
    while (elem) {
        if ($(elem).attr('data-type')) {
            obj = elem;
            break;
        }
        elem = elem.parentNode
    }

    return {
        controlElement: obj
    }

};
// 改变构造函数属性moevElement
Editer_stage.dragResize.prototype.changeControlElemen = function (elem) {

    var _this = this;
    _this.moevElement = elem;

};
// 绑定点击/按下事件
Editer_stage.dragResize.prototype.addMouseDown = function () {

    var _this = this,
        objElem;

    $(_this.panel).off(_this.eventDown).on(_this.eventDown, function (elem) {

        elem = _this.getEvent(elem);

        var elemTarget = elem.target,
            moveElement = null,
            resizeElement = null,
            $moveElem = null;

        objElem = _this.findMoveElement(elemTarget);
        moveElement = objElem.moveElement;
        resizeElement = objElem.resizeElement;
        $moveElem = $(moveElement);

        if ($moveElem) {
            if (_this.moevElement[0] !== $moveElem[0]) _this.deleteSelectPoint(_this.moevElement);
        }

        if (moveElement) {

            var moveElementName = moveElement.className;

            if (moveElementName === 'item') {

                var dataDrag = $moveElem.attr('data-drag'),
                    type = $moveElem.attr('data-type');

                // if(_this.moevElement){

                //     if($moveElem[0].id !== _this.moevElement[0].id){

                //         Editer_stage.areaDataShow.hideLeftSideBar('.editer-area-msg');

                //     }

                // }

                _this.moevElement = $moveElem;

                _this.isMove = dataDrag === 'false' ? false : true;

                if ($moveElem.find('.dragResize').length === 0) _this.addSelectPoint($moveElem);

                if (_this.isMove) {
                    $moveElem.css({
                        'cursor': 'move',
                        'opacity': .9
                    });
                }

                _this.setOnElemInfo($moveElem.attr('data-id'));

                Editer_stage.tool.showAreaTool();

                // 0为视频，1为图片，2为字幕，13为rtf
                if (type === '0' || type === '1' || type === '2' || type === '13') {
                    Editer_stage.tool.showAreaBorderTool();
                } else {
                    Editer_stage.tool.hideAreaBorderTool();
                }

            } else if (moveElementName === 'editerCanvas-main' || moveElementName === 'editerCanvas') {

                _this.editerAreaIsMove = true;

                if (moveElementName === 'editerCanvas') {
                    _this.moevElement = $moveElem.find('.editerCanvas-main');
                } else {
                    _this.moevElement = $moveElem;
                }
                // Editer_stage.areaDataShow.hideLeftSideBar('.editer-area-msg');
                $('.current-text').text(0);

                Editer_stage.tool.hideAreaTool();
                Editer_stage.tool.hideAreaBorderTool();

            }

            _this.initW = Math.round($moveElem.width());
            _this.initH = Math.round($moveElem.height());
            _this.initT = Math.round($moveElem[0].offsetTop);
            _this.initL = Math.round($moveElem[0].offsetLeft);
            // _this.initT = Math.round($moveElem.position().top);
            // _this.initL = Math.round($moveElem.position().left);
            _this.initX = Math.round(_this.getPageX(elem));
            _this.initY = Math.round(_this.getPageY(elem));
            _this.offsetX = _this.initX - _this.initL;
            _this.offsetY = _this.initY - _this.initT;

        } else {

            $('.current-text').text(0);

            // 移除所有的
            if (_this.moevElement) {
                _this.deleteSelectPoint(_this.moevElement);
                _this.moevElement = false;
                // Editer_stage.areaDataShow.hideLeftSideBar('.editer-area-msg');
            }

            Editer_stage.tool.hideAreaTool();
            Editer_stage.tool.hideAreaBorderTool();

        }

        if (resizeElement) {
            _this.resizeElement = resizeElement;
        } else {
            _this.resizeElement = false;
        }

        // 阻止默认事件
        _this.preventDefault(elem);

    });

};
// 手机端和PC获取 pageX
Editer_stage.dragResize.prototype.getPageX = function (elem) {

    var pageX = 0;

    if (elem) {
        pageX = IsPC() ? elem.pageX : elem.touches[0].pageX;
    }

    return pageX;

}
// 手机端和PC获取 pageY
Editer_stage.dragResize.prototype.getPageY = function (elem) {

    var pageY = 0;

    if (elem) {
        pageY = IsPC() ? elem.pageY : elem.touches[0].pageY;
    }

    return pageY;

}
// 绑定移动事件
Editer_stage.dragResize.prototype.addMouseMove = function () {

    var _this = this;

    $(_this.panel).off(_this.eventMove).on(_this.eventMove, function (elem) {

        elem = _this.getEvent(elem);

        var x = _this.getPageX(elem) - _this.initX,
            y = _this.getPageY(elem) - _this.initY,
            editerAreaW = $(_this.editerArea).width(),
            editerAreaH = $(_this.editerArea).height();

        if (_this.isMove) {

            if (_this.moevElement) {

                var thisTypeName = Editer_stage.tool.getMediaType(_this.moevElement.attr('data-type') * 1),
                    thisId = _this.moevElement.attr('data-id'),
                    thisArryIndex = _this.moevElement.attr('data-arry');

                if (_this.resizeElement) {

                    var resizeElementName = _this.resizeElement.className,
                        moveElemTop = _this.moevElement.position().top,
                        moveElemleft = _this.moevElement.position().left,
                        // moveElemWidth = _this.moevElement.width(),
                        // moveElemheight = _this.moevElement.height(),
                        editAreaTop = Math.round($(_this.editerArea).position().top),
                        editAreaLeft = Math.round($(_this.editerArea).position().left);

                    if (resizeElementName.indexOf('dragResize-n') >= 0 || resizeElementName.indexOf('dragResize-nw') >= 0 || resizeElementName.indexOf('dragResize-ne') >= 0) {

                        var dragT = _this.getPageY(elem) - _this.offsetY,
                            storNum = 0;

                        if (dragT < 0) {
                            dragT = 0;
                        }

                        // 控制拖拽范围  必须小于区块的top值加高度的范围
                        if (dragT < _this.initT + _this.initH) {
                            // 大于top值为向下，
                            // 小于top值向上
                            if (dragT < _this.initT) {

                                storNum = _this.initH + (_this.initT - dragT);

                            } else {

                                if (dragT > moveElemTop) {

                                    storNum = _this.initH - (dragT - _this.initT);

                                }

                            }

                            if (storNum > 0) {
                                _this.initH = storNum;
                            }

                            _this.initT = dragT;

                        }

                    }

                    if (resizeElementName.indexOf('dragResize-nw') >= 0 || resizeElementName.indexOf('dragResize-w') >= 0 || resizeElementName.indexOf('dragResize-sw') >= 0) {

                        var dragL = _this.getPageX(elem) - _this.offsetX,
                            storNum = 0;

                        if (dragL < 0) {
                            dragL = 0;
                        }

                        if (dragL < _this.initL + _this.initW) {
                            if (dragL < _this.initL) {
                                storNum = _this.initW + (_this.initL - dragL);
                            } else {
                                if (dragL > _this.initL) {
                                    storNum = _this.initW - (dragL - _this.initL);
                                }
                            }
                            if (storNum > 0) {
                                _this.initW = storNum;
                            }
                            _this.initL = dragL;
                        }

                    }

                    if (resizeElementName.indexOf('dragResize-ne') >= 0 || resizeElementName.indexOf('dragResize-se') >= 0 || resizeElementName.indexOf('dragResize-e') >= 0) {

                        var dragW = _this.getPageX(elem) - editAreaLeft,
                            storNum = 0;

                        if (dragW > editerAreaW) {
                            dragW = editerAreaW;
                        }

                        storNum = dragW - _this.initL;

                        if (storNum > 0) {
                            _this.initW = storNum;
                        }

                    }

                    if (resizeElementName.indexOf('dragResize-s') >= 0 || resizeElementName.indexOf('dragResize-se') >= 0 || resizeElementName.indexOf('dragResize-sw') >= 0) {

                        var dragH = _this.getPageY(elem) - editAreaTop,
                            storNum = 0;

                        if (dragH > editerAreaH) {
                            dragH = editerAreaH
                        }

                        storNum = dragH - _this.initT;

                        if (storNum > 0) {
                            _this.initH = storNum
                        }

                    }

                    var conversionData = Editer_stage.tool.conversion(_this.initW, _this.initH, _this.initL, _this.initT);
                    Editer_stage.areaDataShow.publicItem(thisTypeName, thisId, thisArryIndex, conversionData.width, conversionData.height, conversionData.left, conversionData.top);
                    if (conversionData) editerDataStore.setMediaData(thisId, conversionData.width, conversionData.height, conversionData.left, conversionData.top);

                    _this.moevElement.css({
                        left: _this.initL,
                        top: _this.initT,
                        height: _this.initH,
                        width: _this.initW
                    });

                } else {

                    var dragL = _this.initL + x,
                        dragT = _this.initT + y,
                        maxL = editerAreaW - _this.initW, // left最大值
                        maxT = editerAreaH - _this.initH; // top最大值

                    if (dragL < 0) {
                        dragL = 0;
                    }

                    if (dragL > maxL) {
                        dragL = maxL;
                    }

                    if (dragT < 0) {
                        dragT = 0;
                    }

                    if (dragT > maxT) {
                        dragT = maxT;
                    }

                    var conversionData = Editer_stage.tool.conversion(_this.initW, _this.initH, dragL, dragT);
                    Editer_stage.areaDataShow.publicItem(thisTypeName, thisId, thisArryIndex, '', '', conversionData.left, conversionData.top);
                    if (conversionData) editerDataStore.setMediaData(thisId, '', '', conversionData.left, conversionData.top);

                    _this.moevElement.css({
                        top: dragT,
                        left: dragL
                    });
                }

                _this.setOnElemInfo(thisId);

            }

        }

        if (_this.editerAreaIsMove) {

            var dragL = _this.initL + x,
                dragT = _this.initT + y;

            _this.moevElement.css({
                top: dragT,
                left: dragL
            });

            // $('.editerCanvas-tool').css({
            //     top: dragT - 30,
            //     left: dragL
            // })

        }

        // 阻止默认事件
        _this.preventDefault(elem);

    });

};
// 绑定鼠标弹起
Editer_stage.dragResize.prototype.addMouseUp = function () {

    var _this = this;

    $(_this.panel).unbind(_this.eventUp).bind(_this.eventUp, function (elem) {

        elem = _this.getEvent(elem);

        if (_this.isMove && _this.moevElement) {
            _this.isMove = false;
            _this.moevElement.css({
                'cursor': 'pointer',
                'opacity': 1
            });
        }

        if (_this.editerAreaIsMove) {
            _this.editerAreaIsMove = false;
            _this.moevElement.css('cursor', 'pointer');
        }

        // 阻止默认事件
        _this.preventDefault(elem);

    });

};
// 绑定双击
Editer_stage.dragResize.prototype.addDbClick = function () {

    var _this = this;

    // if(!IsPC()){

    var touchtime = 0,
        touchStarTime = 0;

    $(_this.panel).bind('touchstart', function (elem) {

        elem = _this.getEvent(elem);
        var elemTarget = elem.target,
            objElem = _this.findMoveElement(elemTarget),
            moveElement = objElem.moveElement;

        if (moveElement.className === 'controlItem' || moveElement.className === 'item') {
            touchStarTime = new Date().getTime();
        }

    });

    $(_this.panel).bind("touchend", function (elem) {

        var nowClick = new Date().getTime();

        elem = _this.getEvent(elem);
        var elemTarget = elem.target,
            objElem = _this.findMoveElement(elemTarget),
            moveElement = objElem.moveElement;

        if (nowClick - touchStarTime >= 600 && nowClick - touchStarTime <= 1000) {

            if (moveElement) {

                var moveElementName = moveElement.className;

                if (moveElementName === 'controlItem') {
                    // 合并属性
                    Editer.extend(moveElement, dragResize.findControlElement(elemTarget));
                    moveElement.event = elem;
                    touchStarTime = 0;
                    // contextMenuHandler(moveElement);

                }

            }

            return;
        }

        if (nowClick - touchtime <= 300) {

            if (moveElement) {

                var moveElementName = moveElement.className;

                if (moveElementName === 'item') {

                    var moveElementId = $(moveElement).attr('data-id'),
                        moveElementTypeId = $(moveElement).attr('data-type') * 1;

                    if (moveElementTypeId === 0 || moveElementTypeId === 1) {

                        Editer_stage.tool.showItemMsg(moveElementId, moveElementTypeId);

                    } else {

                        Editer_stage.tool.toast('暂不支持编辑');

                    }

                }

            }

        }

        touchtime = nowClick;

    });

    // }else{

    //     $(_this.panel).unbind('dblclick').bind('dblclick',function (elem){

    //         elem = _this.getEvent(elem);

    //         var elemTarget = elem.target, 
    //             objElem = _this.findMoveElement(elemTarget),
    //             moveElement = objElem.moveElement;

    //         if(moveElement){

    //             var moveElementName = moveElement.className;

    //             if(moveElementName === 'controlItem'){

    //                 var moveElementId = $(moveElement).attr('data-id');
    //                 var moveElementTypeId = $(moveElement).attr('data-type')*1;

    //                 Editer_stage.tool.showItemMsg(moveElementId, moveElementTypeId);

    //             }

    //         }

    //     })

    // }


};
// 区域边框设置
Editer_stage.dragResize.prototype.getElemByBorder = function () {

    return this.moevElement

}
// 添加拖拽点
Editer_stage.dragResize.prototype.addSelectPoint = function (elem) {

    // 清除拖拽点
    if ($(elem).find('.dragResize').length > 0) {
        $(elem).find('.dragResize').remove();
    }

    // 循环添加拖拽点
    for (var i = 0, len = this.resizeDirection.length; i < len; i++) {

        var setPoint = $('<div class="dragResize ' + this.resizeDirection[i] + '"></div>');
        $(elem).append(setPoint);

    };

};
// 删除拖拽点
Editer_stage.dragResize.prototype.deleteSelectPoint = function (elem) {

    // 清除拖拽点
    if ($(elem).find('.dragResize').length > 0) {
        $(elem).find('.dragResize').remove();
    }

};
// 区域右键菜单
Editer_stage.dragResize.prototype.addContextMenu = function (elem) {

    var _this = this;

    $(_this.panel).unbind('contextmenu').bind('contextmenu', function (elem) {

        var elem = elem || window.event,
            elemTarget = elem.target,
            objElem = _this.findMoveElement(elemTarget),
            moveElement = objElem.moveElement;

        if (moveElement) {

            var moveElementName = moveElement.className;

            if (moveElementName === 'controlItem') {
                // 合并属性
                Editer.extend(moveElement, _this.findControlElement(elemTarget));
                moveElement.event = elem;

                if (_this.objContextmenu) {
                    _this.objContextmenu(moveElement);
                }

            }

        }

        // 阻止默认事件
        _this.preventDefault(elem);

    });

};
Editer_stage.dragResize.prototype.addHandler = function (element, type, handler) {

    var _this = this;

    if (element.addEventListener) {

        element.addEventListener(type, handler, false);

    } else if (element.attachEvent) {

        element.attachEvent("on" + type, handler);

    } else {

        element["on" + type] = handler;

    }

};
Editer_stage.dragResize.prototype.removeHandler = function (element, type, handler) {

    if (element.removeEventListener) {

        element.removeEventListener(type, handler, false);

    } else if (element.detachEvent) {

        element.detachEvent("on" + type, handler);

    } else {

        element["on" + type] = null;

    }

};
Editer_stage.dragResize.prototype.getTarget = function (event) {

    return event.target || event.srcElement;

};
Editer_stage.dragResize.prototype.getWheelDelta = function (event) {

    if (event.wheelDelta) {

        return event.wheelDelta;

    } else {

        return -event.detail * 40;

    }

};
Editer_stage.dragResize.prototype.onWheel = function (event) {

    var _this = Editer_stage.dragResize.prototype;

    event = _this.getEvent(event);
    var curElem = _this.getTarget(event),
        curVal = parseInt(curElem.value),
        delta = _this.getWheelDelta(event),
        thisZoom = Editer_stage.tool.getZoom();

    if (delta > 0) {

        curElem.value = 0 + 10;
        if (thisZoom > 0 && thisZoom < 500) {
            var changeZoom = thisZoom * 1 + curElem.value * 1;
            Editer_stage.tool.siderbuildEditerArea(changeZoom);
            Editer_stage.tool.setZoom(changeZoom);
            Editer_stage.tool.setTopSlider(changeZoom);
        }

    } else {

        curElem.value = 0 - 10;
        if (thisZoom > 10) {
            var changeZoom = thisZoom * 1 + curElem.value * 1;
            Editer_stage.tool.siderbuildEditerArea(changeZoom);
            Editer_stage.tool.setZoom(changeZoom);
            Editer_stage.tool.setTopSlider(changeZoom);
        }

    }

    _this.preventDefault(event);

};
// 实时赋值左下角信息
Editer_stage.dragResize.prototype.setOnElemInfo = function (id) {

    var _this = this,
        jsonData = editerDataStore.getMediaData(id),
        left = jsonData.left,
        top = jsonData.top,
        width = jsonData.width,
        height = jsonData.height,
        zIndex = jsonData.zIndex;

    $(_this.currentX).text(left);
    $(_this.currentY).text(top);
    $(_this.currentW).text(width);
    $(_this.currentH).text(height);
    $(_this.currentZ).text(zIndex);

}
// 对象获取
Editer_stage.dragResize.prototype.getEvent = function (event) {

    return event ? event : window.event;

};
// 阻止默认事件
Editer_stage.dragResize.prototype.preventDefault = function (event) {

    if (event && event.preventDefault) {

        event.preventDefault();

    } else {

        event.returnValue = false;

    }

};
Editer_stage.dragResize.prototype.delete = function () {

    var _this = this,
        elem = _this.moevElement,
        itemId = _this.moevElement.attr('data-id');

    editerDataStore.deleteMediaDataItemById(itemId);
    Editer_stage.tool.removeEditerItem(elem);


};
Editer_stage.dragResize.prototype.lock = function () {

    var _this = this;

    _this.moevElement.attr('data-drag', 'false');


};
Editer_stage.dragResize.prototype.unlock = function () {

    var _this = this;

    _this.moevElement.attr('data-drag', 'true');

};
Editer_stage.dragResize.prototype.upZindex = function () {

    var _this = this,
        zIndex = _this.moevElement.css('z-index'),
        thisItemId = _this.moevElement.attr('data-id');

    zIndex = zIndex * 1 + 1;
    zIndex = zIndex < 0 ? 0 : zIndex;

    _this.moevElement.css('z-index', zIndex);
    Editer_stage.tool.setAreaZindex(zIndex);
    editerDataStore.setMediaProjectData(thisItemId, 'zIndex', zIndex);

};
Editer_stage.dragResize.prototype.downZindex = function () {

    var _this = this,
        zIndex = _this.moevElement.css('z-index'),
        thisItemId = _this.moevElement.attr('data-id');

    zIndex = zIndex * 1 - 1;
    zIndex = zIndex < 0 ? 0 : zIndex;

    _this.moevElement.css('z-index', zIndex);
    Editer_stage.tool.setAreaZindex(zIndex);
    editerDataStore.setMediaProjectData(thisItemId, 'zIndex', zIndex);

};
Editer_stage.dragResize.prototype.fullScreen = function () {

    var _this = this,
        thisItemId = _this.moevElement.attr('data-id'),
        nowZoom = Editer_stage.tool.calculateZoom(Editer_stage.tool.getZoom()),
        thisItemWidth = _this.resolutionWidth * nowZoom,
        thisItemHeight = _this.resolutionHeight * nowZoom,
        thisItemTypeId = _this.moevElement.attr('data-type') * 1,
        thisItemTypeName = Editer_stage.tool.getMediaType(thisItemTypeId);

    _this.moevElement.css({
        'width': thisItemWidth + 'px',
        'height': thisItemHeight + 'px',
        'left': '0px',
        'top': '0px'
    });
    editerDataStore.setMediaProjectData(thisItemId, 'width', _this.resolutionWidth);
    editerDataStore.setMediaProjectData(thisItemId, 'height', _this.resolutionHeight);
    editerDataStore.setMediaProjectData(thisItemId, 'left', 0);
    editerDataStore.setMediaProjectData(thisItemId, 'top', 0);

    Editer_stage.areaDataShow.publicItem(thisItemTypeName, '', '', _this.resolutionWidth, _this.resolutionHeight, 0, 0);

};
Editer_stage.dragResize.prototype.alignLeft = function () {

    var _this = this,
        thisItemId = _this.moevElement.attr('data-id'),
        thisItemTypeId = _this.moevElement.attr('data-type') * 1,
        thisItemTypeName = Editer_stage.tool.getMediaType(thisItemTypeId);

    _this.moevElement.css('left', '0px');
    editerDataStore.setMediaProjectData(thisItemId, 'left', 0);

    Editer_stage.areaDataShow.publicItem(thisItemTypeName, '', '', '', '', 0, '');

};
Editer_stage.dragResize.prototype.alignRight = function () {

    var _this = this,
        thisItemId = _this.moevElement.attr('data-id'),
        thisItemWidth = editerDataStore.getMediaData(thisItemId).width * 1,
        nowZoom = Editer_stage.tool.calculateZoom(Editer_stage.tool.getZoom()),
        thisItemLeft = _this.resolutionWidth - thisItemWidth,
        thisItemEditerLeft = parseInt(thisItemLeft * nowZoom) + 'px',
        thisItemTypeId = _this.moevElement.attr('data-type') * 1,
        thisItemTypeName = Editer_stage.tool.getMediaType(thisItemTypeId);

    _this.moevElement.css('left', thisItemEditerLeft);
    editerDataStore.setMediaProjectData(thisItemId, 'left', thisItemLeft);

    Editer_stage.areaDataShow.publicItem(thisItemTypeName, '', '', '', '', thisItemLeft, '');

};
Editer_stage.dragResize.prototype.alignXCenter = function () {

    var _this = this,
        thisItemId = _this.moevElement.attr('data-id'),
        thisItemWidth = editerDataStore.getMediaData(thisItemId).width * 1,
        nowZoom = Editer_stage.tool.calculateZoom(Editer_stage.tool.getZoom()),
        thisItemLeft = (_this.resolutionWidth - thisItemWidth) / 2,
        thisItemEditerLeft = parseInt(thisItemLeft * nowZoom) + 'px',
        thisItemTypeId = _this.moevElement.attr('data-type') * 1,
        thisItemTypeName = Editer_stage.tool.getMediaType(thisItemTypeId);

    _this.moevElement.css('left', thisItemEditerLeft);
    editerDataStore.setMediaProjectData(thisItemId, 'left', thisItemLeft);

    Editer_stage.areaDataShow.publicItem(thisItemTypeName, '', '', '', '', thisItemLeft, '');

};
Editer_stage.dragResize.prototype.alignYCenter = function () {

    var _this = this,
        thisItemId = _this.moevElement.attr('data-id'),
        thisItemHeight = editerDataStore.getMediaData(thisItemId).height,
        nowZoom = Editer_stage.tool.calculateZoom(Editer_stage.tool.getZoom()),
        thisItemTop = (_this.resolutionHeight - thisItemHeight) / 2,
        thisItemEditerTop = parseInt(thisItemTop * nowZoom) + 'px',
        thisItemTypeId = _this.moevElement.attr('data-type') * 1,
        thisItemTypeName = Editer_stage.tool.getMediaType(thisItemTypeId);

    _this.moevElement.css('top', thisItemEditerTop);
    editerDataStore.setMediaProjectData(thisItemId, 'top', thisItemTop);

    Editer_stage.areaDataShow.publicItem(thisItemTypeName, '', '', '', '', '', thisItemTop);

};
Editer_stage.dragResize.prototype.alignTop = function () {

    var _this = this,
        thisItemId = _this.moevElement.attr('data-id'),
        thisItemTypeId = _this.moevElement.attr('data-type') * 1,
        thisItemTypeName = Editer_stage.tool.getMediaType(thisItemTypeId);

    _this.moevElement.css('top', '0px');
    editerDataStore.setMediaProjectData(thisItemId, 'top', 0);

    Editer_stage.areaDataShow.publicItem(thisItemTypeName, '', '', '', '', '', 0);

};
Editer_stage.dragResize.prototype.alignBottom = function () {

    var _this = this,
        thisItemId = _this.moevElement.attr('data-id'),
        thisItemHeight = editerDataStore.getMediaData(thisItemId).height * 1,
        nowZoom = Editer_stage.tool.calculateZoom(Editer_stage.tool.getZoom()),
        thisItemTop = (_this.resolutionHeight - thisItemHeight),
        thisItemEditerTop = parseInt(thisItemTop * nowZoom) + 'px',
        thisItemTypeId = _this.moevElement.attr('data-type') * 1,
        thisItemTypeName = Editer_stage.tool.getMediaType(thisItemTypeId);

    _this.moevElement.css('top', thisItemEditerTop);
    editerDataStore.setMediaProjectData(thisItemId, 'top', thisItemTop);

    Editer_stage.areaDataShow.publicItem(thisItemTypeName, '', '', '', '', '', thisItemTop);

};
// 置顶
Editer_stage.dragResize.prototype.upToFirst = function () {

    var _this = this,
        zIndex = _this.moevElement.css('z-index'),
        thisItemId = _this.moevElement.attr('data-id'),
        areaLen = editerDataStore.returnDataAreaLen(),
        areaMaxIndex = editerDataStore.getMaxZindex();

    if (zIndex == areaMaxIndex && areaMaxIndex > areaLen) {
        Editer_stage.tool.toast('当前已处于最顶层！');
        return;
    }else{
        zIndex = areaMaxIndex + 1;
    }
    Editer_stage.tool.setAreaZindex(zIndex);
    _this.moevElement.css('z-index', zIndex);
    editerDataStore.setMediaProjectData(thisItemId, 'zIndex', zIndex);

};
// 置底
Editer_stage.dragResize.prototype.upToLast = function () {

    var _this = this,
        thisItemId = _this.moevElement.attr('data-id');

    _this.moevElement.css('z-index', 0);
    Editer_stage.tool.setAreaZindex(0);
    editerDataStore.setMediaProjectData(thisItemId, 'zIndex', 0);

};
// 监听点击
Editer_stage.dragResize.prototype.addMouseListener = function () {

    this.addMouseDown();
    this.addMouseUp();
    this.addMouseMove();
    this.addContextMenu();
    this.addDbClick();

};