!function($){var MobileFileUpload=function(ele,opt){this.ele=ele,this.defaults={showThumb:!0,thumbContainer:".file-thumb-list",filestack:[],formdata:{},acceptType:"image",maxFileCount:10,url:""},this.options=$.extend({},this.defaults,opt)};MobileFileUpload.prototype={constructor:MobileFileUpload,init:function(){this.clearView(),this.clearStack(),this.listenChage(),this.bindHandle(),this.setAcceptType()},setAcceptType:function(){var acceptType=this.options.acceptType,type="";"picture"===acceptType?type="image/*":"video"===acceptType&&(type="video/*"),$(this.ele).attr("accept",type)},listenChage:function(){var self=this;self.ele.off().on("change",function(){var files=this.files,filestackLen=self.filestack.length,maxFileCount=self.options.maxFileCount,noTypeNum=0,fileType=self.options.acceptType;if(maxFileCount<filestackLen)Public.toast("超出最大限度"+maxFileCount+"个");else{for(var i=0,len=files.length;i<len;i++)self.checkFileType(files[i])||noTypeNum++;if("picture"===fileType&&0<noTypeNum)Public.toast("图片仅支持gif、png、jpg、jpeg格式");else if("video"===fileType&&0<noTypeNum)Public.toast("视频仅支持ogg、mp4、webm、avi、mov、rmvb、wmv、vob、asf、flv格式");else{for(var e=0,eLen=(files=self.screenChoice(files)).length;e<eLen;e++){var file=files[e],type=self.fileType(file.type),fileIndex=(new Date).getTime();if(self.addToStack(file,fileIndex),"image"===type)self.fileReader(file,type,fileIndex);else if("video"===type){var url=self.getObjectURL(file);self.previewImage(url,type,fileIndex)}}$(self.ele).val("")}}})},checkFileSize:function(size){},screenChoice:function(files){for(var len=this.filestack.length,newFiles=[],e=0,eLen=files.length;e<eLen;e++){var filesItem=files[e],hasItem=0;if(0<len){for(var i=0;i<len;i++){var filestackItem=this.filestack[i].file;filesItem.name===filestackItem.name&&filesItem.size===filestackItem.size&&filesItem.lastModified===filestackItem.lastModified&&hasItem++}0===hasItem&&newFiles.push(filesItem)}else newFiles.push(filesItem)}return newFiles},checkFileType:function(file){var fileType=this.options.acceptType;return"picture"===fileType?file.name.match(/\.(gif|png|jpe?g)$/i):"video"===fileType?file.name.match(/\.(ogg|mp4|webm|avi|mov|rmvb|wmv|vob|asf|flv)$/i):void 0},getObjectURL:function(file){var url=null;return null!=window.createObjectURL?url=window.createObjectURL(file):null!=window.URL?url=window.URL.createObjectURL(file):null!=window.webkitURL&&(url=window.webkitURL.createObjectURL(file)),url},fileType:function(name){return name.match("image.*")?"image":name.match("video.*")?"video":void 0},fileReader:function(file,type,fileIndex){var self=this,reader=new FileReader;"image"===type?reader.readAsArrayBuffer(file):reader.readAsDataURL(file),reader.onloadstart=function(e){},reader.onerror=function(e){},reader.onload=function(e){self.previewImage(e,type,fileIndex)},reader.onprogress=function(e){}},previewImage:function(file,type,fileIndex){var shtml='<div class="item pull-left" data-fileindex="'+fileIndex+'"><div class="delete"><i class="iconfont icon-shanchu"></i></div >';if("image"===type){var blob=new Blob([file.target.result]);shtml+='<div class="img-item" data-fileindex="'+fileIndex+'"><img src="'+(URL||webkitURL).createObjectURL(blob)+'" alt=""></div>'}else"video"===type&&(shtml+='<div class="video-item" data-fileindex="'+fileIndex+'" data-url="'+file+'"><i class="iconfont icon-qidong"></i></div>');shtml+="</div>",$(".file-input").after(shtml)},clearView:function(params){$(".file-input").prevAll().remove()},clearStack:function(params){this.filestack=[]},removeStack:function(index){for(var filestack=this.filestack,len=filestack.length,name="file-"+index,removeNum=-1,i=0;i<len;i++)filestack[i].name===name&&(removeNum=i);-1!==removeNum&&this.filestack.splice(removeNum,1)},addToStack:function(file,fileIndex){var fileObj={};fileObj.name="file-"+fileIndex,fileObj.file=file,this.filestack.push(fileObj)},judgeFile:function(){if(0===this.filestack.length)return Public.toast("您暂未选择素材！"),!0},uploadFile:function(params){for(var self=this,formdata=new FormData,filestackLen=self.filestack.length,i=0;i<filestackLen;i++)formdata.append("fileData",self.filestack[i].file,self.filestack[i].file.name);for(var prop in params)formdata.append(prop,params[prop]);$.ajax({type:"POST",url:self.options.url,data:formdata,dataType:"json",contentType:!1,processData:!1,beforeSend:function(xhr){xhr.setRequestHeader("token",Public.getCookie("token")),xhr.setRequestHeader("username",Public.getCookie("username")),$("#preview-loading").addClass("preview-in"),xhr.upload.onprogress=function(evt){if(evt.lengthComputable){var percentComplete=Math.round(100*evt.loaded/evt.total);percentComplete=percentComplete.toString(),$(".progress-bar").css("width",percentComplete+"%"),$("#progress-percent").text(percentComplete)}}},success:function(data){-1010!==data.code||-9999===data.code?(Public.toast(data.response),self.hideLoadingView(),self.clearStack(),$(".file-thumb-list .item").remove()):-9001===data.code?(Public.toast(data.response),setTimeout(function(){Public.turnOut(data.code)},500)):(self.hideLoadingView(),Public.toast("上传失败，请稍后再试！"))},error:function(xhr,type){self.hideLoadingView(),Public.toast("上传失败，请稍后再试！")}})},bindHandle:function(){var self=this;$(document).off("click",".file-thumb-list .delete").on("click",".file-thumb-list .delete",function(){var $item=$(this).parent(".item"),fileIndex=$item.attr("data-fileindex");self.removeStack(fileIndex),$item.remove()}),$(document).off("click",".file-thumb-list .img-item").on("click",".file-thumb-list .img-item",function(){var $this=$(this);$this.parents(".file-thumb-list").find("img"),$this.parents(".item").index();$("#show-image").html("").append('<img style="object-fit: contain;" src="'+$(this).find("img").attr("src")+'"/>'),$("#preview-view").show().addClass("preview-in")}),$(document).off("click",".file-thumb-list .video-item").on("click",".file-thumb-list .video-item",function(){var $this=$(this);$this.parents(".file-thumb-list").find("img"),$this.index();$("#preview-video").addClass("preview-in"),$("#video-player video").attr("src",$(this).attr("data-url"))}),$(document).off("click",".upload-btn").on("click",".upload-btn",function(){var params={},lable=$("#media-lable").val(),isCommon=$("input[name=style]:checked").val(),remarks=$("#media-remarks").val();if(!self.judgeFile()){if(""===lable)return Public.popup(".popup-lable"),void Public.toast("请输入素材标签,再上传！");params.isCommon=isCommon,params.label=lable,params.remarks=remarks,self.uploadFile(params)}})},hideLoadingView:function(){$("#preview-loading").removeClass("preview-in")}},$.fn.fileUpload=function(options){this.each(function(){var $this=$(this),mobileFileUpload=new MobileFileUpload($this,options);return mobileFileUpload.init(),mobileFileUpload})}}(Zepto);