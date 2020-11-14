<template>
  <div class="login">
    <div class="logo">

    </div>
    <button class="login-btn" open-type="getUserInfo" lang="zh_CN"  @getuserinfo="bindGetUserInfo">微信登录</button>
  </div>
</template>

<script>
  import {
    host
  } from "../../utils";
  import globalData  from '../../components/common.vue';
  import {loginByWeixin}  from  '../../service/user';
  var qcloud = require("wafer2-client-sdk/index.js");
  export default {
    created() {},
    mounted() {
      console.log("host",host);
    },
    data() {
      return {};
    },
    components: {},
    methods: {
        bindGetUserInfo(e) {  //绑定用户信息
      let userInfo = wx.getStorageSync('userInfo');
      let token = wx.getStorageSync('token');
      if (userInfo && token) {
        return;
      }
        //console.log("e3",e.detail) //mp封装了一层  需要在mp一层下调用 
        console.log("mp.detail",e.mp.detail.userInfo)
        if (e.mp.detail.userInfo){
            //用户按了允许授权按钮
                console.log('用户按了允许授权按钮')
                loginByWeixin(e.mp.detail).then(res => {
          
                
                 //设置全局变量的值
                globalData.globalData.userInfo = res.data.userInfo;
                globalData.globalData.token = res.data.token;
                wx.navigateBack({});
            }).catch((err) => {
                console.log(err)
            });
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告通知',
                content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
                success: function (res) {
                    if (res.confirm) {
                        wx.openSetting({
                            success: (res) => {
                                if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                                    loginByWeixin(e.mp.detail).then(res => {
                             
                        //设置全局变量的值
                          globalData.globalData.userInfo = res.data.userInfo;
                            globalData.globalData.token = res.data.token;

                            wx.navigateBack({});

                                    }).catch((err) => {
                                        console.log(err)
                                    });
                                }
                            }
                        })
                    }
                }
            });
        }
    },
      doLogin() {
        wx.showLoading({
          title: "登录中...", //提示的内容,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        const session = qcloud.Session.get();
        if (session) {
                         console.log("res",res);

          // 第二次登录
          // 或者本地已经有登录态
          // 可使用本函数更新登录态
          qcloud.loginWithCode({
            success: res => {
              // this.setData({ userInfo: res, logged: true });
              wx.setStorageSync("key", "value");
            },
            fail: err => {
              console.error(err);
            }
          });
        } else {
          // 首次登录
          qcloud.login({
            success: res => {
              console.log(res);

               console.log("res",res);
              wx.hideLoading();
              wx.setStorageSync("userInfo", res);
              var openId = res.openId;
                   console.log("openId",openId);
              wx.setStorageSync("openId", openId);
              wx.navigateBack({});
            },
            fail: err => {
              console.log(err);
              wx.hideLoading();
              wx.navigateBack({});
            }
          });
        }
      }
    },
    computed: {}
  };

</script>
<style lang='scss' scoped>
  @import "./style";

</style>
