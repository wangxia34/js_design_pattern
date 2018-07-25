function confirm_mesg(mesg,callback_OK,callback_CANCEL,color_style){

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
}


function create_confirm_mesg_box(mesg,color_style) {
    var mesg_box = "";
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


function alert_mesg(mesg,callback_OK,color_style){

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

}

function create_alert_mesg_box(mesg,color_style) {
    var mesg_box = "";
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