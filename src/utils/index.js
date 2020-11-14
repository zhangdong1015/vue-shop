function formatNumber(n) {
  const str = n.toString();
  return str[1] ? str : `0${str}`;
}

export function formatTime(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const t1 = [year, month, day].map(formatNumber).join("/");
  const t2 = [hour, minute, second].map(formatNumber).join(":");

  return `${t1} ${t2}`;
}

//-------------------------------------------------------------------------请求的封装

const host = "http://localhost:8089/xiuhong/api";

export { host };
//请求封装
export function request(url, method, data, header ={}) {
  wx.showLoading({
    title: "加载中" //数据请求前loading
  });
  return new Promise((resolve, reject) => {
    wx.request({
      url: host + url, //仅为示例，并非真实的接口地址
      method: method,
      data: data,
      header: {
        "content-type": "application/json", // 默认值
        'X-Nideshop-Token': wx.getStorageSync('token')

      },
      success: function(res) {
        wx.hideLoading();
              if (res.statusCode == 200) {

                 console.log("dd1111",res.data)
                  if (res.data.errno == 401) {
                      wx.navigateTo({
                          url: '/pages/auth/btnAuth/btnAuth',
                      })
                  } else {
                      resolve(res.data);
                  }
              } else {
                  reject(res.errMsg);
              }

      },
      fail: function(res) {
        wx.hideLoading();
        reject(res);
      },
      complete: function() {
        wx.hideLoading();
      }
    });
  });
}
export function get(url, data) {
  return request(url, "GET", data);
}
export function post(url, data) {
  return request(url, "POST", data);
}

//-------------------------------------------------------------------------请求的封装

//----------------------------------------------用户是否登录 未登录跳转到登录页面 -------------------------

export function toLogin() {
  const userInfo = wx.getStorageSync("userInfo");
  if (!userInfo) {
    wx.navigateTo({
      url: "/pages/login/main"
    });
  } else {
    return true;
  }
}

export function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
        success: function (res) {
            if (res.code) {
                resolve(res);
            } else {
                reject(res);
            }
        },
        fail: function (err) {
            reject(err);
        }
    });
});
}

//----------------------------------------------用户是否登录 未登录跳转到登录页面 -------------------------

export function getStorageOpenid() {
  const openId = wx.getStorageSync("openId");
  if (openId) {
    return openId;
  } else {
    return "";
  }
}

export function showErrorToast(msg) {
  wx.showToast({
      title: msg,
      image: '/static/images/icon_error.png'
  })
}

export function showSuccessToast(msg) {
  wx.showToast({
      title: msg,
  })
}

export function checkSession() {
  return new Promise(function (resolve, reject) {
      wx.checkSession({
          success: function () {
              resolve(true);
          },
          fail: function () {
              reject(false);
          }
      })
  });
}

