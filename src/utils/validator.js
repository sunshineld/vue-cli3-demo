
var checkMonth = (rule, value, callback) => {
    if (!value) {
        return callback(new Error('月份不能为空'));
    }
    if (isNaN(Number(value))) {
        callback(new Error('请输入数字值'));
    } else {
        if (value > 12 || value < 0) {
            callback(new Error('月份格式不正确'));
        } else {
            callback();
        }
    }
};
var checkEnglish = (rule,value,callback) =>{
    var eng = /^[a-zA-z]+$/;
    if(!value.match(eng)){
        return callback(new Error('只能输入英文！'));
    }else{
        callback();
    }

}
var checkPoints = (rule,value,callback) => {
    if(value > 5) {
        callback(new Error('积分最大值为5'));
    } else {
        callback();
    }
}
var checkMaxValue = (rule,value,callback) => {
    if(value > rule.max || value < rule.min) {
        callback(new Error(rule.message));
    } else {
        callback();
    }
}
var validateIdCard = (rule, idCard, callback) => {
    //15位和18位身份证号码的正则表达式
    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    //如果通过该验证，说明身份证格式正确，但准确性还需计算
    if (regIdCard.test(idCard)) {
        if (idCard.length == 18) {
            var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
            var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
            var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
            for (var i = 0; i < 17; i++) {
                idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
            }
            var idCardMod = idCardWiSum % 11;//计算出校验码所在数组的位置
            var idCardLast = idCard.substring(17);//得到最后一位身份证号码
            //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
            if (idCardMod == 2) {
                if (idCardLast == "X" || idCardLast == "x") {
                    callback();
                } else {
                    callback(new Error('身份证格式错误'));
                }
            } else {
                //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                if (idCardLast == idCardY[idCardMod]) {
                    callback();
                } else {
                    callback(new Error('身份证格式错误'));
                }
            }
        }
    } else {
        callback(new Error('身份证格式错误'));
    }
}
var validatePhone = function(rule, value, callback) {
    let reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if(!reg.test(value)) {
       callback(new Error('请输入正确的手机号'));
    } else {
        callback();
    }
}
var isInteger = function(rule, value, callback){
    let flag = Math.round(value) == value
    if(flag) {
        callback();
    } else {
        callback(new Error('请输入整数'));
    }

}
export { 
    checkMonth, 
    checkEnglish,
    checkPoints,
    validateIdCard,
    validatePhone,
    checkMaxValue,
    isInteger
}
