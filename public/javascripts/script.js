$(document).ready(function () {
    //图片展示
    $(function() {
        $('.msg-con').each(function () {
            var that = $(this);
            $(this).click(function () {
                //获取传到弹出框的当前点击元素的各值
                var text = that.find('p').html();
                var imgSrc = that.find('div').find('img').attr('src');
                var currentParent = that.parent();
                var userName = currentParent.find('.msg-user').html();
                var createTime = currentParent.find('.msg-time').html();
                var userHead = currentParent.parent().find('.msg-head img').attr('src');
                var imgModal = $('#imgModal');
                imgModal.find('.modal-userhead img').attr({
                    'src': userHead
                });
                imgModal.find('.msg-user').html(userName);
                imgModal.find('.msg-time').html(createTime);
                imgModal.find('.msg-info').html(text);
                imgModal.find('.msg-img img').attr({
                    'src': imgSrc
                });
            });
        });
    });
    //发表ajax
    $(function () {
        $('#fileBtn').click(function () {
            var info = $('#info').val();
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/send',
                data: {
                    info: info
                }
            });
        });
    });
    //删除ajax
    $(function () {
        $('.delete').each(function () {
            var that = $(this);
            that.click(function () {
                var imgPath = that.parent().find('.msg-img img').attr('src'),
                    imgUser = that.parent().find('.msg-user').html();
                $.ajax({
                    type: 'get',
                    dataType: 'json',
                    url: '/delete',
                    data: {
                        imgPath: imgPath,
                        imgUser: imgUser
                    }
                });
            });
        });
    });
    //显示评论区
    //隐藏评论区
    $(function () {
        $('.module-comment').each(function () {
            var that = $(this);
            that.click(function () {
                that.parent().parent().parent().find('.comment-text').fadeIn();
            });
        });
        $('.comment-close').each(function () {
            var that = $(this);
            that.click(function () {
                that.parent().fadeOut();
            });
        });
    });
    //用户头像上传
    $(function () {
        $('#edit-userhead').change(function () {
            $('#edit-hide-btn').fadeIn();
        });
    });
    // 用户文章喜欢
    $('.module-like a').click(function () {
        var parent = $(this).parent().parent().parent(),
            user = parent.find('.msg-user').html(),
            imgId = parent.attr('data-id'),
            data = {
                user: user,
                id: imgId
            };
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/love',
            data: data
        });
    });
    // 转发
    $('.module-forward a').click(function () {
        var parent = $(this).parent().parent().parent(),
            user = parent.find('.msg-user').html(),
            info = parent.find('.msg-info').html(),
            path = parent.find('.msg-img').find('img').attr('src'),
            head = parent.find('.msg-head').find('img').attr('src');
            data = {
                user: user,
                info: info,
                path: path,
                head: head
            };
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/forward',
            data: data
        });
    });

    // 评论
    $('.comment-btn').click(function () {
        var user = $(this).parent().parent().parent().parent().find('.msg-user').html(),
            text = $(this).parent().parent().find('.comment-text').val();
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/comment',
            data: {
                user: user,
                text: text
            }
        });
    });

    // 收藏
    $('.module-collect a').click(function () {
        var parent = $(this).parent().parent().parent(),
            user = parent.find('.msg-user').html(),
            info = parent.find('.msg-info').html(),
            path = parent.find('.msg-img img').attr('src'),
            imgId = parent.attr('data-id'),
            data = {
                user: user,
                info: info,
                path: path,
                imgId: imgId
            };
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: '/collection',
            data: data
        });
    });

    // 删除收藏
    $('.col-del').click(function () {
        var imgId = $(this).parent().attr('data-id');
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: '/colDelete',
            data: {
                imgId: imgId
            }
        });
    })
});