$(function() {
    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    $image.cropper(options);
    // 隐藏文件域
    $('#file').hide();
    // 点击上传按钮 打开文件域
    $('#ly-btn').on('click', function() {
        //阻止默认事件

        $('#file').click();
    })

    // 给文件域创建change事件
    $('#file').on('change', function(e) {
            var filelist = e.target.files;
            if (filelist.length === 0) return layer.msg('请上传图片');
            // 拿到用户选择的文件
            var file = e.target.files[0];
            //根据选择的文件，创建一个对应的 URL 地址：
            var newImgURL = URL.createObjectURL(file);
            //先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        // 头像上传到服务器
    $('#r_btn').on('click', function(e) {
        e.preventDefault();
        // 将裁剪后的图片，输出为 base64 格式的字符串
        var dataURL = $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })

        .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            type: "POST", //默认get
            url: "/my/update/avatar", //默认当前页
            data: {
                avatar: dataURL
            },
            success: function(res) { //请求成功回调
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg('更换头像成功');
                window.parent.getUserInfo();
            },

        })
    })
})