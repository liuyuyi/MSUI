var menu = new FlMenu(),
    type = 'picture',
    fileObj = null,
    videoPlayer = null;

$(function () {
    
    menu.init();

    fileObj = $('.file-To-Upload').fileUpload({
        acceptType: 'picture',
        url: PublicUrl.materialUploadUrl() + type
    });

    videoPlayer = $('#video-player').videoPlayer();
    
    $(document).on('click', '.upload-file-type .item', function () {

        var $this = $(this),
            acceptType = $this.attr('data-type');

        $('div[data-fileindex]').remove();
        if (acceptType === 'picture'){
            
            type = acceptType;

        } else if (acceptType === 'video'){

            type = acceptType;

        }

        $this.siblings().removeClass('active');
        $this.addClass('active');
        
        fileObj = $('.file-To-Upload').fileUpload({
            acceptType: acceptType,
            url: PublicUrl.materialUploadUrl() + type
        });

    });

    $(document).on('click', '.close', function () {

        $('#preview-video').removeClass('preview-in').hide();

        videoPlayer.stopVideo();
        videoPlayer.btnInit();

    });

    $(document).on('click', '#preview-close', function () {

        $('#preview-view').hide().removeClass('preview-in');

    });


})
