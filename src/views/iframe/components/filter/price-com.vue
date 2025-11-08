<script setup lang="ts">
import { ref, computed } from "vue";
import { onClickOutside } from "@vueuse/core";
import { ArrowDown } from "@element-plus/icons-vue";

defineOptions({
  name: "PriceCom"
});
const props = defineProps({});
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
  max: maxOptions.value[0].label
});
const priceValue = ref({
  min: "",
  max: ""
});
const priceValueDisplay = ref("");
const isShowPopover = ref(false);
const virtualRef = ref();
const popoverRef = ref();
const popoverTrigger = computed(() => "manual" as const);

function setPriceValue(item: any, filed: string) {
  priceValue.value[filed] = item.value;
  priceValueText.value[filed] = item.label;
  onApply();
}

function onApply() {
  const minText = priceValue.value?.min
    ? priceValue.value?.min + "K"
    : "No Min.";
  const maxText = priceValue.value?.max
    ? priceValue.value?.max + "K"
    : "No Max.";
  priceValueDisplay.value = `${minText} ~ ${maxText}`;
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
  priceValue.value.min = priceValue.value?.min || "";
  priceValue.value.max = priceValue.value?.max || "";
  emit("onFiler", priceValue.value);
}

onClickOutside(popoverRef, () => {
  //isShowPopover.value = false;
});
</script>

<template>
  <div class="price-com-main">
    <el-popover
      ref="popoverRef"
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
          placeholder="Price"
          @click="onShowPopover"
        >
          <template #suffix>
            <el-icon><ArrowDown /></el-icon>
          </template>
        </el-input>
      </template>
      <template #default>
        <div class="price-com-content">
          <div class="left">
            <div class="title">Min. Price</div>
            <div class="list">
              <!--div
                v-for="(item, index) in minOptions"
                :key="index"
                class="item"
                :class="{ current: item.value === priceValue.min }"
                @click="setPriceValue(item, 'min')"
              >
                {{ item.label }}
              </div-->
              <el-input-number
                v-model="priceValue.min"
                placeholder=" "
                :min="0"
                :max="9999999999"
                style="width: 100%"
                controls-position="right"
              >
                <template #suffix>
                  <span>K</span>
                </template>
              </el-input-number>
            </div>
          </div>
          <div class="right">
            <div class="title">Max. Price</div>
            <div class="list">
              <!--div
                v-for="(item, index) in maxOptions"
                :key="index"
                class="item"
                :class="{ current: item.value === priceValue.max }"
                @click="setPriceValue(item, 'max')"
              >
                {{ item.label }}
              </div-->
              <el-input-number
                v-model="priceValue.max"
                placeholder=" "
                :min="0"
                :max="9999999999"
                style="width: 100%"
                controls-position="right"
              >
                <template #suffix>
                  <span>K</span>
                </template>
              </el-input-number>
            </div>
          </div>
        </div>
        <div class="foot">
          <div class="left">
            <el-button text @click="onCancel"> Cancel </el-button>
          </div>
          <div class="right" style="text-align: right;">
            <el-button class="btn-apply" text @click="onApply">
              Apply
            </el-button>
          </div>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<style scoped lang="scss">
.price-com-main {
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
.price-com-content {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  .left,
  .right {
    flex: 1; /* 平均分配剩余空间 */
  }
  .title {
    color: #000;
    margin-bottom: 10px;
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
.foot {
  display: flex;
  align-items: center;
  gap: 10px;
  .left,
  .right {
    flex: 1;
  }
  .btn-apply,
  .btn-apply:hover {
    background: rgb(154, 137, 187);
    border: 1px solid rgb(154, 137, 187);
    color: #fff;
  }
}
</style>
