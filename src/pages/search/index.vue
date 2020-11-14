<template>
  <div class="search">
    <div class="head">
      <div>
        <img src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/search2-2fb94833aa.png" alt="">
        <input type="text" confirm-type="search" focus="true" v-model="words" @focus="inputFocus" @input="tipsearch" @confirm="searchWords" placeholder="商品搜索">
        <!-- <input name="input" class="keywrod" focus="true" value="{{keyword}}" confirm-type="search" bindinput="inputChange" bindfocus="inputFocus" bindconfirm="onKeywordConfirm" confirm-type="search" placeholder="{{defaultKeyword.keyword}}" /> -->
        <img @click="clearInput" class="del" src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/clearIpt-f71b83e3c2.png" alt="">
      </div>
      <div @click="cancel">取消</div>
    </div>
    <div class="searchtips" v-if="words">
      <div   @click="searchWords"  :data-value="item" v-for="(item,index) in tipsData" :key="index">
        {{item}}
      </div>
    </div>

    <div class="history" v-if=" historyData">
      <div class="t">
        <div>历史记录</div>
        <div @click="clearHistory">

        </div>
      </div>
      <div class="cont">
        <div @click="searchWords" :data-value="item" v-for="(item,index) in historyData" :key="index">
          {{item}}
        </div>
      </div>
    </div>
    <div class="history hotsearch">
      <div class="t">
        <div>热门搜索</div>
      </div>
      <div class="cont" v-if="hotData">
        <div @click="searchWords" v-for="(item,index) in hotData" :data-value="item.keyword" :class="{active:0==index}" :key="index">
          {{item.keyword}}
        </div>
      </div>
    </div>
    <!--商品列表  -->
    <div v-if="listData & listData.length!=0" class="goodsList">
      <div class="sortnav">
        <div @click="changeTab(0)" :class="[0==nowIndex ?'active':'']">综合</div>
        <div @click="changeTab(1)" class="price" :class="[1==nowIndex ?'active':'', order =='desc'? 'desc':'asc']">价格</div>
        <div @click="changeTab(2)" :class="[2==nowIndex ?'active':'']">分类</div>
      </div>
      <div class="sortlist">
        <div @click="goodsDetail(item.id)" v-for="(item, index) in listData" :key="index" :class="[(listData.length)%2==0?'active':'none']" class="item">
          <p class="name">{{item.name}}</p>
          <p class="price">￥{{item.retail_price}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  post,
  get
} from "../../utils";
export default {
  created() { },
  mounted() {
  
    this.getHotData();
  },
  data() {
    return {
      nowIndex: 0,
      words: "",
      historyData: [],
      hotData: [],
      tipsData: [],
      listData: [],
      openid: "",
      order: "",
      isHot: "",
      isNew: "",
     categoryFilter: false,
    lcurrentSortType: 'default',
    lcurrentSortOrder: '',
    filterCategory: [],
    defaultKeyword: {},
    hotKeyword: [],
    page: 1,
    size: 20,
    currentSortType: 'id',
    currentSortOrder: 'desc',
    categoryId: 0
    };
  },
  components: {},

  //跳转到详情页
  methods: {
    goodsDetail(id) {
      wx.navigateTo({
        url: "/pages/goods/main?id=" + id
      });
    },
    cancel() {
      wx.navigateBack({
        delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
      });
    },
    clearInput() {
      this.words = "";
      this.listData = [];
      this.tipsData = [];
    },
    inputFocus() {
      //商品清空
      this.listData = [];
      //展示搜索提示信息
      this.tipsearch();
    },
    async getlistData() {
      //获取商品列表
  
    console.log("entry goodList  keyword ",this.words);
    var res =   await get("/goods/list",{ keyword: this.words, page: this.page, size: this.size, sort: this.currentSortType, order: this.currentSortOrder, categoryId: this.categoryId },{});
    console.log("goodList",res);
 if (res.errno === 0) 
 {
   this.searchStatus=true;
   this.categoryFilter =false;
   this.listData= res.data.goodsList; //商品列表s
   this.page=res.data.currentPage;
   this.size=res.data.numsPerPage;
   this.filterCategory =res.data.filterCategory;
 }
      //重新获取关键词
      that.getHotData();
      this.tipsData = [];
    },
    changeTab(index) {
      this.nowIndex = index;
      if (index == 1) {
        this.order = this.order == "asc" ? "desc" : "asc";
      } else {
        this.order = "";
      }
      this.getlistData();
    },
    //清除历史记录
    async clearHistory() {
      const data = await post("/search/clearhistoryAction", {});
      console.log(data);
      if (data) {
        this.historyData = [];
      }
    },
    async searchWords(e) {
      //mp
       console.log("searchWords", e.mp.detail.value);
       var vaule = e.mp.detail.value;
       this.words = vaule || this.words;
        this.getHotData();
       if(this.words)
       {
        //获取商品列表
      this.getlistData();
       }
     
    
    },
    async getHotData() {
      const res = await get("/search/indexaction",{});
      this.hotData = res.data.hotKeywordList;
      this.historyData = res.data.historyKeywordList;
      console.log("hot",this.hotData);
    },
    //提示并帮助
    async tipsearch(e) {
      const data = await get("/search/helperaction", {
        keyword: this.words
      });
      console.log("111",data.data)
      this.tipsData = data.data;
    },
   
  },
  computed: {}
};

</script>
<style lang='scss' scoped>
@import "./style";
</style>
