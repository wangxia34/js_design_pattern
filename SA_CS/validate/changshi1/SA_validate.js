/*
* rules:
* valid:
*
*/


// *** validator.showErrors:
/*
        var validator = $( "#myshowErrors" ).validate();
        validator.showErrors({
          "name": "I know that your firstname is Pete, Pete!"
        });
*/

// *** validator.setDefaults:
/*
        $.validator.setDefaults({
            success: "校验成功！"
        });
*/

// *** validator.messages/rules:
/*
        $("#myform").validate({
          rules: {
            name: {
              required: true,
              minlength: 2
            }
          },
          messages: {
            name: {
              required: "We need your email address to contact you",
              minlength: jQuery.validator.format("At least {0} characters required!")
            }
          }
        });
*/

// *** validator.methods:
/*
         $.validator.methods.email = function( value, element ) {
             return this.optional( element ) || /[a-z]+@[a-z]+\.[a-z]+/.test( value );
         }
*/

// *** validator.addMethod:
/*
        $.validator.addMethod("isMobile", function(value, element) {
            return this.optional(element) || /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/.test(value);
        }, "请正确填写您的手机号码");
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
    $.extend($.fn, {
        
        SAvalidate: function (options) {
            // 验证是否已经创建该表单的校验
            let validator = $.data(this[0], "validator");
            console.log(validator);
            if (validator) {
                return validator;
            }
            
            // 去掉HTML5中表单的默认提交
            this.attr("novalidate", "novalidate");
            
            // 创建表单校验。
            validator = new $.validator(options, this[0]);
            $.data(this[0], "validator", validator);
            
            return validator;
        },
        
        // 校验
        valid: function () {
            let valid, validator, errorList;
            
            if ($(this[0]).is("form")) {
                valid = this.SAvalidate().form();
            } else {
                errorList = [];
                valid = true;
                validator = $(this[0].form).SAvalidate();
                this.each(function () {
                    valid = validator.element(this) && valid;
                    if (!valid) {
                        errorList = errorList.concat(validator.errorList);
                    }
                });
                validator.errorList = errorList;
            }
            return valid;
        },
        
        // 规则的添加，获取，删除
        rules: function (command, argument) {
            let element = this[0],
                data, param;
            
            // 没有element 返回空对象
            if (element == null) {
                return;
            }
            
            // 没有在表单标签里，但含有可编辑属性。
            // ...
            
            // 没有表单
            if (element.form == null) {
                return;
            }
            
            // 自定义添加和删除rules
            // ...
            
            data = $.validator.normalizeRules(
                $.extend(
                    {},
                    $.validator.attributeRules(element),
                    $.validator.staticRules(element)
                ), element);
            
            // required在最前
            if (data.required) {
                param = data.required;
                delete data.required;
                data = $.extend({required: param}, data);
            }
            
            return data;
        }
        
        
    });
    
    // validator构造函数
    $.validator = function (options, form) {
        this.settings = $.extend(true, {}, $.validator.defaults, options);
        this.currentForm = form;
        this.init();
    };
    
    
    // 用参数替换{n}个占位符。
    // var template = jQuery.validator.format("{0} is not a valid value");
    // alert(template("abc"));
    $.validator.format = function (source, params) {
        if (arguments.length === 1) {
            return function () {
                let args = $.makeArray(arguments);
                args.unshift(source);
                return $.validator.format.apply(this, args);
            };
        }
        if (params === undefined) {
            return source;
        }
        if (arguments.length > 2 && params.constructor !== Array) {
            params = $.makeArray(arguments).slice(1);
        }
        if (params.constructor !== Array) {
            params = [params];
        }
        $.each(params, function (i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function () {
                return n;
            });
        });
        return source;
    };
    
    
    $.extend($.validator, {
        // 默认设置
        defaults: {
            messages: {},               // 错误提示信息
            groups: {},                 // 校验对象和规则的集合
            rules: {},                  // 校验规则
            errorClass: "error",        // 提示错误信息的标签、进行校验的表单元素校验失败的class属性名称
            validClass: "valid",        // 进行校验的表单元素校验成功的class属性名称
            errorElement: "label",      // 提示错误信息的标签名称
            focusCleanup: false,
            focusInvalid: true,
            errorContainer: $([]),
            onsubmit: true,
            ignore: ":hidden",
            ignoreTitle: false,
            success: "<img src=\"./images/note_note.png\">",
            onpropertychange: function (element) { // 默认的监听方式，input框改变的监听
                this.element(element);
            },
            highlight: function (element, errorClass, validClass) {
                if (element.type === "radio") {
                    this.findByName(element.name).addClass(errorClass).removeClass(validClass);
                } else {
                    $(element).addClass(errorClass).removeClass(validClass);
                }
            },
            unhighlight: function (element, errorClass, validClass) {
                if (element.type === "radio") {
                    this.findByName(element.name).removeClass(errorClass).addClass(validClass);
                } else {
                    $(element).removeClass(errorClass).addClass(validClass);
                }
            }
        },
        
        // 修改默认设置
        setDefaults: function (settings) {
            $.extend($.validator.defaults, settings);
        },
        
        autoCreateRanges: false,
        
        prototype: {
            
            init: function () {
                this.errorContext = $(this.currentForm);
                this.invalid = {};// name:效验成功为false  失败为true
                this.reset();
                
                // 将规则和消息分组成键值对
                let groups = (this.groups = {}),
                    rules;
                $.each(this.settings.groups, function (key, value) {
                    if (typeof value === "string") {
                        value = value.split(/\s/);
                    }
                    $.each(value, function (index, name) {
                        groups[name] = key;
                    });
                });
                rules = this.settings.rules;
                $.each(rules, function (key, value) {
                    rules[key] = $.validator.normalizeRule(value);
                });
                
                
                // 此处监听事件
                function delegate(event) {
                    var validator = $.data(this.form, "validator"),
                        // eventType = "on" + event.type.replace( /^validate/, "" ),
                        settings = validator.settings;
                    // if ( settings[ eventType ] && !$( this ).is( settings.ignore ) ) {
                    settings.onpropertychange.call(validator, this, event);
                    // }
                }
                
                $(this.currentForm)
                    .on("input propertychange", ":text", delegate);
            },
            
            isValid: function () {
                if (!this.numberOfInvalids()) {
                    return true;
                }
            },
            
            // 效验单个元素  有效为true  否则为false
            element: function (element) {
                let cleanElement = this.clean(element),
                    v = this,
                    result = true,
                    rs, group;
                
                this.prepareElement(cleanElement);
                this.currentElements = $(cleanElement);
                
                /*
                group = this.groups[ cleanElement.name ];
                if ( group ) {
                    $.each( this.groups, function( name, testgroup ) {
                        if ( testgroup === group && name !== cleanElement.name ) {
                            cleanElement = v.validationTargetFor( v.clean( v.findByName( name ) ) );
                            if ( cleanElement && cleanElement.name in v.invalid ) {
                                v.currentElements.push( cleanElement );
                                result = v.check( cleanElement ) && result;
                            }
                        }
                    } );
                }
                */
                
                rs = this.check(cleanElement) !== false;
                
                result = result && rs;
                
                if (rs) {
                    this.invalid[cleanElement.name] = false;
                } else {
                    this.invalid[cleanElement.name] = true;
                }
                
                // console.log("invalid : ");
                // console.log(this.invalid);
                
                this.showErrors();
                
                return result;
            },
            
            // 显示指定的信息
            showErrors: function (errors) {
                if (errors) {
                    let validator = this;
                    
                    // 添加错误信息列表
                    $.extend(this.errorMap, errors);
                    this.errorList = $.map(this.errorMap, function (message, name) {
                        return {
                            message: message,
                            element: validator.findByName(name)[0]
                        };
                    });
                    
                    // 移除成功信息列表
                    this.successList = $.grep(this.successList, function (element) {
                        return !(element.name in errors);
                    });
                }
                
                this.defaultShowErrors();
            },
            
            // 返回给定元素名称的自定义消息和验证方法
            customMessage: function (name, method) {
                let m = this.settings.messages[name];
                // console.log("this.settings.messages : ");
                // console.log(this.settings.messages);
                // console.log("m : ");
                // console.log(m);
                return m && (m.constructor === String ? m : m[method]);
            },
            
            // 返回第一个定义的参数，允许空字符串
            findDefined: function () {
                for (let i = 0; i < arguments.length; i++) {
                    if (arguments[i] !== undefined) {
                        return arguments[i];
                    }
                }
                return undefined;
            },
            
            /*
                 rule = {
                     method: "method name",
                     parameters: "the given method parameters"
                 }
            */
            // 获取到错误提示信息
            defaultMessage: function (element, rule) {
                if (typeof rule === "string") {
                    rule = {method: rule};
                }
                
                let message = this.findDefined(
                        this.customMessage(element.name, rule.method),
                        $.validator.messages[rule.method],
                        "<strong>Warning: 没有定义\"" + element.name + "\"的 \"message\"</strong>"
                    ),
                    theregex = /\$?\{(\d+)\}/g;
                
                if (typeof message === "function") {
                    message = message.call(this, rule.parameters, element);
                } else if (theregex.test(message)) {
                    message = $.validator.format(message.replace(theregex, "{$1}"), rule.parameters);
                }
                
                return message;
            },
            
            // 获取到错误提示信息，将错误信息写入errorList集合中
            formatAndAdd: function (element, rule) {
                let message = this.defaultMessage(element, rule);
                
                this.errorList.push({
                    message: message,
                    element: element,
                    method: rule.method
                });
                
                this.errorMap[element.name] = message;
                // this.submitted[ element.name ] = message;
            },
            
            // 默认的显示信息
            defaultShowErrors: function () {
                let i, elements, error;
                for (i = 0; this.errorList[i]; i++) {
                    error = this.errorList[i];
                    if (this.settings.highlight) {
                        this.settings.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass);
                    }
                    this.showLabel(error.element, error.message);
                }
                if (this.settings.success) {
                    for (i = 0; this.successList[i]; i++) {
                        this.showLabel(this.successList[i]);
                    }
                }
                if (this.settings.unhighlight) {
                    for (i = 0, elements = this.validElements(); elements[i]; i++) {
                        this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass);
                    }
                }
                this.toHide = this.toHide.not(this.toShow);
                this.hideErrors();
                
                this.toShow.show();
            },
            
            numberOfInvalids: function () {
                return this.objectLength(this.invalid);
            },
            
            // 获得object的长度
            objectLength: function (obj) {
                /* jshint unused: false */
                var count = 0,
                    i;
                for (i in obj) {
                    // 允许计数空错误的元素，message不计数
                    if (obj[i] !== undefined && obj[i] !== null && obj[i] !== false) {
                        count++;
                    }
                }
                return count;
            },
            
            // 隐藏提示信息
            hideErrors: function () {
                this.toHide.hide();
            },
            
            clean: function (selector) {
                return $(selector)[0];
            },
            
            resetInternals: function () {
                this.successList = [];      // 效验成功的集合
                this.errorList = [];        // 效验失败的集合
                this.errorMap = {};
                this.toShow = $([]);      // 需要显示的消息集合
                this.toHide = $([]);      // 需要隐藏的消息集合
            },
            
            reset: function () {
                this.resetInternals();
                this.currentElements = $([]);
            },
            
            // 准备element
            prepareElement: function (element) {
                this.reset();
                this.toHide = this.errorsFor(element);
            },
            
            // 返回表单元素中除开校验失败的所有表单元素
            validElements: function () {
                return this.currentElements.not(this.invalidElements());
            },
            
            // 返回错误列表中的element
            invalidElements: function () {
                return $(this.errorList).map(function () {
                    return this.element;
                });
            },
            
            // 显示label提示信息标签
            showLabel: function (element, message) {
                let place, group, v,
                    error = this.errorsFor(element), // 确保获得的是label
                    elementID = this.idOrName(element);
                
                if (error.length) {
                    // 如果有错误，移除class的正确类，添加错误类。
                    error.removeClass(this.settings.validClass).addClass(this.settings.errorClass);
                    
                    // 将错误消息添加到label标签中
                    error.html(message);
                } else {
                    // 创建错误提示标签
                    error = $("<" + this.settings.errorElement + ">")
                        .attr("id", elementID + "-error")
                        .addClass(this.settings.errorClass)
                        .html(message || "");
                    
                    // 保持对要放置到DOM中的元素的引用
                    place = error;
                    place.insertAfter(element);// 在element元素之后插入place元素
                    
                    // 连接表单与错误标签的name
                    if (error.is("label")) {
                        error.attr("for", elementID);
                    } else if (error.parents("label[for='" + this.escapeCssMeta(elementID) + "']").length === 0) {
                        // 如果将该元素分组，则将其分配给同一组中的所有元素。
                        group = this.groups[element.name];
                        if (group) {
                            v = this;
                            $.each(v.groups, function (name, testgroup) {
                                if (testgroup === group) {
                                    $("[name='" + v.escapeCssMeta(name) + "']", v.currentForm);
                                }
                            });
                        }
                    }
                }
                if (!message && this.settings.success) {
                    error.text("");
                    if (typeof this.settings.success === "string") {
                        error.html(this.settings.success);
                    } else {
                        this.settings.success(error, element);
                    }
                }
                this.toShow = this.toShow.add(error);
            },
            
            // 缩减集合到label上
            errorsFor: function (element) {
                let name = this.escapeCssMeta(this.idOrName(element)),
                    selector = "label[for='" + name + "'], label[for='" + name + "'] *";
                return this.errors().filter(selector);
            },
            
            // 为css添加转译符号
            escapeCssMeta: function (string) {
                return string.replace(/([\\!"#$%&'()*+,./:;<=>?@\[\]^`{|}~])/g, "\\$1");
            },
            
            // 获取元素name
            idOrName: function (element) {
                return this.groups[element.name] || element.id || element.name;
            },
            
            // 选择到表单中所有的class属性为error【默认，可修改】的label【默认，可修改】标签。
            errors: function () {
                let errorClass = this.settings.errorClass.split(" ").join(".");
                return $(this.settings.errorElement + "." + errorClass, this.errorContext);
            },
            
            // 获得value
            elementValue: function (element) {
                let $element = $(element),
                    type = element.type,
                    val;
                
                val = $element.val();
                
                if (typeof val === "string") {
                    return val.replace(/\r/g, "");
                }
                return val;
            },
            
            // 效验
            check: function (element) {
                element = this.clean(element);
                
                let rules = $(element).rules(),
                    rulesCount = $.map(rules, function (n, i) {
                        return i;
                    }).length,
                    dependencyMismatch = false,
                    val = this.elementValue(element),
                    result, method, rule;
                
                
                for (method in rules) {
                    rule = {method: method, parameters: rules[method]};
                    try {
                        result = $.validator.methods[method].call(this, val, element, rule.parameters);
                        
                        // 如果方法指示字段是可选的，因此是有效的，当没有其他规则时，不要将其标记为有效。
                        if (result === "dependency-mismatch" && rulesCount === 1) {
                            dependencyMismatch = true;
                            continue;
                        }
                        dependencyMismatch = false;
                        
                        // 校验失败
                        if (!result) {
                            this.formatAndAdd(element, rule);
                            return false;
                        }
                    } catch (e) {
                        if (this.settings.debug && window.console) {
                            console.log("Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e);
                        }
                        if (e instanceof TypeError) {
                            e.message += ".  Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.";
                        }
                        
                        throw e;
                    }
                }
                if (dependencyMismatch) {
                    return;
                }
                if (this.objectLength(rules)) {
                    this.successList.push(element);
                }
                return true;
            },
            
            // 获取表单内name值为传入值的元素。
            findByName: function (name) {
                return $(this.currentForm).find("[name='" + this.escapeCssMeta(name) + "']");
            },
            
            // 获得长度
            getLength: function (value, element) {
                /*
                switch ( element.nodeName.toLowerCase() ) {
                    case "select":
                        return $( "option:selected", element ).length;
                    case "input":
                        if ( this.checkable( element ) ) {
                            return this.findByName( element.name ).filter( ":checked" ).length;
                        }
                }
                */
                return value.length;
            },
            
            // 检查是否有值  有值返回"dependency-mismatch"，无值返回false
            optional: function (element) {
                let val = this.elementValue(element);
                return !$.validator.methods.required.call(this, val, element) && "dependency-mismatch";
            },
        },
        
        addClassRules: function (className, rules) {
            if (className.constructor === String) {
                this.classRuleSettings[className] = rules;
            } else {
                $.extend(this.classRuleSettings, className);
            }
        },
        
        normalizeAttributeRule: function (rules, type, method, value) {
            // 数字转换
            if (/min|max|step/.test(method) && (type === null || /number|range|text/.test(type))) {
                value = Number(value);
                if (isNaN(value)) {
                    value = undefined;
                }
            }
            
            if (value || value === 0) {
                rules[method] = value;
            } else if (type === method && type !== "range") {
                
                // Exception: the jquery validate 'range' method
                // does not test for the html5 'range' type
                rules[method] = true;
            }
        },
        
        // 将字符串转换成 {string: true} 的规则形式 , e.g., "required" to {required:true}
        normalizeRule: function (data) {
            if (typeof data === "string") {
                var transformed = {};
                $.each(data.split(/\s/), function () {
                    transformed[this] = true;
                });
                data = transformed;
            }
            return data;
        },
        
        // 获取标签上以规则为属性的规则
        attributeRules: function (element) {
            let rules = {},
                $element = $(element),
                type = element.getAttribute("type"),
                method, value;
            
            for (method in $.validator.methods) {
                if (method === "required") {
                    value = element.getAttribute(method);
                    if (value === "") {
                        value = true;
                    }
                    value = !!value;
                } else {
                    value = $element.attr(method);
                }
                this.normalizeAttributeRule(rules, type, method, value);
            }
            
            // “最大长度”可以返回为-1, 2147483647（IE）和524288（Safari）用于文本输入
            if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
                delete rules.maxlength;
            }
            
            return rules;
        },
        
        // 获取rules中用户自己设置的默认规则
        staticRules: function (element) {
            let rules = {},
                validator = $.data(element.form, "validator");
            
            if (validator.settings.rules) {
                rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
            }
            
            return rules;
        },
        
        // 获取到规则
        normalizeRules: function (rules, element) {
            // 对相关的检查进行一些处理
            $.each(rules, function (prop, val) {
                // 当规则为显示false时，忽略规则。
                if (val === false) {
                    delete rules[prop];
                    return;
                }
                /*
                if ( val.param || val.depends ) {
                    let keepRule = true;
                    switch ( typeof val.depends ) {
                        case "string":
                            keepRule = !!$( val.depends, element.form ).length;
                            break;
                        case "function":
                            keepRule = val.depends.call( element, element );
                            break;
                    }
                    if ( keepRule ) {
                        rules[ prop ] = val.param !== undefined ? val.param : true;
                    } else {
                        $.data( element.form, "validator" ).resetElements( $( element ) );
                        delete rules[ prop ];
                    }
                }*/
            });
            
            $.each(rules, function (rule, parameter) {
                rules[rule] = $.isFunction(parameter) && rule !== "normalizer" ? parameter(element) : parameter;
            });
            
            $.each(["minlength", "maxlength"], function () {
                if (rules[this]) {
                    rules[this] = Number(rules[this]);
                }
            });
            
            $.each(["rangelength", "range"], function () {
                let parts;
                if (rules[this]) {
                    if ($.isArray(rules[this])) {
                        rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
                    } else if (typeof rules[this] === "string") {
                        parts = rules[this].replace(/[\[\]]/g, "").split(/[\s,]+/);
                        rules[this] = [Number(parts[0]), Number(parts[1])];
                    }
                }
            });
            
            if ($.validator.autoCreateRanges) {
                if (rules.min != null && rules.max != null) {
                    rules.range = [rules.min, rules.max];
                    delete rules.min;
                    delete rules.max;
                }
                if (rules.minlength != null && rules.maxlength != null) {
                    rules.rangelength = [rules.minlength, rules.maxlength];
                    delete rules.minlength;
                    delete rules.maxlength;
                }
            }
            
            return rules;
        },
        
        // 添加自定义校验方法
        addMethod: function (name, method, message) {
            $.validator.methods[name] = method;
            $.validator.messages[name] = message !== undefined ? message : $.validator.messages[name];
            // if ( method.length < 3 ) {
            //     $.validator.addClassRules( name, $.validator.normalizeRule( name ) );
            // }
        },
        
        // 内置的校验方法  也可通过这个接口修改为自定义的校验方法
        methods: {
            
            // 是否必填 required：true
            required: function (value, element, param) {
                return value.length > 0;
            },
            
            // 电子邮件 email: true
            email: function (value, element) {
                return this.optional(element) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
            },
    
            // 手机号码 isMobile: true
            mobile: function(value, element) {
                return this.optional(element) || /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/.test(value);
            },
            
            // 字符验证，只能包含中文、英文、数字、下划线等字符。
            stringCheck: function (value, element) {
                return this.optional(element) || /^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/.test(value);
            },
            
            // 有效网址 url: true
            url: function (value, element) {
                return this.optional(element) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
            },
            
            // 日期
            date: function (value, element) {
                return this.optional(element) || !/Invalid|NaN/.test(new Date(value).toString());
            },
            
            // 使元素需要ISO日期。
            dateISO: function (value, element) {
                return this.optional(element) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
            },
            
            // 必须十进制数字，可以小数点 number: true
            number: function (value, element) {
                return this.optional(element) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
            },
            
            // 是否仅填写数字，不能小数点 digits: true
            digits: function (value, element) {
                return this.optional(element) || /^\d+$/.test(value);
            },
            
            // 给定最小长度 minlength: 2
            minlength: function (value, element, param) {
                let length = $.isArray(value) ? value.length : this.getLength(value, element);
                return this.optional(element) || length >= param;
            },
            
            // 给定最大长度 maxlength: 23
            maxlength: function (value, element, param) {
                let length = $.isArray(value) ? value.length : this.getLength(value, element);
                return this.optional(element) || length <= param;
            },
            
            // 给定值长度的范围 range: [2, 23]
            rangelength: function (value, element, param) {
                let length = $.isArray(value) ? value.length : this.getLength(value, element);
                return this.optional(element) || (length >= param[0] && length <= param[1]);
            },
            
            // 给定最小值 min: 2
            min: function (value, element, param) {
                return this.optional(element) || value >= param;
            },
            
            // 给定最大值 max: 23
            max: function (value, element, param) {
                return this.optional(element) || value <= param;
            },
            
            // 给定值范围 range: [13, 23]
            range: function (value, element, param) {
                return this.optional(element) || (value >= param[0] && value <= param[1]);
            },
            
            // 要求元素与另一个元素相同  equalTo: "#id"
            equalTo: function (value, element, param) {
                // 绑定到目标的模糊事件，以便每当目标字段被更新时重新验证。
                let target = $(param);
                if (this.settings.onpropertychange && target.not(".validate-equalTo-blur").length) {
                    target.addClass("validate-equalTo-blur").on("keyup.validate-equalTo", function () {
                        $(element).valid();
                    });
                }
                return value === target.val();
            },
        },
        
        // 提示信息
        messages: {
            required: "这是必填字段",
            email: "请输入有效的电子邮件地址",
            mobile: "请正确填写手机号码",
            url: "请输入有效的网址",
            date: "请输入有效的日期",
            dateISO: "请输入有效的日期 (YYYY-MM-DD)",
            number: "请输入有效的数字",
            digits: "只能输入数字",
            creditcard: "请输入有效的信用卡号码",
            equalTo: "你的输入不相同",
            stringCheck: "包含特殊字符",
            extension: "请输入有效的后缀",
            maxlength: $.validator.format("最多可以输入 {0} 个字符"),
            minlength: $.validator.format("最少要输入 {0} 个字符"),
            rangelength: $.validator.format("请输入长度在 {0} 到 {1} 之间的字符串"),
            range: $.validator.format("请输入范围在 {0} 到 {1} 之间的数值"),
            max: $.validator.format("请输入不大于 {0} 的数值"),
            min: $.validator.format("请输入不小于 {0} 的数值")
        },
        
        
    });
    
    return $;
}));