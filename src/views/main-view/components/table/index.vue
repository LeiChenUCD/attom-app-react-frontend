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
  sortState: {
    type: null as PropType<any>
  }
});

const parentContainer = ref(null);
const boxWidth = ref(500);
const boxHeight = ref(500);
const tableColumns: any[] = props.columns || [];
const emit = defineEmits(["onSort", "onRowIndex"]);
const currentRowIndex = ref(0);
const tableRef = ref();

function onSortTable(sortBy: SortBy) {
  emit("onSort", sortBy);
}

function onClickRow(index: number) {
  currentRowIndex.value = index;
  emit("onRowIndex", index);
}

onMounted(() => {
  if (parentContainer.value) {
    boxHeight.value = parentContainer.value.offsetHeight;
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
