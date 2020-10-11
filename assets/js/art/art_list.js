$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    initTable();
    // 获取文章列表数据的方法
    function initTable() {
        //发送ajax请求
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message);
                // console.log(res);
                // 渲染到页面
                var htmlStr = template('temp-table', res);
                // var htmlStr = template('temp-table');
                $('tbody').html(htmlStr);
                randerPage(res.total);
            }
        });
    }
    //定义 `initCate` 函数请求文章分类的列表数据
    initCate();

    function initCate() {
        $.ajax({
            type: "GET", //默认get
            url: "/my/article/cates", //默认当前页
            success: function(res) { //请求成功回调
                if (res.status !== 0) return layer.msg(res.message);
                // console.log(res);
                var htmlStr = template('temp-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }

    // 筛选部分
    $('#listForm').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable();
    })

    // 渲染分页
    function randerPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'page-list', //注意，这里的 test1 是 ID，不用加 # 号
            limit: q.pagesize, //每页显示的条数。
            curr: q.pagenum, //	起始页
            limits: [2, 5, 8, 10, 15], //每页条数的选择项。
            count: total, //数据总数，从服务端得到
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                //  console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    //do something
                    initTable();
                }
            }
        });
    }
    //通过代理
    $('tbody').on('click', '.btn-del', function() {
        //获取  页面删除按钮的个数
        var len = $('.btn-del').length;
        // console.log(len);
        //获取相应ID
        var id = $(this).attr('cate_id');
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function(res) {
                    // console.log(res);
                    if (res.status !== 0) return layer.msg(res.message);
                    layer.msg('删除成功');
                    // 判断  判断页面删除按钮的个数是否等于1
                    // pagenum ， 页码值  页码值进行减一  当为1时  返回1
                    if (len === 1) {
                        q.pagenum = q.pagenum == 1 ? q.pagenum : q.pagenum - 1;
                    }
                    initTable();
                }
            });
            layer.close(index);
        });
    })

    //通过代理编辑
    // $('tbody').on('click', '.btn-edit', function() {
    //     //获取  页面删除按钮的个数
    //     // var len = $('.btn-del').length;
    //     // console.log(len);
    //     //获取相应ID
    //     var id = $(this).attr('cate_id');
    //     layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function(index) {
    //         //do something
    //         $.ajax({
    //             type: "GET",
    //             url: "/my/article/delete/" + id,
    //             success: function(res) {
    //                 // console.log(res);
    //                 if (res.status !== 0) return layer.msg(res.message);
    //                 layer.msg('删除成功');
    //                 // 判断  判断页面删除按钮的个数是否等于1
    //                 // pagenum ， 页码值  页码值进行减一  当为1时  返回1
    //                 if (len === 1) {
    //                     q.pagenum = q.pagenum == 1 ? q.pagenum : q.pagenum - 1;
    //                 }
    //                 initTable();
    //             }
    //         });
    //         layer.close(index);
    //     });
    // })
})