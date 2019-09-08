// type:请求方式
// url:请求url
// data:传递给服务器的参数
// callback:客户端动态结构渲染方式

// 下面的封装方式的缺点：
// 1.参数数量固定：用户在调用的时候必须传入四个参数
// 2.参数的顺序固定：用户在调用的时候必须按照顺序进行参数的传递
// 3.不方便后期封装功能的扩展与修改
// function ajax(type,url,data,callback){}

// 解决方式：通过传入对象的方式来设置参数
// 对象的参数不需固定，顺序也不用固定
// option是一个对象，它里面包含着相关的属性：如type,url,data,callback
// 不方便后期功能的添加与扩展
// 会造成当前文件中存在着大量的全局变量，不会自动释放，会造成全局变量污染
// function ajax(option){}
// function get(option){}
// function post(option){}
// 建议的封装方式：

var $ ={
    // 由于参数是对象，所以要将{"name":"jack"}的参数转化为?name=jack&age=20这种形式

    // 定义一个函数  将参数进行转化
    getpa:function(data){
        // 遍历对象 得到键和值  拼接为字符串
        // 先判断有没数据       是否为对象   
        if(data && typeof data == "object"){
            var str = "?";
            for(var key in data){
                str = str+key + "=" +data[key] +"&";
            }
            // 多了&
            str=str.substr(0,length-1);
        }
        return str;
    },

    // option:type:请求方式
    // option:url:请求url
    // option:data:传递给服务器的参数  规定参数必须是以对象的形式传递
    // {"name":"jack","age":20}
    // option:callback:客户端动态结构渲染方式
   

    ajax:function(option){
         // 对象  用户可能只传入部分值  所以要处理

        //  1.接受用户参数进行相应处理
        var type = option.type || "get";
        // 默认当前页  location.href可获取当前文件的路径
        var url = option.url || location.href;
        // 接收参数 js中什么类型用户最容易收集----对象
        // 所以规定传递的参数必须是对象
        var data = this.getpa(option.data) || "";
        // var data = option.data || {};
        // 相应成功后的回调
        var success =  option.success;
        // 2.创建异步对象
        var xhr = new XMLHttpRequest();
        // 3.让异步对象发送请求
        // 设置请求行
        if(type=="get"){
            // 拼接参数
            // 但是我们的参数是对象 
            url += data; 
            // 拼接完了我们可以让data=null
            data=null;
        }
        xhr.open(type,url);
        // 设置请求头
        if(type=="post"){
            xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");

        }
        // 设置请求体
        // 优化处理 让前面的data=null
        xhr.send(data);
  

        // 4.让异步对象接受响应
        xhr.onreadystatechange=function(){
            // 一个成功的响应有两个条件：1服务器成功响应 2数据解析完毕可以使用
            if(xhr.status==200 && xhr.readyState==4){
                // 接收响应的返回值
                // responseText  responseXML
                var rh = xhr.getResponseHeader("Content-Type");
                // 判断
                // 当是xml格式时
                if(rh.indexOf("xml")!=-1){
                    var result=xhr.responseXML;
                }else if(rh.indexOf("json")!=-1){
                    var result = JSON.parse(xhr.responseText);
                }else{
                    var result = xhr.responseText;
                }
                // 接收数据后 调用回调函数
                success && success(result);
            }
        }


    },
    get:function(option){

    },
    post:function(option){

    }
}