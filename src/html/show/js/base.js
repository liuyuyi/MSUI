var pageList;
var thisData = "";
var intNum = 0;
var intMaxNum = 0;
var pagTime = 0; 
var resolution;
var pageTimeOut = 0;
var timeObj = {};
var sidlerObj = {};
var pageNum = 0;
var setTimeWeather = {};
var setTimeWebPage = {};
var setDataTable = {};
var setMap = {};
var serverIp = 'http://192.168.0.109:8080';
// var serverIp = 'http://116.62.172.55:8080';

// 获得选择的分辨率
function getViewResolution(resolut) {

    if (resolut === "") return;
  
    var resl = resolut.split('X');

    return { 'width': parseInt(resl[0]), 'height': parseInt(resl[1]) };       // parseInt 字符转成整数性质

}

// 获取页面列表
function getPageList(){

	pageList = callbackPL();
	resolution = getViewResolution(pageList.pageResolution[0].resolution);
	
	removejscssfile(thisData,"js");
	// android.removeVideo(pageNum);
	
	$('#demo').empty();

	intMaxNum = pageList.page.length;
	thisData = pageList.page[intNum].jsonData;
	pagTime = pageList.page[intNum].pagTime;

	intNum++;
	pageNum = intNum - 1;
	if(intNum == intMaxNum){
		intNum = 0;
	}
	
	// console.log(thisData);
	// console.log(pagTime);
	//console.log(thisData + "|" + intNum);
	// console.log(intMaxNum);

	loadScript(thisData,function(){
		// document.getElementsByTagName('body')[0].removeChild(this);
		getData();

	});

	settime();
	
}

// 获取数据
function getData(resolution){

	var data = callback();

	var eqType = (data.pageEle[0].eqType).toLocaleLowerCase();
	var bgImg = data.pageEle[0].bgImg;
	var bgColor = data.pageEle[0].bgColor;
    var resolution = getViewResolution(resolution);
	// var num = 0;
	// var textNum=0;

	if(bgImg !== ''){
		
		$("#demo").css({
	        "background-image": "url('" + serverIp + "/resources/" + bgImg + "')",
	        "background-size":"cover"
    	});

	}
	
	if(eqType === 'x3m'){

		resolution = getViewResolution('1280X720');

	}else if(eqType === 'x3c'){

		resolution = getViewResolution('1024X768');

	}else if(eqType === 'x3'){

		resolution = getViewResolution('1280X720');

	}else if(eqType === 'q5' || eqType === 'q5c'){

		resolution = getViewResolution('1920X1080');

	}

	$("#demo").css({
        "background-color":bgColor,
        "width":resolution.width+"px",
        "height":resolution.height+"px"
	});
	
	$.each(data.mediaEle,function(index,item){
		
		var itemId = item.id;
		var itemType = item.type;
		var itemTop = item.top;
		var itemLeft = item.left;
		var itemWidth = item.width;
		var itemHeight = item.height;
		var itemResolution = item.resolution;
		var itemSrcGroup = item.srcGroup;
		var itemzIndex = item.zIndex;
		var itemArrSrc = [];
		var itemRotation = item.rotation;
		var rotationClass = '';

		// if(itemRotation == 1){
		// 	rotationClass = 'rotate90';
		// }else if(itemRotation == 2){
		// 	rotationClass = 'rotate180';
		// }else if(itemRotation == 3){
		// 	rotationClass = 'rotate270';
		// }

		if(itemType == 0){

			var timestamp = new Date().getTime();
			var itemId = "my-video" + timestamp;
			//console.log(itemId);
			for(var i=0;i<itemSrcGroup.length;i++){
				var src = itemSrcGroup[i].src;
				var name = src.substring(0,src.lastIndexOf("."));
                var type = src.substring(src.lastIndexOf("."),src.length);
                var picPath ="";

                // if(type=='.mp4'){
              	//   picPath = serverIp + "/resources/" + name + "_copy.mp4";
                // }else{
              	//   picPath = serverIp + "/resources/" + name + ".mp4";
                // }
                picPath = serverIp + "/resources/" + name + ".mp4";

				itemArrSrc.push(picPath);
			}
				
    		addVideo(itemArrSrc[0],itemArrSrc,itemId,itemWidth,itemHeight,itemLeft,itemTop,itemzIndex,rotationClass);

			// android.addChildView(pageNum, itemArrSrc, num, itemWidth, itemHeight, itemLeft, itemTop);
			// num++;

		}else if(itemType == 1){

			var itemClass = "slider"+item.id;
			var itemType = siderType(item.siderType);
			var itemPauseTime = item.pauseTime * 1000;
			var shtml = "";
			
			for(var i=0;i<itemSrcGroup.length;i++){
				shtml += '<img src="' + serverIp + "/resources/" + itemSrcGroup[i].src + '" />';
			}
			
			addSiderPhoto(itemClass,shtml,itemType,itemPauseTime,itemWidth,itemHeight,itemLeft,itemTop,itemzIndex,rotationClass)

		}else if(itemType == 4){

			var itemIdName = "clock"+item.id;

			addClock(itemIdName,item,itemWidth,itemHeight,itemLeft,itemTop,itemzIndex);

		}else if(itemType == 2){

			var itemIdName = "text"+item.id;
			var speed = item.scrollSpeed;
			var sppedType =item.siderType;
			var imageList = textImgList();
		    //addTextView(pageNum,imageList, textNum, speed, sppedType, itemWidth, itemHeight, itemLeft, itemTop);
		    //textNum++;
		    
			var shtml = '<div class="item" style="width:'+ itemWidth +'px;height:'+ itemHeight +'px;top:'+ itemTop +'px;left:'+ itemLeft +'px;z-index:'+ itemzIndex +';background:black;color:#fff">'+
						'文字暂不支持预览'+
		    			'</div>';
		    
		    $("#demo").append(shtml);

		}else if(itemType == 3){

			ajaxCallback('GET', 'getWeather', {'city': item.district}, function(districtData){

				var jsonData = districtData.result;

				addWeather(item,itemWidth,itemHeight,itemLeft,itemTop,itemzIndex,jsonData);
				
				// if(jsonData.HeWeather5[0].status !== 'ok'){

				// 	ajaxCallback('GET','getWeather',{'city': item.city},function(cityData){

				// 		if(cityData.result.HeWeather5[0].status !== 'ok'){

				// 			ajaxCallback('GET','getWeather',{'city': item.province},function(provinceData){

				// 				addWeather(item,itemWidth,itemHeight,itemLeft,itemTop,itemzIndex,provinceData.result);

				// 			})

				// 		}else{

				// 			addWeather(item,itemWidth,itemHeight,itemLeft,itemTop,itemzIndex,cityData.result);

				// 		}

				// 	});

				// }else{

				// 	addWeather(item,itemWidth,itemHeight,itemLeft,itemTop,itemzIndex,jsonData);

				// }

			});

		}else if(itemType == 10){

			addAudio(item.srcGroup);

		}else if(itemType == 8){
			var picList=pdfPicList();
			
			var itemClass = "pdf"+item.id;
			var itemType = siderType(item.siderType);
			var itemPauseTime = item.pauseTime * 1000;
			var shtml = "";
			
			for(var i=0;i<itemSrcGroup.length;i++){
				for(var j=0;j<picList.length;j++){
					var imageList=picList[j].imageList;
					var domainId=picList[j].domainId;
					if(domainId==itemSrcGroup[i].id){
						for(var n=0;n<imageList.length;n++){
							shtml += '<img src="' + serverIp + "/resources/" + imageList[n] + '" />';
						}
					}
				}
			}
			addSiderPhoto(itemClass,shtml,itemType,itemPauseTime,itemWidth,itemHeight,itemLeft,itemTop,itemzIndex);

		}else if(itemType == 9){

			var refreshType = item.refreshType;
			var refreshTime = item.refreshTime;

			addWebPage(itemId, refreshType, refreshTime, itemTop, itemLeft, itemWidth, itemHeight, item.href);

		}else if(itemType == 7){
			var picList=pptPicList();
			
			var itemClass = "ppt"+item.id;
			var itemType = siderType(item.siderType);
			var itemPauseTime = item.pauseTime * 1000;
			var shtml = "";
			
			for(var i=0;i<itemSrcGroup.length;i++){
				for(var j=0;j<picList.length;j++){
					var imageList=picList[j].imageList;
					var domainId=picList[j].domainId;
					if(domainId==itemSrcGroup[i].id){
						for(var n=0;n<imageList.length;n++){
							shtml += '<img src="' + serverIp + "/resources/" + imageList[n] + '" />';
						}
					}
				}
			}
			addSiderPhoto(itemClass,shtml,itemType,itemPauseTime,itemWidth,itemHeight,itemLeft,itemTop,itemzIndex);

		}else if(itemType == 6){
			var picList=wordPicList();
			
			var itemClass = "word"+item.id;
			var itemType = siderType(item.siderType);
			var itemPauseTime = item.pauseTime * 1000;
			var shtml = "";
			
			for(var i=0;i<itemSrcGroup.length;i++){
				for(var j=0;j<picList.length;j++){
					var imageList=picList[j].imageList;
					var domainId=picList[j].domainId;
					if(domainId==itemSrcGroup[i].id){
						for(var n=0;n<imageList.length;n++){
							shtml += '<img src="' + serverIp + "/resources/" + imageList[n] + '" />';
						}
					}
				}
			}
			addSiderPhoto(itemClass,shtml,itemType,itemPauseTime,itemWidth,itemHeight,itemLeft,itemTop,itemzIndex);

		}else if(itemType == 12){
			
			addStreamingMedia(itemTop, itemLeft, itemWidth, itemHeight, item.href);

		}else if(itemType == 5){

			var itemClass = "slider"+item.id;
			var itemType = siderType(item.siderType);
			var itemPauseTime = item.pauseTime * 1000;
			var shtml = "";
			
			for(var i=0;i<itemSrcGroup.length;i++){
				if((/\.(gif|png|jpe?g)$/i).test(itemSrcGroup[i].src)){
					shtml += '<img data-id="' + itemSrcGroup[i].id + '"  data-type="1" data-play="0" src="' + serverIp + "/resources/" + itemSrcGroup[i].src + '" />';
				}else{
					shtml += '<img data-id="' + itemSrcGroup[i].id + '"  data-type="0" data-play="0" data-src="' + serverIp + '/resources/' + itemSrcGroup[i].src + '" src="../page/play/show/look/images/bg.jpg" />';
				}
			}
			
			addMixedSeeding(itemClass,shtml,itemType,itemPauseTime,itemWidth,itemHeight,itemLeft,itemTop,itemzIndex)

		}else if(itemType == 14){

			addTable(item.id,itemTop, itemLeft, itemWidth, itemHeight, itemzIndex, item.html, item.dataUrl, item.refreshTime);

		}else if(itemType == 15){

			addMap(itemTop, itemLeft, itemWidth, itemHeight, itemzIndex,item);

		}

	});

}

// 计时器
function settime() { 

	if(intMaxNum>1){

		if (pagTime == 0) { 

	        for(pop in timeObj){
	            clearTimeout(timeObj[pop]);
	        }
	        timeObj = {};

	        for(sidpop in sidlerObj){
	            sidlerObj[sidpop].stop();
	        }
	        sidlerObj = {};

	        for(weatherpop in setTimeWeather){
	            clearTimeout(setTimeWeather[weatherpop]);
	        }
	        setTimeWeather = {};

	        for(webPagePop in setTimeWebPage){
	            clearTimeout(setTimeWebPage[weatherpop]);
	        }
	        setTimeWebPage = {};

	    	clearTimeout(pageTimeOut);
	    	getPageList();

	        return;

		} else { 

			pagTime--; 

		} 

		pageTimeOut = setTimeout(function() {
			settime();
		},1000);

	}

}

// 动态创建JS
function loadScript(url, callback) {

  var script = document.createElement("script");
  script.type = "text/javascript";
  if(typeof(callback) != "undefined"){
    if (script.readyState) {
      script.onreadystatechange = function () {
        if (script.readyState == "loaded" || script.readyState == "complete") {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {
      script.onload = function () {
        callback();
      };
    }
  }
  script.src = url;
  document.body.appendChild(script);

}

// 移除JS
function removejscssfile(filename, filetype){

	var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none";
	var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none";
	var allsuspects=document.getElementsByTagName(targetelement);

	for (var i=allsuspects.length; i>=0; i--){
	if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
	   allsuspects[i].parentNode.removeChild(allsuspects[i]);
	}

}

/**
 * ajax异步请求 回调处理
 * @param method
 * @param url
 * @param params
 * @param return  data
 * */
function ajaxCallback(method,url,params,callBack){

  $.ajax({
    cache: true,
    type: method,
    url: url,
    data: params,
    dataType: 'jsonp',
    jsonp:'jsonpCallback',
    // jsonpCallback:'jsonpCallback',
    //async: false,
    success: function(data) {
    	
      	if (is_define(callBack)) {

	        callBack(data); 

      	}

    },
    error: function(request) {
		console.log('错误')
    }
  });

}

function jsonpCallback(result){
	return result;
}

//判断是否是空 
function is_define(value) {
    if (value === null || value === "" || value === undefined || typeof (value) === 'undefined' || value === 0) {
        return false;
    }
    else {
        value = value + "";
        value = value.replace(/\s/g, "");
        if (value == "") {
            return false;
        }
        return true;
    }
}

/**
 * 获取城市
 * @return {[type]} [description]
 */
function getBMapCity(callBack){

    // 获取城市
    var myCity = new BMap.LocalCity();
    myCity.get(function (result){

    	callBack(result.name);

    });

}


/*********************************************************  加入舞台元素方法  *********************************************/


/*********************************** 添加轮播图 ******************************************
 * 判断轮播类型
 * @param  {[type]} itemId [ID]
 * @return {[type]}        [类型]
 */
function siderType(itemId){

	var type = "";

        // random  随机
        // fold   百叶窗左右
        // foldTop 百叶窗上下
        // sliceUpLeft 左右
        // sliceUpToDown 上下
        // line 随机线条
	switch(itemId){
		case "0":
		  type = "random";
		  break;
		case "1":
		  type = "sliceUpLeft";
		  break;
		case "2":
		  type = "fold";
		  break;
		case "3":
		  type = "foldTop";
		  break;
		case "4":
		  type = "sliceUpToDown";
		  break;
		case "5":
		  type = "line";
		  break;
		case "6":
		  type = ""; // boxRainGrow
		  break;
		case "7":
		  type = "boxRainGrowReverse";
		  break;
	}

	return type;
	
}

/**
 * 图片轮播 添加dom
 * @param {[type]} clName    [类名]
 * @param {[type]} arrLis    [图片列表]
 * @param {[type]} siderType [滚动类型]
 * @param {[type]} anim      [停留时间]
 * @param {[type]} W         [宽度]
 * @param {[type]} H         [高度]
 * @param {[type]} L         [左边]
 * @param {[type]} T         [顶部]
 * @param {[type]} itemzIndex         [层级]
 */
function addSiderPhoto(clName, arrLis, siderType, anim, W, H, L, T, itemzIndex,rotationClass){

	var shtml = '<div class="item " style="width:'+ W +'px;height:'+ H +'px;top:'+ T +'px;left:'+ L +'px;z-index:'+ itemzIndex +'">'+
        '<div class="slider-wrapper theme-default '+ rotationClass +'">'+
            '<div id="'+ clName +'" class="nivoSlider">'+
                arrLis +
            '</div>'+
       ' </div>'+
    '</div>';

    $("#demo").append(shtml);
    $('#'+clName).nivoSlider({
        effect: siderType,
        animSpeed:500,
        pauseTime:anim,
        directionNavHide:false,
        controlNav:false,
        directionNav:false,
        pauseOnHover:false
    });

    $('#' + clName).find("img").css({
    	"max-height":H+"px",
    	"min-height":H+"px"
    })

}
/*********************************** 添加轮播图 ******************************************/

/*********************************** 添加视频 ******************************************
 * 添加视频  controls(进度条) loop(循环)
 * @param {[type]} video [视频]
 * @param {[type]} vList [视频列表]
 * @param {[type]} ID    [ID]
 * @param {[type]} W         [宽度]
 * @param {[type]} H         [高度]
 * @param {[type]} L         [左边]
 * @param {[type]} T         [顶部]
 * @param {[type]} itemzIndex         [层级]
 */
function addVideo(video, vList, ID, W, H, L, T, itemzIndex,rotationClass){

	var shtml = '<video id="' + ID + '" class="video-js ' + rotationClass + '" preload="auto" controls="true" poster="" data-setup="{}">' +
				    '<source src="'+ video +'" type="video/mp4">' +
				'</video>';

	$("#demo").append(shtml);

	
    var myPlayer = videojs(ID,{
		controls: true
	});
    myPlayer.ready(function(){
        var myPlayer = this;
        myPlayer.play();
		// myPlayer.loop();
	});
	
	$("#" + ID).css({
		"width": W + "px",
		"height": H + "px",
		"left": L + "px",
		"top": T + "px"
	});

	var vLen = vList.length,
		curr = 0; 
	      
    myPlayer.on('ended', function(){  
		
        myPlayer.src(vList[curr]);
        myPlayer.load();     
		myPlayer.play();    
		
        curr++;    
        if(curr >= vLen){    
            curr = 0; // 重新循环播放  
        }    
    });   
   
}
/*********************************** 添加视频 ******************************************/

/*********************************** 添加时钟 ******************************************
* 添加时钟
* @param {[type]} itemIdName         [时钟ID]
* @param {[type]} itemData         [时钟数据]
* @param {[type]} W         [宽度]
* @param {[type]} H         [高度]
* @param {[type]} L         [左边]
* @param {[type]} T         [顶部]
*/
function addClock(itemIdName,itemData,W,H,L,T,itemzIndex){

	var heightArr = [];
	var maxHeight = 0;

	var dateFormat = '';
	var clockHtml = '';
	var timeHtml = '';
	var dateHtml = '';
	var aWeekDay = '';

	var clockStyle = '';
	var weekStyle = '';
	var timeStyle = '';
	var dateStyle = '';

	var clockShow = itemData.clockShow;
	var weekShow = itemData.weekShow;
	var timeShow = itemData.timeShow;
	var dateShow = itemData.dateShow;

	var clockW = itemData.clockW;
	var dateFontSize = itemData.dateFontSize;
	var timeFontSize = itemData.timeFontSize;
	var timeFormat = itemData.timeFormat;
	var dateFormat = itemData.dateFormat;
	var weekFormat = itemData.weekFormat;
	var fontFamily = itemData.fontFamily;
	var fontColor = itemData.fontColor;
	var dateWeight = itemData.dateWeight;
	var weekWeight = itemData.weekWeight;
	var timeWeight = itemData.timeWeight;
	var clockType = itemData.clockType;

	dateStyle += (dateWeight == 1) ? "font-weight:bold;" : "font-weight:normal;";
	weekStyle += (weekWeight == 1) ? "font-weight:bold;" : "font-weight:normal;";
	timeStyle += (timeWeight == 1) ? "font-weight:bold;" : "font-weight:normal;";

	dateStyle += "font-size:"+ dateFontSize +"px;color:"+ fontColor +";";
	weekStyle += "font-size:"+ dateFontSize +"px;color:"+ fontColor +";";
	timeStyle += "font-size:"+ timeFontSize +"px;color:"+ fontColor +";";

	heightArr.push(dateFontSize*1);
	heightArr.push((timeFontSize*1)+(dateFontSize*1));
	heightArr.push(clockW*1);
	heightArr.push(H);

	maxHeight = arrMax(heightArr);

	// 日期
	// if(dateShow == 1){
		
		dateHtml =  '<div class="date">'+
	                    '<span class="date_a" style="'+ dateStyle +'"></span>'+
	                '</div>';
        dateFormat = "YYYY-MM-DD";

	    // if(dateFormat == 1){

	    //     dateFormat = "YYYY年MM月DD日";

	    // }else if(dateFormat == 2){

	    //     dateFormat = "YYYY.MM.DD";

	    // }else if(dateFormat == 3){

	    //     dateFormat = "YYYY-MM-DD";
	        
	    // }else if(dateFormat == 4){

	    //     dateFormat = "MM月DD日";
	        
	    // }

	// }

	// 时间
	// if(timeShow == 1){

		timeHtml += '<div class="digits" style="'+ timeStyle +'">';

	    if(timeFormat == 1){
	        timeHtml += '<div class="hou01"></div>'+
			            '<div class="hou02"></div>'+
			            '<div class="dots">:</div>'+
			            '<div class="min01"></div>'+
		                '<div class="min02"></div>'+
		                '<div class="dots">:</div>'+
		                '<div class="sec01"></div>'+
		                '<div class="sec02"></div>';

	    }else {

	        timeHtml += '<div class="hou01"></div>'+
		                '<div class="hou02"></div>'+
		                '<div class="dots">:</div>'+
		                '<div class="min01"></div>'+
		                '<div class="min02"></div>';

	    }

	    timeHtml += '</div>';

	// }
	
	timeHtml +=  '<div><span class="date_b" style="'+ weekStyle +'"></span></div>';

	// 周
	if(weekShow == 1){

	    if(weekFormat == 1){
	        aWeekDay = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
	    } else if(weekFormat == 2){
	        aWeekDay = ['周日','周一','周二','周三','周四','周五','周六'];
	    } else {
	        aWeekDay = ['Sun','Mon','Tur','Wed','Thu','Fri','Sat'];
	    }

	}

	var shtml = '<div id="'+ itemIdName +'" class="light clock" style="position:absolute;width:'+ W +'px;height:'+ maxHeight +'px;top:'+ T +'px;left:'+ L +'px;z-index:'+ itemzIndex +'">';
	if(clockType == 1){

		shtml += '<table cellspacing="0" cellpadding="0" border="0" width="100%"><tbody><tr>'+
				 '<td class="text_td" style="white-space:nowrap;text-align: center;">'+
				    dateHtml+
					timeHtml+
				 '</td></tr>'+
				 '</tbody></table>';


	}else if(clockType == 0){

		shtml +='<canvas class="clockIn" width="'+W+'px" height="'+H+'px"></canvas>'

	}
	shtml +='</div>'

	$("#demo").append(shtml);

	$('#'+itemIdName).setClock({
	    'sFormat': dateFormat,
	    'aWeekDay': aWeekDay,
        'clockId': itemIdName,
        'clockType':clockType  
	});

}
/**
 * 获取最大值
 * @param  {[arry]} arr [数组]
 * @return {[type]}     [最大值]
 */
function arrMax(arr){

    var arrMax = arr[0];

    for(var i=0,len=arr.length;i<len;i++){

        if(arrMax<arr[i]){
            arrMax = arr[i];
        }

    }
    
    return arrMax;

}
/*********************************** 添加时钟 ******************************************/

/*********************************** 添加音频 ******************************************/
/**
 * 添加音频
 * @param {[string]} patch [音频地址]
 */
function addAudio(patchs){

	var sAudio = '';

	for(var i=0,len=patchs.length;i<len;i++){
		sAudio += patchs[i].src + '|';
	}

	var shtml = '<audio id="pageAudio" controls="true" autoplay="autoplay" onended="endAudio(this)" data-audio="'+ sAudio +'" data-index="0" style="display:none;">'+
                    '<source src="' + serverIp + '/resources/' + patchs[0].src + '" />' +
                '</audio>';

	$("#demo").append(shtml);
	$('#pageAudio').load();

}
// 停止音频
function pauseAudio(){
	$('#pageAudio').pause();
}
function endAudio(obj){
	
	var audios = $(obj).attr('data-audio');
	var audioIndex = $(obj).attr('data-index')*1;
	var audiosArr = [];
	var len = 0;

	audios = audios.substring(0,audios.length-1);
	audiosArr = audios.split('|');
	len = audiosArr.length;
	if(audioIndex+1 === len){
		audioIndex = -1;
	}
	audioIndex += 1;

	for(var i=0;i<len;i++){

		if(i === audioIndex){
			$('#pageAudio').attr('src', serverIp + '/resources/' + audiosArr[i]);
			$('#pageAudio').load();
		}

	}
	
	$('#pageAudio').attr('data-index', audioIndex);

}
/*********************************** 添加音频 ******************************************/

/*********************************** 添加天气 ******************************************
 * 添加天气
 * @param {[type]} itemData   [数据]
 * @param {[type]} W          [宽]
 * @param {[type]} H          [高]
 * @param {[type]} L          [left]
 * @param {[type]} T          [top]
 * @param {[type]} itemzIndex [层级]
 * @param {[type]} jsonData   [请求天气数据]
 */
function addWeather(itemData,W, H, L, T,itemzIndex, jsonData){

    var shtml = '';
    var id = itemData.id;
    var fontColor = itemData.fontColor;
    var fontSize = itemData.fontSize;
    var bgColor = itemData.bgColor;
    var bgColorShow = itemData.bgColorShow;
    var rowType = itemData.rowType;
    var todayShow = itemData.todayShow;
    var tomShow = itemData.tomShow;
    var afterShow = itemData.afterShow;
    var fontFamily = itemData.fontFamily;
    var svgSize = itemData.iconSize; 
    var refreshTime = itemData.refreshTime;
    var className = '#controlItem_'+id;
    var setTimeName = 'weatherSetTime'+id;
    var city = itemData.city;

    // if(bgColorShow != 1) bgColor = "";

    var msgHtml = getWeatherHtml(rowType,todayShow,tomShow,afterShow,jsonData,itemData);

    shtml += 	'<div id="controlItem_'+ id +'" class="controlItem" style="position: absolute; top:' + T + 'px; left: ' + L + 'px; width: ' + W + 'px; height: ' + H + 'px;z-index:' + itemzIndex + ';color:'+ fontColor +';background:'+ bgColor +';font-size:'+ fontSize +'px;font-family:'+ fontFamily +'">'+
                    '<div style="width:100%;height:100%;overflow:hidden">'+
                        '<table cellspacing="0" cellpadding="0" border="0" class="weather_content" style="width:100%; height:100%;margin: 0 auto;">'+
                            msgHtml +
                        '</table>'+
                    '</div>'+
                '</div>';

	$("#demo").append(shtml);

	$(className).find('svg').css({
		'width':svgSize + 'px',
		'height':svgSize + 'px'
	});
	
	$(className).find('p').css('font-size',fontSize+'px');

	setTimeWeather[setTimeName] = setInterval(function(){
		getWeatherOnlineData(setTimeName);
	},refreshTime*3600*1000);
	
}

// 异步刷新天气
function getWeatherOnlineData(setTimeName) {
	
	var data = callback();
	var refreshId = setTimeName.replace('weatherSetTime','');

	for(var i = 0,len=data.mediaEle.length;i<len;i++){

		var mediaEle = data.mediaEle[i];
		var itemId = mediaEle.id;

		if(itemId == refreshId){

			// var url="http://"+ getWeatherUrl() +"/ListenPlatform/show/getWeather";
			
			ajaxCallback('GET','getWeather',{'city': data.mediaEle[i].district },function(districtData){

				var jsonData = districtData.result;

			    var id = mediaEle.id;
			    var fontColor = mediaEle.fontColor;
			    var fontSize = mediaEle.fontSize;
			    var bgColor = mediaEle.bgColor;
			    var bgColorShow = mediaEle.bgColorShow;
			    var rowType = mediaEle.rowType;
			    var todayShow = mediaEle.todayShow;
			    var tomShow = mediaEle.tomShow;
			    var afterShow = mediaEle.afterShow;
			    var fontFamily = mediaEle.fontFamily;
			    var svgSize = fontSize*4+18; 
			    var className = "#controlItem_"+id;

			    // if(bgColorShow != 1) bgColor = "";

				if(jsonData.HeWeather5[0].status !== 'ok'){

					ajaxCallback('GET','getWeather',{'city': data.mediaEle[i].city },function(cityData){

						if(cityData.result.HeWeather5[0].status !== 'ok'){

							ajaxCallback('GET','getWeather',{'city': data.mediaEle[i].province},function(provinceData){

								getAjaxWeatherData(className, svgSize, rowType, todayShow, tomShow, afterShow, provinceData.result);

							})

						}else{

							getAjaxWeatherData(className, svgSize, rowType, todayShow, tomShow, afterShow, cityData.result);

						}


					});

				}else{

					getAjaxWeatherData(className, svgSize, rowType, todayShow, tomShow, afterShow, jsonData);

				}

			});

		}

	}

}
// 加载异步刷新数据 
function getAjaxWeatherData(className, svgSize, rowType, todayShow, tomShow, afterShow, jsonData){

	var msgHtml = getWeatherHtml(rowType,todayShow,tomShow,afterShow,jsonData);
	var shtml  = 	'<div style="width:100%;height:100%;overflow:hidden">'+
	                    '<table cellspacing="0" cellpadding="0" border="0" class="weather_content" style="width:100%; height:100%;margin: 0 auto;">'+
	                        msgHtml +
	                    '</table>'+
	                '</div>';

    $(className).empty();
    $(className).append(shtml);
	$(className).find('svg').css({
		'width':svgSize + 'px',
		'height':svgSize + 'px'
	});

}

// 获取一天数据
function getWeatherDayData(jsonData,day){

	var heWeather = jsonData.HeWeather5[0];
	var city = heWeather.basic.city;
	var dayData = null;
	var aqi = null;

	for(var i=0,len=heWeather.daily_forecast.length;i<len;i++){

		if(day === i){

			dayData = heWeather.daily_forecast[i];
			aqi = heWeather.aqi.city;

		}

	}

	return {
		city: city,
		dayData:  dayData,
		aqi: aqi
	}

}

// 获取天气图标
function getWeatherIcon(dayJsonData){

	var iconCode = dayJsonData.dayData.cond.code_d;

	switch(iconCode){
		case '100':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-qing"></use></svg>';
			break;
		case '101':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-duoyun"></use></svg>';
			break;
		case '102':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-shaoyun"></use></svg>';
			break;
		case '103':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-qingjianduoyun"></use></svg>';
			break;
		case '104':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tianqizitiku05"></use></svg>';
			break;
		case '200':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tq-200"></use></svg>';
			break;
		case '201':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tianqizitiku07"></use></svg>';
			break;
		case '202':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tq-200"></use></svg>';
			break;
		case '203':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tq-200"></use></svg>';
			break;
		case '204':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tq-200"></use></svg>';
			break;
		case '205':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tianqizitiku11"></use></svg>';
			break;
		case '206':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tianqizitiku11"></use></svg>';
			break;
		case '207':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tianqizitiku11"></use></svg>';
			break;
		case '208':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tg-208"></use></svg>';
			break;
		case '209':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-fengbao"></use></svg>';
			break;
		case '210':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-kuangbaofeng"></use></svg>';
			break;
		case '211':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-jufeng"></use></svg>';
			break;
		case '212':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-longjuanfeng"></use></svg>';
			break;
		case '213':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-19redaifengbao"></use></svg>';
			break;
		case '300':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-zhenyu"></use></svg>';
			break;
		case '301':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tq-301"></use></svg>';
			break;
		case '302':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tq-303"></use></svg>';
			break;
		case '303':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tq-303"></use></svg>';
			break;
		case '304':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tianqizitiku24"></use></svg>';
			break;
		case '305':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-xiaoyu"></use></svg>';
			break;
		case '306':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-zhongyu"></use></svg>';
			break;
		case '307':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-dayu"></use></svg>';
			break;
		case '308':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tq-208"></use></svg>';
			break;
		case '309':	
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tianqizitiku29"></use></svg>';
			break;
		case '310':	
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-rain"></use></svg>';
			break;
		case '311':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-dabaoyu"></use></svg>';
			break;
		case '312':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tedabaoyu"></use></svg>';
			break;
		case '313':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-dongyu"></use></svg>';
			break;
		case '400':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-22"></use></svg>';
			break;
		case '401':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tianqizitiku35"></use></svg>';
			break;
		case '402':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-daxue"></use></svg>';
			break;
		case '403':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-baoxue"></use></svg>';
			break;
		case '404':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-yujiaxue"></use></svg>';
			break;
		case '405':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tq-405"></use></svg>';
			break;
		case '406':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-zhenyujiaxue"></use></svg>';
			break;
		case '407':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-zhenxue"></use></svg>';
			break;
		case '500':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tianqizitiku42"></use></svg>';
			break;
		case '501':	
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-fog"></use></svg>';
			break;
		case '502':	
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-d502"></use></svg>';
			break;
		case '503':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-23yangsha"></use></svg>';
			break;
		case '504':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tianqizitiku46"></use></svg>';
			break;
		case '507':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tianqizitiku47"></use></svg>';
			break;
		case '508':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-qiangshachenbao"></use></svg>';
			break;
		case '900':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tianqizitiku49"></use></svg>';
			break;
		case '901':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-tq-901"></use></svg>';
			break;
		case '999':
			return '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-weather99"></use></svg>';
			break;

	}

}

// 获取天气湿度
function getWeatherHum(dayJsonData){
	return dayJsonData.dayData.hum;
}

// 获取天气描述
function getWeatherText(dayJsonData){
	return dayJsonData.dayData.cond.txt_d;
}

// 获取天气温度
function getWeatherTmp(dayJsonData){
	return dayJsonData.dayData.tmp.min + ' ~ ' + dayJsonData.dayData.tmp.max + '℃';
}

// 获取天气城市
function getWeatherCity(dayJsonData){
	return dayJsonData.city;
}

// 获取风向
function getWeatherWindDir(dayJsonData){
	return dayJsonData.dayData.wind.dir;
}

// 获取风级
function getWeatherWindSc(dayJsonData){
	return dayJsonData.dayData.wind.sc;
}
function getWeatherData(data){

    var weatherData = {};
    weatherData.wind = data.wind == 0 ? 'none' : 'inline-block',
    weatherData.scale = data.scale == 0 ? 'none' : 'inline-block',
    weatherData.hum = data.hum == 0 ? 'none' : 'block',
    weatherData.air = data.air == 0 ? 'none' : 'inline-block',
    weatherData.pm = data.pm == 0 ? 'none' : 'inline-block',
    weatherData.icon = data.icon == 0 ? 'none' : 'table-cell',
    weatherData.area = data.area == 0 ? 'none' : 'block',
    weatherData.state = data.state == 0 ? 'none' : 'inline-block',
    weatherData.date = data.date == 0 ? 'none' : 'block',
    weatherData.temperature = data.temperature == 0 ? 'none' : 'inline-block',
    weatherData.lineShow01 = 'block',
    weatherData.lineShow02 = 'block',
    weatherData.lineShow03 = 'block',
    weatherData.fontFamily = data.fontFamily,
    weatherData.fontColor = data.fontColor,
    weatherData.fontSize = data.fontSize,
    weatherData.todayShow = data.todayShow,
    weatherData.tomShow = data.tomShow,
    weatherData.afterShow = data.afterShow,
    weatherData.iconSize = data.iconSize,
    weatherData.dayName = ['今天','明天','后天'];

    if(data.wind == 0 && data.scale == 0){
        weatherData.lineShow01 = 'none';
    }

    if(data.pm == 0 && data.air == 0){
        weatherData.lineShow02 = 'none';
    }

    if(data.state == 0 && data.temperature == 0){
        weatherData.lineShow03 = 'none';
    }

    return weatherData;

}
// 左右图文(横排)
function setWeatherTemp01(dayJsonData, itemData, text){

	var weatherIcon = getWeatherIcon(dayJsonData);
	var city = getWeatherCity(dayJsonData);
	var temperature = getWeatherTmp(dayJsonData);
	var cond = getWeatherText(dayJsonData);
	var hum = getWeatherHum(dayJsonData);
	var windDir = getWeatherWindDir(dayJsonData);
	var windSc = getWeatherWindSc(dayJsonData);

    var weatherData = getWeatherData(itemData);

	var pmHtml = '';
	if(text === '今天'){
		var qlty = dayJsonData.aqi.qlty;
		var pm = dayJsonData.aqi.pm25;
		pmHtml = '<p style="margin: 0px;text-align: right;white-space:nowrap;padding-top: 6px;display:'+ weatherData.lineShow02 +'"><span style="display:'+ weatherData.pm +'">'+'PM2.5 '+ pm + '</span> <span style="display:'+ weatherData.air +'">'+ qlty +'</span></p>';
	}

    var shtml = '<td class="weather_day clearfix">'+
                    '<table style="width:100%;">'+
                        '<tbody>'+
                            '<tr>'+
                                '<td class="weather_pic" style="display:'+ weatherData.icon +'">'+
                                   	weatherIcon+
                                '</td>'+
                                '<td class="weater_text">'+
                                	'<p style="margin: 0px;white-space:nowrap; text-align: right;padding-top: 6px;display:'+ weatherData.date +'" class="weather_date">'+ text+'</p>'+
                                    '<p style="margin: 0px;white-space:nowrap; text-align: right;display:'+ weatherData.area +'">'+ city + '</p>'+
                                    '<p style="margin: 0px 0px 0px 5px;white-space:nowrap; text-align:right;padding-top: 6px;display:'+ weatherData.lineShow03 +'">'+ cond + ' ' + temperature +'</p>'+
                                    '<p style="margin: 0px;text-align: right;white-space:nowrap;padding-top: 6px;display:'+ weatherData.lineShow01 +'"><span style="display:'+ weatherData.wind +'">'+ windDir + '</span> <span style="display:'+ weatherData.scale +'">' + windSc +'</span></p>'+
                                    '<p style="margin: 0px;text-align: right;white-space:nowrap;padding-top: 6px;display:'+ weatherData.hum +'">湿度 '+ hum +'%</p>'+
                                    pmHtml +
                                '</td>'+
                            '</tr>'+
                        '</tbody>'+
                    '</table>'+
                '</td>';

    return shtml;

}

// 上下图文(横排)
function setWeatherTemp02(dayJsonData, itemData, text){

	var weatherIcon = getWeatherIcon(dayJsonData);
	var city = getWeatherCity(dayJsonData);
	var temperature = getWeatherTmp(dayJsonData);
	var cond = getWeatherText(dayJsonData);
	var hum = getWeatherHum(dayJsonData);
	var windDir = getWeatherWindDir(dayJsonData);
	var windSc = getWeatherWindSc(dayJsonData);

    var weatherData = getWeatherData(itemData);
    
	var pmHtml = '';
	if(text === '今天'){
		var qlty = dayJsonData.aqi.qlty;
		var pm = dayJsonData.aqi.pm25;
		pmHtml = '<p class="weater_text" style="margin: 0px;white-space:nowrap;display:'+ weatherData.lineShow02 +'"><span style="display:'+ weatherData.pm +'">'+'PM2.5 '+ pm + '</span> <span style="display:'+ weatherData.air +'">'+ qlty +'</span></p>';
	}

    var shtml = '<td class="weather_day" align="center" style="vertical-align: text-top;">'+
                    '<div class="weather_pic" style="margin-bottom:10px;">'+
                        '<p style="margin: 0px;white-space:nowrap;">'+
                           '<span class="city" style="display:'+ weatherData.area +'">'+ city + '</span>'+
                           '<span class="day_name weather_date" style="display:'+ weatherData.date +'">'+ text +'</span>'+
                        '</p>'+
                        '<span style="display:'+ weatherData.icon +'">'+ weatherIcon +'</span>'+
                        '<p style="margin: 0px;white-space:nowrap;display:'+ weatherData.temperature +'">'+ temperature +'</p>'+
                        '<p class="weater_text" style="margin: 0px;white-space:nowrap;display:'+ weatherData.state +'">'+ cond +'</p>'+
                        '<p class="weater_text" style="margin: 0px;white-space:nowrap;display:'+ weatherData.lineShow01 +'"><span style="display:'+ weatherData.wind +'">'+ windDir + '</span> <span style="display:'+ weatherData.scale +'">' + windSc +'</span></p>'+
                        '<p class="weater_text" style="margin: 0px;white-space:nowrap;display:'+ weatherData.hum +'">湿度 '+ hum +'%</p>'+
                        pmHtml +
                    '</div>'+
                '</td>';
                
    return shtml;

}
// 上下文字(横排)
function setWeatherTemp03(dayJsonData, itemData, text){

	var city = getWeatherCity(dayJsonData);
	var temperature = getWeatherTmp(dayJsonData);
	var cond = getWeatherText(dayJsonData);
	var hum = getWeatherHum(dayJsonData);
	var hum = getWeatherHum(dayJsonData);
	var windDir = getWeatherWindDir(dayJsonData);
	var windSc = getWeatherWindSc(dayJsonData);

    var weatherData = getWeatherData(itemData);

	var pmHtml = '';
	if(text === '今天'){
		var qlty = dayJsonData.aqi.qlty;
		var pm = dayJsonData.aqi.pm25;
		pmHtml = '<p class="weater_text" style="margin: 0px;white-space:nowrap;display:'+ weatherData.lineShow02 +'"><span style="display:'+ weatherData.pm +'">'+'PM2.5 '+ pm + '</span> <span style="display:'+ weatherData.air +'">'+ qlty +'</span></p>';
	}
	
    var shtml = '<td class="weather_day" align="center" style="vertical-align: text-top;">'+
                    '<div class="weather_pic">'+
                        '<p style="margin: 0px;white-space:nowrap;">'+
                           '<span class="city" style="display:'+ weatherData.area +'">'+ city +'</span>'+
                           '<span class="day_name weather_date">'+ text +'</span>'+
                        '</p>'+
                        '<p style="margin: 0px;white-space:nowrap;display:'+ weatherData.temperature +'">'+ weatherData.temperature +'</p>'+
                        '<p class="weater_text" style="margin: 0px;white-space:nowrap;display:'+ weatherData.state +'">'+ cond +'</p>'+
                        '<p class="weater_text" style="margin: 0px;white-space:nowrap;display:'+ weatherData.lineShow01 +'"><span style="display:'+ weatherData.wind +'">'+ windDir + '</span> <span style="display:'+ weatherData.scale +'">' + windSc +'</span></p>'+
                        '<p class="weater_text" style="margin: 0px;white-space:nowrap;display:'+ weatherData.hum +'">湿度 '+ hum +'%</p>'+
                        pmHtml +
                    '</div>'+
                '</td>';
                
    return shtml;

}

// 获得根据类型判断天气排版
function getWeatherHtml(rowType,todayShow,tomShow,afterShow,jsonData,itemData){

    var sHtml = "";
    var dayJsonData = null;

 	if(jsonData.HeWeather5[0].status === 'ok'){

	    // 左右图文(横排)                                
	    if(rowType == 1){

	        sHtml += "<tr>";

	        if(todayShow == 1){
	        	dayJsonData = getWeatherDayData(jsonData,0);
	            sHtml += setWeatherTemp01(dayJsonData, itemData, "今天");
	        }
	        if(tomShow == 1){
	        	dayJsonData = getWeatherDayData(jsonData,1);
	            sHtml += setWeatherTemp01(dayJsonData, itemData, "明天");
	        }
	        if(afterShow == 1){
	        	dayJsonData = getWeatherDayData(jsonData,2);
	            sHtml += setWeatherTemp01(dayJsonData, itemData, "后天"); 
	        }

	        sHtml += "</tr>";

	    }

	    // 左右图文(竖排)
	    if(rowType == 2){
	        
	        if(todayShow == 1){
	        	dayJsonData = getWeatherDayData(jsonData,0);
	            sHtml += "<tr>";
	            sHtml += setWeatherTemp02(dayJsonData, itemData, "今天");
	            sHtml += "</tr>";
	        }
	        if(tomShow == 1){
	        	dayJsonData = getWeatherDayData(jsonData,1);
	            sHtml += "<tr>";
	            sHtml += setWeatherTemp02(dayJsonData, itemData, "明天");
	            sHtml += "</tr>";
	        }
	        if(afterShow == 1){
	        	dayJsonData = getWeatherDayData(jsonData,2);
	            sHtml += "<tr>";
	            sHtml += setWeatherTemp02(dayJsonData, itemData, "后天"); 
	            sHtml += "</tr>";
	        }

	    }

	    // 上下图文(横排)
	    if(rowType == 3){

	        sHtml += "<tr>";

	        if(todayShow == 1){
	        	dayJsonData = getWeatherDayData(jsonData,0);
	            sHtml += setWeatherTemp02(dayJsonData, itemData, "今天");
	        }
	        if(tomShow == 1){
	        	dayJsonData = getWeatherDayData(jsonData,1);
	            sHtml += setWeatherTemp02(dayJsonData, itemData, "明天");
	        }
	        if(afterShow == 1){
	        	dayJsonData = getWeatherDayData(jsonData,2);
	            sHtml += setWeatherTemp02(dayJsonData, itemData, "后天"); 
	        }

	        sHtml += "</tr>";

	    }

	    // 上下文字(横排)
	    if(rowType == 4){

	        sHtml += "<tr>";

	        if(todayShow == 1){
	        	dayJsonData = getWeatherDayData(jsonData,2);
	            sHtml += setWeatherTemp03(dayJsonData, itemData, "今天");
	        }
	        if(tomShow == 1){
	        	dayJsonData = getWeatherDayData(jsonData,2);
	            sHtml += setWeatherTemp03(dayJsonData, itemData, "明天");
	        }
	        if(afterShow == 1){
	        	dayJsonData = getWeatherDayData(jsonData,2);
	            sHtml += setWeatherTemp03(dayJsonData, itemData, "后天"); 
	        }

	        sHtml += "</tr>";

	    }

 	}else{
 		console.log('无法搜索到该城市/县/区的天气');
 	}

    return sHtml;

}

/*********************************** 添加天气 ******************************************/

/*********************************** 添加网页 ******************************************/
function addWebPage(id, type, time, T, L, W, H, url){

	var itemIdName = 'webPage_' + id;

	var shtml = '<iframe id="'+ itemIdName +'" style="top:'+ T +'px;left:'+ L +'px;width:'+ W +'px;height:'+ H +'px;position: absolute;" src="'+ url +'"></iframe>';

	$("#demo").append(shtml);

	if(type == 1){

		var starTime = time * 60 * 1000;
		setTimeWebPage[itemIdName] = setInterval(function(){

			document.getElementById(itemIdName).src = url;

		},starTime);

	}else if(type == 2){

		var starTime = time * 60 * 60 * 1000;
		setTimeWebPage[itemIdName] = setInterval(function(){

			document.getElementById(itemIdName).src = url;

		},starTime);

	}


}

/*********************************** 添加网页 ******************************************/

/*********************************** 添加流媒体 ******************************************/
function addStreamingMedia(T, L, W, H, url){

	var shtml =	'<video autoplay="autoplay" style="position: absolute;width:'+ W +'px;height:'+ H +'px;left:'+ L +'px;top:'+ T +'px;">'+
		          '<source src="'+ url +'" type="application/x-mpegURL">'+
		        '</video>';
		        
	$("#demo").append(shtml);

}

/*********************************** 添加流媒体 ******************************************/

/*********************************** 添加混播区 ******************************************/
/**
 * 混播区轮播 添加dom
 * @param {[type]} clName    [类名]
 * @param {[type]} arrLis    [图片列表]
 * @param {[type]} siderType [滚动类型]
 * @param {[type]} anim      [停留时间]
 * @param {[type]} W         [宽度]
 * @param {[type]} H         [高度]
 * @param {[type]} L         [左边]
 * @param {[type]} T         [顶部]
 * @param {[type]} itemzIndex         [层级]
 */
function addMixedSeeding(clName, arrLis, siderType, anim, W, H, L, T, itemzIndex){

	var shtml = '<div class="item" style="width:'+ W +'px;height:'+ H +'px;top:'+ T +'px;left:'+ L +'px;z-index:'+ itemzIndex +'">'+
        '<div class="slider-wrapper theme-default">'+
        	'<div class="videoPlay" style="display: none"></div>'+
            '<div id="'+ clName +'" class="nivoSlider">'+
                arrLis +
            '</div>'+
       ' </div>'+
    '</div>';
    
    $("#demo").append(shtml);
    $('#'+clName).nivoSlider({
        effect: siderType,
        animSpeed:500,
        pauseTime: anim,
        directionNavHide: false,
        controlNav: false,
        directionNav: false,
        pauseOnHover: false
    });

    $('#' + clName).find("img").css({
    	"max-height":H+"px",
    	"min-height":H+"px"
    })

}

/*********************************** 添加混播区 ******************************************/


/*********************************** 添加动态表 ******************************************/

function addTable(id, itemTop, itemLeft, itemWidth, itemHeight,itemzIndex, html, dataUrl,refreshTime){

	var shtml = '<div class="item dnytable" style="width:'+ itemWidth +'px;height:'+ itemHeight +'px;top:'+ itemTop +'px;left:'+ itemLeft +'px;z-index:'+ itemzIndex +'">'+
				html +
				'</div>';

    $("#demo").append(shtml);

    var td = $(html).find('td'),
    	className = '',
    	setTimeName = 'table'+id;

    // for(var pop in jsonData){

    // 	$('.'+pop).text(jsonData[pop]);

    // }

    // setMap[setTimeName] = setInterval(function(){
    	
    // 	getMapData(id);

    // },refreshTime*1000);

}
function getMapData(id){
	console.log(id)
}
/*********************************** 添加动态表 ******************************************/

/*********************************** 添加交通诱导图 ******************************************/

function addMap(itemTop, itemLeft, itemWidth, itemHeight, itemzIndex, itemData){

	var itemHtml = '',
		shtml = '',
		backgroundImg = serverIp + '/resources/' + itemData.backgroundImg,
		fontSize = itemData.fontSize,
		fontFamily = itemData.fontFamily,
		fontColor = itemData.fontColor;

	for(var i=0;i<itemData.srcGroup.length;i++){

		var itemL = itemData.srcGroup[i].left,
			itemT = itemData.srcGroup[i].top,
			dataValId = itemData.srcGroup[i].dataVal;

		itemHtml += '<div style="position:absolute;min-height:30px;top:'+ itemT +'px;line-height: initial;left:'+ itemL +'px;" id="induced_'+ dataValId +'">0</div>';

	}

	shtml = '<div class="item" style="width:'+ itemWidth +'px;height:'+ itemHeight +'px;top:'+ itemTop +'px;left:'+ itemLeft +'px;z-index:'+ itemzIndex +';background-image:url('+ backgroundImg +');background-repeat: no-repeat;color: '+ fontColor +';font-size: '+ fontSize +'px;font-family: '+ fontFamily +'; background-size: cover;">'+
				itemHtml +
			'</div>'

    $("#demo").append(shtml);

	// ajaxCallback('GET', 'http://116.62.172.55:8090/displayCard/v1.0.0/getInfo.fgl', {'devCode': 'QC201806220739'}, function(data){

	// 	if(data !== 1000){
	// 		InWebSocket.devCode = 'QC201806220739';
	// 		InWebSocket.getData(data);
	//     	InWebSocket.init();
	// 	}

	// });


}

/*********************************** 添加交通诱导图 ******************************************/

var InWebSocket = {
	url: 'ws://116.62.172.55:8090/displayCard/myHandler?devCode=',
	websocket: null,
	autoOpen : true,   // 是否自动重新连接
	autoTime : null,
	devCode: '',
	init : function(){

	  var _this = this;
	  
	  if ('WebSocket' in window) {
	  	_this.websocket = null;
	    _this.websocket = new WebSocket(_this.url+_this.devCode);
	    _this.onopen();
	    _this.onmessage();
	    _this.onclose();
	  }

	},
	onopen : function(){
	  
	  var _this = this;

	  _this.websocket.onopen = function(evnt) {
	    // console.log('WebSocket连接成功');
	    clearInterval(_this.autoTime);
	  };

	},
	onmessage : function(evnt) {

	  var _this = this;

	  _this.websocket.onmessage = function(evnt) {
	    // console.log(evnt.data);
	    
	    _this.getData(JSON.parse(event.data));
	    
	  };

	},
	onclose : function(evnt) {
	  
	  var _this = this;

	  _this.websocket.onclose = function(evnt) {

	    // console.log('WebSocket连接关闭');
    	_this.init();

	  };

	},
	onerror : function(evnt) {
	  
	  var _this = this;

	  _this.websocket.onerror = function(evnt) {
	    // console.log('WebSocket连接发生错误')
	    
    	_this.init();
	  };

	},
	getData : function(data){
		
		for(var i=0,len=data.dataInfo.length;i<len;i++){

			var itemData = data.dataInfo[i],
				id = itemData.id,
				totalNum = itemData.totalNum;

			$('#induced_'+id).text(totalNum);

		}

	}
};

/*********************************************************  加入舞台元素方法 end *********************************************/