/**
 * 字符串、数字、下划线、中划线的组合
 * **/
export const isAlphaNumeric = (rule, value, callback) => {
  const regex = /^[a-zA-Z0-9_-]+$/;
  if (!regex.test(value)) {
    callback(new Error('只支持字符串、数字、下划线、中划线的组合'));
  } else {
    callback();
  }
};

/**
 * 验证是否手机号
 * **/
export const isIphoneNumber = (rule, value, callback) => {
  const regex = /^1[3-9]\d{9}$/;
  if (!regex.test(value)) {
    callback(new Error('请输入正确的手机号码'));
  } else {
    callback();
  }
};

/**
 * 验证是支付宝
 * **/
export const validZhifuBao = (value) => {
  const regex = /^(?:1[3-9]\d{9}|[a-zA-Z\d._-]*\@[a-zA-Z\d.-]{1,10}\.[a-zA-Z\d]{1,20})$/;
  let isValid = false
  if (!regex.test(value)) {
    isValid = false
  } else {
    isValid = true
  }
  return isValid
};


/**
 * 验证是否银行卡
 * **/
export const validBank = (value) => {
  const regex = /^[1-9]\d{9,18}$/;
  let isValid = false
  if (!regex.test(value)) {
    isValid = false
  } else {
    isValid = true
  }
  return isValid
};

/**
 * 验证是否手机号
 * **/
export const validPhone = (value) => {
  const regex = /^1[3-9]\d{9}$/;
  let isValid = false
  if (!regex.test(value)) {
    isValid = false
  } else {
    isValid = true
  }
  return isValid
};

/**
 * 验证是否身份证号
 * **/
export const validIDCard = (value) => {
  const regex = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}(\d|X|x)$/;
  let isValid = false
  if (!regex.test(value)) {
    isValid = false
  } else {
    isValid = true
  }
  return isValid
};


