
/*
*
* SA.waitingMesgs(show)
*       show : true  false
*
* SA.alertMesg(mesg,color_style,callback_OK)
*       mesg        : 展示的信息             必填      string
*       color_style : 提示框颜色             选填      string      ：blue green
*       callback_OK : 点击确认之后的回调函数   选填      function
*
* SA.confirmMesg(mesg,color_style,callback_OK,callback_CANCEL)
*       mesg            : 展示的信息             必填      string
*       color_style     : 提示框颜色             选填      string      ：blue green
*       callback_OK     : 点击确认之后的回调函数   选填      function
*       callback_CANCEL : 点击取消之后的回调函数   选填      function
*
* SA.postRequest(url, data, callBack, type, async)
*       url         :   请求地址              必填      string
*       data        :   请求发送的数据         必填      object
*       callBack    :   请求成功的回调函数     必填      function
*       type        :   请求数据的格式        选填     string       【默认 json】
*       async       :   同步请求还是异步请求   选填
*
*/


(function () {
    
    let SA = function () {};
    
    function create_waiting_mesg_box() {
        let mesg_box = "";
        mesg_box += '<div id="waiting-mesg-box">';
        mesg_box += '<div class="popup-waiting-cover"></div>';
        mesg_box += '<div class="popup-waiting-mesg-box">';
        mesg_box += '<img src="./images/009.gif"/>';
        mesg_box += '</div>';
        mesg_box += '</div>';
        return mesg_box;
    }
    
    function create_alert_mesg_box(mesg,color_style) {
        let mesg_box = "";
        mesg_box += '<div class="confirm-mesg-div" id="alert_mesg_div"><div class="confirm-mesg-box-body"><div class="confirm-mesg-text-area ';
        
        mesg_box += color_style ? "confirm-mesg-text-area_"+color_style : "";
        
        mesg_box += '"><div id="alert_mesg_box" class="confirm-mesg-text confirm-mesg ';
        
        mesg_box += color_style ? "confirm-mesg_"+color_style : "";
        
        mesg_box += '">' + mesg + '</div></div><div class="confirm-mesg-buttons ';
        
        mesg_box += color_style ? "confirm-mesg-buttons_"+color_style : "";
        
        mesg_box += '"><button id="alert_OK_box" class="confirm-mesg-button ';
        
        mesg_box += color_style ? "confirm-mesg-button_"+color_style : "";
        
        mesg_box += '"><span class="confirm-mesg-button-text">确定</span></button></div></div></div>';
        
        return mesg_box;
    }
    
    function create_confirm_mesg_box(mesg,color_style) {
        let mesg_box = "";
        mesg_box += '<div class="confirm-mesg-div" id="confirm_mesg_div"><div class="confirm-mesg-box-body"><div class="confirm-mesg-text-area ';
        
        mesg_box += color_style ? "confirm-mesg-text-area_"+color_style : "";
        
        mesg_box += '"><div id="confirm_mesg_box" class="confirm-mesg-text confirm-mesg ';
        
        mesg_box += color_style ? "confirm-mesg_"+color_style : "";
        
        mesg_box += '">' + mesg + '</div></div><div class="confirm-mesg-buttons ';
        
        mesg_box += color_style ? "confirm-mesg-buttons_"+color_style : "";
        
        mesg_box += '"><button id="confirm_YES_box" class="confirm-mesg-button ';
        
        mesg_box += color_style ? "confirm-mesg-button_"+color_style : "";
        
        mesg_box += '"><span class="confirm-mesg-button-text">确定</span></button><button id="confirm_NO_box" class="confirm-mesg-button ';
        
        mesg_box += color_style ? "confirm-mesg-button_"+color_style : "";
        
        mesg_box += '"><span class="confirm-mesg-button-text">取消</span></button></div></div></div>';
        
        return mesg_box;
    }
    
    SA.prototype = {
        
        waitingMesgs: function(show) {
            if(show){
                if($("#waiting-mesg-box").length > 0) {
                    $("#waiting-mesg-box").show();
                } else {
                    $('body').append(create_waiting_mesg_box());
                }
            }else{
                $("#waiting-mesg-box").hide();
            }
        },
    
        alertMesg: function(mesg,color_style,callback_OK){
        
            if(!callback_OK){
                if(color_style && typeof color_style === "function" ){
                    callback_OK = color_style;
                    color_style = undefined;
                }
            }
        
            if($("#alert_mesg_div").length > 0) {
                $("#alert_mesg_box").html(mesg);
                $("#alert_mesg_div").show();
            } else {
                $('body').append(create_alert_mesg_box(mesg,color_style));
            }
        
            $('#alert_OK_box').click(function () {
                if(callback_OK && typeof callback_OK === "function"){
                    callback_OK();
                }
                $("#alert_mesg_div").hide();
            })
        
        },
    
        confirmMesg: function(mesg,color_style,callback_OK,callback_CANCEL){
        
            if(!callback_OK && !callback_CANCEL){
                if(color_style && typeof color_style === "function" ){
                    callback_OK = color_style;
                    color_style = undefined;
                }
            }else if(!callback_CANCEL){
                if(color_style && typeof color_style === "function" ){
                    callback_CANCEL = callback_OK;
                    callback_OK = color_style;
                    color_style = undefined;
                }
            }
        
            $('body').append(create_confirm_mesg_box(mesg,color_style));
        
            $('#confirm_YES_box').click(function () {
                if(callback_OK && typeof callback_OK === "function"){
                    callback_OK();
                }
                $('#confirm_mesg_div').remove();
            
            });
            $('#confirm_NO_box').click(function () {
                if(callback_CANCEL && typeof callback_CANCEL === "function"){
                    callback_CANCEL( false );
                }
                $('#confirm_mesg_div').remove();
            
            })
        },
    
    };
    
    //AJAX异步请求数据
    function ajaxRequest(url, data, callBack, type, async) {
        
        if(typeof type === "boolean" && !async){
            async = type;
            type = undefined;
        }
        
        let obj = {
            type: "post",
            url: url,
            data: data,
            success: callBack,
            error: function(error) {
                SA.alertMesg("ajax请求出错！");
            }
        };
        if(async) {
            obj.async = false;
        }
        if(type) {
            obj.dataType = type;
        } else {
            obj.dataType = "json";
        }
        
        $.ajax(obj);
    }
    
    $.extend(SA.prototype,{
        
        postRequest: function (url, data, callBack, type, async) {
            ajaxRequest(url, data, callBack, type, async);
        },
        
    });
    
    
    
    $.extend(SA.prototype,{
    
    
    
    });
    
    
    
    window.SA = new SA();
})();