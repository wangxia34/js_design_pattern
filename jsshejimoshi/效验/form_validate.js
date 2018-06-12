class Form_Validate {
	constructor() {
		this.text_check = {
			"other": "其他"
		}; 
		this.option_name = {
			"text": {
				type:"input",
				name:"文本框",
				listener:"keyup"
			},
			"select": {
				type:"select",
				name:"下拉框",
				listener:"change"
			},
			"checkbox": {
				type:"input",
				name:"复选框",
				listener:"change"
			},
			"textarea": {
				type:"textarea",
				name:"文本域",
				listener:"keyup"
			},
			"radio": {
				type:"input",
				name:"单选框",
				listener:null
			},
			"file": {
				type:"input",
				name:"文件上传",
				listener:"change"
			},
			"password": {
				type:"input",
				name:"密码框",
				listener:"keyup"
			},
			"date": {
				type:"input",
				name:"时间",
				listener:null
			}
		}
		this.required = 1;
		this.cur_time = 0;
		this.last_time = 0;

	}
	
	_main(obj) {
        this.checkArgument(obj);
        var option = obj.option;
        var form_name = obj.form_name;
        for (var x in option) {
            this.checkFormOption(option[x], x);
            this.iniArgumentList(option[x]);
            this._addEventListener(option[x], x, form_name, option);
        }
        this._addFormSubmit(obj);
    }
	
    //检查传入参数的正确性
    checkArgument(obj) {
        if (!obj) { alert("实例化ChinArk_form对象时没有传入参数！"); return; }
        if (typeof obj != "object") { alert("传入的参数不是对象！"); return; }
        if (!obj.form_name) { alert("要检查的表单名form_name字段没写或者为空！"); return; }
        if (!this.getElementsByName(obj.form_name, "form")) { alert("没有找到表单名为" + obj.form_name + "的表单，检查一下表单名称写对没！"); return; }
    }
    
    //获得表单节点
    getElementsByName(name, tag) {
        if (!document.all) { 
        	return document.getElementsByName(name); 
        }else {
            var returns = document.getElementsByName(name);
            if (returns.length > 0) return returns;
            returns = new Array();
            var e = document.getElementsByTagName(tag);
            for (var i = 0; i < e.length; i++) {
                if (e[i].getAttribute("name") == name) { returns[returns.length] = e[i] };
            }
        }
        return returns;
    }
    
    //检查传入的表单对象的属性是否符合规范
    checkFormOption(option, x) {
        var cur = this.getElementsByName(x, this.option_name[option.type][type]);
        if (!cur[0]) { return; }
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
    }
    
    //初始化参数列表
	iniArgumentList(option) {
        option.required = typeof (option.required) == 'undefined' ? this.required : parseInt(option.required);//默认是必须填写，不能为空
    }
	
	//为每个表单元素添加事件监听
	_addEventListener(option, name, form_name, obj) {
        var me = this;
        var cur = me.getCURElementsByName(name, me.option_name[option.type][type], form_name)[0];
        if (!cur) { return; }
        else if(me.option_name[option.type][Listener] !== null){
        	if (document.all) {
                cur.attachEvent("on"+me.option_name[option.type][Listener], function () {
                    var cur_value = cur.value;
                    var obj1 = { "option": option, "name": name, "value": cur_value, "form": form_name }
                    me.check_select_checkbox(obj1)
                })
           }else {
                cur.addEventListener(me.option_name[option.type][Listener], function () {
                    var cur_value = cur.value;
                    var obj1 = { "option": option, "name": name, "value": cur_value, "form": form_name }
                    me.check_select_checkbox(obj1)
                }, true)
            }
        }
    }
	
	check_select_checkbox(object) {
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
        this.tip(option, name, msg, form_name)
    }
    
    tip(option, name, msg, form_name) {
        var cur_obj = document.getElementById(form_name + name + "CHINARK_ERROR_TIP");
        if (cur_obj) { cur_obj.parentNode.removeChild(cur_obj) }
        var cur_obj = document.getElementById(form_name + name + "CHINARK_NOTE_TIP");
        if (cur_obj) { cur_obj.parentNode.removeChild(cur_obj) }

        if (msg) {
            var str = this.error_tip(msg);
            var container = document.createElement("div");
            container.id = form_name + name + "CHINARK_ERROR_TIP";
            container.name = "CHINARK_ERROR_TIP";
            container.setAttribute("name", "CHINARK_ERROR_TIP");
            container.style.fontSize = "11px";
            container.style.display = "inline-block";
            container.className = "chinark_note_tip_class_error";
            container.innerHTML = str;
            this.getCURElementsByName(name, this.option_name[option.type][type], form_name)[0].parentNode.appendChild(container);
        } else {
            var cur = this.getElementsByName(name, this.option_name[option.type][type])[0];
            if (!option.required) {
                if (/^\s*$/.test(cur.value)) { msg = "此项可以为空" } else { msg = "此项输入正确" }
            }
            var str = this.note_tip(msg);
            var container = document.createElement("div");
            container.id = form_name + name + "CHINARK_NOTE_TIP";
            container.style.fontSize = "11px";
            container.style.display = "inline-block";
            container.style.margin = "0px 5px";
            container.className = "chinark_note_tip_class_right";
            container.innerHTML = str;
            this.getCURElementsByName(name, this.option_name[option.type], form_name)[0].parentNode.appendChild(container);
        }
    }
    
    error_tip(msg) {
        var note_style = "style='float:left; margin:0px 0px -8px 5px;color: red;";
        note_style += "line-height: 24px;'";
        return "<div " + note_style + ">" + msg + "</div>";
    }
    
    note_tip(msg) {
        if (!msg) { msg = "此项满足规范" }
        var html = "<img src='images/note_note.png' />";
        return html;
    }
	
	//取某标签form下的名字为name的tag元素
	getCURElementsByName(name, tag, form_name) {
        if (!document.all) {  //pj:在非IE浏览器下,modify the document not exist;
            var e = (document.getElementsByName(form_name).length == 0) ? [] : document.getElementsByName(form_name)[0].getElementsByTagName(tag);
            var returns = new Array();
            for (var i = 0; i < e.length; i++) {
                if (e[i].getAttribute("name") == name) { returns[returns.length] = e[i] };
            }
        }else {
            var con = this.getElementsByName(form_name, "form")[0];
            returns = new Array();
            var e = con.getElementsByTagName(tag);
            for (var i = 0; i < e.length; i++) {
                if (e[i].getAttribute("name") == name) { returns[returns.length] = e[i] };
            }
        }
        return returns;
    }
	
}