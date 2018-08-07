module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2015,
        "sourceType": "module"
    },
    "rules": {
        "no-console": "off",
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],
        // 强制 “for” 循环中更新子句的计数器朝着正确的方向移动
        "for-direction": "error",
        // switch 中 case 禁止冒号之前有空格，冒号之后有一个或多个空格
        "switch-colon-spacing": "error",
        // 注释 // 或 /* 必须跟随至少一个空白
        "spaced-comment": ["error", "always"],
        // 一元操作符前后是否需要加空格，单词类操作符需要加，而非单词类操作符不用加
        "space-unary-ops": [2, { "words": true, "nonwords": false }],
        // 操作符前后需要加空格
        "space-infix-ops": 2,
        // 禁止圆括号内有空格
        "space-in-parens": ["error", "never"],
        // 要求语句块之前有空格
        "space-before-blocks": "error",
        // 强制分号必须在句末
        "semi-style": ["error", "last"],
        // 强制分号之后有空格，禁止分号之前有空格。
        "semi-spacing": ["error", {"before": false, "after": true}],
        // 禁止块语句和类的开始或末尾有空行
        "padded-blocks": ["error", "never"],
        // 要求尽可能地简化赋值操作
        "operator-assignment": ["error", "always"],
        // 不允许花括号中有空格
        "object-curly-spacing": ["error", "never"],
        // if语句后面不能省略大括号
        "curly": "error",
        // 和null比较时必须使用全等和非全等
        "no-eq-null": "error",
        // 禁止出现多个空格
        // "no-multi-spaces": "error",
        // 禁止单行语句之前有换行
        "nonblock-statement-body-position": ["error", "beside"],
        // 禁止属性前有空白
        "no-whitespace-before-property": "error",
        // 当有更简单的结构可以代替三元操作符时，该规则禁止使用三元操作符
        "no-unneeded-ternary": "error",
        // 要求在关键字前后至少有一个空格
        "keyword-spacing": "error",
        // 要求在字面量中的冒号之前无空格，之后有空格
        "key-spacing": "error",
        // 禁止在函数标识符和其调用之间有空格
        "func-call-spacing": ["error", "never"],
        // 禁止在计算属性中使用空格
        "computed-property-spacing": ["error", "never"],
        // 要求逗号放在数组元素、对象属性或变量声明之后，且在同一行
        "comma-style": ["error", "last"],
        // 要求在逗号前无空格，逗号后有空格
        "comma-spacing": "error"
    }
};