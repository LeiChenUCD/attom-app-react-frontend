<script setup lang="ts">
import { ref } from "vue";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { getCityListApi, getZoneListApi } from "@/api/welcome";

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
const citySubsetOptions = ref([]);
const zoneOptions = ref([]);

const sellerReplyOptions = ref([
  /*{
    value: "Both",
    label: "Both"
  },*/
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
  /*{
    value: "Both",
    label: "Both"
  },*/
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
  /*{
    value: "Both",
    label: "Both"
  },*/
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
  /*{
    value: "Both",
    label: "Both"
  },*/
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
  location: "",
  citySubset: "",
  addrFilter: "",
  noteFilter: "",
  lotAreaLower: null,
  lotAreaUpper: null,
  zoning: "",
  bedroomsLower: null,
  bedroomsUpper: null,
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
  contactInfo: "Both",
  alphaxheld: false,
  comments: null
});

async function queryCityList() {
  const params = {};
  const res = await getCityListApi(params);
  citySubsetOptions.value = getCityOptions(res);
}

async function queryZoneList() {
  const params = {};
  const res = await getZoneListApi(params);
  zoneOptions.value = getCityOptions(res);
}

function getCityOptions(list) {
  const res = [];
  if (list?.length > 0) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item) {
        res.push({
          value: item,
          label: item
        });
      }
    }
  }
  return res;
}

function onSearch() {
  onBack();
}

function resetForm() {
  formValue.value = {
    location: "",
    citySubset: "",
    addrFilter: "",
    noteFilter: "",
    lotAreaLower: null,
    lotAreaUpper: null,
    zoning: "",
    bedroomsLower: null,
    bedroomsUpper: null,
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
    contactInfo: "Both",
    alphaxheld: false,
    comments: null
  };
  onBack();
}

function onBack() {
  emit("onFiler", formValue.value);
}

queryCityList();
queryZoneList();
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
      <el-form-item prop="location">
        <template #label>
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg data-v-1d2a0c97="" data-insp-path="D:/project/attom-app-react-frontend/src/views/iframe/components/overview/index.vue:176:13:svg" t="1755760665346" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5055" width="20" height="20"><path data-v-1d2a0c97="" data-insp-path="D:/project/attom-app-react-frontend/src/views/iframe/components/overview/index.vue:176:157:path" d="M512 64C317.92 64 160 221.92 160 416c0 187.36 315.424 520.032 328.832 534.08C494.88 956.448 503.264 960 512 960c0.224 0 0.48 0 0.704 0 8.992 0 17.472-4.192 23.392-10.944l109.216-125.12C790.432 646.176 864 508.928 864 416 864 221.92 706.08 64 512 64zM512 576c-88.384 0-160-71.616-160-160s71.616-160 160-160 160 71.616 160 160S600.384 576 512 576z" p-id="5056"></path></svg>
            <span>Location</span>
          </div>
        </template>
        <el-input
          v-model="formValue.location"
          placeholder="Please enter"
          clearable
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item prop="mlsstatus">
        <template #label>
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg t="1758620933729" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7401" width="20" height="20"><path d="M384 606.72H167.253333c-26.026667 0-49.92 13.226667-63.573333 35.413333-13.653333 21.76-14.933333 47.786667-3.84 70.826667a462.506667 462.506667 0 0 0 259.84 231.68c7.68 2.56 16.213333 4.266667 24.32 4.266667a75.264 75.264 0 0 0 74.666667-75.093334l0.426666-192c0-20.053333-7.68-38.826667-21.76-52.906666A76.373333 76.373333 0 0 0 384 606.72zM959.146667 409.6C911.36 199.68 727.466667 53.333333 512 53.333333c-215.466667 0-399.36 146.346667-447.146667 356.266667-5.12 22.186667 0 44.8 14.506667 62.72 14.506667 17.92 35.84 28.16 58.88 28.16h747.946667a74.026667 74.026667 0 0 0 72.96-90.88zM855.893333 608.853333L640 608.426667a74.197333 74.197333 0 0 0-74.666667 74.666666l0.426667 191.146667a75.264 75.264 0 0 0 74.666667 75.093333c8.106667 0 16.213333-1.28 23.893333-4.266666 111.786667-39.253333 206.506667-123.306667 258.986667-229.546667a72.533333 72.533333 0 0 0-3.413334-70.4c-14.08-23.04-37.973333-36.266667-64-36.266667z" p-id="7402"></path></svg>
            <span>Status</span>
          </div>
        </template>
        <el-select-v2
          v-model="formValue.mlsstatus"
          filterable
          clearable
          :options="mlsstatusOptions"
          placeholder="Please select"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="Price" prop="closePrice">
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

      <el-form-item label="Bedroomscount" prop="bedrooms">
        <el-input-number
          v-model="formValue.bedroomsLower"
          placeholder=" "
          :min="0"
          :max="9999"
          style="width: 42%"
          controls-position="right"
        />
        <span style="margin: 0 10px">~</span>
        <el-input-number
          v-model="formValue.bedroomsUpper"
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

      <el-form-item label="City" prop="citySubset">
        <el-select-v2
          v-model="formValue.citySubset"
          filterable
          clearable
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
      <!--el-form-item label="Note" prop="noteFilter">
        <el-input
          v-model="formValue.noteFilter"
          placeholder="Please enter"
          clearable
          style="width: 100%"
        />
      </el-form-item-->

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

      <el-form-item label="Zonedcodelocal" prop="zoning">
        <el-select-v2
          v-model="formValue.zoning"
          filterable
          clearable
          :options="zoneOptions"
          placeholder="Please select"
          style="width: 100%"
        />
        <!--el-input
          v-model="formValue.zoning"
          placeholder="Please enter"
          clearable
          style="width: 100%"
        /-->
      </el-form-item>

      <!--el-form-item label="Priority" prop="priority">
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
      </el-form-item-->

      <!--el-form-item label="LotSizeArea" prop="lotSizeArea">
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
      </el-form-item-->

      <!--el-form-item label="Seller Reply?" prop="sellerReplyAddr">
        <el-select-v2
          v-model="formValue.sellerReplyAddr"
          filterable
          clearable
          :options="sellerReplyOptions"
          placeholder="Please select"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="Due Diligence?" prop="dueDiligence">
        <el-select-v2
          v-model="formValue.dueDiligence"
          filterable
          clearable
          :options="dueDiligenceOptions"
          placeholder="Please select"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="Noted?" prop="noted">
        <el-select-v2
          v-model="formValue.noted"
          filterable
          clearable
          :options="notedOptions"
          placeholder="Please select"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="Contact Info?" prop="contactInfo">
        <el-select-v2
          v-model="formValue.contactInfo"
          filterable
          clearable
          :options="contactInfoOptions"
          placeholder="Please select"
          style="width: 100%"
        />
      </el-form-item-->
      <!--el-form-item label="Comments" prop="comments">
        <el-input
          v-model="formValue.comments"
          placeholder="Please enter"
          clearable
          style="width: 100%"
        />
      </el-form-item-->
      <!--el-form-item label="AlphaX project" prop="alphaxheld">
        <el-checkbox v-model="formValue.alphaxheld" label="" size="large" />
      </el-form-item-->
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
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 0 10px 0 20px;
  .search-form {
    display: flex;
    flex-wrap: wrap;
    :deep(.el-form-item) {
      margin-bottom: 12px;
      margin-right: 0;
      padding-right: 10px;
      display: inline-block;
      flex: 1 1 20%;
      min-width: 200px;
    }
    flex: 1;
    /**height: 55px;**/
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
    display: none;
    svg {
      cursor: pointer;
      margin: 0 0 0 10px;
      color: var(--el-color-primary);
    }
  }
}
</style>
