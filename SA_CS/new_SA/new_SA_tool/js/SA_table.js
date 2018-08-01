


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
        panelHeader: [],
        // topWidgets: [],
        bottom_widgets: [],
        extend_search: [],
        bottom_extend_widgets: [],
        actions: {}
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
    
            /*页面搜索相关按钮的ID*/
            selfId.search_form_name      = "list_panel_search_form_for_" + panel_name;
            selfId.search_key_id         = "search_key_for_" + panel_name;
            selfId.search_button_id      = "search_button_for_" + panel_name;
            selfId.extend_search_class   = "extend_search_for_" + panel_name;
            
            this.selfId = selfId;
            this.panel_body = {};
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
            
            if(setting.panelTitle || setting.isClose){
                this.createTitle();
            }
            
            this.createToolbarTop();
            
            $('#'+setting.parentId).append(Element(self.panel_body).render());
            
            
        },
    
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
                    props: {'class': 'prefix-label-for-widget'},
                    children: [setting.searchConfig.title]
                }));
                
            }
            
            return Element(content_body);
        },
    
        createTopWidgets(){
            let self = this,
                selfId = this.selfId,
                setting = this.settings,
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
                
                item = this.createTopWidget(setting.topWidgets[i]);
                
                if(item){
                    content_body.children.push(item);
                }
                
            }
            
            return content_body;
            
            
        },
        
        createTopWidget: function (item) {
            let content_body,
                toolSpan;
            
            // enable 只有为 true 时才会创建 不存在，false，非Boolean值都不创建
            if (item.enable !== true) {
                return;
            }
            
            content_body = {
                tagName: 'span',
                props: {
                    'class': 'widgets-item'
                },
                children: []
            };
    
            try {
                toolSpan = SATable.createToolspan[item.type](item);
                content_body.children = toolSpan;
            }
            catch(err) {
                content_body = undefined ;
                console.error('没有 type 为 ' + item.type + ' ！');
            }
            
            
            return content_body;
        }
        
        
        
    },
    
    createToolspan: {
        checkbox: function (item) {
            let content_body;
            
            content_body = [
                Element({
                    tagName: 'input',
                    props: {
                        id: item.id ? item.id : '',
                        name: item.name ? item.name : '',
                        type: 'checkbox'
                    }
                })
            ];
            if(item.text){
                content_body.push(Element({
                    tagName: 'label',
                    props: {
                        class: 'postfix-label-for-widget',
                        for: item.name ? item.name : ''
                    },
                    children: [item.text]
                }))
            }
            
            return content_body;
        },
    
        select: function (item) {
            let content_body;
    
            content_body = [
                Element({
                    tagName: 'select',
                    props: {
                        id: item.id ? item.id : '',
                        name: item.name ? item.name : ''
                    },
                    children: []
                })
            ];
    
            if(item.label || item.title){
                content_body.unshift(Element({
                    tagName: 'label',
                    props: {
                        class: 'prefix-label-for-widget',
                        for: item.name ? item.name : ''
                    },
                    children: [item.label ? item.label : item.title]
                }))
            }
            
            
            if(!item.options){
                return content_body;
            }
            
            function selectOption() {
                
            }
            
            
        },
        
        label: function () {
        
        }
    }
    
    
});

// var a = '<span class="widgets-item">' +
//             '<input type="checkbox" id="stop_refresh" name="stop_refresh">' +
//             '<label for="stop_refresh" class="postfix-label-for-widget">停止刷新</label>' +
//         '</span>' +
//         '<span class="widgets-item">' +
//             '<label for="select_test" class="prefix-label-for-widget">测试选择框</label>' +
//             '<select id="select_test" name="select_test">' +
//                 '<option value="test1">test1</option>' +
//             '</select>' +
//         '</span>'