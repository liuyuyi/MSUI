var Public={languageType:"zh",turnOut:function(code){try{var mobileSystem=Public.isMobile();mobileSystem.weixin?window.location.href="login.html":mobileSystem.ios?ios_onResultCode(code):mobileSystem.android&&Android.onResultCode(code)}catch(e){window.location.href="login.html"}},setCookie:function(key,value,iDay){document.cookie=key+"="+value+";"},getCookie:function(key){for(var cookieArr=document.cookie.split("; "),i=0,len=cookieArr.length;i<len;i++){var arr=cookieArr[i].split("=");if(arr[0]===key)return arr[1]}return!1},clearAllCookie:function(){var keys=document.cookie.match(/[^ =;]+(?=\=)/g);if(keys)for(var i=keys.length;i--;)document.cookie=keys[i]+"=0;expires="+new Date(0).toUTCString()},isMobile:function(){var u=navigator.userAgent;navigator.appVersion;return{ios:!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),android:-1<u.indexOf("Android")||-1<u.indexOf("Adr"),weixin:-1<u.indexOf("MicroMessenger")}},isDefine:function(value){return null!==value&&""!==value&&void 0!==value&&void 0!==value&&0!==value&&""!=(value=(value+="").replace(/\s/g,""))},isArry:function(arr){return 0!==JSON.parse(arr).length},inputClean:function(){$("input").attr("required","required"),setTimeout(function(){$("input[required]").each(function(){$(this).after('<div class="iss-close"><i class="iconfont icon-shanchu"></i></div>')})},300),$("body").on("click",".iss-close",function(e){e.preventDefault(),e.stopPropagation(),$(this).prev("input").val("")})},uniqueArray:function(data){for(var a={},i=0,len=(data=data||[]).length;i<len;i++){var v=data[i];void 0===a[v]&&(a[v]=1)}for(var pop in data.length=0,a)data[data.length]=pop;return data},checkLetNum:function(obj){return obj.value.replace(/[^A-Za-z0-9]/g,"")},checkInputVal:function(val){return val.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,"")},msuiPicker:function(params){$(params.obj).picker({cols:[{textAlign:params.textAlign,values:params.values}]})},msuiConfirm:function(info,okFn){$.confirm(info,okFn)},msuiAlert:function(info){$.alert(info)},toast:function(info){$.toast(info)},customToast:function(info){var $toast=$('<div class="custom-toast">'+info+"</div>");$toast.appendTo(document.body),$toast.show(),setTimeout(function(){$toast.addClass("fade-in")},50),setTimeout(function(){$toast.addClass("fade-out").remove()},800)},popup:function(popup){$.popup(popup)},closeModal:function(popup){$.closeModal(popup)},showMask:function(){var $layout=$(".custom-overlay");$layout.show(),setTimeout(function(){$layout.addClass("fade-in")},50)},hideMask:function(){var $layout=$(".custom-overlay");$layout.addClass("fade-out"),setTimeout(function(){$layout.hide(),$layout.removeClass("fade-out").removeClass("fade-in")},300)},momentFormat:function(time,format){return moment(time).format(format)},momentIsBefor:function(starDate,endDate){return moment(starDate).isBefore(endDate)},momentIsBefore:function(params){return moment(params.starDate).isBefore(params.endDate)},momentIsSame:function(params){return moment(params.starDate).isSame(params.endDate)},datetimePicker:function(params){return $(params.obj).datetimePicker({value:params.value,format:params.format})},calendar:function(obj,params){$(obj).calendar(params)},showPreloader:function(info){$.showPreloader(info)},hidePreloader:function(){$.hidePreloader()},showPageInitLoading:function(){$(".list-init-refresh-layer-wrap").show()},hidePageInitLoading:function(){$(".list-init-refresh-layer-wrap").hide()},ajaxCall:function(params){$.ajax({type:params.type,url:params.url,data:params.data,dataType:"json",beforeSend:function(xhr){xhr.setRequestHeader("Token","sso1122334455xmnds"),xhr.setRequestHeader("UserName","admin")},success:function(data){if(data)if(0<data.code)params.successCallBack(data);else if(-9001===data.code){try{Public.customToast(data.response)}catch(e){Editer_stage.tool.toast(data.response)}setTimeout(function(){Public.turnOut(data.code)},500),params.errorCallBack&&params.errorCallBack(data)}else{try{Public.customToast(data.response)}catch(e){Editer_stage.tool.toast(data.response)}params.errorCallBack&&params.errorCallBack(data)}},error:function(xhr,type){params.errorCallBack&&params.errorCallBack(xhr,type)}})},swiper:function(data,obj,initialSlide){for(var shtml="",i=0,len=data.length;i<len;i++)shtml+='<div class="swiper-slide"><div class="slide-item swiper-lazy" style="background-image: url(./../images/loading.gif);" data-background="'+data[i].currentSrc+'"></div></div>';$(obj).html(""),$(obj).append(shtml),new Swiper(".swiper-container",{autoplay:!1,autoHeight:!1,slidesPerView:"auto",pagination:".swiper-pagination",paginationType:"fraction",initialSlide:initialSlide,observer:!0,observeParents:!0,width:window.innerWidth,height:100,lazyLoading:!0,onInit:function(swiper){$("#preview-view").show().addClass("preview-in"),setTimeout(function(){swiper.slideTo(initialSlide,0,!1)},100)}})},formatFileSize:function(fileSize){return fileSize<1024?fileSize+"B":fileSize<1048576?(fileSize/1024).toFixed(2)+"KB":fileSize<1073741824?(fileSize/1048576).toFixed(2)+"MB":(fileSize/1073741824).toFixed(2)+"GB"},isCommon:function(data){return 2==data?"<font color='red'>私有</font>":1==data?"<font color='green'>公开</font>":void 0},isStatus:function(data){return 2==data?"<font color='green'>已审核</font>":"<font color='red'>未审核</font>"},isTaskStatue:function(data){return 0==data?"<font color='blue'>待处理</font>":1==data?"<font color='orange'>正在处理</font>":2==data?"<font color='green'>处理成功</font>":3==data?"<font color='red'>处理失败</font>":4==data?"<font color='red'>异常</font>":5==data?"<font color='red'>未审核</font>":void 0},isPramStatue:function(value){return 10==value?"设备开屏":40==value?"设备关屏":50==value?"设备重启":80==value?"同步时钟":90==value?"音量调整":100==value||101==value?"亮度调整":110==value?"截屏":120==value?"日志上传":60==value?"系统升级":70==value?"软件升级":140==value?"下发频道":150==value?"下发节目":130==value?"策略设置":20==value?"设备待机":180==value?"开启播放":190==value?"紧急停播":121==value?"日志下载":160==value?"插播节目":170==value?"插播字幕":30==value?"设备开机":135==value?"围栏任务":125==value?"删除频道":126==value?"删除节目":127==value?"更新设备节目信息":128==value?"删除围栏":129==value?"更新设备围栏信息":65==value?"Model升级":400==value?"清理缓存":210==value?"设置板卡参数":230==value?"固件升级":240==value?"更新配置文件":260==value?"GPS开关":801==value?"输入源切换":804==value?"局部全屏":810==value?"亮度":802==value?"画面冻结":803==value?"黑屏":814==value?"PIP（画中画）":845==value?"场景":277==value?"信号源回显":265==value?"节目点播":266==value?"节目停播":280==value?"日志开关":285==value?"音频开关":829==value?"播放模式":255==value?"频道点播":288==value?"语言切换":289==value?"亮度管理":290==value?"电源管理":291==value?"GPS同步播放":292==value?"设备同步":void 0},isPramStatueName:function(value){return"设备开屏"==value?10:"设备关屏"==value?40:"设备重启"==value?50:"同步时钟"==value?80:"音量调整"==value?90:"亮度调整"==value?100:"截屏"==value?110:"日志上传"==value?120:"系统升级"==value?60:"软件升级"==value?70:"下发频道"==value?140:"下发节目"==value?150:"策略设置"==value?130:"设备待机"==value?20:"开启播放"==value?180:"紧急停播"==value?190:"日志下载"==value?121:"插播节目"==value?160:"插播字幕"==value?170:"设备开机"==value?30:"围栏任务"==value?135:"删除频道"==value?125:"删除节目"==value?126:"更新设备节目信息"==value?127:"删除围栏"==value?128:"更新设备围栏信息"==value?129:"Model升级"==value?65:"清理缓存"==value?400:"设置板卡参数"==value?210:"固件升级"==value?230:"更新配置文件"==value?240:"GPS开关"==value?260:"输入源切换"==value?801:"局部全屏"==value?804:"亮度"==value?810:"画面冻结"==value?802:"黑屏"==value?803:"PIP（画中画）"==value?814:"场景"==value?845:"信号源回显"==value?277:"节目点播"==value?265:"节目停播"==value?266:"日志开关"==value?280:"音频开关"==value?285:"播放模式"==value?829:"频道点播"==value?255:"语言切换"==value?288:"亮度管理"==value?289:"电源管理"==value?290:"GPS同步播放"==value?291:"设备同步"==value?292:void 0},mvalidate:function(params){params=$.extend({},{obj:"#form",validCall:function(event,options){},invalidCall:function(event,status,options){},eachFieldCall:function(event,status,options){},eachValidFieldCall:function(val){},conditional:{}},params),$(params.obj).mvalidate({type:1,onKeyup:!1,sendForm:!1,firstInvalidFocus:!0,valid:function(event,options){params.validCall(event,options),event.preventDefault()},invalid:function(event,status,options){params.invalidCall(event,options)},eachField:params.eachField,eachValidField:function(val){params.eachValidFieldCall(val)},eachInvalidField:function(event,status,options){params.eachFieldCall(event,status,options)},conditional:params.conditional,descriptions:params.descriptions})},leaveLine:function(time){var m=(new Date).getTime();if(m<time)return 0;var n=(m-time)/6e4;return 0<=n&&n<=5?0:n<=30&&5<n?1:30<n&&n<=60?2:60<n?3:void 0},leaveLineStyle:function(state){var classStyle="";return 0===state?classStyle="online":1===state?classStyle="offline":2===state?classStyle="abnormal":3===state&&(classStyle="unknow"),classStyle},leaveLineName:function(state){var stateName="",className="";return 0===state?(stateName="联网",className="onlineColor"):1===state?(stateName="脱机",className="offlineColoe"):2===state?(stateName="异常",className="fontRed"):3===state&&(stateName="未知",className="unknowColor"),'<span class="'+className+'">'+stateName+"</span>"},dhtmlxTreeGroupAjax:function(tree,id){id=0===id?0:id,Public.ajaxCall({type:"GET",url:PublicUrl.ip+PublicUrl.api+PublicUrl.version+"group/listWithoutDevice",data:{parentId:id},successCallBack:function(data){if(0<data.code){var dataLen=data.response.length;if(0==dataLen)return void tree.insertNewItem(id,-1,"暂无更多记录","",0,0,0,0);tree.deleteChildItems(id);for(var i=0;i<dataLen;i++){var itemData=data.response[i],itemId=itemData.id,isParent=itemData.isParent,name=itemData.name;tree.insertNewItem(id,itemId,name,"","folderClosed.gif","folderOpen.gif","folderClosed.gif",0),tree.setUserData(itemId,"isParent",isParent)}}}})},dhtmlxTreeGroup:function(){var tree=new dhtmlXTreeObject("eq-tree","100%","100%",0);return tree.setImagePath("./../images/treeimgs/"),tree.enableDragAndDrop(0),tree.enableCheckBoxes(1),tree.enableTreeLines(!0),tree.enableThreeStateCheckboxes(!0),Public.dhtmlxTreeGroupAjax(tree,0),tree.setOnClickHandler(function(id){id<0||0===tree.getOpenState(id)&&Public.dhtmlxTreeGroupAjax(tree,id)}),tree},dhtmlxTreeGroupNoCheck:function(checkedCall){var tree=new dhtmlXTreeObject("eq-tree","100%","100%",0);return tree.setImagePath("./../images/treeimgs/"),tree.enableDragAndDrop(0),tree.enableCheckBoxes(0),tree.enableTreeLines(!0),tree.enableThreeStateCheckboxes(!0),Public.dhtmlxTreeGroupAjax(tree,0),tree.setOnClickHandler(function(id){id<0||0===tree.getOpenState(id)&&(checkedCall(),Public.dhtmlxTreeGroupAjax(tree,id))}),tree},dhtmlxTreeEqGroupAjax:function(tree,id){id=0===id?0:id,Public.ajaxCall({type:"GET",url:PublicUrl.ip+PublicUrl.api+PublicUrl.version+"group/list",data:{parentId:id},successCallBack:function(data){if(0<data.code){var dataLen=data.response.length;if(0==dataLen)return void Public.toast("加载成功，暂无数据！");tree.deleteChildItems(id);for(var i=0;i<dataLen;i++){var itemData=data.response[i],showImg="",itemId=itemData.id,isParent=itemData.isParent,name=itemData.name,aliveTime=itemData.aliveTime;if(isParent)tree.insertNewChild(id,itemId,name,"","folderClosed.gif","folderOpen.gif","folderClosed.gif",""),tree.setUserData(itemId,"isParent",isParent);else{var state=Public.leaveLine(aliveTime);0===state?showImg="on.gif":1===state?showImg="no.gif":2===state?showImg="abnormal.gif":3===state&&(showImg="un.gif"),tree.insertNewChild(id,itemId,name,"",showImg,0,0,0),tree.setUserData(itemId,"isParent",isParent)}}}}})},dhtmlxTreeEqGroup:function(){var tree=new dhtmlXTreeObject("map-tree","100%","100%",0);return tree.setImagePath("./../images/treeimgs/"),tree.enableDragAndDrop(0),tree.enableCheckBoxes(1),tree.enableTreeLines(!0),tree.enableThreeStateCheckboxes(!0),Public.dhtmlxTreeEqGroupAjax(tree,0),tree.setOnClickHandler(function(id){0===tree.getOpenState(id)&&Public.dhtmlxTreeEqGroupAjax(tree,id)}),tree},getUrlItem:function(urls){urls||(urls=window.location.href);for(var args={},items=urls.substring(urls.indexOf("?")+1,urls.length).split("&"),name=null,value=null,item=null,i=0,len=items.length;i<len;i++)item=items[i].split("="),name=decodeURIComponent(item[0]),value=decodeURIComponent(item[1]),args[name]=value;return args},loadJs:function(url,callback){var script=document.createElement("script");script.type="text/javascript",void 0!==callback&&(script.readyState?script.onreadystatechange=function(){"loaded"!=script.readyState&&"complete"!=script.readyState||(script.onreadystatechange=null,callback())}:script.onload=function(){callback()}),script.src=url,document.body.appendChild(script)},removeJs:function(filename,filetype){for(var targetelement="js"==filetype?"script":"css"==filetype?"link":"none",targetattr="js"==filetype?"src":"css"==filetype?"href":"none",allsuspects=document.getElementsByTagName(targetelement),i=allsuspects.length;0<=i;i--)allsuspects[i]&&null!=allsuspects[i].getAttribute(targetattr)&&-1!=allsuspects[i].getAttribute(targetattr).indexOf(filename)&&allsuspects[i].parentNode.removeChild(allsuspects[i])},getEqImage:function(type){var typeUrl="";switch(type){case"X3":case"X3C":typeUrl="x3.jpg";break;case"Q5":case"Q5C":case"Q5S":typeUrl="q5.jpg";break;case"X3M":case"X3T":case"X3M-Z1":case"X3T-Z1":typeUrl="x3m.jpg";break;case"VP1000U":case"VP-U":typeUrl="vp1000u.jpg";break;case"H2":typeUrl="h2.jpg";break;default:typeUrl="defaultEq.jpg"}return typeUrl},isEqType:function(type){return"null"!==type?type:"未知"}},PublicUrl={ip:"http://116.62.172.55:8080/",api:"ListenHtmlApi/",version:"v1/",resources:"resources/",material:"material",upload:"upload",audit:"audit",program:"program",programList:"Program",list:"list",capList:"List",info:"info",device:"Device",task:"Task",loginUrl:function(){return this.ip+this.api+"loginIn"},publicHeadUrl:function(params){return this.ip+this.api+this.version},materialResourceUrl:function(){return this.ip+this.resources},taskInfoUrl:function(){return this.publicHeadUrl()+"Task/info"},taskListUrl:function(){return this.publicHeadUrl()+"Task/List"},taskNumberUrl:function(){return this.publicHeadUrl()+"Task/number"},taskForEqUrl:function(){return this.publicHeadUrl()+"Device/task/"},materialDeleteUrl:function(){return this.publicHeadUrl()+"material/"},materialInfoUrl:function(){return this.publicHeadUrl()+"material/info"},materialListUrl:function(){return this.publicHeadUrl()+"material/list/"},materialUploadUrl:function(){return this.publicHeadUrl()+"material/upload/"},auditMaterialUrl:function(){return this.publicHeadUrl()+"audit/material"},auditStateMaterialUrl:function(){return this.publicHeadUrl()+"audit/material"},programContUrl:function(){return this.publicHeadUrl()+"Program/"},programContInfoUrl:function(){return this.publicHeadUrl()+"Program/info"},programContListUrl:function(){return this.publicHeadUrl()+"Program/Page"},programContPageUrl:function(){return this.publicHeadUrl()+"Program/Page/"},programListUrl:function(){return this.publicHeadUrl()+"Program/list"},programSendUrl:function(){return this.publicHeadUrl()+"sendPlay/"},auditMaterialUrl:function(){return this.publicHeadUrl()+"audit/material"},auditMaterialStateUrl:function(){return this.publicHeadUrl()+"audit/material/"},auditOneMaterialUrl:function(){return this.publicHeadUrl()+"audit/Material"},auditProgramUrl:function(){return this.publicHeadUrl()+"audit/program"},auditProgramStateUrl:function(){return this.publicHeadUrl()+"audit/program/"},auditProgramInfoUrl:function(){return this.publicHeadUrl()+"audit/Program/"},deviceOneUrl:function(){return this.publicHeadUrl()+"Device/"},deviceInfoUrl:function(){return this.publicHeadUrl()+"Device/info"},deviceListUrl:function(){return this.publicHeadUrl()+"Device/list"},deviceTaskUrl:function(){return this.publicHeadUrl()+"Device/task/"},deviceGetPicUrl:function(){return this.publicHeadUrl()+"Device/detail/pic/"},deviceGroupUrl:function(){return this.publicHeadUrl()+"group/"},deviceGroupListUrl:function(){return this.publicHeadUrl()+"group/list"},deviceWidthOutListUrl:function(){return this.publicHeadUrl()+"group/listWithoutDevice"},deviceListWithRecallUrl:function(){return this.publicHeadUrl()+"group/listWithRecall"},deviceListWithRemoveUrl:function(){return this.publicHeadUrl()+"group/listWithRemove"},sendPlayTaskUrl:function(){return this.publicHeadUrl()+"sendPlay/Task/"},findAllTaskUrl:function(){return this.publicHeadUrl()+"sendPlay/findAllTask"},singleAreadyUrl:function(){return this.publicHeadUrl()+"Device/detail"},imgSrc:function(){return"./../images/"}},PublicDataHtml={getMediaHtml:function(data,allChecked){var itemData=data,materialContentType=itemData.materialContentType,materialRelativePath=(itemData.materialTypeName,itemData.materialRelativePath),materialStorageName=itemData.materialStorageName,materialOriginalName=itemData.materialOriginalName,materialAuditStatus=itemData.materialAuditStatus,materialSize=(itemData.createBy,itemData.createDate,itemData.materialLabel,Public.formatFileSize(itemData.materialSize)),materialId=(itemData.materialTypeId,itemData.materialId),materialHtml="",icon="",materialUrl=PublicUrl.ip+PublicUrl.resources+materialRelativePath+materialStorageName;return materialContentType.match("image.*")?(materialHtml='<div class="picture" data-url="'+materialUrl+'"><img onerror="this.src=\'./../images/default.jpg\'" data-echo="'+materialUrl+'" src="./../images/default.jpg" alt=""></div>',icon='<i class="iconfont icon-tupian"></i>'):materialContentType.match("video.*")?(materialHtml='<div class="video" data-src="'+materialUrl+'"><i class="iconfont icon-qidong"></i></div>',icon='<i class="iconfont icon-shipin"></i>'):(materialContentType="other",materialHtml='<div class="picture" data-url="'+materialUrl+'"><img onerror="this.src=\'./../images/default.jpg\'" data-echo="'+materialUrl+'" src="./../images/default.jpg" alt=""></div>',icon='<i class="iconfont icon-tags2"></i>'),'<div class="col-50" id="material-'+materialId+'"><div class="item"><div class="label-checked-box pull-left"><input type="checkbox" '+(allChecked?"checked":"")+' id="check-'+materialId+'" value="'+materialId+'" /><label for="check-'+materialId+'"></label></div><div class="item-in"><div class="pic"><div class="state">'+Public.isStatus(materialAuditStatus)+"</div>"+materialHtml+' </div><div class="info material-info" data-json=\''+JSON.stringify(itemData)+'\'><div class="name">'+materialOriginalName+'</div><div class="row"><div class="col-80"><span class="iconStyle">'+icon+'</span><span class="type">'+materialContentType+'</span></div></div><div class="row"><div class="col-80"><span class="iconStyle"><i class="iconfont icon-duochicun"></i></span><span class="size" id="size-'+materialId+'">'+materialSize+"</span></div></div></div></div></div></div>"}};function FlMenu(params){this.obj=".float-menu",this.initPagX=0,this.initPagY=0,this.initTop=0,this.initLeft=0,this.innerHeight=0,this.innerWidth=0,this.menuWidth=0,this.menuHeight=0}function MobileListData(params){this.pageNum=1,this.pageSize=8,this.request=!1,this.initData=!0,this.initVideoArr=[],this.noMoreDataText="暂无更多记录",this.defaults={listObj:null,getListHtml:null,url:"",data:{},noMoreDataObj:".noMoreData",dataSuccessCall:function(){}},this.options=$.extend({},this.defaults,params)}FlMenu.prototype.init=function(){this.mouseDown(),this.mouseMove(),this.mouseUp(),this.onclick(),this.innerHeight=$(window).height(),this.innerWidth=$(window).width(),this.menuWidth=$(this.obj).width(),this.menuHeight=$(this.obj).height()},FlMenu.prototype.onclick=function(){$(document).on("click",".float-menu-icon",function(e){var $this=$(this);"closed"===$this.attr("data-flm")?$this.attr("data-flm","open"):$this.attr("data-flm","closed")})},FlMenu.prototype.mouseDown=function(){var _this=this;$(document).on("touchstart",_this.obj,function(e){var _targetTouches=e.targetTouches[0],_position=$(_this.obj).position();_this.initTop=_position.top,_this.initLeft=_position.left,_this.initPagX=_targetTouches.pageX,_this.initPagY=_targetTouches.pageY})},FlMenu.prototype.mouseMove=function(){var _this=this;$(document).on("touchmove",_this.obj,function(e){var _targetTouches=e.targetTouches[0],nowLeft=_this.initLeft+(_targetTouches.pageX-_this.initPagX),nowTop=_this.initTop+(_targetTouches.pageY-_this.initPagY);nowLeft+_this.menuWidth>_this.innerWidth?nowLeft=_this.innerWidth-_this.menuWidth:nowLeft<0&&(nowLeft=0),nowTop+_this.menuHeight>_this.innerHeight?nowTop=_this.innerHeight-_this.menuHeight:nowTop<0&&(nowTop=0),$(_this.obj).css({left:nowLeft,top:nowTop})})},FlMenu.prototype.mouseUp=function(){$(document).on("touchend",this.obj,function(e){$(this).off("touchstart","touchmove")})},MobileListData.prototype.init=function(){$(this.options.listObj).empty(),this.pageNum=1,this.getData(),this.refresh(),this.infinite(),this.addNoDataBlock()},MobileListData.prototype.getData=function(){var self=this,dataParam={pageNo:self.pageNum,pageSize:self.pageSize};self.request=!0,dataParam=$.extend({},self.options.data,dataParam),$(self.options.noMoreDataObj).hide(),Public.ajaxCall({type:"GET",url:self.options.url,data:dataParam,successCallBack:function(data){if(Public.hidePreloader(),0<data.code)if(self.initData&&($(self.options.listObj).empty(),$.pullToRefreshDone(".pull-to-refresh-content")),"{}"!==data.response&&void 0!==data.response&&data.response.list)if(0<data.response.list.length){data.response.lastPage===self.pageNum&&($.detachInfiniteScroll($(".infinite-scroll")),$(self.options.noMoreDataObj).show(),$(".infinite-scroll-preloader").hide());var shtml=self.options.getListHtml(data.response.list);$(self.options.listObj).append(shtml),Public.customToast("加载成功！"),self.request=!1,$.refreshScroller()}else self.options.dataSuccessCall(data),Public.customToast("加载成功！"),self.noData();else self.options.dataSuccessCall(data),Public.customToast("加载成功！"),self.noData();else self.noData();self.options.dataSuccessCall(data)},errorCallBack:function(data){Public.hidePreloader(),self.noData()}})},MobileListData.prototype.refresh=function(){var self=this;$(document).on("refresh",".pull-to-refresh-content",function(e){$(".infinite-scroll-preloader").hide(),self.request||(self.pageNum=1,self.initData=!0,$(self.options.noMoreDataObj).hide(),self.init())})},MobileListData.prototype.infinite=function(){var self=this;$.initInfiniteScroll($(".infinite-scroll")),$(document).on("infinite",".infinite-scroll-bottom",function(e){self.request||($(".infinite-scroll-preloader").show(),self.pageNum++,self.initData=!1,self.getData())})},MobileListData.prototype.addNoDataBlock=function(){$(this.options.noMoreDataObj).text(this.noMoreDataText)},MobileListData.prototype.search=function(params){this.options.data=params,this.init()},MobileListData.prototype.noData=function(){this.request=!1,$.pullToRefreshDone(".pull-to-refresh-content"),$.detachInfiniteScroll($(".infinite-scroll")),$(this.options.noMoreDataObj).show(),$(".infinite-scroll-preloader").hide(),Public.hidePreloader()},$(function(){$(".iss-close").on("click",function(e){$(this).prev("input").val("")}),$(document).on("click",".checkAll",function(){var listId=$(this).attr("data-list"),$checkboxList=$("#"+listId+" input[type=checkbox]");$(this).prop("checked")?$checkboxList.prop("checked",!0):$checkboxList.prop("checked",!1)}),$(document).on("click","#login-out",function(){try{var mobileSystem=Public.isMobile();mobileSystem.weixin?(Public.clearAllCookie(),window.location.href="login.html"):mobileSystem.ios?ios_logout():mobileSystem.android&&Android.logout()}catch(e){Public.clearAllCookie(),window.location.href="login.html"}})}),function($){var Slider=function(ele,opt){this.ele=ele,this.defaults={initVal:0,range:".range",bar:".range-bar",progress:".range-progress",text:"#range-value",initBarX:0,initBarL:0,initRangL:0,isMove:!1,changeVal:function(data){}},this.options=$.extend({},this.defaults,opt)};Slider.prototype={constructor:Slider,init:function(){var $ele=this.ele,rangeWidth=$ele[0].offsetWidth,options=this.options,barWidth=$ele.find(options.bar)[0].offsetWidth;options.maxRang=rangeWidth-barWidth,options.barWidth=barWidth,this.mouserDown(),this.mouserMove(),this.mouserUp(),console.log(options.initVal),this.setInitRang(options.initVal)},mouserDown:function(){var options=this.options;$(this.ele).off("touchstart").on("touchstart",function(e){if("range-bar"===e.target.className){var val=e.touches[0].pageX,valL=$(e.target).position().left;options.initBarX=val,options.initBarL=valL,options.isMove=!0}})},mouserMove:function(){var self=this,options=self.options;$(self.ele).off("touchmove").on("touchmove",function(e){if(options.isMove){var movePageX=e.touches[0].pageX;self.ele[0].offsetLeft;self.setRang(options.initBarL-(options.initBarX-movePageX))}})},mouserUp:function(){var options=this.options;$(this.ele).off("touchend").on("touchend",function(event){options.isMove=!1})},setRang:function(value){var options=this.options,maxRang=options.maxRang;value<=0&&(value=0),maxRang<=value&&(value=maxRang),this.ele.find(options.bar)[0].style.left=value+"px",this.ele.find(options.progress)[0].style.width=value+options.barWidth/2+"px",$(options.text).val(Math.ceil(value/maxRang*100)),options.changeVal(Math.ceil(value/maxRang*100))},setInitRang:function(val){var maxRang=this.options.maxRang;this.setRang(Math.floor(maxRang*(val/100)))}},$.fn.customSlider=function(options){return this.each(function(){var $this=$(this);new Slider($this,options).init()})}}(Zepto);