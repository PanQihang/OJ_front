jQuery.validator.addMethod("mobilePhone", function(value, element) {
    var tel = /^1[34578]\d{9}$/;
    return this.optional(element) || (tel.test(value));
}, "请输入正确格式的电话号码");