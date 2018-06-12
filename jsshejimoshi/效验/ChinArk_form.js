//Date:2012-08-15
//功能：表单检查类
//作者:zhouyuan
//传入：表单内的元素object
function ChinArk_forms() {
    this.text_check = {
        "ip": "IP",
        "mask": "mask",
        "ip_range": "IP范围",
        "ipv6": "ipv6",
        "ip_mask": "IP/掩码",
        "mac": "MAC地址",
        "port": "端口",
        "port_range": "端口范围",
        "url": "URL",
        "domain": "域名",
        "name": "应在1-20个字符之间",
        "specify_name": "指定长度的字符串名称",
        "mail": "邮箱",
        "note": "注释",
        "num": "自然字",
        "int": "正整数",
        "float": "正小数",
        "percent": "百分数",
        "domain_suffix": "域",
        "regexp": "正则表达式的合法性",
        "phone_number": "电话号码",
        "fax": "传真号码",
        "udp": "udp或udp范围",
        "tcp": "tcp或tcp范围",
        "other": "其他"
    };//表单项检查类型
    this.option_type = {
        "text": "文本框",
        "password": "密码框",
        "select-one": "单选下拉",
        "select-multiple": "多选下拉",
        "checkbox": "复选框",
        "textarea": "文本域",
        "radio": "单选框",
        "file": "文件上传"
    };
    this.option_name = {
        "text": "input",
        "select-one": "select",
        "select-multiple": "select",
        "checkbox": "input",
        "textarea": "textarea",
        "radio": "input",
        "file": "input",
        "password": "input",
        "date": "input"
    }
    this.required = 1;
    this.cur_time = 0;
    this.last_time = 0;
}
ChinArk_forms.prototype = {
    _main: function (obj) {
        this._checkArgument(obj);
        var option = obj.option;
        var form_name = obj.form_name;
        for (var x in option) {
            this._checkFormOption(option[x], x);
            this._iniArgumentList(option[x]);
            this._addEventListener(option[x], x, form_name, option);
        }
        this._addFormSubmit(obj);
    },
    addEvent: function (obj, name, f_obj) {//提供给外界自己添加事件处理函数，兼容ie和firefox
        if (!(obj && name && f_obj)) { alert("添加相关联的" + name + "事件失败！"); return; }
        if (/^on/.test(name)) { alert("传入的事件名不用带on"); return; }
        if (document.all) { obj.attachEvent("on" + name, f_obj) }
        else { obj.attachEvent(name, f_obj) }
    },
    _addFormSubmit: function (obj) {
        var me = this;
        if (document.all) {
            me._getElementsByName(obj.form_name, "form")[0].attachEvent("onsubmit", function () {
                var error_length = me._submit_check(obj, me); if (error_length > 0) return false;
            })
        }//兼容IE
        else {
            //pj:2016-09-02 modify the document not exists;
            if (me._getElementsByName(obj.form_name, "form").length > 0) {
                me._getElementsByName(obj.form_name, "form")[0].addEventListener("submit", function (event) {
                    var error_length = me._submit_check(obj, me);
                    if (error_length > 0) event.preventDefault();
                }, true);
            } else {
                return;
            }

        }
    },
    _check_hidden: function (obj, form_name, option_obj) {//产看当前元素的显隐状态
        if (option_obj) {
            if (option_obj["option"]["hidden_check"]) {
                return "check";
            }
        }
        var form_obj = this._getElementsByName(form_name, "form")[0];
        var cur_display = document.all ? obj.currentStyle.display : document.defaultView.getComputedStyle(obj, null).display;
        var cur_hidden = document.all ? obj.currentStyle.display : document.defaultView.getComputedStyle(obj, null).visibility;
        var display = cur_display;
        var next = 1;
        while (next) {
            if (cur_display == 'none' || cur_hidden == 'hidden') { next = 0; display = "none"; }
            else if (obj.parentNode != form_obj) {
                obj = obj.parentNode;
                display = this._check_hidden(obj, form_name);
                next = 0;
            } else {
                next = 0;
            }
        }
        return display;
    },
    _show_con: function (show_con_name) {
        if (this._getElementsByName(show_con_name, "div")) {
            var cur_obj = this._getElementsByName(show_con_name, "div");
            var toggle_img = $(".toggle");
            for (var j = 0; j < toggle_img.length; j++) {
                toggle_img.attr("src", "/images/collapse.png");
            }
            for (var i = 0; i < cur_obj.length; i++) {
                cur_obj[i].style.display = "block";
            }
        }
    },
    _submit_check: function (obj, me) {
        var option = obj.option;
        var form_name = obj.form_name;
        //如果是代理界面，提交是展开
        var proxy_con = this._getCURElementsByName("proxy_con", "div", form_name);
        for (var i = 0; i < proxy_con.length; i++) {
            proxy_con[i].style.display = "block";
        }
        var toggle = $(".tottle");
        for (var j = 0; j < toggle.length; j++) {
            toggle.attr("src", "/images/collapse.png");
        }
        var error_tip = this._getCURElementsByName("CHINARK_ERROR_TIP", "div", form_name);

        for (var i = 0; i < error_tip.length; i++) {
            error_tip[i].parentNode.removeChild(error_tip[i])
        };
        for (var x in option) {
            var option_cur = this._getCURElementsByName(x, this.option_name[option[x].type], form_name)[0];
            if (!option_cur) { continue; }
            var cur_value = option_cur.value;
            var option_obj = { "option": option[x], "name": x, "value": cur_value, "form": form_name }
            if (this._check_hidden(option_cur, obj.form_name, option_obj) == "none") { continue; }//隐藏的表单不做检查

            else if (option[x].type == "select-one" || option[x].type == "select-multiple" || option[x].type == "checkbox") {
                me._check_select_checkbox(option_obj);
            }
            else if (option[x].type == "password") {
                me._check_password(option_obj)
            }
            else if (option[x].type == "file") {
                me._check_file(option_obj)
            }
            else if (option[x].type == "text") {
                var msg = me._check_textarea(option_obj);
                me._tip(option[x], x, msg, form_name);
            }
            else if (option[x].type == "date") {
                var msg = me._check_textarea(option_obj)
                me._tip(option[x], x, msg, form_name);
            }
            else if (option[x].type == "textarea") {
                var textarea = option_cur.value.split("\n");
                var msg = "";
                var error_obj = {};
                //2013-7-22添加
                if (option[x].required && textarea.length == 1 && textarea[0] == '') {
                    msg = '此项不能为空';
                }
                //
                for (var i = 0; i < textarea.length; i++) {
                    var option_obj = { "option": option[x], "name": name, "value": textarea[i], "form": form_name }
                    if (textarea[i]) {
                        var temp = "";
                        temp = me._check_textarea(option_obj);
                        if (temp) { error_obj[temp] = temp; }
                    }
                }
                for (var y in error_obj) {
                    msg += y + "<br />"
                }

                me._tip(option[x], x, msg, form_name);
            }
        }
        var error_tip = this._getCURElementsByName("CHINARK_ERROR_TIP", "div", form_name);
        return error_tip.length;
    },
    _addEventListener: function (option, name, form_name, obj) {//为每个表单元素添加事件监听
        var me = this;
        var cur = me._getCURElementsByName(name, me.option_name[option.type], form_name)[0];
        if (!cur) { return; }
        else if (option.type == "select-one" || option.type == "select-multiple" || option.type == "checkbox") {
            if (document.all) {
                cur.attachEvent("onchange", function () {
                    var cur_value = cur.value;
                    var obj1 = { "option": option, "name": name, "value": cur_value, "form": form_name }
                    me._check_select_checkbox(obj1)
                })
            }
            else {
                cur.addEventListener("change", function () {
                    var cur_value = cur.value;
                    var obj1 = { "option": option, "name": name, "value": cur_value, "form": form_name }
                    me._check_select_checkbox(obj1)
                }, true)
            }
        }
        else if (option.type == "password") {
            if (document.all) {
                cur.attachEvent("onkeyup", function () {
                    var cur_value = cur.value;
                    var obj1 = { "option": option, "name": name, "value": cur_value, "form": form_name }
                    me._check_password(obj1)
                })
            }
            else {
                cur.addEventListener("keyup", function (event) {
                    var cur_value = cur.value;
                    var obj1 = { "option": option, "name": name, "value": cur_value, "form": form_name }
                    me._check_password(obj1)
                }, true)
            }
        }
        else if (option.type == "file") {
            if (document.all) {
                cur.attachEvent("onchange", function (event) {
                    var cur_value = cur.value;
                    var obj1 = { "option": option, "name": name, "value": cur_value, "form": form_name }
                    me._check_file(obj1)
                })
            }
            else {
                cur.addEventListener("change", function (event) {
                    var cur_value = cur.value;
                    var obj1 = { "option": option, "name": name, "value": cur_value, "form": form_name }
                    me._check_file(obj1)
                }, true)
            }
        }
        else if (option.type == "text") {
            if (document.all) {
                cur.attachEvent("onkeyup", function (event) {
                    var cur_value = cur.value;
                    var obj1 = { "option": option, "method": "keyup", "name": name, "value": cur_value, "form": form_name }
                    obj1.eve = event.srcElement;
                    me._check_text(obj1);
                    //部分需要有关联检测的输入 add by elvis
                    if (option.associated) { me._check_associated(option, form_name, obj, event, "text"); }
                })
            } else {
                var m = $(cur);
                cur.addEventListener("keyup", function (event) {
                    var cur_value = cur.value;
                    var obj1 = { "option": option, "method": "keyup", "name": name, "value": cur_value, "form": form_name }
                    obj1.eve = event.target;
                    me._check_text(obj1);
                    //部分需要有关联检测的输入 add by elvis
                    if (option.associated) {
                        me._check_associated(option, form_name, obj, event, "text");
                    }
                }, true)
            }
        }
        else if (option.type == "textarea") {
            if (document.all) {
                cur.attachEvent("onkeyup", function () {
                    var msg = "";
                    var tmp_value = cur.value.replace("\n", "");
                    if (!cur.value || !tmp_value) { if (option.required) { msg = "此项不能为空！"; } }
                    else {
                        var error_obj = {};
                        var textarea = cur.value.split("\n");
                        for (var i = 0; i < textarea.length; i++) {
                            {
                                if (textarea[i]) {
                                    var obj = { "option": option, "name": name, "value": textarea[i] }
                                    var temp = me._check_textarea(obj);
                                    //部分需要有关联检测的输入 add by elvis
                                    if (option.associated) { me._check_associated(option, form_name, obj, event, "textarea"); }
                                    if (temp) { error_obj[temp] = temp; }
                                }
                            }
                        }
                    }
                    for (var x in error_obj) {
                        msg += x + "<br />";
                    }
                    me._tip(option, name, msg, form_name);
                });
            } else {
                cur.addEventListener("keyup", function () {
                    var msg = "";
                    var tmp_value = cur.value.replace("\n", "");
                    if (!cur.value || !tmp_value) { if (option.required) { msg = "此项不能为空！"; } }
                    else {
                        var error_obj = {};
                        var textarea = cur.value.split("\n");
                        for (var i = 0; i < textarea.length; i++) {
                            {
                                if (textarea[i]) {
                                    var obj = { "option": option, "name": name, "value": textarea[i] };
                                    var temp = me._check_textarea(obj);
                                    //部分需要有关联检测的输入 add by elvis
                                    if (option.associated) { me._check_associated(option, form_name, obj, event, "textarea"); }
                                    if (temp) error_obj[temp] = temp;
                                }
                            }
                        }
                    }
                    for (var x in error_obj) {
                        msg += x + "<br />";
                    }

                    me._tip(option, name, msg, form_name);
                }, true);
            }
        }
    },
    _checkArgument: function (obj) {//检查传入参数的正确性
        if (!obj) { alert("实例化ChinArk_form对象时没有传入参数！"); return; }
        if (typeof obj != "object") { alert("传入的参数不是对象！"); return; }
        if (!obj.form_name) { alert("要检查的表单名form_name字段没写或者为空！"); return; }
        if (!this._getElementsByName(obj.form_name, "form")) { alert("没有找到表单名为" + obj.form_name + "的表单，检查一下表单名称写对没！"); return; }
    },
    _checkFormOption: function (option, x) {//检查传入的表单对象的属性是否符合规范
        var cur = this._getElementsByName(x, this.option_name[option.type]);
        if (!cur[0]) { return; }
        else if (option.check == "other" && !option.other_reg) { alert(x + "的类型为其他，则reg选项为必选"); return; }
        else if (option.check && (cur[0].type == "text" || option.type == "textarea")) {

            var checks = option.check.split("|");
            var unexites = 0;
            var check_error = "";
            for (var i = 0; i < checks.length; i++) {
                if (!checks[i]) { break; }
                if (!this.text_check[checks[i]]) { unexites = 1; check_error = checks[i]; break; }
            }
            if (unexites) { alert(x + "表单元素的check字段出现了" + check_error + "类型，但是我们未定义这种检查方法，你是不是写错啦~"); return; }
        }
    },
    _iniArgumentList: function (option) {//初始化参数列表
        option.required = typeof (option.required) == 'undefined' ? this.required : parseInt(option.required);//默认是必须填写，不能为空
    },
    //部分需要有关联检测的输入的函数主体 add by elvis
    _check_associated: function (option, form_name, obj, event, type) {
        var me = this;
        var associated = option.associated.split("|");
        var objs;
        for (var i in associated) {
            var cur_ass = me._getCURElementsByName(associated[i], me.option_name[option.type], form_name)[0];
            var cur_value_ass = cur_ass.value;
            for (var x in obj) {
                if (x == associated[i]) {
                    objs = { "option": obj[x], "method": "keyup", "name": associated[i], "value": cur_value_ass, "form": form_name };
                }
            }
            if (cur_value_ass) {
                objs.eve = event.target ? event.target : event.srcElement;
                if (type == "text") {
                    me._check_text(objs);
                }
                if (type == "textarea") {
                    me._check_textarea(objs);
                }
            }
        }

    },
    _check_ip: function (option) {
        var required = option.required;
        var str = option.value;
        str = this.trim(str);
        var msg = "";
        if (typeof str == "undefined" || str == "") { if (required) { msg = "IP不能为空！"; } return msg; }
        if (!this.validip(str)) {
            if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
            str = "<b>" + str + "</b>  ";
            msg = str + "不合法,应是IP类型！";
        }
        return msg;
    },
    _check_mask: function (option) {
        var required = option.required;
        var str = option.value;
        str = this.trim(str);
        var msg = "";
        if (typeof str == "undefined" || str == "") { if (required) { msg = "mask不能为空！"; } return msg; }
        if (!this.validmask(str)) {
            if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
            str = "<b>" + str + "</b>  ";
            msg = str + "不合法,应是mask类型！";
        }
        return msg;
    },
    _check_ip_range: function (option) {
        var required = option.required;
        var str = option.value;
        str = this.trim(str);
        var msg = "";
        if (typeof str == "undefined" || str == "") { if (required) { msg = "IP范围不能为空！"; } return msg; }
        if (!this.rangeip(str)) {
            if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
            str = "<b>" + str + "</b>  ";
            msg = str + "不合法,应是IP范围！";
        }
        return msg;
    },
    _check_ipv6: function (option) {
        var required = option.required;
        var str = option.value;
        str = this.trim(str);
        return msg;
    },
    _check_ip_mask: function (option) {
        var required = option.required;
        var str = option.value;
        str = this.trim(str);
        var msg = "";
        if (typeof str == "undefined" || str == "") { if (required) { msg = "IP/掩码不能为空！"; } return msg; }
        if (!this.validsegment(str)) {
            if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
            str = "<b>" + str + "</b>  ";
            msg = str + " 输入不合法,应是IP/掩码类型！";
        }
        return msg;
    },
    _check_port: function (option) {
        var str = option.value;
        str = this.trim(str);
        var required = option.required;
        var msg = "";
        if (typeof str == "undefined" || str == "") { if (required) { msg = "端口号不能为空！"; } return msg; }
        var reg = /^([1-9][0-9]*)$/;
        if (!(reg.test(str) && RegExp.$1 < 65536 && RegExp.$1 > 0)) {
            if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
            str = "<br>" + str + "</b> ";
            msg = str + "端口号格式输入错误！";
        }
        return msg;
    },
    _check_port_range: function (option) {
        var required = option.required;
        var str = option.value;
        str = this.trim(str);
        var msg = "";
        if (typeof str == "undefined" || str == "") { if (required) { msg = "端口范围不能为空！"; } return msg; }
        if (/^([1-9]+[0-9]*)[:|-]([1-9]+[0-9]*)$/.test(str)) {
            if (parseInt(RegExp.$1) > 65535 || parseInt(RegExp.$1) < 0 || parseInt(RegExp.$2) > 65535 || parseInt(RegExp.$2) <= 0)
                msg = str + "中端口应在0-65535之间";
            if (parseInt(RegExp.$1) >= parseInt(RegExp.$2))
                msg = str + "端口范围中前一个应小于后一个";
        } else {
            if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
            str = "<b>" + str + "</b> ";
            msg = str + "端口范围格式错误";
        }
        return msg;
    },
    _check_mac: function (option) {
        var required = option.required;
        var str = option.value;
        str = this.trim(str);
        var msg = "";
        if (typeof str == "undefined" || str == "") { if (required) { msg = "MAC地址不能为空！"; } return msg; }
        str = str.replace(/-/g, ":");
        var reg = /^([\dA-Fa-f]{2}):([\dA-Fa-f]{2}):([\dA-Fa-f]{2}):([\dA-Fa-f]{2}):([\dA-Fa-f]{2}):([\dA-Fa-f]{2})$/;
        if (!reg.test(str)) {
            if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
            str = "<b>" + str + "</b> ";
            msg = str + "MAC地址格式输入错误！";
        }
        return msg;

    },
    _check_num: function (option) {
        var str = option.value;
        str = this.trim(str);
        var required = option.required;
        var msg = "";
        if (typeof str == "undefined" || str == "") { if (required) { msg = "此项不能为空！"; } return msg; }
        if (!(/^[1-9][0-9]*$/.test(str))) {
            if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
            str = "<b>" + str + "</b> ";
            msg = str + "此项应填正整数！";
        }
        return msg;
    },
    _check_int: function (option) {
        var str = option.value;
        str = this.trim(str);
        var required = option.required;
        var msg = "";
        if (typeof str == "undefined" || str == "") { if (required) { msg = "此项不能为空！"; } return msg; }
        if (!(/^([1-9][0-9]*|0)$/.test(str))) {
            if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
            str = "<b>" + str + "</b> ";
            msg = str + "只能输入整数!";
        }
        return msg;
    },
    _check_float: function (option) {
        var str = option.value;
        str = this.trim(str);
        var required = option.required;
        var msg = "";
        if (typeof str == "undefined" || str == "") { if (required) { msg = "此项不能为空！"; } return msg; }
        if (!(/^[1-9][0-9]*(\.[0-9]+)?$/.test(str))) {
            if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
            str = "<b>" + str + "</b> ";
            msg = str + "此项应填正小数或正整数！";
        }
        return msg;
    },
    _check_percent: function (option) {
        var str = option.value;
        str = this.trim(str);
        var required = option.required;
        var msg = "";
        if (typeof str == "undefined" || str == "") { if (required) { msg = "此项不能为空！"; } return msg; }
        if (!(/^([0-9]+)%$/.test(str) && parseInt(RegExp.$1) <= 100 && parseInt(RegExp.$1) >= 0)) {
            if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
            str = "<b>" + str + "</b> ";
            msg = str + "此项应填整数百分数！";
        }
        return msg;


    },
    _check_name: function (option) {
        var str = option.value;
        str = this.trim(str);
        var required = option.required;
        var msg = "";
        if (typeof str == "undefined" || str == "") { if (required) { msg = "此项不能为空！"; } return msg; }
        var reg = /^[0-9a-zA-Z\u4e00-\u9fa5][_0-9a-zA-Z\u4e00-\u9fa5]*$/;
        var reg2 = /^[0-9]/;
        if (str.length <= 20) {
            if (/\s/.test(str)) { msg = str + "含有空格！"; }
            if (reg2.test(str)) { msg = str + "不能以数字开头！"; }
            if (!reg.test(str)) { msg = str + "含有非法字符！"; }
        } else {
            if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
            str = "<b>" + str + "</b> ";
            msg = str + "应20个字符以内！";

        }
        return msg;
    },
    _check_specify_name: function (option, nameLength) {
        var nameLengthInt = parseInt(nameLength);
        var str = option.value;
        str = this.trim(str);
        var required = option.required;
        var msg = "";
        if (typeof str == "undefined" || str == "") { if (required) { msg = "此项不能为空！"; } return msg; }
        var reg = /^[0-9a-zA-Z\u4e00-\u9fa5]+$/;
        var reg2 = /^[0-9]/;
        if ((str.length >= nameLengthInt) && (str.length <= 20)) {
            if (/\s/.test(str)) { msg = str + "含有空格！"; }
            if (reg2.test(str)) { msg = str + "不能以数字开头！"; }
            if (!reg.test(str)) { msg = str + "含有非法字符！"; }
        } else {
            if (str.length < nameLengthInt) {
                msg = str + "至少为" + nameLength + "个字符！";
            }
            if (str.length > 20) {
                if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
                str = "<b>" + str + "</b> ";
                msg = str + "应在20个字符以内！";
            }
        }


        return msg;
    },
    _check_mail: function (option) {
        var str = option.value;
        str = this.trim(str);
        var required = option.required;
        var msg = "";
        if (typeof str == "undefined" || str == "") { if (required) { msg = "邮件地址不能为空！"; } return msg; }
        var reg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
        if (!reg.test(str)) {
            if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
            str = "<b>" + str + "</b> ";
            msg = str + "邮件地址错误！";
        }
        return msg;
    },
    _check_note: function (option) {
        var required = option.required;
        var str = option.value;
        str = this.trim(str);
        var msg = "";
        if (typeof str == "undefined" || str == "") { if (required) { msg = "注释不能为空！"; } return msg; }
        if (/['"@#$%^&*~`\\]/.test(str)) {
            if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
            str = "<b>" + str + "</b> ";
            msg = str + "包含非法字符！";
        }
        else if (str.length > 128) {
            if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
            str = "<b>" + str + "</b> ";
            msg = str + "注释信息过长，应在128个字符以内！";
        }
        return msg;
    },
    _check_url: function (option) {
        var required = option.required;
        var str = option.value;
        str = this.trim(str);
        var msg = "";
        if (typeof str == "undefined" || str == "") { if (required) { msg = "此项不能为空！"; } return msg; }
        if (!this.validurl(str)) {
            if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
            str = "<b>" + str + "</b> ";
            msg = str + "格式错误！"; return msg;
        }
        return msg;

    },
    _check_other: function (option) {
        var required = option.required;
        var str = option.value;
        str = this.trim(str);
        var reg = option.other;
        var msg = "";
        if (typeof str == "undefined" || str == "") { if (required) { msg = "此项不能为空！"; } return msg; }
        if (/"/.test(str)) { msg = "含有非法字符！"; return msg; }
        if (eval('!' + reg + '.test("' + str + '")')) {
            if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
            str = "<b>" + str + "</b> ";
            if (option.other_msg) {
                msg = str + option.other_msg;
            } else {
                msg = str + "格式错误！";
            }
        }
        return msg;
    },
    _check_domain: function (option) {
        var required = option.required;
        var str = option.value;
        str = this.trim(str);
        var msg = "";
        if (/"/.test(str)) { msg = str + '含有非法字符"'; return msg; }
        if (typeof str == "undefined" || str == "") { if (required) { msg = " 域名不能为空！"; } return msg; }
        if (!this.validdomainname(str)) {
            if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
            str = "<b>" + str + "</b> ";
            msg = str + "域名输入错误！";
        }
        return msg;
    },
    _check_udp: function (option) {
        var required = option.required;
        var str = option.value;
        str = this.trim(str);
        var msg = "";
        if (/"/.test(str)) { msg = str + '含有非法字符"'; return msg; }
        if (typeof str == "undefined" || str == "") { if (required) { msg = " udp或udp范围不能为空！"; } return msg; }
        if (!this.validtcporudp(str)) {
            if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
            str = "<b>" + str + "</b> ";
            msg = str + "格式错误！";
        }
        return msg;
    },
    _check_tcp: function (option) {
        var required = option.required;
        var str = option.value;
        str = this.trim(str);
        var msg = "";
        if (/"/.test(str)) { msg = str + '含有非法字符"'; return msg; }
        if (typeof str == "undefined" || str == "") { if (required) { msg = " tcp或tcp范围不能为空！"; } return msg; }
        if (!this.validtcporudp(str)) {
            if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
            str = "<b>" + str + "</b> ";
            msg = str + "格式错误！";
        }
        return msg;
    },

    _check_domain_suffix: function (option) {
        var required = option.required;
        var str = option.value;
        str = this.trim(str);
        var msg = "";
        if (/"/.test(str)) { msg = str + '含有非法字符"'; return msg; }
        if (typeof str == "undefined" || str == "") { if (required) { msg = " 域不能为空！"; } return msg; }
        if (!this.validdomain_suffix(str)) {
            if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
            str = "<b>" + str + "</b> ";
            msg = str + "域输入错误！";
        }
        return msg;
    },
    /*******************************
    *added by:Liu JuLong
    *date:2015-11-09
    *description新增电话号码格式检测
    *******************************/
    _check_phone_number: function (option) {
        var reg_cellphone = /^1\d{10}$/;
        var reg_phone = /^0\d{2,3}-?\d{7,8}$/;
        var required = option.required;
        var str = option.value;
        str = this.trim(str);
        var msg = "";
        if (typeof str == "undefined" || str == "") {
            if (required) {
                msg = "此项不能为空！";
            }
            return msg;
        }
        if (!reg_cellphone.test(str) && !reg_phone.test(str)) {
            str = "<b>" + str + "</b> ";
            msg = str + "电话号码格式错误！";
        }
        return msg;
    },
    _check_fax: function (option) {
        var reg_fax = /^(\d{3,4}-)?\d{7,8}$/;
        var required = option.required;
        var str = option.value;
        str = this.trim(str);
        var msg = "";
        if (typeof str == "undefined" || str == "") {
            if (required) {
                msg = "此项不能为空！";
            }
            return msg;
        }
        if (!reg_fax.test(str)) {
            str = "<b>" + str + "</b> ";
            msg = str + "传真号码格式错误！";
        }
        return msg;
    },
    _check_text: function (obj) {
        var option = obj.option;
        var name = obj.name;
        var str = obj.value;
        var form_name = obj.form;
        var src = obj.eve;
        var msg = "", is_true = 0;
        var checks = option.check.split("|");
        var new_checks = new Array();
        var d = new Date();
        this.cur_time = d.getTime();
        var num = 0;
        for (var i = 0; i < checks.length; i++) {
            checks[i] = checks[i].replace(" ", "");
            if (checks[i]) { num++ }
        }
        option.required = parseInt(option.required);
        var option_obj = {
            "required": option.required,
            "value": str,
            "other": option.other_reg,
            "require": option.required,
            "form": form_name,
            "other_msg": option.other_msg,
        };
        if (num > 1)//check类型为多个时
        {
            var is_true = 0;
            if (/^\s*$/.test(src.value) && !option.required) { is_true = 1; }
            else {
                for (var i = 0; i < checks.length; i++) {
                    if (checks[i] == "") continue;
                    var temp = "";
                    if (checks[i] == "other") { temp = this._check_other(option_obj) }
                    else {
                        temp = this._eval_check(option_obj, checks[i]);
                    }
                    if (temp == "") is_true = 1;
                    new_checks[i] = this.text_check[checks[i]];
                }
                var temp_str = new_checks.join(",");
            }

            if (!is_true) {
                var temps = src.value;
                if (this._get_str_byte(temps > 16)) { temps = temps.slice(0, 16) + "..."; }
                msg = /^\s*$/.test(src.value) ? "此项不能为空！" : temps + "输入不合法,应是" + temp_str + "类型";
                this._tip(option, name, msg, form_name);
            } else {
                if (option.ass_check) {//若正常格式检查通过，则进行关联检查
                    var check = option.ass_check;
                    if (!src.value && !parseInt(option.required)) {
                        this._tip(option, name, "", form_name);
                    } else {
                        var msg = check(this);
                        this._tip(option, name, msg, form_name);
                    }
                }
            }
        } else {
            var check = option.check.replace("|", "");
            if (check == 'other') { msg = this._check_other(option_obj); }
            else {
                if (!src.value && !option.required) {
                    msg = "";
                } else {
                    msg = this._eval_check(option_obj, check);
                }
            }
            if (!msg && option.ass_check) {
                var check = option.ass_check;
                msg = check(this);
                this.last_time = this.cur_time;
            }
        }
        this._tip(option, name, msg, form_name);
    },
    _eval_check: function (obj, check_name) {
        switch (check_name) {
            case "ip": return this._check_ip(obj);
            case "mask": return this._check_mask(obj);
            case "ip_range": return this._check_ip_range(obj);
            case "ipv6": return this._check_ipv6(obj);
            case "ip_mask": return this._check_ip_mask(obj);
            case "mac": return this._check_mac(obj);
            case "port": return this._check_port(obj);
            case "port_range": return this._check_port_range(obj);
            case "url": return this._check_url(obj);
            case "domain": return this._check_domain(obj);
            case "name": return this._check_name(obj);
            case "specify_name": return this._check_specify_name(obj, check_name[1]);
            case "mail": return this._check_mail(obj);
            case "note": return this._check_note(obj);
            case "num": return this._check_num(obj);
            case "int": return this._check_int(obj);
            case "float": return this._check_float(obj);
            case "percent": return this._check_percent(obj);
            case "domain_suffix": return this._check_domain_suffix(obj);
            case "tcp": return this._check_tcp(obj);
            case "udp": return this._check_udp(obj);
            case "phone_number": return this._check_phone_number(obj);
            case "fax": return this._check_fax(obj);
            case "other": return this._check_other(obj);
        }
    },
    _check_textarea: function (object) {
        var option = object.option;
        var name = object.name;
        var str = object.value;
        msg = "", new_msg = "",
            required = option.required,
            is_error = 1,
            is_error1 = 1,
            is_error2 = 1,
            new_checks = new Array();

        var check_item = option.check.split("|");
        var num = 0;
        for (var i = 0; i < check_item.length; i++) {
            check_item[i] = check_item[i].replace(" ", "");
            if (check_item[i]) { num++ }
        }
        option.required = parseInt(option.required);
        var option_obj = { "value": str, "other": option.other_reg, "required": option.required };
        if (num > 1) {
            for (var i = 0; i < check_item.length; i++) {
                if (!check_item[i]) { continue; }
                if (check_item[i] == 'other') { msg = this._check_other(option_obj); }
                else {
                    msg1 = this._eval_check(option_obj, check_item[i]);
                    if (!msg1) is_error1 = 0;
                }
                if (!msg1 && option.ass_check) {//若正常格式检查通过，则进行关联检查
                    // if(!str && !option.required){
                    //     msg = "";
                    // }else{
                    var check = option.ass_check;
                    if (check(this)) { var msg2 = check(this); }
                    if (!msg2) is_error2 = 0;
                    // }
                }
                new_checks[i] = this.text_check[check_item[i]];
            }
            var temp_str = new_checks.join(",");
            if (is_error1) {
                if (this._get_str_byte(str) > 16) { str = str.slice(0, 16) + "..."; }
                str = "<b>" + str + "</b> ";
                new_msg = str + "不合法,该是" + temp_str + "类型";
            } else if (is_error2 && option.ass_check) {
                var check = option.ass_check;
                if (check(this)) { new_msg = check(this); }
            }
        } else {
            var check = option.check.replace("|", "");
            if (check == 'other') { new_msg = this._check_other(option_obj); }
            else {
                new_msg = this._eval_check(option_obj, check);
            }

            if (!new_msg && option.ass_check) {//若正常格式检查通过，则进行关联检查
                // if(!str && !option.required){
                //     new_msg = "";
                // }else{
                var check = option.ass_check;
                if (check(this)) { new_msg = check(this); }
                // }
            }
        }
        return new_msg;
    },
    _check_password: function (object) {
        var option = object.option;
        var name = object.name;
        var str = object.value;
        var form_name = object.form;
        var msg = "";
        if ((str.length < 6) || (str.length > 16)) {
            if (option.required) { msg = "长度应为6-16位之间！"; }
        }
        //else if((/^\d+$/.test(str)) || (!/\d/.test(str))){
        //    msg="密码不能只有数字或者字母，必须包含数字及字母！";
        //}
        else {
            if (option.ass_check) {//若正常格式检查通过，则进行关联检查
                var check = option.ass_check;
                if (check(this)) { msg = check(this); }
            }
        }
        this._tip(option, name, msg, form_name)
    },
    _check_file: function (object) {
        var option = object.option;
        var name = object.name;
        var str = object.value;
        var form_name = object.form;
        var msg = "";
        if (!str) { if (option.required) { msg = "上传文件路径不能为空！"; } }
        else {
            if (option.ass_check) {//若正常格式检查通过，则进行关联检查
                var check = option.ass_check;
                if (check(this)) { msg = check(this); }
            }
        }
        this._tip(option, name, msg, form_name)
    },
    _check_select_checkbox: function (object) {
        var option = object.option;
        var name = object.name;
        var str = object.value;
        var form_name = object.form;
        var msg = "";
        if (!str && option.required) {
            msg = "此项不能为空！";
        } else {
            if (option.ass_check) {//若正常格式检查通过，则进行关联检查
                var check = option.ass_check;
                if (check(this)) { msg = check(this); }
            }
        }
        this._tip(option, name, msg, form_name)
    },
    _error_tip: function (msg, width, height) {
        // var note_style="style='width:"+width+";height:"+height;
        var note_style = "style='float:left; margin:0px 0px -8px 5px;color: red;";
        note_style += "line-height: 24px;'";

        // var html = "<div "+note_style+">";
        //      html += "<p style='width:100%;height:16px;line-height:16px;";
        //      html += "background-color:#f47a7f;border-bottom:1px solid red;";
        //     html += "font-weight:bold;'><img src='../images/error_note.png' />";
        //     html += "错误信息</p><div style='padding:5px;text-indent:0'>";
        //     html += msg+"</div></div>";
        // return html;
        return "<div " + note_style + ">" + msg + "</div>";
    },
    _note_tip: function (msg, width, height) {
        if (!msg) { msg = "此项满足规范" }
        var html = "<img src='../images/note_note.png' />";
        return html;
    },
    _waiting_tip: function (msg, width, height) {
        var html = '检测中...';
        return html;
    },
    _tip: function (option, name, msg, form_name) {
        var cur_obj = document.getElementById(form_name + name + "CHINARK_ERROR_TIP");
        if (cur_obj) { cur_obj.parentNode.removeChild(cur_obj) }
        var cur_obj = document.getElementById(form_name + name + "CHINARK_NOTE_TIP");
        if (cur_obj) { cur_obj.parentNode.removeChild(cur_obj) }

        if (msg) {
            var str = this._error_tip(msg, this.note_width, this.note_height);
            var container = document.createElement("div");
            container.id = form_name + name + "CHINARK_ERROR_TIP";
            container.name = "CHINARK_ERROR_TIP";
            container.setAttribute("name", "CHINARK_ERROR_TIP");
            container.style.fontSize = "11px";
            container.style.display = "inline-block";
            container.className = "chinark_note_tip_class_error";
            container.innerHTML = str;
            this._getCURElementsByName(name, this.option_name[option.type], form_name)[0].parentNode.appendChild(container);
        } else {
            var cur = this._getElementsByName(name, this.option_name[option.type])[0];
            if (!option.required) {
                if (/^\s*$/.test(cur.value)) { msg = "此项可以为空" } else { msg = "此项输入正确" }
            }
            var str = this._note_tip(msg, this.note_width, this.note_height);
            var container = document.createElement("div");
            container.id = form_name + name + "CHINARK_NOTE_TIP";
            container.style.fontSize = "11px";
            container.style.display = "inline-block";
            container.style.margin = "0px 5px";
            container.className = "chinark_note_tip_class_right";
            container.innerHTML = str;
            this._getCURElementsByName(name, this.option_name[option.type], form_name)[0].parentNode.appendChild(container);
        }
    },
    trim: function (str) {
        return str.replace(/^\s+|\s+$/g, "");
    },
    validtcporudp: function (str) {
        var reg = /^[1-9][0-9]*(\-[1-9][0-9]*)?$/;
        var flag = true;
        var arr = str.split(/-/);
        if (!reg.test(str)) {
            flag = false;
        } else if (arr && arr.length == 1) {
            if (parseInt(arr[0]) > 65535 || parseInt(arr[0]) < 1) {
                flag = false;
            }
        } else if (arr && arr.length == 2) {
            if (arr[0] > 65535 || arr[0] < 1 || arr[0] > arr[1] || arr[1] > 65535 || arr[1] < 1) {
                flag = false;
            }
        }
        return flag;
    },
    validurl: function (str) {
        var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
            + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?"
            + "(([0-9]{1,3}"
            + ".){3}[0-9]{1,3}"
            + "|"
            + "([0-9a-z_!~*'()-]+.)*"
            + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]."
            + "[a-z]{2,6})"
            + "(:([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5]))?"
            + "((/?)|"
            + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
        var re = new RegExp(strRegex);
        var flag = false;
        if (re.test(str)) {
            var re2 = /((\d+\.)+\d+)\/?/;
            var re3 = /\./;
            if (re2.test(str)) {
                re2.exec(str);
                var s1 = RegExp.$1;
                flag = this.validip(s1);
            }
            else if (!re3.test(str)) {
                flag = false;
            }
            else {
                flag = true;
            }
            var re4 = /:(\d+)/;
            if (re4.test(str)) {
                var s2 = RegExp.$1;
                flag = this.validport(s2);
            }
        };
        return flag;
    },
    validnumber: function (str) {
        var reg = /^\d+$/;
        var reg0 = /^0/;
        if (reg0.test(str) && str != 0) {
            return false;
        }
        return reg.test(str);
    },
    validport: function (str) {
        var reg = /^([1-9][0-9]*)$/;
        if (!(reg.test(str) && RegExp.$1 < 65536 && RegExp.$1 > 0)) {
            return false;
        } else {
            return true;
        }
    },
    validsegment: function (str) {
        var test = new Array();
        test = str.split("/");
        var leng = test.length;
        var ip = test[0];
        var mask = test[1];
        var ip_reg = /^([1-9]|[1-9]\d|1\d{2}|2[0-1]\d|22[0-3])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/;
        var zero = /^0+/;
        if (mask < 1 || mask > 32 || leng < 2 || zero.test(mask)) {
            return false;
        }
        else if (!ip_reg.test(ip)) {
            return false;
        }
        else {
            var total_str = "";
            var temp = new Array();
            temp = ip.split(".");
            for (i = 0; i < 4; i++) {
                temp[i] = parseInt(temp[i]);
                temp[i] = this.formatIP(temp[i]);
                total_str += temp[i];
            }
            var segment = total_str.substring(mask);
            var all_zero = /^0+$/;
            return all_zero.test(segment);
        }
    },
    formatIP: function (ip) {
        return (ip + 256).toString(2).substring(1); //格式化输出(补零)
    },
    rangeip: function (str) {   //检测IP范围合法性的函数start
        var temp = str.split("-");
        if (temp.length != 2) { return false; };
        var startip = temp[0];
        var endip = temp[1];
        var start = startip.split(".");
        var end = endip.split(".");
        var flag = this.compareIP(startip, endip);
        if (this.validip(startip) && flag == -1) { return this.validip(endip); }
        else { return false; }
    },
    compareIP: function (ipBegin, ipEnd) {
        var temp1 = ipBegin.split(".");
        var temp2 = ipEnd.split(".");
        for (var i = 0; i < 4; i++) {
            temp1[i] = parseInt(temp1[i]);
            temp2[i] = parseInt(temp2[i]);
            if (temp1[i] > temp2[i]) { return 1; }
            else if (temp1[i] < temp2[i]) { return -1; }
        }
        return 0;
    },
    validdomainname: function (str) {
        var reg = /^[A-Za-z0-9+\.]+([-A-Za-z0-9]+\.)+[A-Za-z0-9]{2,6}$/;
        var regnum = /^(\d+\.)+\d+$/;
        if (str == "localdomain") { return true; }
        if (regnum.test(str)) { return false; }
        return reg.test(str);
    },
    validregexp: function (str) {
        try {
            new RegExp(str);
        } catch (e) {
            return false;
        }
        return true;
    },
    validdomain_suffix: function (str) {
        var reg = /^[A-Za-z0-9+\.]+([-A-Za-z0-9]+\.)+[A-Za-z0-9]{2,6}$/;
        var reg2 = /^[A-Za-z0-9]{2,6}$/;
        var regnum = /^(\d+\.)+\d+$/;
        if (str == "localdomain") { return true; }
        if (regnum.test(str)) { return false; }
        if (reg2.test(str)) { return true; }
        return reg.test(str);
    },
    validip: function (str) {
        var ip = /^([1-9]|[1-9]\d|1\d{2}|2[0-1]\d|22[0-3])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}$/;
        var flag = ip.test(str);
        var ip_0 = /\.0$/;
        if (ip_0.test(str)) {
            flag = false;
        }
        return flag;
    },
    validmask: function (str) {
        var mask = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/;
        return mask.test(str);
    },
    validmac: function (str) {
        var mac = /^([\dA-Fa-f]{2}):([\dA-Fa-f]{2}):([\dA-Fa-f]{2}):([\dA-Fa-f]{2}):([\dA-Fa-f]{2}):([\dA-Fa-f]{2})$/;
        return mac.test(str);
    },
    same_green: function (ip, green) {
        if (!this.validip(ip)) {
            return false;
        }
        var ip_mask = green.split("/");
        var mask = ip_mask[1];
        var temp_ip = ip.split(".");
        var ip_str = "", green_str = "";
        for (i = 0; i < 4; i++) {
            temp_ip[i] = parseInt(temp_ip[i]);
            temp_ip[i] = this.formatIP(temp_ip[i]);
            ip_str += temp_ip[i];
        }
        var temp_green = ip_mask[0].split(".");
        for (i = 0; i < 4; i++) {
            temp_green[i] = parseInt(temp_green[i]);
            temp_green[i] = this.formatIP(temp_green[i]);
            green_str += temp_green[i];
        }
        var ip_segment = ip_str.substring(0, mask);
        var green_segment = green_str.substring(0, mask);
        return ip_segment == green_segment;
    },
    same_orange: function (ip, orange) {
        if (!this.validip(ip)) {
            return false;
        }
        var ip_mask = orange.split("/");
        var mask = ip_mask[1];
        var temp_ip = ip.split(".");
        var ip_str = "", orange_str = "";
        for (i = 0; i < 4; i++) {
            temp_ip[i] = parseInt(temp_ip[i]);
            temp_ip[i] = this.formatIP(temp_ip[i]);
            ip_str += temp_ip[i];
        }
        var temp_orange = ip_mask[0].split(".");
        for (i = 0; i < 4; i++) {
            temp_orange[i] = parseInt(temp_orange[i]);
            temp_orange[i] = this.formatIP(temp_orange[i]);
            orange_str += temp_orange[i];
        }
        var ip_segment = ip_str.substring(0, mask);
        var orange_segment = orange_str.substring(0, mask);
        return ip_segment == orange_segment;
    },
    _get_str_byte: function (str) {
        var bytes = 0;
        for (var i = 0; i < str.length; i++) { if (str.charCodeAt(i) > 255) { bytes += 2; } else { bytes += 1; } }
        return bytes;
    },
    _get_form_obj_table: function (form_name, show_config) {//获取form表单元素
        if (typeof show_config == 'undefined') {
            show_config = {//默认不显示单选菜单，复选框，单选框
                "select-one": 0,
                "checkbox": 0,
                "radio": 0
            }
        }
        var me = this;
        if (document.getElementById("chinark_choice_config"))
            document.getElementById("chinark_choice_config").parentNode.removeChild(document.getElementById("chinark_choice_config"));
        var html = "<div id='chinark_choice_config' style='width:96%;margin:10px auto;'>";
        html += "<p><span  class='note'>高级显示控制</span>";
        html += "<select  id='chinark_control_display' multiple style='height:42px;' >";
        html += "<option " + (show_config['select-one'] ? "selected" : "") + " value='select-one'>显示单选下拉菜单</option>";
        html += "<option " + (show_config['checkbox'] ? "selected" : "") + " value='checkbox'>显示复选框</option>";
        html += "<option " + (show_config['radio'] ? "selected" : "") + " value='radio'>显示单选框</option>";
        html += "</select></p>";
        html += "<table id='chinark_create_table' style='width:55%;float:left;margin:10px 0;border:2px dotted #999;'>";
        html += "<tr class='table-header'><td width='15%'>【" + form_name + "】</td>";
        html += "<td width='18%'>元素类型</td>";
        html += "<td width='15%';>是否必须</td>";
        html += "<td width='28%'>默认check类型</td>";
        html += "<td width='15%'>关联检查</td></tr>";

        var form_obj = new Object();
        var form_type = ("input", "select", "checkbox", "textarea");
        var cur = me._getElementsByName(form_name, "form");
        if (cur[0] && cur[0].getElementsByTagName("input")) form_obj.input = cur[0].getElementsByTagName("input");
        if (cur[0] && cur[0].getElementsByTagName("select")) form_obj.selects = cur[0].getElementsByTagName("select");
        if (cur[0] && cur[0].getElementsByTagName("checkbox") && show_config["checkbox"]) form_obj.checkbox = cur[0].getElementsByTagName("checkbox");
        if (cur[0] && cur[0].getElementsByTagName("textarea")) form_obj.textarea = cur[0].getElementsByTagName("textarea");
        for (var x in form_obj) {
            var tmp = form_obj[x];
            for (var j = 0; j < tmp.length; j++) {
                if (x == "input" && tmp[j].type == "checkbox" && !show_config["checkbox"]) continue;
                if (x == "input" && tmp[j].type == "radio" && !show_config["radio"]) continue;
                if (x == "selects" && tmp[j].type == "select-one" && !show_config["select-one"]) continue;
                if (tmp[j].type != "submit" && tmp[j].type != "button" && tmp[j].type != "hidden") {
                    this._show_potion_name(this._getElementsByName(tmp[j].name, this.option_name[tmp[j].type])[0]);
                    var name = tmp[j].name ? tmp[j].name : "没有命名?记得加上哦";

                    html += "<tr name='chinark_create' class='odd_thin'>";
                    html += "<td><span class='note'>" + name + "</span></td>";
                    html += "<td><b>" + tmp[j].tagName + " / " + me.option_type[tmp[j].type] + "</b><b class='hidden_class'>" + tmp[j].type + "</b></td>";
                    html += "<td ><select style='width:80%;margin:0 auto;text-align:center;'>";
                    html += "<option style='text-align:center;' selected  value='1'>是</option>";
                    html += "<option style='text-align:center;'  value='0'>否</option>";
                    html += "</select></td>";

                    if (tmp[j].type == "text" || tmp[j].type == "textarea") {
                        html += "<td><select multiple style='width:96%;height:120px;'>";
                        for (var y in this.text_check) {
                            html += "<option style='text-indent:10px;width:100%;border-bottom:1px dotted #999;'>" + y + "</option>";
                        }
                        html += "</select>";
                        html += "<div><b class='note'>若选other,请输其正则</b><input type='text' style='width:96%' /></div></td>";
                    } else { html += "<td></td>"; }
                    html += "<td><input type='checkbox' />启用关联检查";
                    html += "</td>";
                    html += "</tr>";
                }
            }
        }
        html += "<tr class='table-footer'>";
        html += "<td colspan='5'><input id='ChinArk_GERNERT' class='net_button' type='button' value='生成表单对象' /></td></tr>";
        html += "</table>";
        html += "<div style='width:40%;float:left;display:none;margin:10px 0;margin-left:8px;";
        html += "padding:10px 0;border:2px dotted #999;text-indent:10px;' id='obj_detail'></div></div>";

        document.getElementById("module-content").innerHTML = document.getElementById("module-content").innerHTML + html;
        document.getElementById("ChinArk_GERNERT").onclick = function () { me._create_form_obj(form_name); }
        document.getElementById("chinark_control_display").onclick = function () {
            var value = me._get_mult_select(this);
            var show_config = {
                "select-one": 0,
                "checkbox": 0,
                "radio": 0
            }
            var values = value.split("|");
            for (var i = 0; i < values.length; i++) {
                show_config[values[i]] = 1
            }
            me._get_form_obj_table(form_name, show_config);
        }
    },
    _create_form_obj: function (form_name) {
        var obj = new Object();
        obj.form_name = form_name;
        obj.option = new Object();
        var tr = this._getElementsByName("chinark_create", "tr");
        for (var i = 0; i < tr.length; i++) {
            var td = tr[i].childNodes;
            var name = td[0].childNodes[0].innerHTML;
            var required = td[2].childNodes[0].value;
            var type = td[1].childNodes[1].innerHTML;
            var check = "";
            var other_reg = "";
            var ass_check = td[4].childNodes[0].checked;//是否启用关联检查字段

            if (type == "text" || type == "textarea") {
                check = this._get_mult_select(td[3].childNodes[0]);
                var temp_check = check.replace("|", "")
                if (!check || !temp_check) { alert("第" + (i + 1) + "行没有选择检查类型！"); return; }
                other_reg = td[3].childNodes[1].childNodes[1].value;
                if (/other/.test(check) && !other_reg) { alert("第" + (i + 1) + "行没有写other的正则表达式！"); return; }
                else if (/other/.test(check) && !/^\/.*\/$/.test(other_reg)) {
                    alert("第" + (i + 1) + "行other的正则表达式明显没对嘛！");
                    return;
                }
            }
            name = name.replace(/\s$/, "");
            obj.option[name] = {
                "type": type,
                "required": required,
                "check": check,
                "other_reg": other_reg,
                "ass_check": ass_check
            };
            obj.option[name] = this._delete_null_object(obj.option[name])
        }
        this._print_obj(obj);
    },
    _show_potion_name: function (obj) {//显示每个带检查表单的name属性在表单前面，方便查看
        var str = obj.name;
        var span = document.createElement("span");
        span.className = "note";
        span.innerHTML = str;
        obj.parentNode.insertBefore(span, obj);
    },
    _delete_null_object: function (obj) {//删除object中空着的属性
        for (var x in obj) {
            if (!obj[x]) delete obj[x];
        }
        return obj;
    },
    _print_obj: function (obj) {
        var str = "<p class='note' >表单声称对象代码为：(可将其copy进自己的代码哦~)</p><pre>";
        str += "var object = {\n";
        str += "       'form_name':'" + obj.form_name + "',\n";
        str += "       'option'   :{\n";
        var option = obj.option;
        for (var x in option) {
            str += "                    '" + x + "':{\n";
            for (var y in option[x]) {
                if (y != "ass_check") {
                    str += "                               '" + y + "':'" + option[x][y] + "',\n";
                }
            }
            if (option[x]['ass_check'] == true) {
                var event_type = option[x]["type"] == "text" || option[x]["type"] == "textarea" ? "blur" : "change";
                str += "                               'ass_check':function(){\n";
                str += "                                                               //此处添加你自己的代码吧\n";
                str += "                                                     }\n";
            }
            str += "                             },\n";
        }
        str += "                 }\n";
        str += "         }\n</pre>";
        document.getElementById("obj_detail").innerHTML = str;
        document.getElementById("obj_detail").style.display = "block";
    },
    _get_mult_select: function (select_obj) {
        if (select_obj) {
            var value = "";
            for (var i = 0; i < select_obj.options.length; i++) {
                if (select_obj.options[i].selected) { value += select_obj.options[i].value + "|"; }
            }
            return value;
        }
    },
    _getElementsByName: function (name, tag) {
        if (!document.all) { return document.getElementsByName(name); }
        else {
            var returns = document.getElementsByName(name);
            if (returns.length > 0) return returns;
            returns = new Array();
            var e = document.getElementsByTagName(tag);
            for (var i = 0; i < e.length; i++) {
                if (e[i].getAttribute("name") == name) { returns[returns.length] = e[i] };
            }
        }
        return returns;
    },

    _getCURElementsByName: function (name, tag, form_name) {//取某标签form下的名字为name的tag元素
        if (!document.all) {  //pj:在非IE浏览器下,modify the document not exist;
            // var e = document.getElementsByName(form_name)[0].getElementsByTagName(tag); 
            var e = (document.getElementsByName(form_name).length == 0) ? [] : document.getElementsByName(form_name)[0].getElementsByTagName(tag);
            var returns = new Array();
            for (var i = 0; i < e.length; i++) {
                if (e[i].getAttribute("name") == name) { returns[returns.length] = e[i] };
            }
        }
        else {
            var con = this._getElementsByName(form_name, "form")[0];
            returns = new Array();
            var e = con.getElementsByTagName(tag);
            for (var i = 0; i < e.length; i++) {
                if (e[i].getAttribute("name") == name) {
                    returns[returns.length] = e[i]
                }
            }
        }
        return returns;
    }
}

