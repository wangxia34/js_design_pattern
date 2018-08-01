


function SATable(options) {
    this.settings = $.extend(true, {}, SATable.defaults, options);
    this.init();
}

$.extend(SATable, {
    
    // 默认设置
    defaults: {
        //控制数据在哪里加载数据
        url: "",
        //确定面板挂载在哪里
        parentId: "",
        //默认名字my_list_panel，当一个页面存在多个列表面板，此字段必填，以区别不同面板
        panelName: "my_list_panel",
        //控制数据项默认加载多少条，默认是15，此处可以在加载数据过程中更改，更改方法是从服务器加载数据到浏览器时，传一个page_size字段到浏览器
        pageSize: 15,
        //可选 面板标题 默认不存在
        // panelTitle: "面板标题",
        // titleIcon: "标题icon",
        isClose: false,
        isPagingTools: true,
        isLoadAllData: true,
        isModal: false,
        modalConfig: {
            modalBoxSize:"l",
            modalLevel:10,
        },
        isSearch: true,
        searchConfig: {
            inputTip: "输入关键字以查询...",
            // title: "某字段关键字"
        },
        render: {},
        check_obj: null,
        eventHandler: {
            before_load_data : "",
            after_load_data : ""
        },
        // panelHeader: [],
        // topWidgets: [],
        // bottomWidgets: [],
        extend_search: [],
        bottom_extend_widgets: [],
        actions: {},
        //以下不用配置
        totalNum: 4
    },
    
    prototype: {
        init:function () {
            this.initVariable();
            
        },
        
        initVariable: function () {
            let panel_name = this.settings.panelName,
                selfId = {};
            
            /*页面主体部分ID*/
            selfId.panel_id          = "list_panel_id_for_" + panel_name;
            selfId.panel_close_id    = "list_panel_close_for_" + panel_name;
            selfId.panel_header_id   = "panel_header_id_for_" + panel_name;
            selfId.panel_body_id     = "rule_listb_for_" + panel_name;
    
            /*页面搜索相关按钮的ID*/
            selfId.search_form_name      = "list_panel_search_form_for_" + panel_name;
            selfId.search_key_id         = "search_key_for_" + panel_name;
            selfId.search_button_id      = "search_button_for_" + panel_name;
            selfId.extend_search_class   = "extend_search_for_" + panel_name;
    
            /*控制页面选择的名目*/
            selfId.control_checkbox_id   = "control_checkbox_for_" + panel_name;
            // selfId.checkbox_class        = "checkbox_item_for_" + panel_name;
            // selfId.radio_name            = "radio_item_for_" + panel_name;
            
            this.selfId = selfId;
            this.panel_body = {};
            this.detail_data = {};
        },
        
        render: function () {
            this.displayTabel();
        },
    
        //创建整个tabel面板
        displayTabel: function () {
            let self = this,
                selfId = this.selfId,
                setting = this.settings;
    
            self.panel_body = {
                tagName: 'div',
                props: {
                    'class': 'list',
                    'id': selfId.panel_id
                },
                children: []
            };
            
            //创建 标题栏 和 关闭模块按钮
            if(setting.panelTitle || setting.isClose){
                this.createTitle();
            }
            
            //创建 搜索栏 和 顶部按钮模块
            if(setting.topWidgets || setting.isSearch){
                this.createToolbarTop();
            }
            
            //创建 table主体部分
            if(setting.panelHeader){
                this.createTable();
            }
            
            //创建 翻页工具栏 和 底部按钮模块
            if(setting.isPagingTools || setting.bottomWidgets){
                this.createToolbarBottom();
            }
            
            
            $('#'+setting.parentId).append(Element(self.panel_body).render());
            
            
        },
    
        createToolbarBottom: function () {
            let self = this,
                content_body;
    
            content_body = {
                tagName: 'div',
                props: {'class': 'toolbar'},
                children: []
            };
            
            
    
            
            self.panel_body.children.push(content_body);
        },
    
        //创建table主体部分
        createTable: function () {
            let self = this,
                content_body, tHead_body, tBody_body,
                tableChild;
            
            content_body = {
                tagName: 'div',
                props: {'class': 'container-main-body'},
                children: [{
                    tagName: 'table',
                    props: {'class': 'rule-list'},
                    children: []
                }]
            };
    
            tableChild = content_body.children[0].children;
            tHead_body = this.createTabelHead();
            tableChild.push(tHead_body);
    
            tBody_body = this.createTBody();
            tableChild.push(tBody_body);
    
    
            self.panel_body.children.push(content_body);
        },
    
        createTabelHead: function () {
            let self = this,
                selfId = this.selfId,
                setting = this.settings,
                content_body, theadTr,
                theadLevel = 1, i = 0, j = 0, length = setting.panelHeader.length;
    
            content_body = {
                tagName: 'thead',
                props: {
                    'class': 'rule-listbh',
                    'id': selfId.panel_header_id
                },
                children: []
            };
            
            //确定是否为二级表头，最多只支持二级
            for(; i < length; i++){
                if(setting.panelHeader[i].children){
                    theadLevel = 2;
                    break;
                }
            }
            for(; j < theadLevel; j++){
                content_body.children.push({
                    tagName: 'tr',
                    children: []
                })
            }
            
            function createtHeadtd(item) {
                let thead_body;
    
                thead_body = {
                    tagName: 'td',
                    props: {
                        'class': 'contentHidden ' + (item.cls ? item.cls : ''),
                        'width': item.width ? item.width : '5%'
                    },
                    children: []
                };
                
                try {
                    thead_body.children.push(SATable.createTHeadtd[item.type].call(self, item));
                } catch {
                    console.error('panelHeader 没有 type 为 ' + item.type + ' !');
                }
                
                // 创建第二层thead 防止创建第三层
                if (item.children && !item.isChild) {
                    $.each(item.children, function (key, item) {
                        item.isChild = true;
                        createtHeadtd(item)
                    });
                }
                
                if (item.isChild) {
                    theadTr = content_body.children[1].children;
                } else if (item.children) {
                    thead_body.props.colspan = item.children.length;
                    theadTr = content_body.children[0].children;
                } else {
                    if (theadLevel !== 1) {
                        thead_body.props.rowspan = theadLevel;
                    }
                    theadTr = content_body.children[0].children;
                }
                
                theadTr.push(thead_body);
                
            }
            
            $.each(setting.panelHeader, function (key, item) {
                createtHeadtd(item);
            });
            
            return content_body;
            
        },
    
        createTBody: function () {
            let self = this,
                selfId = this.selfId,
                setting = this.settings,
                content_body, tBody_tr,
                i = 0;
    
            content_body = {
                tagName: 'tbody',
                props: {
                    'class': 'rule-listb',
                    'id': selfId.panel_body_id
                },
                children: []
            };
            
            for(; i < setting.pageSize; i++){
                tBody_tr = this.createTBodytr();
                content_body.children.push(tBody_tr);
            }
            
            return content_body;
        },
    
        createTBodytr: function () {
            let setting = this.settings,
                content_body, tBody_td,
                i, j, length;
            
            content_body = {
                tagName: 'tr',
                props: {'class': 'num-line'},
                children: []
            };
    
            i = 0;
            length = setting.panelHeader.length;
            for(; i < length; i++ ) {
                let item = setting.panelHeader[i];
                if ( item.children !== undefined ) {
                    j = 0;
                    for (; j < item.children.length; j++ ) {
                        let sub_item = item.children[j];
                        tBody_td = this.createTBodytd(sub_item);
                        content_body.children.push(tBody_td);
                    }
                } else {
                    tBody_td = this.createTBodytd(item);
                    content_body.children.push(tBody_td);
                }
            }
            
            return content_body;
        },
        
        createTBodytd: function (item) {
            let content_body;
    
            content_body = {
                tagName: 'td',
                props: {
                    'class': 'contentHidden ' + (item.columnCls ? item.columnCls : '')
                },
                children: [' ']
            };
    
            return content_body;
        },
    
        //创建标题栏和关闭按钮
        createTitle: function () {
            let self = this,
                selfId = this.selfId,
                setting = this.settings,
                content_body, close_body,
                title_body, icon_body;
    
            content_body = {
                tagName: 'div',
                props: {
                    'class': 'list-panel-title'
                },
                children: []
            };
            
            if(setting.titleIcon){
                icon_body = Element({
                    tagName: 'img',
                    props: {
                        'src': setting.titleIcon,
                    }
                });
                content_body.children.push(icon_body);
            }
            
            if(setting.panelTitle){
                title_body = Element({
                    tagName: 'span',
                    children: [setting.panelTitle]
                });
                content_body.children.push(title_body);
            }
            
            if(setting.isClose){
                close_body = Element({
                    tagName: 'button',
                    props: {
                        'class': 'close-button',
                        'id': selfId.panel_close_id
                    }
                });
                content_body.children.push(close_body);
            }
            
            self.panel_body.children.push(content_body);
            
        },
        
        //创建顶部工具栏
        createToolbarTop: function () {
            let self = this,
                selfId = this.selfId,
                setting = this.settings,
                content_body, search_body,
                default_search_body, top_widgets_body;
    
            content_body = {
                tagName: 'div',
                props: {
                    'class': 'toolbar'
                },
                children: []
            };
            
            if(setting.topWidgets){
                
                top_widgets_body = this.createTopWidgets();
    
                content_body.children.push(Element(top_widgets_body));
                
            }
            
            if(setting.isSearch){
                
                default_search_body = this.createDefaultSearchWidget();
                
                search_body = {
                    tagName: 'span',
                    props: {
                        'class': 'search'
                    },
                    children: [
                        {
                            tagName: 'form',
                            props: {
                                'name': selfId.search_form_name,
                                'onsubmit': "return false;"
                            },
                            children: [default_search_body]
                        }
                    ]
                };
                
                content_body.children.push(Element(search_body));
                
            }
            
            self.panel_body.children.push(Element(content_body));
            
        },
    
        createDefaultSearchWidget: function () {
            let self = this,
                selfId = this.selfId,
                setting = this.settings,
                content_body;
            
            content_body = {
                tagName: 'span',
                props: {
                        'class': 'search-item'
                },
                children: [
                    Element({
                        tagName: 'input',
                        props: {
                            'id': selfId.search_key_id,
                            'class': 'search-key-input',
                            'placeholder': setting.searchConfig.inputTip
                        },
                    }),
                    Element({
                        tagName: 'button',
                        props: {
                            'id': selfId.search_button_id,
                            'class': 'imaged-button search-button',
                        },
                        children: [
                            Element({tagName: 'img', props: {'class': 'button-image', 'src': 'images/search16x16.png'}}),
                            Element({tagName: 'span', props: {'class': 'button-text'}, children: ['查询']})
                        ]
                    })
                ]
            };
            
            if(setting.searchConfig.title){
                content_body.children.unshift(Element({
                    tagName: 'label',
                    props: {'class': 'tool-text-pre'},
                    children: [setting.searchConfig.title]
                }));
                
            }
            
            return Element(content_body);
        },
    
        createTopWidgets(){
            let setting = this.settings,
                content_body,
                i = 0, length = setting.topWidgets.length;
            
            content_body = {
                tagName: 'span',
                props: {
                    'class': 'opt-tools'
                },
                children: []
            };
            
            for (; i < length; i++) {
                let item;
                
                item = this.createWidget(setting.topWidgets[i]);
                
                if(item){
                    content_body.children.push(item);
                }
                
            }
            
            return content_body;
            
            
        },
        
        createWidget: function (item) {
            let content_body,
                toolSpan;
            
            // enable 只有为 true 时才会创建 不存在，false，非Boolean值都不创建
            if (item.enable !== true) {
                return;
            }
    
            try {
                toolSpan = SA.createTool[item.type](item);
                content_body = toolSpan;
            }
            catch(err) {
                content_body = undefined ;
                console.error('没有 type 为 ' + item.type + ' ！');
            }
            
            
            return content_body;
        }
        
    },
    
    createTHeadtd: {
        
        text: function (item) {
            let content_body;
            content_body = {
                tagName: 'span',
                props:{},
                children: [item.title]
            };
            
            if(item.name){
                content_body.props.name = item.name;
            }
            
            return content_body;
        },
    
        checkbox: function (item) {
            let content_body,
                selfId = this.selfId;
            
            content_body = {
                tagName: 'input',
                props:{
                    'type': 'checkbox',
                    'id': selfId.control_checkbox_id,
                    'name': item.name ? item.name : 'checkbox'
                }
            };
            if(item.functions){
                $.each(item.functions,function (key,value) {
                    content_body.props[key] = value;
                })
            }
            return content_body;
        },
    
        radio: function (item) {
            let content_body,
                selfId = this.selfId;
            content_body = {
                tagName: 'span',
                props:{
                    'name': item.name ? item.name : 'radio'
                },
                children: ['请选择']
            };
            return content_body;
        },
    
        action: function (item) {
            let content_body,
                selfId = this.selfId;
            content_body = {
                tagName: 'span',
                props:{
                    'name': item.name ? item.name : 'action'
                },
                children: [item.title ? item.title : '操作']
            };
            return content_body;
        }
        
    }
    
    
    
});
