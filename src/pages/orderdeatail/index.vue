<template>
  <div class="cart">
    <div class="top">
    <p v-if="orderInfo.order_status===201">待发货</p>
    <p v-else-if="orderInfo.order_status===0">待支付</p>
    <p v-else-if="orderInfo.order_status===300">已发货</p>
    </div>
    <div class="cartlist">
      <!--  -->
      <div class="item" :data-index="index" v-for="(item,index) in listData"
        :key="index">
        <div class="con" :style="item.textStyle">
          <div class="left">
            <div class="icon" ></div>
            <div class="img">
              <img :src="item.list_pic_url" alt="">
            </div>
            <div class="info">
              <p>{{item.goods_name}}</p>
              <p>￥{{item.retail_price}}</p>
            </div>
          </div>
          <div class="right">
            <div class="num">
              x{{item.number}}
            </div>
          </div>
        </div>

        <div>
          
        </div>

      </div>
    </div>

    <div  class="nogoods">
      <div>收货人: {{orderInfo.consignee}}  {{orderInfo.mobile}}  </div>
      <div>{{orderInfo.full_region}} {{orderInfo.address}}</div>
    
    </div>
      <div  class="nogoods">
      <div>订单编号: {{orderInfo.order_sn}} </div>
      <div> 创建时间: {{orderInfo.add_time}} </div>
    </div>
     
    <div class="fixed">
     <div class="left" :class="[1==1 ? 'active' :'']"  v-if="orderInfo.shipping_name">
      <p>快递: {{orderInfo.shipping_name}}  {{orderInfo.shipping_no}}</p>
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
      this.orderId =this.$root.$mp.query.id;
      this.getListData(this.orderId);
    },
    created() {},
    data() {
      return {
        orderId: "",
        allcheck: false,
        listData: [],
        orderGoods:[],
        orderInfo:{},
        Listids: [],
        userInfo: {},
        tranX: 0,
        tranX1: 0,
        startX: "",
        startY: "",
        moveX: "",
        moveY: "",
        moveEndX: "",
        moveEndY: "",
        X: 0,
        Y: "",
        goodsId:'',
        allNum:''
      };
    },
    components: {},
    methods: {
      initTextStyle() {
        //滑动之前先初始化数据
        for (var i = 0; i < this.listData.length; i++) {
          this.listData[i].textStyle = "";
          this.listData[i].textStyle1 = "";
        }
      },
      startMove(e) {
        this.initTextStyle();
        this.startX = e.touches[0].pageX;
        this.startY = e.touches[0].pageY;
      },
      deleteGoods(e) {
        //滑动之前先初始化样式数据
        this.initTextStyle();
        var index = e.currentTarget.dataset.index;
        console.log(index);
        if (this.X <= -100) {
          this.flag = true;
        }
        if (!this.flag) {
          this.moveX = e.touches[0].pageX;
          this.moveY = e.touches[0].pageY;
          this.X = this.moveX - this.startX;
          this.Y = this.moveX - this.startY;
          this.listData[index].textStyle = `transform:translateX(${this.tranX}rpx);`;
          if (this.X >= 100) {
            this.X = 0;
          }
          this.tranX = this.X;
          if (this.X <= -100) {
            this.X = -100;
          }
          this.tranX1 = this.X;
          this.listData[index].textStyle1 = `transform:translateX(${this.tranX1}rpx);`;
        } else {
          this.moveX = e.touches[0].pageX;
          this.moveY = e.touches[0].pageY;
          this.X = this.moveX - this.startX;
          this.Y = this.moveX - this.startY;

          this.tranX = this.X - 100;
          this.listData[index].textStyle = `transform:translateX(${this.tranX}rpx);`;
          // transform:'translateX(' + tranX + 'rpx)'
          console.log("heyushuo");

          console.log(this.listData[index].textStyle);

          if (this.X + -100 > -100) {
            this.flag = false;
          }
          this.tranX1 = -100;
          this.listData[index].textStyle1 = `transform:translateX(-100rpx);`;
          console.log(this.listData[index].textStyle1);
          // this.listData = this.listData;
        }
        // if (Math.abs(this.X) > Math.abs(this.Y) && this.X > 20) {
        //   this.scrollflag = false;
        // } else if (Math.abs(this.X) > Math.abs(this.Y) && this.X < 20) {
        //   console.log("right 2 left");
        // }
      },
      endMove(e) {
        var index = e.currentTarget.dataset.index;
        if (this.X > -50) {
          this.tranX1 = 0;
          this.tranX = 0;
          this.listData[index].textStyle = `transform:translateX(${this.tranX}rpx);`;
          this.listData[index].textStyle1 = `transform:translateX(${this.tranX1}rpx);`;
        } else if (this.X <= -50) {
          this.tranX1 = -100;
          this.tranX = -100;
          this.listData[index].textStyle = `transform:translateX(${this.tranX}rpx);`;
          this.listData[index].textStyle1 = `transform:translateX(${this.tranX1}rpx);`;
        }
      },
      async orderDown() {
         console.log('111',1111)
        if (this.Listids.length == 0) {
          wx.showToast({
            title: "请选择商品",
            icon: "none",
            duration: 1500
          });
          return false;
        }
         console.log('111',555)
        // 去掉数组中空的false的
        var newgoodsid = [];
        for (let i = 0; i < this.Listids.length; i++) {
          const element = this.Listids[i];
          if (element) {
            newgoodsid.push(element);
          }
        }
        var goodsId = newgoodsid.join(",");
        this.goodsId=goodsId;
        var newgoodsnum = [];
       var num = "";
        for (let i = 0; i < this.Listids.length; i++) {
          if (this.Listids[i]) {
            for(let k = 0; k < this.Listids.length; k++)
            {
                const element = this.Listids[i];
               goodsId = this.listData[k].goods_id
               if(element===goodsId)
               {
               newgoodsnum.push(this.listData[k].number)
               }
            }
          
           
      
          }
        }
        this.allNum =newgoodsnum.join(",");
       console.log('allNum', this.allNum)
       wx.navigateTo({
        url: "/pages/order/main?allPrise="+this.allPrise+"&goodsId="+this.goodsId+"&allNum="+this.allNum

          });
      },
      async delGoods(id, index) {
        var _this = this;
        wx.showModal({
          title: "",
          content: "是否要删除该商品",
          success: function (res) {
            if (res.confirm) {

              _this.Listids.splice(index, 1);
              const data = get("/cart/delete", {
                id: id
              }).then(() => {
                _this.getListData();
              });
            } else if (res.cancel) {
              console.log("用户点击取消");
              //滑动之前先初始化样式数据
              _this.initTextStyle();
            }
          }
        });
      },
      async getListData(id) {
        const data = await get("/order/detail", {
          orderId:id
        });
       
         console.log("data.data.orderGoods",   data.data.orderGoods);
        for (var i = 0; i <data.data.orderGoods.length; i++) {
          data.data.orderGoods[i].textStyle = "";
          data.data.orderGoods[i].textStyle1 = "";
        }
        this.listData = data.data.orderGoods;
        this.orderInfo = data.data.orderInfo;
           console.log("this.listDat1a",   this.listData)
      },
      allCheck() {
        //先清空
        this.Listids = [];
        if (this.allcheck) {
          this.allcheck = false;
        } else {
          console.log("选择全部");

          this.allcheck = true;
          //循环遍历所有的商品id
          for (let i = 0; i < this.listData.length; i++) {
            const element = this.listData[i];
            this.Listids.push(element.goods_id);
          }
        }
      },
      change(e) {},
      changeColor(index, id) {
        if (this.Listids[index]) {
          this.$set(this.Listids, index, false);
        } else {
          this.$set(this.Listids, index, id);
        }
      }
    },
    computed: {
      isCheckedNumber() {
        let number = 0;
        for (let i = 0; i < this.Listids.length; i++) {
          if (this.Listids[i]) {
            number++;
          }
        }
        if (number == this.listData.length && number != 0) {
          this.allcheck = true;
        } else {
          this.allcheck = false;
        }
        return number;
      },
      allPrise() {
        var Prise = 0;
        for (let i = 0; i < this.Listids.length; i++) {
          if (this.Listids[i]) {
            Prise = Prise + this.listData[i].retail_price * this.listData[i].number;
          }
        }
        return Prise;
      },
    }
  };

</script>
<style lang='scss' scoped>
  @import "./style";

</style>
