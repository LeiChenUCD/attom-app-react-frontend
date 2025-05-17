<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type { SortBy } from "element-plus";

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  index: {
    type: Number,
    default: 0
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
        pageSize: 500,
        pageSizes: [
          100, 200, 300, 400, 500, 1000, 2000, 3000, 4000, 5000, 10000, 15000,
          20000, 25000, 30000, 35000, 40000, 45000, 50000, 100000, 1000000
        ],
        size: "default",
        background: false
      };
    }
  },
  dataTotal: {
    type: Number,
    default: () => 0
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
const pageSize = ref(props.paginationParams.pageSize || 500);

function onSortTable(sortBy: SortBy) {
  emit("onSort", sortBy);
}

function onClickRow(index: number) {
  currentRowIndex.value = index;
  emit("onRowIndex", index);
}

const handleSizeChange = (val: number) => {
  currentPage.value = 1;
  pageSize.value = val || 500;
  onBackPage();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  onBackPage();
};

function onBackPage() {
  emit("onPage", {
    currentPage: currentPage.value,
    pageSize: pageSize.value
  });
}

onMounted(() => {
  if (parentContainer.value) {
    boxHeight.value = parentContainer.value.offsetHeight - 62;
    boxWidth.value = parentContainer.value.offsetWidth;
  }
});

watch(
  () => props.index,
  val => {
    currentRowIndex.value = val;
  },
  {
    deep: true,
    immediate: true
  }
);
</script>

<template>
  <div ref="parentContainer" v-loading="loading" class="main-view-table">
    <div style="margin: 10px 0; display: flex; justify-content: end">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="paginationParams.pageSizes"
        :size="paginationParams.size"
        :disabled="false"
        :background="paginationParams.background"
        layout="sizes, prev, pager, next, jumper"
        :total="dataTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-table-v2
      :columns="tableColumns"
      :data="houses"
      :width="boxWidth"
      :height="boxHeight"
      :sort-by="sortState"
      fixed
      @column-sort="onSortTable"
    >
      <template #cell="{ row, column, rowIndex }">
        <el-tooltip
          v-if="column.dataKey === 'address'"
          class="box-item"
          effect="dark"
          :content="houses[rowIndex][column.dataKey]"
          placement="top"
        >
          <el-button
            :class="{ 'current-item': currentRowIndex == rowIndex }"
            link
            type="primary"
            @click="onClickRow(rowIndex)"
            >{{ houses[rowIndex][column.dataKey] }}</el-button
          >
        </el-tooltip>
        <div v-else-if="column.dataKey === 'alphaxheld'">
          {{ houses[rowIndex][column.dataKey] ? "Yes" : "No" }}
        </div>
        <div
          v-else-if="
            column.dataKey === 'lotsize' ||
            column.dataKey === 'bedrooms' ||
            column.dataKey === 'bathcount'
          "
        >
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
    </el-table-v2>
  </div>
</template>

<style scoped lang="scss">
.current-item {
  font-weight: bold;
}
</style>
