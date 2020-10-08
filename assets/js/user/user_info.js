$(function() {
    var form = layui.form;
    var layer = layui.layer;
    initUserInfo();
    // 限制用户输入
    form.verify({
            nickname: function(value, item) { //value：表单的值、item：表单的DOM对象
                if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                    return '昵称不能有特殊字符';
                }
                if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                    return '昵称首尾不能出现下划线\'_\'';
                }
                if (/^\d+\d+\d$/.test(value)) {
                    return '昵称不能全为数字';
                }
                if (value.length > 3) {
                    return '昵称长度不能超过三个字符';
                }
            }
        })
        //  获取数据
    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message);
                form.val('formUserInfo', res.data);
                // console.log(form.val('formUserInfo', res.data));
                // console.log(res.data);
            }
        });
    }
    //点击事件
    $('#rest').on('click', function(e) {
        //阻止默认行为
        e.preventDefault();
        // 调用函数从新渲染
        initUserInfo()
    })

    //  更新用户的基本信息  表单submit 事件
    // $('.layui-form').on('submit', function(e) {
    //         // 阻止默认行为

    //         e.preventDefault();
    //         $.ajax({
    //             type: "post", //默认get
    //             url: "/my/userinfo", //默认当前页
    //             data: $(this).serialize(), //格式{key:value}
    //             success: function(res) { //请求成功回调
    //                 if (res.status !== 0) return layer.msg(res.message);
    //                 layer.msg('更新用户信息成功！');
    //                 // 成功调用index页面函数
    //                 console.log(window.parent.getUserInfo());
    //                 // window.parent.getUserInfo();
    //             }
    //         })
    //     })
    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
            // 发起 ajax 数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                    // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
            }
        })
    })
})