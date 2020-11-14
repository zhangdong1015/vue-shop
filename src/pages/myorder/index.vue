

<template>
  <div class="order">
    <div>
      <div class="item">
        <div class="list">
          <div class="addresslist">
            <div>
            
            </div>
        
            <div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="cartlist"  v-if="collectlist">
      <div class="item"   @click="goodsDetail(subitem.id)" v-for="(subitem, subindex) in collectlist" :key="subindex">
        <div class="con">
          <div class="left">
            
            <div class="info">
               <p>订单号:  {{subitem.order_sn}}</p>
               <p>支付: ￥{{subitem.actual_price}}</p>
                  <p v-if="subitem.order_status===201">待发货</p>
                 <p v-else-if="subitem.order_status===0">待支付</p>
                  <p v-else-if="subitem.order_status===300">已发货</p>
            </div>
          </div>
          <div class="right">
            <div class="num">
            
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
  import {
    get,
    getStorageOpenid
  } from '../../utils';
  export default {
    onShow() {
      this.getlist();
    },
    created() {},
    mounted() {

    },
    data() {
      return {
         page: 1,
        size: 10,
        collectlist: []
      };
    },
    components: {},
    methods: {
      async getlist() {
        const data = await get('/order/list', {
         page:this.page,size:this.size
        })
        this.collectlist = data.data.data;
        console.log("collectlist", this.collectlist);
      },
      goodsDetail(id) {
        wx.navigateTo({
          url: "/pages/orderdeatail/main?id=" + id
        });
      },
    },
    computed: {}
  };

</script>
<style lang='scss' scoped>
  @import "./style";

</style>
