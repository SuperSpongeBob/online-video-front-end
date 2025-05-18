import { getRequest } from "./http";

const isEmpty = (value) => {
    return value === null || typeof value === "undefined" || value === "";
};

export function isUserName(rule, value, callback) {
    if (isEmpty(value)) {
        callback("请输入你的名称")
    }
    //最少1位，最多16位，可以为字母,数字,汉字,下划线。
    let reg = /^([a-zA-Z0-9_\u4e00-\u9fa5]{1,16})$/;
    if (reg.test(value)) {
        callback();
    } else {
        callback("最少1位，最多16位，可以为字母,数字,汉字,下划线");
    }
}


export function isMobilePhoneNumber(rule, value, callback) {
    const reg = /^1[3-9]\d{9}$/;
    if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号码'));
    } else {
        callback();
    }
}

export function isEmail(rule, value, callback) {
    // const reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    // const reg=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (!reg.test(value)) {
        callback(new Error('请输入正确的邮箱地址!'));
    } else {
        callback();
    }
}

export function isIdCard(rule, value, callback) {
    const reg = /^\d{17}(\d|X)$/;
    if (!reg.test(value)) {
        callback(new Error('请输入正确的身份证号'));
    } else {
        callback();
    }
}


export function userRole(rule, value, callback) {
    const allowedValues = ["1", "2", "3"];
    if (!allowedValues.includes(value.roleId)) {
        callback(new Error('请选择有效的角色'));
    } else {
        callback();
    }
}


export function isPassword(rule, value, callback) {
    if (isEmpty(value)) {
        callback("请输入你的密码")
    }
    //密码强度正则，最少6位，最多18位，而且同时要有字母和数字。
    let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/;
    if (reg.test(value)) {
        callback();
    } else {
        callback("请输入正确的密码，最少6位，最多18位，而且同时要有字母和数字");
    }
}

export function checkExist(rule, value, callback) {
    if (value === null || typeof value === "undefined" || value === "") {
        callback("不能为空");
    } else {
        //不同项目，自行修改url
        getRequest("/register?" + rule.field + "=" + value).then(reason => {
            if (reason.data === true) {
                callback("已存在");
            } else {
                callback();
            }
        })
    }
}
