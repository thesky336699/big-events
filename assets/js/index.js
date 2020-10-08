$(function() {

    //    获取用户信息
    var layer = layui.layer;
    getUserInfo();

    function getUserInfo() {
        $.ajax({
            type: "GET", //默认get
            url: "/my/userinfo", //默认当前页
            // headers: {
            //     Authorization: localStorage.getItem('token') || '',
            // },
            //设置为同步处理  默认为异步处理
            async: false,
            success: function(res) { //请求成功回调
                if (res.status !== 0) return layer.msg(res.message);
                getrenderPhoto(res.data);
            },
            // complete: function(res) {
            //     console.log(res);
            //     if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
            //         localStorage.removeItem('token');
            //         location.href = '/login.html';
            //     }
            // }, //无论请求是成功还是失败都会执行的回调，常用全局成员的释放，或者页面状态的重置
        })
    }
    // 渲染头像函数
    function getrenderPhoto(user) {
        // 获取用户的名称
        var name = user.username || user.nickname;
        // 设置欢迎文本
        $('#welcome').html('欢迎&nbsp&nbsp' + name);
        // 渲染用户头像  
        //进行判断 如果有图片用图片当做头像 没有的话用第一个字母或者第一个文字当做头像
        if (user.user_pic !== null) {
            //渲染图片
            $('.layui-nav-img').attr('src', user.user_pic).show();
            $('.text-photo').hide();
        } else {
            $('.layui-nav-img').hide();
            var frist = name[0].toUpperCase();
            $('.text-photo').html(frist).show();
        }
    }
    //点击事件 点击退出
    $('#close').on('click', function() {
        layer.confirm('退出登录?', { icon: 3, title: '提示' }, function(index) {
            //   清除浏览器数据 token
            localStorage.removeItem('token');
            //返回登录注册页面
            location.href = '/login.html';

            layer.close(index);
        });
    })

})