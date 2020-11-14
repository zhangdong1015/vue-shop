<template>
  <div class="order">
    <div @click="toAddressList" v-if=" address || address.userName" class="address">
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
      <div class="item"  v-for="(item,index) in listData" :key="index">
        <div class="con">
          <div class="left">
            <div class="img">
              <img :src="item.list_pic_url" alt="">
            </div>
            <div class="info">
              <p>{{item.name}}</p>
              <p>￥{{item.retail_price}}</p>
            </div>
          </div>
          <div class="right">
            <div class="num">
              x{{item.number}}
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
     
      this.allprice = this.$root.$mp.query.allPrise;
      this.goodsIds =this.$root.$mp.query.goodsId;
      this.numbers =this.$root.$mp.query.allNum;
    
    
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
        goodsIds:'',
        addressId: "",
        openId: "",
        allprice: "",
        listData: [],
        address: {},
        info:{number:0},
        numbers:''
      };
    },
    components: {},
    methods: {
    async  pay() {
        const  res = await  post("/order/submit",{addressId:this.addressId,type:'cart', goodIds:this.goodsIds});
         console.log("res buy",res)
         if (res.errno === 0)
          {
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
       var goodidArr = this.goodsIds.split(',')
       var numArr = this.numbers.split(",")
       console.log("goodidArr",goodidArr);
       var i =0;
        this.listData=[];
       for(let value of goodidArr) {  
         console.log("value",value);
         const res =   await get("/goods/detailaction",{id:value})
         console.log('res111',res);
         if (res.errno === 0) {
     
       const data =res.data; 
       this.info = data.info;
       this.info.number =numArr[i];
       this.listData.push(this.info)
       i++;
      }
       }
     
      console.log('listData',this.listData);
      },
    },
    computed: {}
  };

</script>
<style lang='scss' scoped>
  @import "./style";

</style>