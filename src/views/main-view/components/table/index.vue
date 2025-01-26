<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Column } from 'element-plus';
import type { SortBy } from 'element-plus';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
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
    type: null as PropType<any>,
  }
});

const parentContainer = ref(null);
const boxWidth = ref(500);
const boxHeight = ref(500);
const tableColumns: any[] = props.columns || []
const emit = defineEmits(["onSort", 'onRowIndex']);
const currentRowIndex = ref(0);

function onSortTable(sortBy: SortBy) {
  emit('onSort', sortBy);
}

function onClickRow(index: number) {
  currentRowIndex.value = index;
  emit('onRowIndex', index);
}
  
onMounted(() => {
  if (parentContainer.value) {
    boxHeight.value = parentContainer.value.offsetHeight;
    boxWidth.value = parentContainer.value.offsetWidth;
  }
});
</script>

<template>
  <div ref="parentContainer" class="main-view-table" v-loading="loading">
    <el-table-v2
      :columns="tableColumns"
      :data="houses"
      :width="boxWidth"
      :height="boxHeight"
      :sort-by="sortState"
      @column-sort="onSortTable"
      fixed
    >
    <template #cell="{ row, column, rowIndex }">
      <el-tooltip
        class="box-item"
        effect="dark"
        v-if="column.dataKey === 'propertyaddressfull'"
        :content="houses[rowIndex][column.dataKey]"
        placement="top"
      >
        <el-button @click="onClickRow(rowIndex)" :class="{'current-item':currentRowIndex == rowIndex}" link type="primary">{{ houses[rowIndex][column.dataKey] }}</el-button>
      </el-tooltip>
      <div :class="{'current-item':currentRowIndex == rowIndex}" v-else>{{ houses[rowIndex][column.dataKey] }}</div>
    </template>
  </el-table-v2>
  </div>
</template>

<style scoped lang="scss">
  .current-item {
    font-weight: bold;
  }
</style>