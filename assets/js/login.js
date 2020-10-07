$(function() {
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link_login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 设置表单验证 layui 中方法
    var form = layui.form;
    form.verify({
        username: function(value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }
        },

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]

        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value) {
            var psd = $('#psd').val();
            if (value !== psd) {
                return '两次输入不一致'
            }
        }
    });
    var layer = layui.layer;
    // 设置ajax请求 注册  点击事件
    $('#form-reg').on('submit', function(e) {
            // 阻止表单默认行为
            e.preventDefault();
            // console.log(222);
            var data = {
                username: $('#form-reg [name=username]').val(),
                password: $('#form-reg [name=password]').val()
            }
            $.ajax({
                type: "POST",
                url: "/api/reguser",
                data: data,
                // dataType: "dataType",
                success: function(res) {
                    if (res.status !== 0) return layer.msg(res.message, { icon: 6 });
                    layer.msg('注册成功', { icon: 6 });
                    // 成功之后返回登录页面  自动点击事件
                    $('#link_login').click();
                }
            });

        })
        // 设置ajax请求 登录  点击事件
    $('#form-login').on('submit', function(e) {
        //阻止表单默认行为
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            // dataType: "dataType",
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg('登录成功');
                // token 数据保存到本地
                localStorage.setItem('token', res.token);
                //href:设置或者获取地址栏信息路
                location.href = '/index.html';
            }
        });
    })

})