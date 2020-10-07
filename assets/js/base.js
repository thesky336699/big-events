$.ajaxPrefilter(function(options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    //进行判断
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    };
    options.complete = function(res) {
        //无论请求是成功还是失败都会执行的回调，常用全局成员的释放，或者页面状态的重置
        if (res.responseJSON.status == 1 && res.responseJSON.message == '身份认证失败！') {
            localStorage.removeItem('token');
            location.href = '/login.html';
        }
    };
})