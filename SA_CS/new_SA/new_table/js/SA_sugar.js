
/*
*
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
    let createTool,
        SA = function () {};
    
    
    function createInput(item) {
        let contentBody,
            inputProps;
        
        contentBody = {
            tagName: "span",
            props: {
                class: "tool-span"
            },
            children: [
                {
                    tagName: "input",
                    props: {
                        type: item.type
                    }
                }
            ]
        };
        
        inputProps = contentBody.children[0].props;
        
        item.id     ? inputProps.id     = item.id   : true;
        item.name   ? inputProps.name   = item.name : true;
        item.cls    ? inputProps.class  = item.cls  : true;
        
        
        return contentBody;
    }
    
    createTool = {
        checkbox: function (item) {
            let contentBody;
    
            item.type = 'checkbox';
            contentBody = createInput(item);
            
            if(item.label || item.text){
                contentBody.children.push(Element({
                    tagName: 'label',
                    props: {
                        class: 'tool-text-post',
                        for: item.name ? item.name : ''
                    },
                    children: [item.label ? item.label : item.text]
                }))
            }
            
            return Element(contentBody).render();
        },
        
        radio: function (item) {
            let contentBody;
    
            item.type = 'radio';
            contentBody = createInput(item);
    
            if(item.label || item.text){
                contentBody.children.push(Element({
                    tagName: 'label',
                    props: {
                        class: 'tool-text-post',
                        for: item.name ? item.name : ''
                    },
                    children: [item.label ? item.label : item.text]
                }))
            }
    
            return Element(contentBody).render();
        },
        
        text: function (item) {
            let contentBody,
                inputProps;
    
            item.type = 'text';
            contentBody = createInput(item);
    
            inputProps = contentBody.children[0].props;
            item.text ? inputProps.placeholder = item.text : true;
    
            if(item.label){
                contentBody.children.unshift(Element({
                    tagName: 'label',
                    props: {
                        class: 'tool-text-pre',
                        for: item.name ? item.name : ''
                    },
                    children: [item.label]
                }))
            }
            
            return Element(contentBody).render();
        },
    
        password: function (item) {
            let contentBody,
                inputProps;
        
            item.type = 'password';
            contentBody = createInput(item);
        
            inputProps = contentBody.children[0].props;
            item.text ? inputProps.placeholder = item.text : true;
        
            if(item.label){
                contentBody.children.unshift(Element({
                    tagName: 'label',
                    props: {
                        class: 'tool-text-pre',
                        for: item.name ? item.name : ''
                    },
                    children: [item.label]
                }))
            }
        
            return Element(contentBody).render();
        },
    
        file: function (item) {
            let contentBody,
                inputProps;
        
            item.type = 'file';
            contentBody = createInput(item);
            
            contentBody.props.class = 'relative';
        
            inputProps = contentBody.children[0].props;
            inputProps.class = 'input-file';
            item.text ? inputProps.placeholder = item.text : true;
        
            if(item.label || item.text){
                contentBody.children.unshift(Element({
                    tagName: 'span',
                    props: {
                        class: 'file-span',
                        for: item.name ? item.name : ''
                    },
                    children: [item.text ? item.text : item.label]
                }))
            }
        
            return Element(contentBody).render();
        },
        
        select: function (item) {
            let contentBody,
                selectChildren, selectProps,
                i, length;
    
            contentBody = {
                tagName: 'span',
                props: {
                    class: 'tool-span'
                },
                children: [
                    {
                        tagName: 'select',
                        props: {},
                        children: []
                    }
                ]
            };
    
            selectProps = contentBody.children[0].props;
    
            item.id     ? selectProps.id     = item.id   : true;
            item.name   ? selectProps.name   = item.name : true;
            item.cls    ? selectProps.class  = item.cls  : true;
    
            if(item.options){
                i = 0;
                length = item.options.length;
                selectChildren = contentBody.children[0].children;
                for(; i < length; i++){
                    let oitem = {};
                    oitem = {
                        tagName: 'option',
                        props: {
                            value: item.options[i].value ? item.options[i].value : ''
                        },
                        children: [item.options[i].text]
                    };
                    selectChildren.push(oitem);
                }
            }
            
            if(item.text){
                contentBody.children.unshift(Element({
                    tagName: 'label',
                    props: {
                        class: 'tool-text-pre',
                        for: item.name ? item.name : ''
                    },
                    children: [item.text]
                }))
            }
            
            return Element(contentBody).render();
        },
        
        button: function (item) {
            let contentBody,
                inputProps;
    
            contentBody = {
                tagName: 'span',
                props: {
                    class: 'tool-span'
                },
                children: [
                    {
                        tagName: 'input',
                        props: {
                            type: 'button',
                            value: item.value ? item.value : item.text
                        }
                    }
                ]
            };
    
            inputProps = contentBody.children[0].props;
    
            item.id     ? inputProps.id     = item.id   : true;
            item.name   ? inputProps.name   = item.name : true;
            item.cls    ? inputProps.class  = item.cls  : true;
            
            if(item.functions){
                $.each(item.functions,function (key,value) {
                    inputProps[key] = value;
                })
            }
            
            return Element(contentBody).render();
    
        },
    
        imageButton: function (item) {
            let contentBody,
                inputProps;
            
            contentBody = {
                tagName: "button",
                props: {
                    class: "imaged-button"
                },
                children: [
                    {
                        tagName: "img",
                        props: {
                            class: "button-image",
                            src: item.icon ? item.icon : ""
                        }
                    }, {
                        tagName: "span",
                        props: {
                            class: "button-text"
                        },
                        children: [item.text]
                    }
                ]
            };
    
            inputProps = contentBody.props;
    
            item.id     ? inputProps.id     = item.id   : true;
            item.name   ? inputProps.name   = item.name : true;
            item.cls    ? inputProps.class  = item.cls  : true;
    
            if (item.functions) {
                $.each(item.functions, function(key, value) {
                    inputProps[key] = value;
                });
            }
    
            return Element(contentBody).render();
        }
    };
    
    function create_waiting_mesg_box() {
        let mesg_box;
        
        mesg_box = {
            tagName: "div",
            props: {
                "id": "waiting-mesg-box"
            },
            children: [{
                tagName: "div",
                props: {"class": "popup-waiting-cover"}
            }, {
                tagName: "div",
                props: {"class": "popup-waiting-mesg-box"},
                children: [
                    Element({tagName: "i", props: {"class": "icon iconfont icon-dengdai1"}}),
                    {
                        tagName: "div",
                        props: {"class": "popup-waiting-mesg-text"},
                        children: [
                            {tagName: "span", children: ["正"]},
                            {tagName: "span", children: ["在"]},
                            {tagName: "span", children: ["请"]},
                            {tagName: "span", children: ["求"]},
                            {tagName: "span", children: ["数"]},
                            {tagName: "span", children: ["据"]},
                            {tagName: "span", children: ["，"]},
                            {tagName: "span", children: ["请"]},
                            {tagName: "span", children: ["稍"]},
                            {tagName: "span", children: ["等"]},
                            {tagName: "span", children: ["."]},
                            {tagName: "span", children: ["."]},
                            {tagName: "span", children: ["."]}
                        ]
                    }
                ]
            }]
        };
        
        return Element(mesg_box).render();
    }
    
    function create_alert_mesg_box(mesg, color_style) {
        let mesg_box;
    
        mesg_box = {
            tagName: 'div',
            props: {
                'id': 'alert_mesg_div',
                'class': 'confirm-mesg-div'
            },
            children: [{
                tagName: 'div',
                props: {'class': 'confirm-mesg-box-body'},
                children: [
                {
                    tagName: 'div',
                    props: {
                        'class': 'confirm-mesg-text-area ' + (color_style ? 'confirm-mesg-text-area_' + color_style : '')
                    },
                    children: [{
                        tagName: 'div',
                        props: {
                            'id': 'alert_mesg_box',
                            'class': 'confirm-mesg-text confirm-mesg ' + (color_style ? 'confirm-mesg_' + color_style : '')
                        },
                        children: [mesg]
                    }]
                },
                {
                    tagName: 'div',
                    props: {
                        'class': 'confirm-mesg-buttons ' + (color_style ? 'confirm-mesg-buttons_' + color_style : '')
                    },
                    children: [{
                        tagName: 'button',
                        props: {
                            'id': 'alert_OK_box',
                            'class': 'confirm-mesg-button ' + (color_style ? 'confirm-mesg-button_' + color_style : '')
                        },
                        children: [{
                            tagName: 'span',
                            props: {
                                'class': 'confirm-mesg-button-text'
                            },
                            children: ['确定']
                        }]
                    }]
                }]
            }]
        };
        
        return Element(mesg_box).render();
    }
    
    function create_confirm_mesg_box(mesg, color_style) {
        let mesg_box;
    
        mesg_box = {
            tagName: 'div',
            props: {
                'id': 'confirm_mesg_div',
                'class': 'confirm-mesg-div'
            },
            children: [{
                tagName: 'div',
                props: {'class': 'confirm-mesg-box-body'},
                children: [
                    {
                        tagName: 'div',
                        props: {
                            'class': 'confirm-mesg-text-area ' + (color_style ? 'confirm-mesg-text-area_' + color_style : '')
                        },
                        children: [{
                            tagName: 'div',
                            props: {
                                'id': 'confirm_mesg_box',
                                'class': 'confirm-mesg-text confirm-mesg ' + (color_style ? 'confirm-mesg_' + color_style : '')
                            },
                            children: [mesg]
                        }]
                    },
                    {
                        tagName: 'div',
                        props: {
                            'class': 'confirm-mesg-buttons ' + (color_style ? 'confirm-mesg-buttons_' + color_style : '')
                        },
                        children: [{
                            tagName: 'button',
                            props: {
                                'id': 'confirm_YES_box',
                                'class': 'confirm-mesg-button ' + (color_style ? 'confirm-mesg-button_' + color_style : '')
                            },
                            children: [{
                                tagName: 'span',
                                props: {
                                    'class': 'confirm-mesg-button-text'
                                },
                                children: ['确定']
                            }]
                        },{
                            tagName: 'button',
                            props: {
                                'id': 'confirm_NO_box',
                                'class': 'confirm-mesg-button ' + (color_style ? 'confirm-mesg-button_' + color_style : '')
                            },
                            children: [{
                                tagName: 'span',
                                props: {
                                    'class': 'confirm-mesg-button-text'
                                },
                                children: ['取消']
                            }]
                        }]
                    }]
            }]
        };
        
        return Element(mesg_box).render();
    }
    
    SA.prototype = {
        
        createTool: createTool,
        
        waitingMesgs: function(show) {
            if (show) {
                if ($("#waiting-mesg-box").length > 0) {
                    $("#waiting-mesg-box").show();
                } else {
                    $("body").append(create_waiting_mesg_box());
                }
            } else {
                $("#waiting-mesg-box").hide();
            }
        },
    
        alertMesg: function(mesg, color_style, callback_OK){
        
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
    
        confirmMesg: function(mesg, color_style, callback_OK, callback_CANCEL){
        
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
    
    // AJAX异步请求数据
    function ajaxRequest(url, data, callBack, type, async) {
        let obj, ajaxRequest;
        obj = {
            type: "post",
            url: url,
            data: data,
            timeout: 90000, // 超时时间设置，单位毫秒
            success: callBack,
            error: function () {
                if (typeof hide_waiting_mesg === "function") {
                    SA.waitingMesgs(false);
                }
                SA.alertMesg("ajax请求出错！");
            },
            complete: function(XMLHttpRequest, status) { // 请求完成后最终执行参数
                if (status === "timeout") { // 超时,status还有success,error等值的情况
                    ajaxRequest.abort();
                    SA.alertMesg("请求超时！");
                    if (typeof hide_waiting_mesg === "function") {
                        SA.waitingMesgs(false);
                    }
                }
            }
        };
        if (type) {
            obj.dataType = type;
        } else {
            obj.dataType = "json";
        }
    
        ajaxRequest = $.ajax(obj);
    }
    
    $.extend(SA.prototype, {
        
        postRequest: function (url, data, callBack, type, async) {
            ajaxRequest(url, data, callBack, type, async);
        },
        
    });
    
    
    
    
    let isDOM = (typeof HTMLElement === "object") ?
        function(obj) {
            return obj instanceof HTMLElement;
        } :
        function(obj) {
            return obj && typeof obj === "object" && obj.nodeType === 1 && typeof obj.nodeName === "string";
        };
    
    
    $.extend(SA.prototype, {
    
        isDOM: isDOM
    
    });
    
    
    
    window.SA = new SA();
})();

