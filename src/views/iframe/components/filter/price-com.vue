<script setup lang="ts">
import { ref } from "vue";
import { ArrowDown } from '@element-plus/icons-vue'

defineOptions({
  name: "PriceCom"
});
const props = defineProps({
});
const emit = defineEmits(["onFiler"]);


const minOptions = ref([
  {
    value: "",
    label: "No Min."
  },
  {
    value: "60",
    label: "$60k"
  },
  {
    value: "180",
    label: "$180k"
  },
  {
    value: "350",
    label: "$350k"
  },
  {
    value: "500",
    label: "$500k"
  },
  {
    value: "600",
    label: "$600k"
  },
  {
    value: "700",
    label: "$700k"
  }
]);

const maxOptions = ref([
  {
    value: "",
    label: "No Max."
  },
  {
    value: "60",
    label: "$60k"
  },
  {
    value: "180",
    label: "$180k"
  },
  {
    value: "350",
    label: "$350k"
  },
  {
    value: "500",
    label: "$500k"
  },
  {
    value: "600",
    label: "$600k"
  },
  {
    value: "700",
    label: "$700k"
  }
]);

const priceValueText = ref({
  min: minOptions.value[0].label,
  max: maxOptions.value[0].label,
});
const priceValue = ref({
  min: '',
  max: ''
})
const priceValueDisplay = ref('');
const isShowPopover = ref(false);

function setPriceValue(item: any, filed: string) {
  priceValue.value[filed] = item.value; 
  priceValueText.value[filed] = item.label; 
  priceValueDisplay.value = `${priceValueText.value.min} ~ ${priceValueText.value.max}`;
  onHidePopover();
  onBack();
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
  <div class="price-com-main">
    <el-popover
      class="box-item"
      placement="bottom"
      :width="200"
      :visible="isShowPopover"
      trigger="click"
    >
      <template #reference> 
        <el-input
          v-model="priceValueDisplay"
          class="responsive-input"
          :readonly="true"
          @click="onShowPopover"
          placeholder="Price"
        >
          <template #suffix>
            <el-icon><ArrowDown /></el-icon>
          </template>
        </el-input>
      </template>
      <template #default>
        <div class="price-com-content">
          <div class="left">
            <div class="title">
              Min. Price
            </div>
            <div class="list">
              <div class="item" 
                :class="{'current':item.value === priceValue.min}"
                @click="setPriceValue(item, 'min')"
                v-for="(item, index) in minOptions" :key="index">
                {{ item.label }}
              </div>
            </div>
          </div>
          <div class="right">
            <div class="title">
              Max. Price
            </div>
            <div class="list">
              <div class="item" 
                :class="{'current':item.value === priceValue.max}"
                @click="setPriceValue(item, 'max')"
                v-for="(item, index) in maxOptions" :key="index">
                {{ item.label }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<style scoped lang="scss">
.price-com-main {
  .responsive-input {
    cursor: pointer;
  }
}
.price-com-content {
  display: flex;
  align-items: center;
  gap: 10px;
  .left, 
  .right {
    flex: 1; /* 平均分配剩余空间 */
  }
  .title {
    color: #000;
  }
  .list {
    .item {
      line-height: 22px;
      cursor: pointer;
      &.current {
        background: #eee;
        color: #333;
      }
    }
  }
}
</style>
