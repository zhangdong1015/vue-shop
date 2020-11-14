/**
 * 用户相关服务
 */

import  {showErrorToast,request,checkSession,login} from '../utils/index'

/**
 * 用户鉴权地址
 */
const AuthLoginByWeixin = "auth/login_by_weixin";


/**
 * 调用微信登录
 */
 function loginByWeixin(userInfo) {

  let code = null;
  return new Promise(function (resolve, reject) {
    return  login().then((res) => {
      code = res.code;
      return userInfo;
    }).then((userInfo) => {
      //登录远程服务器
      request('/auth/login_by_weixin',  'POST', { code: code, userInfo: userInfo },'application/json').then(res => {
        if (res.errno === 0) {
          //存储用户信息
          wx.setStorageSync('userInfo', res.data.userInfo);
          wx.setStorageSync('token', res.data.token);
          resolve(res);
        } else {
         showErrorToast(res.errmsg)
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    })
  });
}

/**
 * 判断用户是否登录
 */
 function checkLogin() {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {

      checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });

    } else {
      reject(false);
    }
  });
}




export
{
  loginByWeixin,checkLogin

}






