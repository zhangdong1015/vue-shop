<script type="text/javascript">
    // 定义一些公共的属性和方法
 
// 设置全局数据
 const globalData= {
  userInfo: {
      nickName: '点击登陆',
      userName: '',
      avatarUrl: 'https://platform-wxmall.oss-cn-beijing.aliyuncs.com/upload/20180727/150547696d798c.png'
  },
  token: '',
  userCoupon: 'NO_USE_COUPON',//默认不适用优惠券
  courseCouponCode: {},//优惠券信息
};
    // 暴露出这些属性和方法
    export default {
        globalData,
    }
</script>