
function SATable(options) {
    this.settings = $.extend(true, {}, SATable.defaults, options);
    // this.init();
}

$.extend(SATable, {
    
    // 默认设置
    defaults: {
        url: "",
        parentId: "",
        panelName: "my_list_panel",
        pageSize: 15,
        panelTitle: "面板标题",
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
            title: ""
        },
        render: {},
        check_obj: null,
        eventHandler: {
            beforeLoadData : "",
            afterLoadData : ""
        },
        panel_header: [],
        top_widgets: [],
        bottom_widgets: [],
        extend_search: [],
        bottom_extend_widgets: [],
        actions: {}
    }
    
    
});