var menu=new FlMenu,devId=Public.getUrlItem().devId,devName=Public.getUrlItem().devName,showPicUrl=[],swpierObj=null;function getListData(){var shtml="",allChecked=$("#checkAll").prop("checked"),swiperShtml="";$("#media-list-data").html(""),$(".swiper-wrapper").html(""),$(".noMoreData").hide(),swpierObj&&swpierObj.destroy(!1),Public.ajaxCall({type:"GET",url:PublicUrl.deviceGetPicUrl()+devId,data:{},successCallBack:function(data){if(data.response){var len=data.response.length;0===len&&$(".noMoreData").show(),showPicUrl=[];for(var i=0;i<len;i++){var itemData=data.response[i],itemTime=itemData.time,itemUrl=PublicUrl.ip+PublicUrl.resources+itemData.url,itemName=itemData.name;itemUrl=itemUrl.replace(/\\/g,"/"),showPicUrl.push(itemUrl),materialHtml='<div class="picture" data-index="'+i+'"><img onerror="this.src=\'./../images/default.jpg\'" data-echo="'+itemUrl+'" src="./../images/default.jpg" alt=""></div>',shtml+='<div class="col-50" id="material-'+i+'"><div class="item"><div class="label-checked-box pull-left"><input type="checkbox" '+(allChecked?"checked":"")+' id="check-'+i+'" value="'+itemData.url+'" /><label for="check-'+i+'"></label></div><div class="item-in"><div class="pic">'+materialHtml+'</div><div class="info material-info" data-json=\''+JSON.stringify(itemData)+'\'><div class="name">'+itemName+'</div><div class="row"><div class="col-80"><span class="iconStyle"><i class="iconfont icon-shijian"></i></span><span class="type">'+Public.momentFormat(itemTime,"YYYY-MM-DD HH:mm:ss")+"</span></div></div></div></div></div></div>",swiperShtml+='<div class="swiper-slide"><div class="slide-item" style="background-image: url('+itemUrl+');"></div></div>'}$("#media-list-data").html(shtml),$(".swiper-wrapper").html(""),$(".swiper-wrapper").append(swiperShtml),echo.init({offset:0,throttle:0,container:document.getElementById("content-list"),callback:function(element,op){}}),swpierObj=new Swiper(".swiper-container",{autoplay:!1,autoHeight:!0,pagination:".swiper-pagination",paginationType:"fraction",initialSlide:0,observer:!0,observeParents:!0})}else $(".noMoreData").show()},errorCallBack:function(){}})}$(function(){$.init(),getListData(),$(document).on("click",".confirm-ok",function(){for(var $checkboxList=$("#media-list-data input:checked"),len=$checkboxList.length,checkboxUrl="",i=0;i<len;i++){var val=$($checkboxList[i]).val();checkboxUrl+=val+","}0<len?(checkboxUrl=checkboxUrl.replace(/\,?$/,""),Public.msuiConfirm(locales.promptDelete,function(){Public.ajaxCall({type:"POST",url:PublicUrl.deviceGetPicUrl()+devId,data:{_method:"delete",url:checkboxUrl},successCallBack:function(data){Public.customToast(data.response),setTimeout(function(){getListData()},1e3)}})})):Public.toast(locales.promptChecked)}),$(document).on("click","#pic-refresh",function(){getListData()}),$(document).on("click",".picture",function(){showPicUrl.length;var index=1*$(this).attr("data-index");$(".swiper-wrapper").append(""),$("#preview-view").show().addClass("preview-in"),swpierObj.slideTo(index,1e3,!1)}),$(document).on("click","#preview-close",function(){$("#preview-view").removeClass("preview-in").hide()})});