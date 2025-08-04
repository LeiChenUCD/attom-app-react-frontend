<script setup lang="ts">
import { ref, watch } from "vue";
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
  <div>
    <el-row :gutter="24" justify="space-around">
      <re-col
        v-motion
        class="mb-[18px]"
        :value="24"
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
        <el-card id="filter-main-box" shadow="never">
          <FilterBox
            :zonedcodelocalOptions="zonedcodelocalOptions"
            @onFiler="onFilerData"
          />
        </el-card>
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
        <el-card
          id="overview-main-box"
          shadow="never"
          class="h-[350px]"
          style="margin-bottom: 20px"
        >
          <div>
            <div class="text-md font-medium" style="margin-bottom: 5px">
              <!--?.address}}-->
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
        </el-card>
        <el-card id="table-main-box" shadow="never" class="h-[580px]">
          <div class="flex justify-between">
            <div class="text-md font-medium">Houses</div>
            <div>
              <span style="margin-right: 0px"
                >Total: {{ pagination.total }}</span
              >
              <!--el-link
                type="primary"
                href="https://z1wxnr4c1l.larksuite.com/base/ZJYxbUZW0ah85TssgMqupEZJsB8?table=tbliAQ068PH77Eli&view=vewM7zhIkl"
                target="_blank"
                >Lark Table</el-link
            -->
            </div>
          </div>
          <WelcomeTable
            :loading="loading"
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
          class="h-[950px]"
          style="
            height: 950px;
            background: #fff;
            padding: 10px;
            border-radius: 3px;
          "
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
</style>
