


function SATable(options) {
    this.settings = $.extend(true, {}, SATable.defaults, options);
    this.init();
}

$.extend(SATable, {
    
    // 默认设置
    defaults: {
        // 控制数据在哪里加载数据
        url: "",
        // 确定面板挂载在哪里
        parentId: "",
        // 默认名字myListPanel，当一个页面存在多个列表面板，此字段必填，以区别不同面板
        panelName: "myListPanel",
        // 控制数据项默认加载多少条，默认是15，此处可以在加载数据过程中更改，更改方法是从服务器加载数据到浏览器时，传一个page_size字段到浏览器
        pageSize: 15,
        // 可选 面板标题 默认不存在
        // panelTitle: "面板标题",
        // titleIcon: "标题icon",
        isClose: false,
        isPagingTools: true,
        isLoadAllData: true,
        isModal: false,
        modalConfig: {
            modalBoxSize: "l",
            modalLevel: 10,
        },
        isSearch: true,
        searchConfig: {
            inputTip: "输入关键字以查询...",
            // title: "某字段关键字"
        },
        render: {},
        check_obj: null,
        eventHandler: {
            before_load_data: "",
            after_load_data: ""
        },
        // panelHeader: [],
        // topWidgets: [],
        // bottomWidgets: [],
        extend_search: [],
        // bottomExtendWidgets: {},
        actions: {},
        // identifier: "wid",
        // 以下不用配置
        extendSendingData: {},
        defaultRender: {
            "checkbox": true,
            "radio": true
        },
        selectedItem: -1,
        firstPage: 1,
        currentPage: 1,
        totalPage: 0,
        fromNum: 0,
        toNum: 0,
        totalNum: 0
    },
    
    prototype: {
        init: function () {
            this.initVariable();
        },
        
        initVariable: function () {
            let panel_name = this.settings.panelName,
                selfId = {};
            
            /* 页面主体部分ID */
            selfId.panel_id          = "list_panel_id_for_" + panel_name;
            selfId.panel_close_id    = "list_panel_close_for_" + panel_name;
            selfId.panel_header_id   = "panel_header_id_for_" + panel_name;
            selfId.panel_body_id     = "rule_listb_for_" + panel_name;
    
            /* 页面搜索相关按钮的ID */
            selfId.search_form_name      = "list_panel_search_form_for_" + panel_name;
            selfId.search_key_id         = "search_key_for_" + panel_name;
            selfId.search_button_id      = "search_button_for_" + panel_name;
            selfId.extend_search_class   = "extend_search_for_" + panel_name;
    
            /* 控制页面选择的名目 */
            selfId.control_checkbox_id   = "control_checkbox_for_" + panel_name;
            selfId.checkbox_class        = "checkbox_item_for_" + panel_name;
            selfId.radio_name            = "radio_item_for_" + panel_name;
    
            /* 页面翻页按钮的ID */
            selfId.first_page_icon_id    = "first_page_icon_for_" + panel_name;
            selfId.last_page_icon_id     = "last_page_icon_for_" + panel_name;
            selfId.next_page_icon_id     = "next_page_icon_for_" + panel_name;
            selfId.end_page_icon_id      = "end_page_icon_for_" + panel_name;
            selfId.refresh_icon_id       = "refresh_icon_for_" + panel_name;
    
            /* 页面页数及条目信息控件的ID */
            selfId.current_page_id   = "current_page_for_" + panel_name;
            selfId.total_page_id     = "total_page_for_" + panel_name;
            selfId.from_num_id       = "from_num_for_" + panel_name;
            selfId.to_num_id         = "to_num_for_" + panel_name;
            selfId.total_num_id      = "total_num_for_" + panel_name;
            
            
            this.selfId = selfId;
            this.panel_body = {};
            this.detailData = {};
        },
        
        render: function () {
            this.displayTabel();
            this.initPagingTools();
        },
    
        /* 页面工具栏 */
        initPagingTools: function() {
            let self = this,
                setting = self.settings,
                selfID = self.selfId,
                panel_close_selector        = "#" + selfID.panel_close_id,
                first_page_icon_selector    = "#" + selfID.first_page_icon_id,
                last_page_icon_selector     = "#" + selfID.last_page_icon_id,
                current_page_selector       = "#" + selfID.current_page_id,
                next_page_icon_selector     = "#" + selfID.next_page_icon_id,
                end_page_icon_selector      = "#" + selfID.end_page_icon_id,
                refresh_icon_selector       = "#" + selfID.refresh_icon_id,
                search_key_selector         = "#" + selfID.search_key_id,
                search_button_selector      = "#" + selfID.search_button_id,
                isPagingTools               = setting.isPagingTools;
            
            /* 点击关闭按钮 */
            $(panel_close_selector).click(function() {
                self.hide();
            });
            
            if (isPagingTools === true) {
                /* 初始化翻页按钮的各个状态 */
                this.updatePagingToolsInfo();
                /* 点击第一页按钮 */
                $(first_page_icon_selector).click(function() {
                    self.firstPageOp();
                });
                /* 点击上一页按钮 */
                $(last_page_icon_selector).click(function() {
                    self.lastPageOp();
                });
                /* 输入页码,或者按enter键按钮 */
                $(current_page_selector).keydown(function(event) {
                    self.currentPageInputControl(event);
                });
                /* 点击下一页按钮 */
                $(next_page_icon_selector).click(function() {
                    self.nextPageOp();
                });
                /* 点击最后一页按钮 */
                $(end_page_icon_selector).click(function() {
                    self.endPageOp();
                });
                /* 点击刷新按钮 */
                $(refresh_icon_selector).click(function() {
                    self.updateInfo(true);
                });
                /* 在搜索框中输入关键字或者按enter键 */
                $(search_key_selector).keydown(function(event) {
                    self.searchInputControl(event);
                });
                /* 点击搜索按钮 */
                $(search_button_selector).click(function() {
                    self.updateInfo(true);
                });
            }
        
            /* 点击全选按钮 */
            this.initControlCheckbox();
        },
    
        /* 初始化全选按钮 */
        initControlCheckbox: function() {
            let self = this,
                selfID = self.selfId,
                control_checkbox_selector = "#" + selfID.control_checkbox_id;
            
            if ($(control_checkbox_selector).length > 0) {
                /* 如果存在全选按钮，初始化 */
                $(control_checkbox_selector).click(function() {
                    self.toggleCheckCurrentPage($(control_checkbox_selector)[0]);
                });
            }
        },
    
        /* 全选按钮的点击事件 */
        toggleCheckCurrentPage: function(element) {
            if (element.checked === true) {
                this.setCheckCurrentPage(true);
            } else {
                this.setCheckCurrentPage(false);
            }
        },
    
        /* 设置多选按钮通过全选按钮设置的选中状态 */
        setCheckCurrentPage: function(status) {
            let self = this,
                setting = self.settings,
                selfID = self.selfId,
                detail_data = self.detailData,
                from_num = setting.fromNum,
                to_num = setting.toNum,
                checkboxListeners = null,
                checkboxs = $("." + selfID.checkbox_class),
                checkedHash = {};
        
            /* 检查外接监听函数 */
            if (setting.render !== undefined) {
                let render = setting.render;
                if (render.checkbox !== undefined) {
                    let checkboxConfig = render.checkbox;
                    if (checkboxConfig.listeners !== undefined) {
                        checkboxListeners = checkboxConfig.listeners;
                    }
                }
            }
            
            /* 这里获取的checkbox数量可能少于一页的数量，因为有些checkbox可能不渲染，意为不可选*/
            for (let i = 0; i < checkboxs.length; i++) {
                let checked_item = checkboxs[i];
                // 利用数据项的id作为键值，选中的checkbox的id（i）作为值
                checkedHash[checked_item.value] = i;
            }
            
            for (let i = from_num; i < to_num; i++) {
                let data_item = detail_data[i - from_num];
                if (setting.isLoadAllData) {
                    data_item = self.detailData[i];
                }
            
                if (data_item === undefined) {
                    continue;
                }
                if (checkedHash[data_item.id] === undefined) {
                    /* 如果说页面中不存在此checkbox 跳过选中 */
                    continue;
                }
            
                let checkbox_element = checkboxs[checkedHash[data_item.id]];
                checkbox_element.checked = status; /* 改变按钮的状态 */
                data_item.checked = checkbox_element.checked; /* 改变数据记录 */
            
                if (checkboxListeners) {
                    if (checkboxListeners.click !== undefined) {
                        checkboxListeners.click(checkbox_element, data_item, self);
                    }
                }
            }
        },
        
        /* 功能  在搜索框中输入关键字或者按enter键 */
        searchInputControl: function(event) {
            let self = this,
                setting = self.settings,
                e = event || window.event, // IE、FF下获取事件对象
                cod = e.charCode || e.keyCode; // IE、FF下获取键盘码
            if (cod === 13) {
                this.updateInfo(true);
            }
        },
        
        /* 功能  点击最后一页按钮 */
        endPageOp: function() {
            let self = this,
                setting = self.settings;
            if (setting.currentPage < setting.totalPage) {
                setting.currentPage = setting.totalPage;
                this.updateInfo(false);
            }
        },
        
        /* 功能  点击下一页按钮 */
        nextPageOp: function() {
            let self = this,
                setting = self.settings;
            if (setting.currentPage < setting.totalPage) {
                setting.currentPage += 1;
                this.updateInfo(false);
            }
        },
        
        /* 功能  输入页码,或者按enter键按钮 */
        currentPageInputControl: function(event) {
            /* 8：退格键、46：delete、37-40： 方向键
            ** 48-57：主键盘区的数字、96-105：小键盘区的数字
            ** 110、190：小键盘区和主键盘区的小数
            ** 189、109：小键盘区和主键盘区的负号
            ** enter:13
            **/
            let self = this,
                selfID = self.selfId,
                setting = self.settings,
                current_page_selector = "#" + selfID.current_page_id,
                e = event || window.event, // IE、FF下获取事件对象
                cod = e.charCode || e.keyCode; // IE、FF下获取键盘码
            
            if (cod === 13) {
                /* 按enter键 */
                setting.currentPage = Number($(current_page_selector).val());
                this.updateInfo(false);
            } else {
                if (cod !== 8 && cod !== 46 && !((cod >= 48 && cod <= 57) || (cod >= 96 && cod <= 105) || (cod >= 37 && cod <= 40))) {
                    notValue(e);
                }
            }
            function notValue(event) {
                event.preventDefault ? event.preventDefault() : event.returnValue = false;
            }
        },
        
        /* 点击上一页按钮 */
        lastPageOp: function() {
            let self = this,
                setting = self.settings;
            if (setting.currentPage > setting.firstPage) {
                setting.currentPage -= 1;
                this.updateInfo(false);
            }
        },
        
        /* 功能  点击第一页按钮 */
        firstPageOp: function() {
            let self = this,
                setting = self.settings;
            if (setting.currentPage > setting.firstPage) {
                setting.currentPage = setting.firstPage;
                this.updateInfo(false);
            }
        },
        
        /* 列表页面隐藏 */
        hide: function() {
            let self = this,
                setting = self.settings,
                check_in_selector = "#" + setting.parentId;
            
            $(check_in_selector).hide();
        },
        
        updateInfo: function (refresh) {
            let self = this,
                setting = self.settings;
            
            /* 第一步：判断是否需要重新加载数据 */
            if (!setting.isLoadAllData || refresh) {
                /* 根据现在定位的页数，加载一页的数据 */
                this.loadData();
            } else {
                /* 更新paging的数据 */
                this.updatePagingHolder();
                /* 更新页面主体的数据 */
                this.loadDataIntoMainBody();
                /* 更新翻页工具的数据 */
                this.updatePagingToolsInfo();
                /* 给页面上的控制按钮注册监听 */
                this.addListenerToControlItems();
            }
        },
        
        loadData: function () {
            let self = this,
                setting = self.settings,
                eventHandler = setting.eventHandler,
                sendData,
                searchData, extendSendingData;
            
            sendData = {
                action: "loadData",
                currentPage: setting.currentPage,
                pageSize: setting.pageSize,
                panelName: setting.panelName
            };
            if (eventHandler !== null && eventHandler.beforeLoadData !== undefined) {
                eventHandler.beforeLoadData(self, sendData);
            }
            
            /* 加入要传输的扩展数据以及查询数据 */
            searchData = this.getSearchKeys();
            extendSendingData = setting.extendSendingData;
            $.extend(true, sendData, searchData, extendSendingData);
    
            function ondatareceived(data) {
                console.log(data);
                self.resetControlCheckbox();
                self.detailData   = data.detailData;
                if (data.totalNum) {
                    setting.totalNum = Number(data.totalNum);
                } else {
                    if (data.detailData) {
                        setting.totalNum = Number(data.detailData.length);
                    } else {
                        setting.totalNum = Number("0");
                    }
                }
    
                self.refreshListPanel(data);
                
                /* 调用可能的外接函数 */
                if (eventHandler !== null && eventHandler.afterLoadData !== undefined) {
                    eventHandler.afterLoadData(self, data);
                }
    
                /* 更新paging的数据 */
                self.updatePagingHolder();
                /* 更新页面主体的数据 */
                self.loadDataIntoMainBody();
                /* 更新翻页工具的数据 */
                self.updatePagingToolsInfo();
                /* 给页面上的控制按钮注册监听 */
                self.addListenerToControlItems();
            }
    
            this.request_for_json(sendData, ondatareceived);
        },
    
        /* 给页面上的控制按钮注册监听 */
        addListenerToControlItems: function() {
            let self = this;
    
            self.addListenerToCheckboxs();
            self.addListenerToRadios();
            // self.add_listener_to_toggle_enable();
            // self.add_listener_to_edit_buttons();
            // self.add_listener_to_delete_buttons();
            //
            self.addListenerToSelectItem();
        },
    
        /* 页面上的选中状态 */
        addListenerToSelectItem: function () {
            $("tr[class='num-line']").click(function () {
                $(this).siblings().removeClass("num-line-action");
                $(this).addClass("num-line-action");
            });
        },
        
        /* 给页面上的单选按钮注册监听 */
        addListenerToRadios: function() {
            let self = this,
                setting = self.settings,
                selfID = self.selfId,
                radios = $("input[name='" + selfID.radio_name + "']"),
                radioListeners = null;
            
            if (setting.render !== undefined) {
                let render = setting.render;
                if (render.radio !== undefined) {
                    let radio = render.radio;
                    if (radio.listeners !== undefined) {
                        radioListeners = radio.listeners;
                    }
                }
            }
            
            radios.each(function() {
                let radio_handle = this;
                $(radio_handle).click(function() {
                    self.setCheckSingle(this.value, this.checked);
                });
            
                /* 注入外界定义的函数 */
                if (radioListeners) {
                    for (let listener in radioListeners) {
                        $(radio_handle).bind(listener, function(event) {
                            let data_item = self.getItem($(radio_handle).val());
                            radioListeners[listener](radio_handle, data_item, event, self);
                        });
                    }
                }
            });
        },
        
        /* 给页面上的多选按钮注册监听 */
        addListenerToCheckboxs: function() {
            let self = this,
                setting = self.settings,
                selfID = self.selfId,
                checkboxs = $("." + selfID.checkbox_class),
                checkboxListeners = null;
            
            if (setting.render !== undefined) {
                let render = setting.render;
                if (render.checkbox !== undefined) {
                    let checkbox = render.checkbox;
                    if (checkbox.listeners !== undefined) {
                        checkboxListeners = checkbox.listeners;
                    }
                }
            }
    
            checkboxs.each(function() {
                let checkbox_handle = this;
                $(checkbox_handle).click(function() {
                    self.setCheck(this.value, this.checked);
                });
        
                /* 注入外界定义的函数 */
                if (checkboxListeners) {
                    for (let listener in checkboxListeners) {
                        $(checkbox_handle).bind(listener, function(event) {
                            let data_item = self.getItem($(checkbox_handle).val());
                            checkboxListeners[listener](checkbox_handle, data_item, this);
                        });
                    }
                }
            });
        },
    
        /*
        * 功能  通过id获得整个数据对象
        * 参数  id
        * 返回  数据对象
        */
        getItem: function(item_id) {
            let self = this,
                detailData = self.detailData;
            for (let i = 0; i < detailData.length; i++) {
                let item = detailData[i];
                if (item.id === item_id) {
                    return item;
                }
            }
        },
        
        /*
        * 功能  设置选中效果
        * 参数  item_id ———— 想要设置选中效果行的id
        *       checked ———— true 选中  false 不选中
        */
        setCheck: function(item_id, checked) {
            let self = this,
                detailData = self.detailData;
            for (let i = 0; i < detailData.length; i++) {
                if (detailData[i].id === item_id) {
                    self.detailData[i].checked = checked;
                    break;
                }
            }
        },
    
        /*
        * 功能  设置唯一的选中效果
        * 参数  item_id ———— 想要设置选中效果行的id
        *       checked ———— true 选中  false 不选中
        */
        setCheckSingle: function(item_id, checked) {
            let self = this,
                detailData = self.detailData;
            for (let i = 0; i < detailData.length; i++) {
                if (detailData[i].id === item_id) {
                    self.detailData[i].checked = checked;
                } else {
                    self.detailData[i].checked = !checked;
                }
            }
        },
        
        /* ajax请求 */
        request_for_json: function(sendData, ondatareceived, onerror) {
            let self = this,
                setting = self.settings,
                url = setting.url;
            
            SA.postRequest(url, sendData, ondatareceived, "json");
        },
        
        /* 功能  初始化翻页按钮的各个状态 */
        updatePagingToolsInfo: function() {
            let self = this,
                setting = self.settings,
                selfID = self.selfId,
                current_page = setting.currentPage,
                total_page = setting.totalPage,
                total_num = setting.totalNum,
                /* 跟真实数组下标不同 */
                from_num = setting.fromNum + 1,
                to_num = setting.toNum;
    
            /* 没有记录时 */
            if (to_num === 0) {
                from_num = 0;
            }
            /* 更新翻页数字信息 */
            $("#" + selfID.current_page_id).val(current_page);
            $("#" + selfID.total_page_id).html(total_page);
            $("#" + selfID.total_num_id).html(total_num);
            $("#" + selfID.from_num_id).html(from_num);
            $("#" + selfID.to_num_id).html(to_num);
            /* 更新翻页工具按钮状态 */
            if (total_page <= 1) {
                /* 总共不到一页的数据 */
                this.disableFirstLastPageOp();
                this.disableNextEndPageOp();
            } else {
                if (current_page === setting.firstPage) {
                    this.disableFirstLastPageOp();
                    this.enableNextEndPageOp();
                } else if (current_page === setting.totalPage) {
                    this.enableFirstLastPageOp();
                    this.disableNextEndPageOp();
                } else {
                    this.enableFirstLastPageOp();
                    this.enableNextEndPageOp();
                }
            }
        },
    
        /* 功能  启用第一页和上一页按钮 */
        enableFirstLastPageOp: function() {
            let self = this,
                selfID = self.selfId,
                first_page_icon_selector = "#" + selfID.first_page_icon_id,
                last_page_icon_selector = "#" + selfID.last_page_icon_id;
            $(first_page_icon_selector).addClass("paging-enabled");
            $(last_page_icon_selector).addClass("paging-enabled");
        },
    
        /* 功能  启用下一页和最后一页按钮 */
        enableNextEndPageOp: function() {
            let self = this,
                selfID = self.selfId,
                next_page_icon_selector = "#" + selfID.next_page_icon_id,
                end_page_icon_selector = "#" + selfID.end_page_icon_id;
            $(next_page_icon_selector).addClass("paging-enabled");
            $(end_page_icon_selector).addClass("paging-enabled");
        },

        /* 功能  禁用第一页和上一页按钮 */
        disableFirstLastPageOp: function() {
            let self = this,
                selfID = self.selfId,
                first_page_icon_selector = "#" + selfID.first_page_icon_id,
                last_page_icon_selector = "#" + selfID.last_page_icon_id;
            $(first_page_icon_selector).removeClass("paging-enabled");
            $(last_page_icon_selector).removeClass("paging-enabled");
        },

        /* 功能  禁用下一页和最后一页按钮 */
        disableNextEndPageOp: function() {
            let self = this,
                selfID = self.selfId,
                next_page_icon_selector = "#" + selfID.next_page_icon_id,
                end_page_icon_selector = "#" + selfID.end_page_icon_id;
            $(next_page_icon_selector).removeClass("paging-enabled");
            $(end_page_icon_selector).removeClass("paging-enabled");
        },
        
        /* 功能  更新页面主体的数据 */
        loadDataIntoMainBody: function() {
            let self = this,
                setting             = self.settings,
                selfId              = self.selfId,
                render              = setting.render,
                default_render      = setting.defaultRender,
                page_size           = setting.pageSize,
                from_num            = setting.fromNum,
                to_num              = setting.toNum,
                selected_item       = setting.selectedItem,
                display_cols        = this.getDisplayCols(),
                detail_data         = self.detailData,
                listb_tr_selector   = "#" + selfId.panel_body_id + " tr",
                listb_tr            = $(listb_tr_selector),
                tr_num              = 0;
    
            for (tr_num; tr_num < to_num - from_num; tr_num++) {
                let current_line = tr_num + from_num;
                
                /* 数据是按页加载，detail_data里面只存了一页的数据 */
                if (!setting.isLoadAllData) {
                    current_line = tr_num;
                }
                
                let data_item = detail_data[current_line];
                if (data_item.hasOwnProperty("id")) {
                    if (data_item.id === selected_item) {
                        listb_tr.eq(tr_num).addClass("selected-line");
                    } else {
                        listb_tr.eq(tr_num).removeClass("selected-line");
                    }
                }
                for (let j = 0; j < display_cols.length; j++) {
                    let variable_name = display_cols[j];
                    let rendered_text = data_item[variable_name];
                    let $table_cell = listb_tr.eq(tr_num).find("td").eq(j);
                    if (rendered_text === undefined) {
                        rendered_text = "";
                    }
            
                    /* 渲染文本 获取默认渲染值 */
                    if (variable_name in default_render) {
                        rendered_text = this.renderDefault(variable_name, data_item);
                        if (rendered_text !== false && rendered_text !== undefined) {
                            $table_cell.html(rendered_text);
                        }
                    } else {
                        /* 如果定义了渲染对象，并满足一定条件，进行文本渲染 */
                        if (render !== undefined && variable_name in render) {
                            if (render[variable_name].render !== undefined) {
                                rendered_text = render[variable_name].render(rendered_text, data_item, $table_cell[0], current_line);
                            }
                            if (rendered_text !== false && rendered_text !== undefined) {
                                $table_cell.html(rendered_text);
                            }
                        } else {
                            $table_cell.text(rendered_text);
                        }
                    }
                }
            }
            this.contextHidden();
            /* 清理掉剩余的数据容器中的数据 */
            if (to_num < from_num + page_size) {
                for (tr_num = to_num - from_num; tr_num < page_size; tr_num++) {
                    for (let j = 0; j < display_cols.length; j++) {
                        listb_tr.eq(tr_num).find("td").eq(j).html("&nbsp");
                    }
                }
            }
        },
    
        /*
        * 功能  获取到header中要显示的列中的name
        * 返回  返回由这些name组成的数组
        */
        getDisplayCols: function() {
            let self = this,
                setting = self.settings,
                panel_header = setting.panelHeader,
                display_cols = [];
    
    
            for (let i = 0; i < panel_header.length; i++) {
                let item = panel_header[i];
                if (item.enable !== undefined && item.enable) {
                    if (item.children !== undefined) {
                        for (let j = 0; j < item.children.length; j++) {
                            let sub_item = item.children[j];
                            display_cols.push(sub_item.name);
                        }
                    } else {
                        display_cols.push(item.name);
                    }
                }
            }
    
            return display_cols;
        },
        
        /* 添加title属性显示隐藏内容 */
        contextHidden: function() {
            let self = this,
                selfId = self.selfId;
            $("#" + selfId.panel_id + " td.contentHidden").each(function() {
                if (this.offsetWidth < this.scrollWidth) {
                    // 处理title内容
                    let tex = $(this).text();
                    $(this).attr("title", tex);
                } else {
                    $(this).attr("title", "");
                }
            });
        },
    
        /* 功能  获取到默认值进行渲染 */
        renderDefault: function(type, data_item) {
            let self = this,
                setting = self.settings,
                selfId = self.selfId,
                rendered_text = {};
            
            // 针对并不以id作为唯一标识的数据
            if (!data_item.id) {
                data_item.id = data_item[setting.identifier];
            }
    
            if (type === "checkbox") {
                let checkbox_class = selfId.checkbox_class,
                    body;
                body = {
                    tagName: "input",
                    props: {
                        "type": "checkbox",
                        "class": checkbox_class,
                        "value": data_item.id
                    }
                };
                if (data_item.checked) {
                    body.props.checked = "checked";
                }
                rendered_text = Element(body).render();
            } else if (type === "radio") {
                let radio_name = selfId.radio_name,
                    body;
                body = {
                    tagName: "input",
                    props: {
                        "type": "radio",
                        "name": radio_name,
                        "value": data_item.id
                    }
                };
                if (data_item.checked) {
                    body.props.checked = "checked";
                }
                rendered_text = Element(body).render();
            }
    
            return rendered_text;
        },
        
        /* 更新paging的数据 */
        updatePagingHolder: function() {
            let self = this,
                setting = self.settings,
                total_num = setting.totalNum,
                page_size = setting.pageSize,
                current_page = setting.currentPage,
                total_page = 1, from_num, to_num;
    
            if (total_num % page_size === 0 && total_num > 0) {
                total_page = Math.floor((total_num / page_size));
            } else {
                total_page = Math.floor((total_num / page_size)) + 1;
            }
            
            if (current_page <= 0) {
                current_page = 1;
            } else if (current_page > total_page) {
                current_page = total_page;
            }
    
            from_num = (current_page - 1) > 0 ? (current_page - 1) * page_size : 0;
            if (from_num > total_num) {
                from_num = total_num;
            }
    
            to_num = current_page * page_size;
            if (to_num > total_num) {
                to_num = total_num;
            }
    
            /* Update settings */
            setting.totalPage    = total_page;
            setting.currentPage  = current_page;
            setting.fromNum      = from_num;
            setting.toNum        = to_num;
        },
        
        /* 更新列表数据 */
        refreshListPanel: function(data) {
            let self = this,
                setting = self.settings,
                pageSize;
    
            /* 查看是否需要渲染页数 */
            if (data.page_size !== undefined) {
                pageSize = Number(data.pageSize);
                if (setting.pageSize !== pageSize) {
                    /* 如果请求数据回来pageSize发生了变化，要重新生成页面主体 */
                    setting.page_size = page_size;
                    this.refreshListPanelBody();
                }
            }
        },
    
        /* 更新面板中的table主体部分 */
        refreshListPanelBody: function() {
            let selfId = this.selfId,
                panelBodySelector = "#" + selfId.panel_body_id,
                panelBody;
    
            panelBody = this.createTBodytr();
            $(panelBodySelector).html(Element(panelBody).render());
        },
        
        /* 页面刷新的时候重置全选按钮 */
        resetControlCheckbox: function() {
            var paging_holder = this;
        
            var control_checkbox_id = paging_holder.control_checkbox_id;
            var control_checkbox_selector = "#" + paging_holder.control_checkbox_id;
            if( $( control_checkbox_selector ).length > 0 ) {
                document.getElementById( control_checkbox_id ).checked = false;
            }
        },
        
        // 功能  获得查询条件
        // 返回  查询数据
        getSearchKeys: function() {
            let self = this,
                selfId = this.selfId,
                searchingData = {},
                searchKeySelector = "#" + selfId.search_key_id,
                extendSearch = "." + selfId.extend_search_class;
        
            /* 加入普通查询条件 */
            if ($(searchKeySelector).val().toString()) {
                searchingData.search = $(searchKeySelector).val();
            }
        
            /* 加入扩展查询条件 */
            $(extendSearch).each(function() {
                let extendSearchHandle = this;
                searchingData[$(extendSearchHandle).attr("name")] = $(extendSearchHandle).val();
            });
        
            return searchingData;
        },
    
        // 自适应高度
        redraw: function () {
            let self = this,
                setting = this.settings,
                selfId = this.selfId,
                $parent = $("#" + setting.parentId),
                $panelHeader = $("#" + selfId.panel_header_id),
                contentHeight, footHeight, headHeight,
                equalize, e_contentHeight;
            
            footHeight = (setting.isPagingTools || setting.bottomWidgets) ? 36 : 0;
            footHeight += setting.bottomExtendWidgets ? 37 : 0;
            
            headHeight = (setting.panelTitle || setting.isClose) ? 36 : 0;
            headHeight += (setting.topWidgets || setting.isSearch) ? 36 : 0;
    
            e_contentHeight = ($parent.height() - footHeight - headHeight - $panelHeader.height()) / 32;
            contentHeight = ~~(e_contentHeight);
            
            equalize = (e_contentHeight - contentHeight) * 32;
            setting.equalize = equalize;
            
            setting.pageSize = contentHeight;
    
            self.render();
            self.updateInfo();
        },
    
        // 创建整个tabel面板
        displayTabel: function () {
            let self = this,
                selfId = this.selfId,
                setting = this.settings,
                $parent = $('#' + setting.parentId);
    
            self.panel_body = {
                tagName: 'div',
                props: {
                    'class': 'list',
                    'id': selfId.panel_id
                },
                children: []
            };
            
            // 创建 标题栏 和 关闭模块按钮
            if(setting.panelTitle || setting.isClose){
                this.createTitle();
            }
            
            // 创建 搜索栏 和 顶部按钮模块
            if(setting.topWidgets || setting.isSearch){
                this.createToolbarTop();
            }
            
            // 创建 table主体部分
            if(setting.panelHeader){
                this.createTable();
            }
            
            // 创建 翻页工具栏 和 底部按钮模块
            if(setting.isPagingTools || setting.bottomWidgets){
                this.createToolbarBottom();
            }
            
            // 创建 底部按钮 【比如确认取消按钮】
            if(setting.bottomExtendWidgets){
                this.createExtendBottom();
            }
            
            if(setting.equalize){
                this.createEqualize();
            }
    
            $parent.empty();
            $parent.append(Element(self.panel_body).render());
        },
    
        createEqualize: function () {
            let self = this,
                setting = this.settings,
                ExBottom = setting.bottomExtendWidgets,
                content_body;
            
            content_body = {
                tagName: 'div',
                props: {
                    style: 'width: 100%; height: ' + (setting.equalize / 2) + 'px; background-color: #2b2b2b;'
                }
            };
            
            self.panel_body.children.push(Element(content_body));
        },
    
        createExtendBottom: function () {
            let self = this,
                setting = this.settings,
                ExBottom = setting.bottomExtendWidgets,
                content_body,
                i, length;
            
            content_body = {
                tagName: 'div',
                props: {
                    'class': ExBottom.cls !== undefined ? 'toolbar ' + ExBottom.cls : 'toolbar'
                },
                children: []
            };
    
            i = 0;
            length = ExBottom.sub_items.length;
            for (; i < length; i++) {
                let item;
        
                item = this.createWidget(ExBottom.sub_items[i]);
        
                if(item){
                    content_body.children.push(item);
                }
            }
    
            self.panel_body.children.push(Element(content_body));
        },
    
        createToolbarBottom: function () {
            let self = this,
                selfId = this.selfId,
                setting = this.settings,
                content_body, paging_body,
                bottom_widgets_body;
    
            content_body = {
                tagName: 'div',
                props: {'class': 'toolbar'},
                children: []
            };
            
    
            if (setting.bottomWidgets) {
                bottom_widgets_body = this.createTopWidgets(setting.bottomWidgets);
        
                content_body.children.push(Element(bottom_widgets_body));
            }
    
            if (setting.isPagingTools) {
    
                paging_body = {
                    tagName: 'span',
                    props: {
                        'class': 'paging-tools'
                    },
                    children: [{
                        tagName: 'span',
                        props: {
                            id: selfId.first_page_icon_id,
                            class: 'icon iconfont icon-diyiye paging-enabled',
                            title: '第一页'
                        }
                    }, {
                        tagName: 'span',
                        props: {
                            id: selfId.last_page_icon_id,
                            class: 'icon iconfont icon-shangyiye paging-enabled',
                            title: '上一页'
                        }
                    }, {
                        tagName: 'span',
                        props: {class: 'paging-text'},
                        children: ['第',{
                            tagName: 'input',
                            props: {
                                id: selfId.current_page_id,
                                class: 'paging-tool-text',
                                type: 'text',
                                onkeyup: 'this.value=this.value.replace(/\D/g,"")',
                                onafterpaste: 'this.value=this.value.replace(/\D/g,"")'
                            }
                        }, '页,共', {
                            tagName: 'span',
                            props: {
                                id: selfId.total_page_id,
                                class: 'paging-tool-text'
                            },
                            children: ['0']
                        }, '页']
                    }, {
                        tagName: 'span',
                        props: {
                            id: selfId.next_page_icon_id,
                            class: 'icon iconfont icon-xiayiye paging-enabled',
                            title: '下一页'
                        }
                    }, {
                        tagName: 'span',
                        props: {
                            id: selfId.end_page_icon_id,
                            class: 'icon iconfont icon-zuihouyiye paging-enabled',
                            title: '最后一页'
                        }
                    }, {
                        tagName: 'span',
                        props: {
                            id: selfId.refresh_icon_id,
                            class: 'icon iconfont icon-shuaxin paging-enabled',
                            title: '刷新'
                        }
                    }, {
                        tagName: 'span',
                        props: {class: 'paging-text'},
                        children: ['显示', {
                            tagName: 'span',
                            props: {
                                id: selfId.from_num_id,
                                class: 'paging-tool-text'
                            },
                            children: ['0']
                        }, '-', {
                            tagName: 'span',
                            props: {
                                id: selfId.to_num_id,
                                class: 'paging-tool-text'
                            },
                            children: ['0']
                        }, '条,共', {
                            tagName: 'span',
                            props: {
                                id: selfId.total_num_id,
                                class: 'paging-tool-text'
                            },
                            children: ['0']
                        }, '条']
                    }]
                };
                
                content_body.children.push(Element(paging_body));
            }
    
            self.panel_body.children.push(Element(content_body));
        },
    
        // 创建table主体部分
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
            
            // 确定是否为二级表头，最多只支持二级
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
                } catch (e) {
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
                tagName: "tbody",
                props: {
                    "class": "rule-listb",
                    "id": selfId.panel_body_id
                },
                children: []
            };
            
            for (; i < setting.pageSize; i++) {
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
                tagName: "tr",
                props: {"class": "num-line"},
                children: []
            };
    
            i = 0;
            length = setting.panelHeader.length;
            for (; i < length; i++) {
                let item = setting.panelHeader[i];
                if (item.children !== undefined) {
                    j = 0;
                    for (; j < item.children.length; j++) {
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
    
        // 创建标题栏和关闭按钮
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
        
        // 创建顶部工具栏
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
                
                top_widgets_body = this.createTopWidgets(setting.topWidgets);
    
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
    
        createTopWidgets(items){
            let setting = this.settings,
                content_body,
                i = 0, length = items.length;
            
            content_body = {
                tagName: 'span',
                props: {
                    'class': 'opt-tools'
                },
                children: []
            };
            
            for (; i < length; i++) {
                let item;
                
                item = this.createWidget(items[i]);
                
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
            catch (err) {
                content_body = undefined;
                console.error('没有 type 为 ' + item.type + ' ！');
            }
            
            
            return content_body;
        },
    
        /*
        * 功能  创建action中的按钮
        * 参数  action_buttons    定义的按钮的集合数组
        * 返回  buttons           按键的html标签
        */
    },
    
    create_action_buttons: function(items) {
        let contentBody,
            inputProps;
        
        if (items === undefined) {
            return; /* 如果没有定义相应的对象，直接返回 */
        }
        
        contentBody = {
            tagName: "div",
            props: {},
            children: []
        };
        
        $.each(items, function (index, item) {
            if (item.enable === undefined || !item.enable){
                return true;
            }
            let itemBody = {
                tagName: "input",
                props: {
                    type: "image",
                    class: (item.cls !== undefined && item.cls) ? "action-image " + item.cls : "action-image",
                    
                }
            };
            
            let inputProps = itemBody.props;
            
            item.id     ? inputProps.id     = item.id   : true;
            item.name   ? inputProps.name   = item.name : true;
            item.text   ? inputProps.title  = item.text : true;
            item.icon   ? inputProps.src    = item.icon : true;
            item.value   ? inputProps.value = item.value : true;
            
            if (item.functions) {
                $.each(item.functions, function(key, value) {
                    inputProps[key] = value;
                });
            }
            
            contentBody.children.push(itemBody);
        });
        
        return Element(contentBody).render();
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
