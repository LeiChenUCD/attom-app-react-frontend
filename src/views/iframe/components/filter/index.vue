<script setup lang="ts">
import { ref } from "vue";
import Search from "@iconify-icons/ep/search";
import Refresh from "@iconify-icons/ep/refresh";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { getCityListApi, getZoneListApi } from "@/api/welcome";
import PriceCom from "./price-com.vue";
import BedBathCom from "./bed-bath-com.vue";
import { zoningOptions } from "./options";

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

function onFilerPrice(data: any) {
  formValue.value.closePriceLower = data?.min? data?.min + '000' : '';
  formValue.value.closePriceUpper = data?.max? data?.max + '000' : '';
  onBack();
}

function onFilerBedBath(data: any) {
  formValue.value.bedroomsLower = data?.bed || '';
  formValue.value.bathcountLower = data?.bath || '';
  onBack();
}

function onChangeStatus() {
  onBack();
}

function onChangeZoning() {
  onBack();
}

function onBack() {
  emit("onFiler", formValue.value);
}

//queryCityList();
//queryZoneList();
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
          @change="onChangeStatus"
          filterable
          clearable
          :options="mlsstatusOptions"
          placeholder="Please select"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item prop="closePrice">
        <template #label>
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg t="1758621427713" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10185" width="20" height="20"><path d="M927.288889 466.488889l-371.674074-371.674074c-21.617778-21.617778-49.682963-33.374815-80.023704-33.754074L173.321481 56.888889c-68.001185 0.83437-117.191111 53.665185-116.432592 116.811852l3.792592 301.89037c0.758519 30.340741 12.515556 58.785185 33.754075 80.023704l371.674074 371.674074a136.912593 136.912593 0 0 0 193.042963 0l268.136296-267.757037a136.912593 136.912593 0 0 0 0-193.042963zM237.643852 289.071407c-31.668148 0-57.268148-26.320593-57.268148-56.888888 0-28.292741 23.286519-56.888889 57.116444-56.888889 31.630222 0 57.040593 25.562074 57.040593 56.888889 0 32.312889-26.889481 56.888889-56.888889 56.888888zM681.908148 682.021926a32.199111 32.199111 0 0 1-45.586963 0l-16.19437-16.19437c-46.686815 26.548148-99.745185 18.962963-133.840593-15.663408a32.237037 32.237037 0 1 1 45.928297-45.245629c14.677333 14.866963 44.183704 19.835259 67.773629-3.413334 19.949037-19.721481 21.959111-50.138074 4.475259-67.887407-17.635556-17.976889-48.165926-15.928889-67.773629 3.451259l-0.227556 0.227556c-42.287407 41.566815-112.715852 48.772741-158.264889 3.147851-35.157333-35.157333-39.708444-89.505185-15.36-132.74074l-16.308148-16.308148a32.199111 32.199111 0 1 1 45.549037-45.549037l16.308148 16.270222c43.690667-24.76563 96.331852-21.048889 132.740741 15.435852a32.199111 32.199111 0 1 1-45.511111 45.549037c-16.877037-16.801185-47.255704-16.687407-67.887407 3.944296-19.797333 19.797333-21.541926 50.213926-3.944297 67.849481 16.952889 16.877037 47.255704 16.57363 67.849482-3.944296a7.698963 7.698963 0 0 1 0.758518-0.758518c44.373333-42.742519 114.915556-45.624889 157.999408-1.820445 34.512593 35.119407 38.912 88.746667 15.056592 131.640889l16.459852 16.459852a32.199111 32.199111 0 0 1 0 45.549037z" p-id="10186"></path></svg>            
            <span>Price</span>
          </div>
        </template>
        <PriceCom @onFiler="onFilerPrice"/>
      </el-form-item>

      <el-form-item prop="bedBath">
        <template #label>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="display: flex;align-items: center;">
              <svg data-v-1d2a0c97="" data-insp-path="D:/project/attom-app-react-frontend/src/views/iframe/components/overview/index.vue:181:15:svg" t="1755761273208" class="icon" viewBox="0 0 1280 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6052" width="20" height="20"><path data-v-1d2a0c97="" data-insp-path="D:/project/attom-app-react-frontend/src/views/iframe/components/overview/index.vue:181:187:path" d="M352 512c88.22 0 160-71.78 160-160s-71.78-160-160-160-160 71.78-160 160 71.78 160 160 160z m704-256H608c-17.68 0-32 14.32-32 32v288H128V160c0-17.68-14.32-32-32-32H32C14.32 128 0 142.32 0 160v704c0 17.68 14.32 32 32 32h64c17.68 0 32-14.32 32-32v-96h1024v96c0 17.68 14.32 32 32 32h64c17.68 0 32-14.32 32-32V480c0-123.72-100.28-224-224-224z" p-id="6053"></path></svg>
              <span style="margin: 0 5px;">/</span>
              <svg data-v-1d2a0c97="" data-insp-path="D:/project/attom-app-react-frontend/src/views/iframe/components/overview/index.vue:189:15:svg" t="1755761642535" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7503" width="20" height="20"><path data-v-1d2a0c97="" data-insp-path="D:/project/attom-app-react-frontend/src/views/iframe/components/overview/index.vue:189:187:path" d="M950.857143 621.714286v109.714285q0 96.571429-73.142857 163.428572v110.857143q0 8-5.142857 13.142857t-13.142858 5.142857h-36.571428q-8 0-13.142857-5.142857t-5.142857-13.142857v-67.428572q-36 12.571429-73.142858 12.571429H292.571429q-37.142857 0-73.142858-12.571429v62.857143q0 9.714286-5.428571 16.285714T201.142857 1024h-36.571428q-7.428571 0-12.857143-6.571429T146.285714 1001.142857v-106.285714q-73.142857-66.857143-73.142857-163.428572v-109.714285h877.714286zM402.285714 384q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142857 13.142857-5.142857 13.142857 5.142857 5.142857 13.142857z m36.571429-36.571429q0 8-5.142857 13.142858t-13.142857 5.142857-13.142858-5.142857-5.142857-13.142858 5.142857-13.142857 13.142858-5.142857 13.142857 5.142857 5.142857 13.142857z m-36.571429-36.571428q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142857 13.142857-5.142857 13.142857 5.142857 5.142857 13.142857z m73.142857 0q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142857 13.142857-5.142857 13.142857 5.142857 5.142857 13.142857z m-36.571428-36.571429q0 8-5.142857 13.142857t-13.142857 5.142858-13.142858-5.142858-5.142857-13.142857 5.142857-13.142857 13.142858-5.142857 13.142857 5.142857 5.142857 13.142857z m-36.571429-36.571428q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142857 13.142857-5.142858 13.142857 5.142858 5.142857 13.142857z m621.714286 292.571428v36.571429q0 8-5.142857 13.142857t-13.142857 5.142857H18.285714q-8 0-13.142857-5.142857t-5.142857-13.142857v-36.571429q0-8 5.142857-13.142857t13.142857-5.142857h54.857143V146.285714q0-60.571429 42.857143-103.428571T219.428571 0q61.714286 0 105.142858 44.571429 26.285714-10.857143 56-6.857143t53.142857 22.285714l12.571428-12.571429q6.285714-6.285714 12.571429 0l24 24q6.285714 6.285714 0 12.571429L303.428571 263.428571q-6.285714 6.285714-12.571428 0l-24-24q-6.285714-6.285714 0-12.571428l12.571428-12.571429q-20.571429-26.285714-23.142857-59.428571T269.714286 93.142857q-21.142857-20-50.285715-20-30.285714 0-51.714285 21.428572T146.285714 146.285714v365.714286h859.428572q8 0 13.142857 5.142857t5.142857 13.142857zM512 274.285714q0 8-5.142857 13.142857t-13.142857 5.142858-13.142857-5.142858-5.142858-13.142857 5.142858-13.142857 13.142857-5.142857 13.142857 5.142857 5.142857 13.142857z m-36.571429-36.571428q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142857 13.142857-5.142858 13.142857 5.142858 5.142857 13.142857z m-36.571428-36.571429q0 8-5.142857 13.142857t-13.142857 5.142857-13.142858-5.142857-5.142857-13.142857 5.142857-13.142857 13.142858-5.142857 13.142857 5.142857 5.142857 13.142857z m109.714286 36.571429q0 8-5.142858 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142857 13.142857-5.142858 13.142857 5.142858 5.142858 13.142857z m-36.571429-36.571429q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142858-13.142857 5.142858-13.142857 13.142857-5.142857 13.142857 5.142857 5.142857 13.142857z m-36.571429-36.571428q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142858 13.142857-5.142857 13.142857 5.142857 5.142857 13.142858z m109.714286 36.571428q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142857 13.142857-5.142857 13.142857 5.142857 5.142857 13.142857z m-36.571428-36.571428q0 8-5.142858 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142858 13.142857-5.142857 13.142857 5.142857 5.142858 13.142858z m73.142857 0q0 8-5.142857 13.142857t-13.142858 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142858 13.142857-5.142857 13.142858 5.142857 5.142857 13.142858z" p-id="7504"></path></svg>
            </div>
            <span>Beds/Baths</span>
          </div>
        </template>
        <BedBathCom @onFiler="onFilerBedBath"/>
      </el-form-item>

      <el-form-item label="Property Type" prop="zoning">
        <template #label>
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg t="1758771083635" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12362" width="20" height="20"><path d="M768 810.666667h-85.333333v-170.666667c0-94.122667-76.544-170.666667-170.666667-170.666667s-170.666667 76.544-170.666667 170.666667v170.666667H256v-355.370667l256-227.541333 256 227.541333V810.666667z m-341.333333 0v-170.666667c0-47.061333 38.272-85.333333 85.333333-85.333333s85.333333 38.272 85.333333 85.333333v170.666667h-170.666666z m497.706666-330.581334l-384-341.333333a42.794667 42.794667 0 0 0-56.746666 0l-384 341.333333a42.794667 42.794667 0 0 0-3.541334 60.288c15.701333 17.578667 42.581333 19.157333 60.288 3.541334L170.666667 531.157333V853.333333a42.666667 42.666667 0 0 0 42.666666 42.666667h597.333334a42.666667 42.666667 0 0 0 42.666666-42.666667v-322.176l14.293334 12.757334a42.666667 42.666667 0 0 0 60.288-3.541334 42.794667 42.794667 0 0 0-3.541334-60.288z" fill="#000000" p-id="12363"></path></svg>
            <span>Property Type</span>
          </div>
        </template>
        <el-select-v2
          v-model="formValue.zoning"
          @change="onChangeZoning"
          filterable
          clearable
          :options="zoningOptions"
          placeholder="Please select"
          style="width: 100%"
        />
      </el-form-item>

      <!--el-form-item label="Bedroomscount" prop="bedrooms">
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
      </el-form-item-->
      <!--el-form-item label="Note" prop="noteFilter">
        <el-input
          v-model="formValue.noteFilter"
          placeholder="Please enter"
          clearable
          style="width: 100%"
        />
      </el-form-item-->

      <!--el-form-item label="AreaLotSF" prop="lotArea">
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
      </el-form-item-->

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
