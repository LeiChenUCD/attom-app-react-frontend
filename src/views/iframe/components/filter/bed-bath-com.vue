<script setup lang="ts">
import { ref } from "vue";
import { ArrowDown } from '@element-plus/icons-vue'

defineOptions({
  name: "BedBathCom"
});
const props = defineProps({
});
const emit = defineEmits(["onFiler"]);


const bedOptions = ref([
  {
    value: "0",
    label: "0+"
  },
  {
    value: "1",
    label: "1+"
  },
  {
    value: "2",
    label: "2+"
  },
  {
    value: "3",
    label: "3+"
  },
  {
    value: "4",
    label: "4+"
  },
  {
    value: "5",
    label: "5+"
  },
  {
    value: "6",
    label: "6+"
  }
]);

const bathOptions = ref([
  {
    value: "0",
    label: "0+"
  },
  {
    value: "1",
    label: "1+"
  },
  {
    value: "2",
    label: "2+"
  },
  {
    value: "3",
    label: "3+"
  },
  {
    value: "4",
    label: "4+"
  },
  {
    value: "5",
    label: "5+"
  },
  {
    value: "6",
    label: "6+"
  }
]);

const priceValueText = ref({
  bed: bedOptions.value[0].label,
  bath: bathOptions.value[0].label,
});
const priceValue = ref({
  bed: '0',
  bath: '0'
})
const priceValueDisplay = ref('');
const isShowPopover = ref(false);

function setPriceValue(item: any, filed: string) {
  priceValue.value[filed] = item.value; 
  priceValueText.value[filed] = item.label; 
}

function onApply() {
  priceValueDisplay.value = `${priceValueText.value.bed},${priceValueText.value.bath}`;
  onHidePopover();
  onBack();
}

function onCancel() {
  onHidePopover();
}

function onShowPopover() {
  isShowPopover.value = true;
}

function onHidePopover() {
  isShowPopover.value = false;
}

function onBack() {
  emit("onFiler", priceValue.value);
}

</script>

<template>
  <div class="bed-bath-com-main">
    <el-popover
      class="box-item"
      placement="bottom"
      :width="300"
      :visible="isShowPopover"
      trigger="click"
    >
      <template #reference> 
        <el-input
          v-model="priceValueDisplay"
          class="responsive-input"
          :readonly="true"
          @click="onShowPopover"
          placeholder="Beds/Baths"
        >
          <template #suffix>
            <el-icon><ArrowDown /></el-icon>
          </template>
        </el-input>
      </template>
      <template #default>
        <div class="bed-bath-com-content">
          <div class="left">
            <div class="title">
              Beds
            </div>
            <div class="list">
              <div class="item" 
                :class="{'current':item.value === priceValue.bed}"
                @click="setPriceValue(item, 'bed')"
                v-for="(item, index) in bedOptions" :key="index">
                {{ item.label }}
              </div>
            </div>
          </div>
          <div class="right">
            <div class="title">
              Baths
            </div>
            <div class="list">
              <div class="item" 
                :class="{'current':item.value === priceValue.bath}"
                @click="setPriceValue(item, 'bath')"
                v-for="(item, index) in bathOptions" :key="index">
                {{ item.label }}
              </div>
            </div>
          </div>
          <div class="foot">
            <div class="left">
              <el-button text @click="onCancel">
                Cancel
              </el-button>
            </div>
            <div class="right" style="text-align: right;">
              <el-button class="btn-apply" text @click="onApply">
                Apply
              </el-button>
            </div>
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<style scoped lang="scss">
.bed-bath-com-main {
  width: 100%;
  .responsive-input {
    cursor: pointer;
    :deep(.el-input__wrapper) {
      cursor: pointer;
    }
    :deep(.el-input__inner) {
      cursor: pointer;
    }
  }
}
.bed-bath-com-content {
  .title {
    color: #000;
    margin-bottom: 5px;
  }
  .list {
    .item {
      line-height: 22px;
      cursor: pointer;
      display: inline-block;
      background: #eee;
      color: #333;
      border: 1px solid #ddd;
      margin-right: 10px;
      margin-bottom: 10px;
      padding: 0 5px;
      text-align: center;
      border-radius: 3px;
      &.current {
        background: rgb(154, 137, 187);
        border: 1px solid rgb(154, 137, 187);
        color: #fff;
      }
    }
  }
  .foot{
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
    .left, .right {
      flex: 1;
    }
    .btn-apply {
      background: rgb(154, 137, 187);
      border: 1px solid rgb(154, 137, 187);
      color: #fff;
    }
  }
}
</style>
