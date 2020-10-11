$(function() {
    // 发起请求获取数据：
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            type: "GET", //默认get
            url: "/my/article/cates", //默认当前页
            success: function(res) { //请求成功回调
                if (res.status !== 0) return layer.msg(res.message);

                var htmlStr = template('temp', res);
                $('tbody').html(htmlStr);
            },
        })
    }
    var layer = layui.layer;
    var form = layui.form;
    //点击btnAddCate按钮出现弹出层
    var indexAdd = null;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#addHtml').html(),
        });
    })

    //新增文章分类  需要通过代理方式
    $('body').on('submit', '#addForm', function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST", //默认get
            url: "/my/article/addcates", //默认当前页
            data: $(this).serialize(), //格式{key:value}
            success: function(res) { //请求成功回调
                if (res.status !== 0) return layer.msg(res.message);
                // console.log(res);
                initArtCateList();
                layer.msg('新增分类成功！');
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd);
            },
        })
    })

    var indexEdit = null;
    //点击.btnEditCate 弹出模态框
    $('body').on('click', '.btnEditCate', function(e) {
        e.preventDefault();
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '260px'],
            content: $('#editCate').html(),
        });
        // 获取相应元素 ID
        var id = $(this).attr('data-id');
        // console.log(id);
        //发送ajax请求  根据 Id 获取文章分类数据
        $.ajax({
            type: "GET", //默认get
            url: "/my/article/cates/" + id, //默认当前页
            success: function(res) { //请求成功回调
                if (res.status !== 0) return layer.msg(res.message);
                // 利用 layui快速获取表单的值
                form.val('editCateStr', res.data);
            }
        })
    })

    //通过事件委托发起请求
    $('body').on('submit', '#editCateHtml', function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST", //默认get
            url: "/my/article/updatecate", //默认当前页
            data: $(this).serialize(), //格式{key:value}
            success: function(res) { //请求成功回调
                if (res.status !== 0) return layer.msg(res.message);
                //重新渲染页面
                initArtCateList();
                layer.msg('修改分类成功！');
                // 根据索引，关闭对应的弹出层
                layer.close(indexEdit);
            },
        })
    })

    //通过事件委托进行删除
    $('body').on('click', '.deletecate', function(e) {
        e.preventDefault();
        // 获取当前ID
        var id = $(this).attr('data-id');
        layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                type: "GET", //默认get
                url: "/my/article/deletecate/" + id, //默认当前页
                data: $(this).serialize(), //格式{key:value}
                success: function(res) { //请求成功回调
                    if (res.status !== 0) return layer.msg(res.message);
                    //重新渲染页面
                    initArtCateList();
                    // layer.close(index);
                    layer.msg('删除分类成功！');
                    // initArtCateList();
                    // 根据索引，关闭对应的弹出层
                },
            })
            layer.close(index);
        });


    })

})