<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import type { SortBy } from "element-plus";
import { objectParamsToQueryString } from "@/utils/common";
import { getCensusListApi3 } from "@/api/welcome";
import OverviewBox from "../overview/index.vue";

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  index: {
    type: Number,
    default: 0
  },
  curPage: {
    type: Number,
    default: 1
  },
  columns: {
    type: Array,
    default: () => {
      return [];
    }
  },
  houses: {
    type: Array,
    default: () => {
      return [];
    }
  },
  paginationParams: {
    type: Object,
    default: () => {
      return {
        currentPage: 1,
        pageSize: 20,
        pageSizes: [
          100, 200, 300, 400, 500, 1000, 2000, 3000, 4000, 5000, 10000, 15000,
          20000, 25000, 30000, 35000, 40000, 45000, 50000, 100000, 1000000
        ],
        size: "default",
        background: false
      };
    }
  },
  whereParams: {
    type: String,
    default: () => ""
  },
  dataTotal: {
    type: Number,
    default: () => 0
  },
  height: {
    type: Number,
    default: () => 200
  },
  sortState: {
    type: null as PropType<any>
  }
});

const parentContainer = ref(null);
const boxWidth = ref(500);
const boxHeight = ref(500);
const tableColumns: any[] = props.columns || [];
const emit = defineEmits(["onSort", "onRowIndex", "onPage"]);
const currentRowIndex = ref(0);
const tableRef = ref();
const currentPage = ref(props.paginationParams.currentPage || 1);
const pageSize = ref(props.paginationParams.pageSize || 20);
const queryOffset = ref(0);
const totalSize = ref(0);
const housesData = ref([]);

const loading = ref(false);

const canLoadMore = computed(() => {
  return currentPage.value === 1 || housesData.value.length < totalSize.value;
});
const noMore = computed(() => {
  return housesData.value.length >= totalSize.value;
});
const disabled = computed(() => loading.value || !canLoadMore.value);
const loadData = () => {
  loadListData();
};

function onSortTable(sortBy: SortBy) {
  emit("onSort", sortBy);
}

function onClickRow(index: number) {
  currentRowIndex.value = index;
  emit("onRowIndex", index);
}

async function loadListData() {
  if (disabled.value) {
    return;
  }
  loading.value = true;
  queryOffset.value = calculateOffset(currentPage.value, pageSize.value);
  const params = {
    where: props.whereParams, //`minorcivildivisionname='SAN JOSE'`,
    //mlsWhere: getMlsFilterParams(),
    maxResultSize: pageSize.value,
    objectIds: "",
    resultOffset: queryOffset.value || 0,
    pic: true,
    //topLat: "",
    //bottomLat: "",
    //leftLong: "",
    //rightLong: "",
    //outFields: `propertyusegroup,propertyaddressfull,fid,"[attom id]"`
    //outFields: `propertyusegroup,propertyaddressfull,fid,"[attom id]",propertylatitude,propertylongitude,arealotsf,bathcount,bedroomscount,censustract,zonedcodelocal,PropertyAddressCity,parcelnumberraw`
    outFields: `bathcount,bedrooms,lotsize,address,city,state,zip,zoning,alphaxheld,fid,lat,lon,mlsstatus,closeprice,comments`
  };

  const queryString = objectParamsToQueryString(params);
  const houseRes = await getCensusListApi3(queryString, params);
  // 关键修改：根据页码决定是覆盖还是合并数据
  if (currentPage.value === 1) {
    // 第一页：直接覆盖
    housesData.value = houseRes?.result || [];
  } else {
    // 非第一页：合并结果（避免重复数据）
    const newData = houseRes?.result || [];
    housesData.value = [...housesData.value, ...newData];
  }
  currentPage.value++;
  totalSize.value = houseRes?.totalSize || 0;
  loading.value = false;
}

function calculateOffset(page: number, pageSize: number) {
  if (page <= 1) {
    return 0;
  }
  return (page - 1) * pageSize;
}

const handleSizeChange = (val: number) => {
  currentRowIndex.value = 0;
  currentPage.value = 1;
  pageSize.value = val || 500;
  onBackPage();
};

const handleCurrentChange = (val: number) => {
  currentRowIndex.value = 0;
  currentPage.value = val;
  onBackPage();
};

function onBackPage() {
  emit("onPage", {
    currentPage: currentPage.value,
    pageSize: pageSize.value
  });
}

function scrollByRows() {
  tableRef.value?.scrollToRow(currentRowIndex.value);
}

function openViewDetailDialog() {}

onMounted(() => {
  if (parentContainer.value) {
    boxHeight.value = parentContainer.value.offsetHeight - 62;
    boxWidth.value = parentContainer.value.offsetWidth;
  }
  loadListData();
});

watch(
  () => props.index,
  val => {
    currentRowIndex.value = val;
    scrollByRows();
  },
  {
    deep: true,
    immediate: true
  }
);

watch(
  () => props.curPage,
  val => {
    currentPage.value = val;
  },
  {
    deep: true,
    immediate: true
  }
);
</script>

<template>
  <div ref="parentContainer" class="main-view-table">
    <ul
      v-infinite-scroll="loadData"
      style="overflow: auto"
      :style="{ height: height + 'px' }"
      :infinite-scroll-distance="100"
      :infinite-scroll-immediate="false"
      :infinite-scroll-disabled="disabled"
    >
      <li v-for="item in housesData" :key="item.fid" class="infinite-list-item">
        <OverviewBox :detailData="item" @onViewDetail="openViewDetailDialog" />
      </li>
      <li v-if="loading" style="text-align: center; margin: 10px 0">
        Loading...
      </li>
      <li v-if="noMore && !loading" style="text-align: center; margin: 10px 0">
        No more
      </li>
    </ul>
    <!--div style="margin: 10px 0; display: flex; justify-content: end">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
        :page-sizes="paginationParams.pageSizes" :size="paginationParams.size" :disabled="false"
        :background="paginationParams.background" layout="prev, pager, next, jumper" :total="dataTotal"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-table-v2 ref="tableRef" :columns="tableColumns" :data="houses" :width="boxWidth" :height="boxHeight"
      :sort-by="sortState" fixed @column-sort="onSortTable">
      <template #cell="{ row, column, rowIndex }">
        <el-tooltip v-if="column.dataKey === 'address'" class="box-item" effect="dark"
          :content="houses[rowIndex][column.dataKey]" placement="top">
          <el-button :class="{ 'current-item': currentRowIndex == rowIndex }" link type="primary"
            @click="onClickRow(rowIndex)">{{ houses[rowIndex][column.dataKey] }}</el-button>
        </el-tooltip>
        <div v-else-if="column.dataKey === 'alphaxheld'">
          {{ houses[rowIndex][column.dataKey] ? "Yes" : "No" }}
        </div>
        <div v-else-if="
          column.dataKey === 'lotsize' ||
          column.dataKey === 'bedrooms' ||
          column.dataKey === 'bathcount'
        " :class="{ 'current-item': currentRowIndex == rowIndex }">
          {{
            houses[rowIndex] &&
              houses[rowIndex][column.dataKey] !== undefined &&
              houses[rowIndex][column.dataKey] !== null
              ? Number(houses[rowIndex][column.dataKey]).toFixed(0)
              : "--"
          }}
        </div>
        <div v-else :class="{ 'current-item': currentRowIndex == rowIndex }">
          {{ houses[rowIndex][column.dataKey] }}
        </div>
      </template>
    </el-table-v2-->
  </div>
</template>

<style scoped lang="scss">
.current-item {
  font-weight: bold;
}
.main-view-table {
  .infinite-list {
    overflow: auto;
  }
}
</style>
