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
});