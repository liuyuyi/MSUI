;(function ($) {

    var MobileFileUpload = function (ele, opt) {
        this.ele = ele;
        this.defaults = {
            showThumb: true,                                  // 是否显示缩略图
            thumbContainer: '.file-thumb-list',                    // 缩略图容器
            filestack: [],                            //  选择的文件
            formdata: {},
            acceptType: 'image',                       // video
            maxFileCount: 10,                       // 最大长度
            url: ''                       // 最大长度
        }
        this.options = $.extend({}, this.defaults, opt)
    }
    
    MobileFileUpload.prototype = {
        constructor: MobileFileUpload,
        // 初始化
        init: function () {

            var self = this;

            self.clearView();
            self.clearStack();
            self.listenChage();
            self.bindHandle();
            self.setAcceptType();

        },
        // 初始化acceptType
        setAcceptType: function () {
            
            var self = this,
                acceptType = self.options.acceptType,
                type = '';

            if (acceptType === 'picture'){

                type = 'image/*';

            } else if (acceptType === 'video'){

                type = 'video/*';

            }

            $(self.ele).attr('accept', type);

        },
        // 监听读取文件
        listenChage: function () {
            
            var self = this;

            self.ele.off().on('change', function () {

                var files = this.files,
                    filestackLen = self.filestack.length,
                    maxFileCount = self.options.maxFileCount,
                    noTypeNum = 0,
                    fileType = self.options.acceptType;

                if (maxFileCount < filestackLen){

                    Public.toast('超出最大限度' + maxFileCount + '个');

                    return;

                };
                
                for (var i = 0, len = files.length; i < len;i++){

                    if (!self.checkFileType(files[i])){

                        noTypeNum++;

                    }

                }
                
                if (fileType === 'picture' && noTypeNum > 0){

                    Public.toast('图片仅支持gif、png、jpg、jpeg格式');
                    return;

                } else if (fileType === 'video' && noTypeNum > 0){

                    Public.toast('视频仅支持ogg、mp4、webm、avi、mov、rmvb、wmv、vob、asf、flv格式');
                    return;
                }

                files = self.screenChoice(files);

                for (var e = 0, eLen = files.length;e<eLen;e++){

                    var file = files[e],
                        type = self.fileType(file.type),
                        fileIndex = new Date().getTime();

                    // if (eLen !== 0) {
                    //     fileIndex = eLen;
                    // }
                    
                    self.addToStack(file, fileIndex);

                    if (type === 'image') {

                        // self.checkFileSize(file.size);
                        self.fileReader(file, type, fileIndex);

                    } else if (type === 'video') {

                        var url = self.getObjectURL(file);

                        self.previewImage(url, type, fileIndex);

                    }

                }

                $(self.ele).val('');

            });

        },
        checkFileSize: function (size) {
            
        },
        // 筛选选择文件
        screenChoice: function (files) {
            
            var self = this,
                len = self.filestack.length,
                newFiles = [];

            for (var e = 0, eLen = files.length;e<eLen;e++){
                
                var filesItem = files[e],
                    hasItem = 0;

                if (len > 0){

                    for (var i = 0; i < len; i++) {

                        var filestackItem = self.filestack[i].file;

                        if (filesItem.name === filestackItem.name && filesItem.size === filestackItem.size && filesItem.lastModified === filestackItem.lastModified){
                           
                            hasItem++;
                        }

                    }

                    if (hasItem === 0) newFiles.push(filesItem);

                }else{

                    newFiles.push(filesItem);

                }

            }

            return newFiles;

        },
        // 判断文件格式是否在范围内
        checkFileType: function (file) {

            var self = this,
                fileType = self.options.acceptType;

            if (fileType === 'picture'){
                return file.name.match(/\.(gif|png|jpe?g)$/i);
            } else if (fileType === 'video'){
                return file.name.match(/\.(ogg|mp4|webm|avi|mov|rmvb|wmv|vob|asf|flv)$/i);
            }

        },
        getObjectURL: function (file) {
            var url = null;
            if (window.createObjectURL != undefined) { // basic
                url = window.createObjectURL(file);
            } else if (window.URL != undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file);
            } else if (window.webkitURL != undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file);
            }
            return url;
        },
        fileType: function (name) {

            if (name.match('image.*')){

                return 'image';

            } else if (name.match('video.*')){

                return 'video';

            }
            
        },
        fileReader: function (file, type, fileIndex) {

            var self = this,
                reader = new FileReader();

            if (type === 'image'){
                reader.readAsArrayBuffer(file);
            }else {
                reader.readAsDataURL(file);
            }
            
            reader.onloadstart = function (e) {
                // console.log(e)
            };
            reader.onerror = function (e) {
                // e.target.value = '';
            };

            reader.onload = function (e) {
                self.previewImage(e, type, fileIndex);
                // e.target.value = '';

            };
           
            reader.onprogress = function (e){   
                // e.target.value = '';
            };

            // reader.onloadend = function (e) {
            // }

        },
        // 显示小图
        previewImage: function (file, type, fileIndex) {

            var self = this,
                shtml = '<div class="item pull-left" data-fileindex="' + fileIndex +'"><div class="delete"><i class="iconfont icon-shanchu"></i></div >';
           
            if(type === 'image'){

                var blob = new Blob([file.target.result]),
                    fileSrc = (URL || webkitURL).createObjectURL(blob);

                shtml += '<div class="img-item" data-fileindex="' + fileIndex + '"><img src="' + fileSrc + '" alt=""></div>';

            } else if (type === 'video'){
               
                shtml += '<div class="video-item" data-fileindex="' + fileIndex + '" data-url="' + file + '"><i class="iconfont icon-qidong"></i></div>';

            }

            shtml += '</div>';
            // (URL || webkitURL).revokeObjectURL();
            $('.file-input').after(shtml);

        },
        clearView: function (params) {

            var self = this;

            $('.file-input').prevAll().remove();

        },
        // 清空文件
        clearStack: function (params) {

            var self = this;

            self.filestack = [];

        },
        removeStack: function (index) {

            var self = this,
                filestack = self.filestack,
                len = filestack.length,
                name = 'file-' + index,
                removeNum = -1;

            for(var i=0;i<len;i++){

                if (filestack[i].name === name){

                    removeNum = i;

                }

            }

            if (removeNum !== -1) self.filestack.splice(removeNum, 1);
            
        },
        // 选择文件加入存储
        addToStack: function (file, fileIndex) {

            var self = this,
                fileObj = {};

            fileObj['name'] = 'file-' + fileIndex;
            fileObj['file'] = file;

            self.filestack.push(fileObj);

        },
        judgeFile: function () {

            var self = this,
                filestackLen = self.filestack.length;

            if (filestackLen === 0) {

                Public.toast('您暂未选择素材！');

                return true;

            }

        },
        // 上传提交
        uploadFile: function (params) {

            var self = this,
                formdata = new FormData(),
                filestackLen = self.filestack.length;
           
            for (var i = 0; i < filestackLen;i++){

                formdata.append('fileData', self.filestack[i].file, self.filestack[i].file.name);
                
            }

            for (var prop in params){

                formdata.append(prop, params[prop]);

            }
           
            $.ajax({
                type: 'POST',
                url: self.options.url,
                data: formdata,
                dataType: 'json',
                contentType: false,
                processData: false,
                beforeSend: function (xhr) {

                    // xhr.setRequestHeader("Token", "sso1122334455xmnds");
                    // xhr.setRequestHeader("UserName", "admin");
                    xhr.setRequestHeader("token", Public.getCookie('token'));
                    xhr.setRequestHeader("username", Public.getCookie('username'));
                    
                    $('#preview-loading').addClass('preview-in');
                    xhr.upload.onprogress = function (evt) {
                        
                        if (evt.lengthComputable) {

                            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                            percentComplete = percentComplete.toString();

                            $('.progress-bar').css('width', percentComplete + '%');
                            $('#progress-percent').text(percentComplete);

                        }

                    };

                },
                success: function (data) {
                    
                    if (data.code !== -1010 || data.code === -9999){

                        Public.toast(data.response);
                        self.hideLoadingView();
                        self.clearStack();
                        $('.file-thumb-list .item').remove();
                        
                    } else if (data.code === -9001) {

                        Public.toast(data.response);

                        setTimeout(function () {

                            Public.turnOut(data.code);

                        }, 500);
                        
                    } else {

                        self.hideLoadingView();
                        Public.toast('上传失败，请稍后再试！');

                    }

                },
                error: function (xhr, type) {

                    self.hideLoadingView();
                    Public.toast('上传失败，请稍后再试！');

                }
            })

        },
        // 点击事件
        bindHandle: function () {

            var self = this;

            // $('.file-To-Upload').on('click', function () {
               
            // })

            $(document).off('click', '.file-thumb-list .delete').on('click','.file-thumb-list .delete', function () {

                var $item = $(this).parent('.item'),
                    fileIndex = $item.attr('data-fileindex');

                self.removeStack(fileIndex);
                $item.remove();

            });


            $(document).off('click', '.file-thumb-list .img-item').on('click', '.file-thumb-list .img-item', function () {

                var $this = $(this),
                    dataImg = $this.parents('.file-thumb-list').find('img'),
                    initialSlide = $this.parents('.item').index();
                
                // $('#show-image').html('').append('<img style="object-fit: contain;height:100%" src="' + $(this).find('img').attr('src') + '"/>');
                // $('#preview-view').show().addClass('preview-in');
                Public.swiper(dataImg, '.swiper-wrapper', initialSlide-1);

            });

            $(document).off('click', '.file-thumb-list .video-item').on('click', '.file-thumb-list .video-item', function () {

                var $this = $(this),
                    dataImg = $this.parents('.file-thumb-list').find('img'),
                    initialSlide = $this.index();
                
                $('#preview-video').show().addClass('preview-in');
                $('#video-player video').attr('src', $(this).attr('data-url'));

            });

            $(document).off('click', '.upload-btn').on('click', '.upload-btn', function () {

                var params = {},
                    lable = $('#media-lable').val(),
                    isCommon = $('input[name=style]:checked').val(),
                    remarks = $('#media-remarks').val();
                
                if(self.judgeFile()) return;

                if (lable === ''){

                    Public.popup('.popup-lable');
                    Public.toast('请输入素材标签,再上传！');

                    return;

                }

                params.isCommon = isCommon;
                params.label = lable;
                params.remarks = remarks;

                self.uploadFile(params);

            })

        },
        hideLoadingView: function () {
            $('#preview-loading').removeClass('preview-in');
        }
    }
    
    $.fn.fileUpload = function (options) {
        
        this.each(function () {

            var $this = $(this),
                mobileFileUpload = new MobileFileUpload($this, options);

            mobileFileUpload.init();
            
            return mobileFileUpload;

        })

    }

})(Zepto);