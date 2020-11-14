<template>
  <div class="order">
    <div @click="toAddressList" v-if="address" class="address">
      <div class="item">
        <div class="list">
          <div class="addresslist">
            <div>
              <span>{{address.userName}}</span>
              <div v-if="address.is_default" class="moren">
                默认
              </div>
            </div>
            <div class="info">
              <p>{{address.telNumber}}</p>
              <p>{{address.full_region+address.detailInfo}}</p>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
    <div @click="toAddressList" v-else class="seladdress">
      请选择收货地址
    </div>
    <div class="orderbox">
      <div class="item">
        <div>商品合计</div>
        <div>￥{{allprice}}</div>
      </div>
      <div class="item">
        <div>运费</div>
        <div>免运费</div>
      </div>
      <div class="item">
        <div>优惠券</div>
        <div>暂无</div>
      </div>
    </div>
    <div class="cartlist">
      <div class="item" >
        <div class="con">
          <div class="left">
            <div class="img">
              <img :src="info.list_pic_url" alt="">
            </div>
            <div class="info">
              <p>{{info.name}}</p>
              <p>￥{{info.retail_price}}</p>
            </div>
          </div>
          <div class="right">
            <div class="num">
              x{{number}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div>
        实付 : ￥{{allprice}}
      </div>
      <div @click="pay">
        提交订单
      </div>
    </div>
  </div>
</template>

<script>
  import {
    get,
    post,
    login,
    getStorageOpenid
  } from "../../utils";
  export default {
    onShow() {

      this.allprice = this.$root.$mp.query.allPrise*this.$root.$mp.query.number;
      this.goodsId =this.$root.$mp.query.goodsId;
      this.number =this.$root.$mp.query.number;
       console.log("111",this.$root.$mp.query)
      if (wx.getStorageSync("address")) {
        this.address = wx.getStorageSync("address");
        this.addressId =this.address.id;
        console.log("return addres",this.address);
      }


      this.getDetail();
    },
    created() {},
    mounted() {},
    data() {
      return {
        goodsId:0,
        addressId: "",
        openId: "",
        allprice: "",
        listData: [],
        address: {},
        info:{},
        number:0
      };
    },
    components: {},
    methods: {
      pay() {
          var  res =  post("/order/submit",{addressId:this.addressId,type:'buy'})
         if (res.errno === 0)
          {
          console.log("res buy",res)
          //切换tab页
           wx.switchTab({
          url: "/pages/my/main"
        });
          }
      },
         
      toAddressList() {
        wx.navigateTo({
          url: "/pages/addressSelect/main" 
        });
      },
      toAdd() {
        wx.navigateTo({
          url: "/pages/addaddress/main"
        });
      },


       async  getDetail() {
      const res =   await get("/goods/detailaction",{id:this.goodsId})
    if (res.errno === 0) {
      console.log('res',res);
      const data =res.data; 
      this.info = data.info;
      }
      },
    },
    computed: {}
  };

</script>
<style lang='scss' scoped>
  @import "./style";

</style>
