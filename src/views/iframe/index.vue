<script setup lang="ts">
import { ref, watch,onUnmounted, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import ReCol from "@/components/ReCol";
import WelcomeTable from "./components/table/index.vue";
import FilterBox from "./components/filter/index.vue";
import OverviewBox from "./components/overview/index.vue";
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
  Empty,
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
    let height = windowHeight - elementHeight;
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
  window.addEventListener('resize', calculateMapHeight); // 监听窗口变化
});

onUnmounted(() => {
  window.removeEventListener('resize', calculateMapHeight); // 组件卸载时移除监听
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
    <el-row :gutter="24" justify="space-around">
       <re-col
        v-motion
        class="mb-[18px]"
        :value="14"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 640
          }
        }"
      >
        <div
          shadow="never"
          style="
            background: #fff;
            padding: 20px;
            border-radius: 3px;
          "
          :style="{height: mapHeight+'px'}"
        >
          <MapBox
            :detailData="currentRowData"
            :isResetPoint="isResetPoint"
            :isSearch="searchAreaParams"
            :houses="houses"
            @onRowIndex="onMapRowIndex"
            @onSearchArea="onSearchArea"
          />
        </div>
      </re-col>
      <re-col
        v-motion
        class="mb-[18px]"
        :value="10"
        :xs="24"
        :initial="{
          opacity: 0,
          y: 100
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            delay: 560
          }
        }"
      >
        <!--el-card
          id="overview-main-box"
          shadow="never"
          class="h-[350px]"
          style="margin-bottom: 20px"
        >
          <div>
            <div class="text-md font-medium" style="margin-bottom: 5px">
              <el-select-v2
                v-model="houseId"
                filterable
                :options="houses"
                :props="{
                  label: 'address',
                  value: 'fid'
                }"
                placeholder="Please select"
                style="width: 50%"
                @change="onChangeHouse"
              />
            </div>
          </div>
          <div>
            <OverviewBox
              :detailData="currentRowData"
              @onComment="openCommentDialog"
              @onViewDetail="openViewDetailDialog"
            />
          </div>
        </el-card-->
        <el-card id="table-main-box" shadow="never" class="h-[580px]">
          <!--div class="flex justify-between">
            <div class="text-md font-medium">Houses</div>
            <div>
              <span style="margin-right: 0px"
                >Total: {{ pagination.total }}</span
              >
            </div>
          </div-->
          <WelcomeTable
            :loading="loading"
            :whereParams="whereParams"
            :sortState="sortState"
            :columns="columns"
            :houses="houses"
            :index="currentRowIndex"
            :curPage="pagination.currentPage"
            :dataTotal="pagination.total"
            @onRowIndex="onTableRow"
            @onSort="onSortTableData"
            @onPage="onSearchPage"
          />
        </el-card>
      </re-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
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
