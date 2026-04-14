<script setup lang="ts">
import { ref, watch, onUnmounted, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import ReCol from "@/components/ReCol";
import WelcomeTable from "./components/table/index.vue";
import FilterBox from "./components/filter/index.vue";
//import OverviewBox from "./components/overview/index.vue";
import MapBox from "./components/map/index.vue";
import { latestNewsData } from "./data";
import { useColumns } from "./components/table/columns";
import { useDialog } from "./components/dialog/utils/hook";
import type { SortBy } from "element-plus";

const {
  loading,
  columns,
  whereParams,
  houses,
  isResetMap,
  currentRowIndex,
  currentRowData,
  isResetPoint,
  sortState,
  zonedcodelocalOptions,
  pagination,
  searchAreaParams,
  isRestData,
  onSort,
  onTableRowIndex,
  onSearchArea,
  onFilerData,
  onSearchPage,
  onCurrentChange
} = useColumns();
const { form, openCommentDialog, openViewDetailDialog } = useDialog();

defineOptions({
  name: "MainView"
});

const route = useRoute();
const { params, query } = route;
const censustractId = ref(params.censustractId || "");
const houseId = ref("");

const filterElement = ref(null);
const mapHeight = ref(500);

const calculateMapHeight = () => {
  if (filterElement.value) {
    const windowHeight = window.innerHeight;
    const elementHeight = filterElement.value.getBoundingClientRect().height;
    let height = windowHeight - elementHeight - 50;
    if (height < 400) {
      height = 400;
    }
    mapHeight.value = height;
  }
};

function onSortTableData(sortBy: SortBy) {
  onSort(sortBy);
}

function onChangeHouse() {
  const house = getHouseById(houseId.value, houses.value);
  if (house) {
    currentRowData.value = house;
    isResetPoint.value = true;
  }
}

function onTableRow(index: number) {
  isResetPoint.value = true;
  onTableRowIndex(index);
}

function onMapRowIndex(index: number) {
  isResetPoint.value = false;
  onTableRowIndex(index);
}

function getHouseById(id: string, list: any) {
  let res;
  if (id && list?.length > 0) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (id === item["fid"]) {
        onTableRowIndex(i);
        res = item;
        break;
      }
    }
  }
  return res;
}

onMounted(() => {
  calculateMapHeight(); // 初始计算
  window.addEventListener("resize", calculateMapHeight); // 监听窗口变化
});

onUnmounted(() => {
  window.removeEventListener("resize", calculateMapHeight); // 组件卸载时移除监听
});

watch(
  () => currentRowData,
  () => {
    houseId.value = currentRowData.value["fid"] || "";
  },
  {
    deep: true
  }
);
</script>

<template>
  <div class="page-box">
    <div ref="filterElement">
      <div class="page-title">Explore Your ldeal Home Now</div>
      <div class="filter-box">
        <FilterBox
          :zonedcodelocalOptions="zonedcodelocalOptions"
          @onFiler="onFilerData"
        />
      </div>
    </div>
    <div class="page-conent">
      <div class="map-box" :style="{ height: mapHeight + 'px' }">
        <MapBox
          :detailData="currentRowData"
          :isResetPoint="isResetPoint"
          :isSearch="searchAreaParams"
          :houses="houses"
          @onRowIndex="onMapRowIndex"
          @onSearchArea="onSearchArea"
          @onViewDetail="openViewDetailDialog"
        />
      </div>
      <div class="list-box">
        <WelcomeTable
          :loading="loading"
          :whereParams="whereParams"
          :sortState="sortState"
          :columns="columns"
          :houses="houses"
          :height="mapHeight"
          :index="currentRowIndex"
          :curPage="pagination.currentPage"
          :isRestData="isRestData"
          :dataTotal="pagination.total"
          @onRowIndex="onTableRow"
          @onSort="onSortTableData"
          @onPage="onSearchPage"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-conent {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;

  /* 允许换行（移动端时左右分行） */
  .map-box {
    flex: 1;
    /* 左边自适应，占满剩余空间 */
    min-width: 0;
    /* 防止内容溢出 */
  }

  .list-box {
    width: 610px;
    margin-left: 10px;
    /* 右边固定宽度 */
  }
  /* 移动端适配（如屏幕宽度 ≤ 768px） */
  @media (max-width: 768px) {
    .map-box,
    .list-box {
      width: 100%; /* 左右均占满整行 */
      flex: none; /* 取消 flex 伸缩 */
    }
    .list-box {
      margin-left: 0;
      margin-top: 20px;
    }
  }
}

:deep(.el-card) {
  --el-card-border-color: none;

  /* 解决概率进度条宽度 */
  .el-progress--line {
    width: 85%;
  }

  /* 解决概率进度条字体大小 */
  .el-progress-bar__innerText {
    font-size: 15px;
  }

  /* 隐藏 el-scrollbar 滚动条 */
  .el-scrollbar__bar {
    display: none;
  }

  /* el-timeline 每一项上下、左右边距 */
  .el-timeline-item {
    margin: 0 6px;
  }
}

.main-content {
  margin: 20px 20px 0 !important;
}

.page-box {
  .page-title {
    font-size: 26px;
    font-weight: 400;
    padding: 10px 20px;
  }

  .filter-box {
    margin: 0 20px;
  }
}
</style>
