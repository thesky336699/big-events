$(function() {
    initCate();
    var layer = layui.layer;
    var form = layui.form;

    function initCate() {
        $.ajax({
            type: "GET", //默认get
            url: "/my/article/cates", //默认当前页
            success: function(res) { //请求成功回调
                if (res.status !== 0) return layer.msg(res.message);
                var htmlStr = template('tel-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    // 初始化富文本编辑器
    initEditor();

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //点击事件
    $('#choosePreview').on('click', function() {
        $('#file').click();

    })

    //给文件域绑定change事件
    $('#file').on('change', function(e) {
        var files = e.target.files;
        //进行判断 文件长度
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义变量
    var art_state = '已发布';
    //发布
    $('#form-pub').on('submit', function(e) {
        e.preventDefault();
        //基于form表单创建formData对象
        var fm = new FormData($(this)[0]);
        // 追加state
        fm.append('state', art_state);
        // fm.forEach(function(e, k) {
        //     console.log(e, k);
        // })
        //获取图片文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //图片文件追加
                fm.append('cover_img', blob);
                //调用发表文章函数
                publishAticle(fm);
            })
    })

    //定义发表文章函数
    function publishAticle(fm) {
        //发送ajax请求
        $.ajax({
            type: "POST", //默认get
            url: "/my/article/add", //默认当前页
            data: fm, //格式{key:value}
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) { //请求成功回调
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg('发布成功');
                // console.log(res);
                // 成功后跳转到 art_list.html 页面
                //href:设置或者获取地址栏信息路径
                //search：获取地址栏参数 例：(?name=zj&age=18)
                //host:返回主机（域名）
                //port:返回端口号
                //pathname:返回路径
                //hash：返回片段 #后面的内容，常见链接 锚点
                location.href = 'art_list.html';
            },
        })
    }
    //发布
    $('#issue').on('click', function(e) {
        // e.preventDefault();
        art_state = '已发布';
    })

    // 存为草稿
    $('#saveDraft').on('click', function(e) {
        // e.preventDefault();
        art_state = '草稿';
    })
})