<template>
  <div class="goods">
    <div class="swiper">
      <swiper class="swiper-container" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
        <block v-for="(item, index) in gallery " :key="index">
          <swiper-item class="swiper-item">
            <image :src="item.img_url" class="slide-image" />
          </swiper-item>
        </block>
      </swiper>
    </div>
    <div class="swiper-b">
      <div class="item">30天无忧退货</div>
      <div class="item">48小时快速退款</div>
      <div class="item">满66元免邮费</div>
    </div>
    <div class="goods-info" >
      <div class="c">
            <p>{{info.name}}</p>
        <p>{{info.goods_brief}}</p>
        <p>￥{{info.retail_price}}</p>
        <div v-if="brand" class="brand">
          <p>{{brand.name}}</p>
        </div>
      </div>
    </div>
    <div @click="showType" class="section-nav">
      <div>请选择规格数量</div>
      <div></div>
    </div>
    <!-- <div @click="showType" class="section-nav">
      <div>用户评价</div>
      <div></div>
    </div> -->

    <div v-if="attribute !== undefined && attribute.length>0 " class="attribute">
      <div class="head">
        商品参数
      </div>
      <div   v-for="(item,index) in attribute" :key="index" class="item">
        <div>{{item.name}}</div>
        <div>{{item.value}}</div>
      </div>
    </div>
    <div v-if="goods_desc" class="detail">
      <wxParse :content="goods_desc" />
    </div>
 

    <!-- 大家都在看 -->
    <div class="bottom-fixed">
      <div @click="collect">
        <div class="collect" :class="[collectFlag ? 'active' :'']">

        </div>

      </div>
      <div @click="toCart">
        <div class="car">
          <span>
            {{allnumber}}
          </span>
          <img src="/static/images/ic_menu_shoping_nor.png" alt="">
        </div>
      </div>
      <div @click="bug">立即购买</div>
      <div @click="addCart">加入购物车</div>
    </div>

    <!-- 选择规格部分 -->
    <div v-show="showpop" @click="showType" class="pop">

    </div>
    <div class="attr-pop" :class="[showpop ? 'fadeup' : 'fadedown']">
      <div class="top">
        <div class="left">
          <img :src="info.primary_pic_url" alt="">
        </div>
        <div class="right">
          <div>
            <p>价格￥{{info.retail_price}}</p>
            <p>请选择数量</p>
          </div>
        </div>
        <div @click="showType" class="close">
          X
        </div>
      </div>
      <div class="b">
        <p>数量</p>
        <div class="count">
          <div @click="reduce" class="cut">-</div>
          <input class="number" disabled="" v-model="number" />
          <div @click="add" class="add">+</div>
        </div>
      </div>
    </div>

    <!-- 选择规格部分 -->
  </div>
</template>

<script>
import { get, post, toLogin, login, getStorageOpenid,request,showErrorToast } from "../../utils";
import wxParse from "mpvue-wxparse";

export default {
  onShow() {
  },
  mounted() {
    //判断是否登录获取用户信息
    if (login()) {
      this.userInfo = login();
    }
    console.log(this.$root.$mp.query.id);

    this.id = this.$root.$mp.query.id;

    this.goodsDetail();
  },
 
  data() {
    return {
      allnumber: 0,
      openId: "",
      collectFlag: false,
      number: 0,
      showpop: false,
      gallery: [],
      info: {
        name:"",
      },
      brand: {name:''},
      attribute: [],
      issueList: [],
      productList: [],
      goods_desc: "",
      id: "",
      userInfo: "",
      goodsId: "",
      allPrise: ""
    };
  },
  components: {
    wxParse
  },
  methods: {
    togoodsDetail(id) {
      wx.redirectTo({ url: "/pages/goods/main?id=" + id });
    },
    add() {
      this.number = this.number + 1;
    },
    reduce() {
      if (this.number > 1) {
        this.number = this.number - 1;
      } else {
        return false;
      }
    },

    //购买
    async bug() {
      if (toLogin()) {
        if (this.showpop) {
          if (this.number == 0) {
            wx.showToast({
              title: "请选择商品数量", //提示的内容,
              duration: 1000, //延迟时间,
              icon: "none",
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => { }
            });
            return false;
          }
          console.log(this.goodsId);
          console.log(this.openId);
      
          //先添加商品到缓存
          const data = await post("/buy/add", {
            goodsId: this.goodsId,
            number: this.number,
            allPrise: this.allPrise,
            productId: this.productList[0].id,
            type:"buy"
          });
          if (data) {
            wx.navigateTo({
              url: "/pages/shopping/main?allPrise="+this.allPrise+"&goodsId="+this.goodsId+"&number="+this.number+"&productId="+this.productList[0].id
            });
          }
        } else {
          this.showpop = true;
        }
      }
    },
    async collect() {
      if (toLogin()) {
        this.collectFlag = !this.collectFlag;
        const data = await post("/collect/addordelete", {
          valueId: this.goodsId,
          typeId:0
        });
      }
    },
    async addCart() {
      if (toLogin()) {
        if (this.showpop) {
          if (this.number == 0) {
            wx.showToast({
              title: "请选择商品数量", //提示的内容,
              duration: 2000, //延迟时间,
              icon: "none",
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => { }
            });
            return false;
          }
          //添加购物车
          const data = await post("/cart/add", {
            goodsId: this.goodsId,
            number: this.number,
            productId:this.productList[0].id
          });
          //添加成功后
          if (data) {
            this.allnumber = this.allnumber + this.number;
            wx.showToast({
              title: "添加购物车成功",
              icon: "success",
              duration: 1500
            });
          }
        } else {
          this.showpop = true;
        }
      }
    },
    toCart() {
      wx.switchTab({
        url: "/pages/cart/main"
      });
  
    },
    async  goodsDetail() {
         
      const res =   await get("/goods/detailaction",{id:this.id})
    if (res.errno === 0) {
      const data =res.data; 
        
      this.gallery = data.gallery;
      this.info = data.info;
      console.log("info1111",this.info);
      this.allPrise = data.info.retail_price;
      this.goodsId = data.info.id;
      this.brand = data.brand;
      this.attribute = data.attribute;
      this.goods_desc = data.info.goods_desc;
      this.issueList = data.issue;
      this.collectFlag = data.userHasCollect; //用户是否收藏
      this.allnumber = data.allnumber;
      this.productList = data.productList;
        
      }
      },

      
    

    showType() {
      this.showpop = !this.showpop;
    }
    },
  
  computed: {}
};
</script>
<style lang='scss' scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
@import "./style.scss";
</style>
