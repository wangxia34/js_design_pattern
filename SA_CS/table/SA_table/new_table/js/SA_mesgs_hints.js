/*
*
* $.waitingMesgs(show)
*       show : true  false
*
* $.alertMesg(mesg,color_style,callback_OK)
*       mesg        : 展示的信息             必填      string
*       color_style : 提示框颜色             选填      string      ：blue green
*       callback_OK : 点击确认之后的回调函数   选填      function
*
* $.confirmMesg(mesg,color_style,callback_OK,callback_CANCEL)
*       mesg            : 展示的信息             必填      string
*       color_style     : 提示框颜色             选填      string      ：blue green
*       callback_OK     : 点击确认之后的回调函数   选填      function
*       callback_CANCEL : 点击取消之后的回调函数   选填      function
*
*/

(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("jquery"));
    } else {
        factory(jQuery);
    }
}(function ($) {
    
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
    
    $.waitingMesgs = function(show) {
        if(show){
            if($("#waiting-mesg-box").length > 0) {
                $("#waiting-mesg-box").show();
            } else {
                $('body').append(create_waiting_mesg_box());
            }
        }else{
            $("#waiting-mesg-box").hide();
        }
    };
    
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
    
    $.alertMesg = function(mesg,color_style,callback_OK){
        
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
        
    };
    
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
    
    $.confirmMesg = function(mesg,color_style,callback_OK,callback_CANCEL){
    
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
    };
    
    
    return $;
}));