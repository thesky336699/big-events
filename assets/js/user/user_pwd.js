 $(function() {
     var form = layui.form;
     var layer = layui.layer;
     form.verify({
         //  自定义校验规则 对比新密码与旧密码是否一致 若一致提示用户
         newPwd: function(value, item) { //value：表单的值、item：表单的DOM对象
             if (value == $('#oldPwd').val()) return '新密码与旧密码一致，请重新输入';
         },
         //  自定义校验规则 对比新密码与确认输入的密码是否一致 若不一致提示用户
         r_newPwd: function(value, item) {
             if (value !== $('#newPwd').val()) return '两次密码不一致，请重新输入';
         },
         //我们既支持上述函数式的方式，也支持下述数组的形式
         //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
         pass: [
             /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
         ]
     });

     //  修改表单密码 绑定事件
     $('.layui-form').on('submit', function(e) {
         // 阻止默认行为
         e.preventDefault();
         $.ajax({
             type: "post", //默认get
             url: "/my/updatepwd", //默认当前页
             data: $(this).serialize(),
             success: function(res) { //请求成功回调
                 //  console.log(res);
                 if (res.status !== 0) return layer.msg(res.message);
                 //  成功
                 layer.msg('修改密码成功');

                 //  清空form表单密码框内容
                 $('.layui-form')[0].reset();
             },

         })
     })
 })