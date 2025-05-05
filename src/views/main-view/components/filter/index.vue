<script setup lang="ts">
import { ref } from "vue";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

defineOptions({
  name: "Filter"
});
const props = defineProps({
  zonedcodelocalOptions: {
    type: Array,
    default: () => {
      return [];
    }
  }
});
const emit = defineEmits(["onFiler"]);
const citySubsetOptions = ref([
  {
    value: "All",
    label: "All"
  },
  {
    value: "CAMPBELL",
    label: "CAMPBELL"
  },
  {
    value: "LOS ALTOS",
    label: "LOS ALTOS"
  }
]);

const sellerReplyOptions = ref([
  {
    value: "Both",
    label: "Both"
  },
  {
    value: "With Seller Reply",
    label: "With Seller Reply"
  },
  {
    value: "Without Seller Reply",
    label: "Without Seller Reply"
  }
]);

const mlsstatusOptions = ref([
  {
    value: "Sold",
    label: "Sold"
  },
  {
    value: "Canceled",
    label: "Canceled"
  },
  {
    value: "Expired",
    label: "Expired"
  },
  {
    value: "Active",
    label: "Active"
  },
  {
    value: "PendingDoNotShow",
    label: "PendingDoNotShow"
  },
  {
    value: "WithdrawnTemporaryOffMarket",
    label: "WithdrawnTemporaryOffMarket"
  },
  {
    value: "Contingent",
    label: "Contingent"
  },
  {
    value: "ComingSoon",
    label: "ComingSoon"
  },
  {
    value: "ExclusionEnded",
    label: "ExclusionEnded"
  }
]);

const dueDiligenceOptions = ref([
  {
    value: "Both",
    label: "Both"
  },
  {
    value: "With Due Diligence",
    label: "With Due Diligence"
  },
  {
    value: "Without Due Diligence",
    label: "Without Due Diligence"
  }
]);

const notedOptions = ref([
  {
    value: "Both",
    label: "Both"
  },
  {
    value: "Noted Addresses",
    label: "Noted Addresses"
  },
  {
    value: "Not Noted Addresses",
    label: "Not Noted Addresses"
  }
]);

const contactInfoOptions = ref([
  {
    value: "Both",
    label: "Both"
  },
  {
    value: "With Contact Info",
    label: "With Contact Info"
  },
  {
    value: "Without Contact Info",
    label: "Without Contact Info"
  }
]);

const loading = ref(false);
const isMore = ref(false);
const formRef = ref();
const formValue = ref({
  citySubset: "All",
  addrFilter: "",
  noteFilter: "",
  lotAreaLower: null,
  lotAreaUpper: null,
  zonedcodelocal: "All",
  bedroomscountLower: null,
  bedroomscountUpper: null,
  bathcountLower: null,
  bathcountUpper: null,
  priorityLower: null,
  priorityUpper: null,
  closePriceLower: null,
  closePriceUpper: null,
  lotSizeAreaLower: null,
  lotSizeAreaUpper: null,
  mlsstatus: null,
  sellerReplyAddr: "Both",
  dueDiligence: "Both",
  noted: "Both",
  contactInfo: "Both"
});

function onSearch() {
  onBack();
}

function resetForm() {
  formValue.value = {
    citySubset: "All",
    addrFilter: "",
    noteFilter: "",
    lotAreaLower: null,
    lotAreaUpper: null,
    zonedcodelocal: "All",
    bedroomscountLower: null,
    bedroomscountUpper: null,
    bathcountLower: null,
    bathcountUpper: null,
    priorityLower: null,
    priorityUpper: null,
    closePriceLower: null,
    closePriceUpper: null,
    lotSizeAreaLower: null,
    lotSizeAreaUpper: null,
    mlsstatus: null,
    sellerReplyAddr: "Both",
    dueDiligence: "Both",
    noted: "Both",
    contactInfo: "Both"
  };
  onBack();
}

function onBack() {
  emit("onFiler", formValue.value);
}
</script>

<template>
  <div class="filter-main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="formValue"
      :class="{ more: isMore }"
      class="search-form bg-bg_color w-[99/100] pt-[12px]"
    >
      <el-form-item label="City" prop="citySubset">
        <el-select-v2
          v-model="formValue.citySubset"
          filterable
          :options="citySubsetOptions"
          placeholder="Please select"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="Address" prop="addrFilter">
        <el-input
          v-model="formValue.addrFilter"
          placeholder="Please enter"
          clearable
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="Note" prop="noteFilter">
        <el-input
          v-model="formValue.noteFilter"
          placeholder="Please enter"
          clearable
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="AreaLotSF" prop="lotArea">
        <el-input-number
          v-model="formValue.lotAreaLower"
          placeholder=" "
          :min="0"
          :max="9999999999"
          style="width: 42%"
          controls-position="right"
        />
        <span style="margin: 0 10px">~</span>
        <el-input-number
          v-model="formValue.lotAreaUpper"
          placeholder=" "
          :min="0"
          :max="9999999999"
          style="width: 42%"
          controls-position="right"
        />
      </el-form-item>

      <el-form-item label="Zonedcodelocal" prop="zonedcodelocal">
        <el-select-v2
          v-model="formValue.zonedcodelocal"
          filterable
          :options="zonedcodelocalOptions"
          placeholder="Please select"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="Bedroomscount" prop="bedroomscount">
        <el-input-number
          v-model="formValue.bedroomscountLower"
          placeholder=" "
          :min="0"
          :max="9999"
          style="width: 42%"
          controls-position="right"
        />
        <span style="margin: 0 10px">~</span>
        <el-input-number
          v-model="formValue.bedroomscountUpper"
          placeholder=" "
          :min="0"
          :max="9999"
          style="width: 42%"
          controls-position="right"
        />
      </el-form-item>

      <el-form-item label="Bathcount" prop="bathcount">
        <el-input-number
          v-model="formValue.bathcountLower"
          placeholder=" "
          :min="0"
          :max="9999"
          style="width: 42%"
          controls-position="right"
        />
        <span style="margin: 0 10px">~</span>
        <el-input-number
          v-model="formValue.bathcountUpper"
          placeholder=" "
          :min="0"
          :max="9999"
          style="width: 42%"
          controls-position="right"
        />
      </el-form-item>

      <el-form-item label="Priority" prop="priority">
        <el-input-number
          v-model="formValue.priorityLower"
          placeholder=" "
          :min="0"
          :max="9999"
          style="width: 42%"
          controls-position="right"
        />
        <span style="margin: 0 10px">~</span>
        <el-input-number
          v-model="formValue.priorityUpper"
          placeholder=" "
          :min="0"
          :max="9999"
          style="width: 42%"
          controls-position="right"
        />
      </el-form-item>

      <el-form-item label="ClosePrice" prop="closePrice">
        <el-input-number
          v-model="formValue.closePriceLower"
          placeholder=" "
          :min="0"
          :max="9999999999"
          style="width: 42%"
          controls-position="right"
        />
        <span style="margin: 0 10px">~</span>
        <el-input-number
          v-model="formValue.closePriceUpper"
          placeholder=" "
          :min="0"
          :max="9999999999"
          style="width: 42%"
          controls-position="right"
        />
      </el-form-item>

      <el-form-item label="LotSizeArea" prop="lotSizeArea">
        <el-input-number
          v-model="formValue.lotSizeAreaLower"
          placeholder=" "
          :min="0"
          :max="9999999999"
          style="width: 42%"
          controls-position="right"
        />
        <span style="margin: 0 10px">~</span>
        <el-input-number
          v-model="formValue.lotSizeAreaUpper"
          placeholder=" "
          :min="0"
          :max="9999999999"
          style="width: 42%"
          controls-position="right"
        />
      </el-form-item>

      <el-form-item label="MLS status" prop="mlsstatus">
        <el-select-v2
          v-model="formValue.mlsstatus"
          filterable
          :options="mlsstatusOptions"
          placeholder="Please select"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="Seller Reply?" prop="sellerReplyAddr">
        <el-select-v2
          v-model="formValue.sellerReplyAddr"
          filterable
          :options="sellerReplyOptions"
          placeholder="Please select"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="Due Diligence?" prop="dueDiligence">
        <el-select-v2
          v-model="formValue.dueDiligence"
          filterable
          :options="dueDiligenceOptions"
          placeholder="Please select"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="Noted?" prop="noted">
        <el-select-v2
          v-model="formValue.noted"
          filterable
          :options="notedOptions"
          placeholder="Please select"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="Contact Info?" prop="contactInfo">
        <el-select-v2
          v-model="formValue.contactInfo"
          filterable
          :options="contactInfoOptions"
          placeholder="Please select"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    <div class="operators">
      <el-button
        type="primary"
        :icon="useRenderIcon(Search)"
        :loading="loading"
        @click="onSearch"
      >
        Search
      </el-button>
      <el-button :icon="useRenderIcon(Refresh)" @click="resetForm()">
        Reset
      </el-button>
      <svg
        v-if="!isMore"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        @click="isMore = !isMore"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 20V4m-7 9l7 7l7-7"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        @click="isMore = !isMore"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m19 12l-7-7l-7 7m7-7v14"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped lang="scss">
.filter-main {
  display: flex;
  align-items: center;
  .search-form {
    :deep(.el-form-item) {
      margin-bottom: 12px;
      margin-right: 50px;
      width: 350px;
    }
    flex: 1;
    height: 55px;
    overflow: hidden;
    &.more {
      height: auto;
      overflow: auto;
    }
  }
  .operators {
    width: 230px;
    display: flex;
    align-items: center;
    svg {
      cursor: pointer;
      margin: 0 0 0 10px;
      color: var(--el-color-primary);
    }
  }
}
</style>
