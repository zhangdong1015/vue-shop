<template>
  <div class="my">
    <div class="myinfo">
       <img  :src="userInfo.avatarUrl" />
       <button class="bu"  open-type="getUserInfo"  @getuserinfo="bindGetUserInfo">{{userInfo.nickName}}</button>
       <div>
    </div>

  
  
    </div>
    <div class="iconlist">
      <div @click="goTo(item.url)" v-for="(item, index) in listData" :key="index">
        <span class="iconfont" :class="item.icon"></span>
        <span>{{item.title}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    get,
    toLogin,
    login
  } from "../../utils";
  import globalData  from '../../components/common.vue'
  import {loginByWeixin}  from  '../../service/user'
 
  export default {
    onShow() {

      console.log("12345",globalData.globalData);
      var global  = globalData.globalData;
        let userInfo1 = wx.getStorageSync('userInfo');
        let token1 = wx.getStorageSync('token');

        // 页面显示 
        if (userInfo1 && token1) {
            //获取当前值给全局变量
            global.userInfo = userInfo1;
            global.token = token1;
           
        }
      
       this.userInfo.nickName =global.userInfo.nickName;
       this.userInfo.userName =global.userInfo.userName;
       this.userInfo.avatarUrl =global.userInfo.avatarUrl;
        this.getSetting();
    },
    created() {},
    mounted() {

       
    },
    data() {
      return {
        avator: "https://platform-wxmall.oss-cn-beijing.aliyuncs.com/upload/20180727/150547696d798c.png", //http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png//https://platform-wxmall.oss-cn-beijing.aliyuncs.com/upload/20180727/150547696d798c.png
        allcheck: false,
        isShow:false,
        Listids: [],
        userInfo: {
     nickName: '',
      userName: '',
      avatarUrl: ''
        },
        listData: [{
            title: "我的订单",
            icon: "icon-unie64a",
            url: "/pages/myorder/main"
          },

          {
            title: "我的收藏",
            icon: "icon-shoucang",
            url: "/pages/collectlist/main"
          },
          {
            title: "地址管理",
            icon: "icon-dizhiguanli",
            url: "/pages/address/main"
          },

          {
            title: "意见反馈",
            icon: "icon-yijianfankui",
            url: "/pages/feedback/main"
          }
        ]
      };
    },
    components: {},
    methods: {
      goTo(url) {
        if (toLogin()) {
          wx.navigateTo({
            url: url
          });
        }
      },
      toLogin() {
        if (!this.userInfo.avatarUrl) {
          wx.navigateTo({
            url: "/pages/login/main"
          });
        }
      }, 
      
      getUserInfo1(){
      console.log('click事件首先触发')
      // 判断小程序的API，回调，参数，组件等是否在当前版本可用。  为false 提醒用户升级微信版本
      // console.log(wx.canIUse('button.open-type.getUserInfo'))
      if(wx.canIUse('button.open-type.getUserInfo')){
        // 用户版本可用
      }else{
        console.log('请升级微信版本')
      }
    },
  
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
                var ht_userInfo  = res.data.userInfo;
                  //设置用户信息
                   this.$set(this.userInfo,"nickName",ht_userInfo.nickName);//设置用户昵称
                   this.$set(this.userInfo,"avatarUrl",ht_userInfo.avatarUrl);//设置用户图像
                   this.isShow=true;
                
                 //设置全局变量的值
                globalData.globalData.userInfo = res.data.userInfo;
                globalData.globalData.token = res.data.token;
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
                                       var ht_userInfo  = res.data.userInfo;

                        //设置用户信息
                         this.$set(this.userInfo,"nickName",ht_userInfo.nickName);//设置用户昵称
                        this.$set(this.userInfo,"avatarUrl",ht_userInfo.avatarUrl);//设置用户图像
                         this.isShow=true;
                        //设置全局变量的值
                          globalData.globalData.userInfo = res.data.userInfo;
                            globalData.globalData.token = res.data.token;



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




     getSetting(){
      wx.getSetting({
        success: function(res){
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function(res) {
                console.log(res.userInfo)
                //用户已经授权过
                console.log('用户已经授权过')
              }
            })
          }else{
            console.log('用户还未授权过')
          }
        }
      })

    },
    },
  
    computed: {}
  };

</script>
<style lang='scss' scoped>
  @import "./style";

</style>
