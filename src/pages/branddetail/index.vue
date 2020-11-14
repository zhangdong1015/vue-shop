<template>
    <div class="branddetail">
        <div class="banner">
            <img :src="detailData.app_list_pic_url" alt="">
            <div class="info">
                <span> {{detailData.name}}</span>
            </div>
        </div>
        <div class="info-desc">
          {{detailData.simple_desc}}
        </div>
        <div v-if="goodsList" class="sortlist">
            <div @click="goodsDetail(item.id)"  v-for="(item, index) in goodsList" :key="index" class="item">
                <img :src="item.list_pic_url" alt="">
                <p class="name">{{item.name}}</p>
                <p class="price">￥{{item.retail_price}}</p>
            </div>
        </div>
        <div v-else class="none">
            暂无数据...
        </div>
    </div>
</template>

<script>
import { get } from "../../utils";
export default {
  created() {},
  mounted() {
    this.id = this.$root.$mp.query.id;
    this.getDetail();
  },
  data() {
    return {
      id: "",
      detailData: {},
      goodsList: []
    };
  },
  components: {},
  methods: {
    async getDetail() {
      const data = await get("/brand/detailaction", { id: this.id });
      this.detailData = data.data.brand;
      console.log('detailData',this.detailData);
        const listdata = await get("/goods/list", {
        brandId: this.detailData.id
      });
      this.goodsList = listdata.data.goodsList;
    },
    goodsDetail(id) {
        wx.navigateTo({
          url: "/pages/goods/main?id=" + id
        });
      },
  },
  computed: {}
};
</script>
<style lang='scss' scoped>
@import "./style";
</style>