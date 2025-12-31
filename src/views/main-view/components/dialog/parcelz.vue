<script setup lang="ts">
import { ref } from "vue";
import { getParcelzSanJoseApi, getNotParcelzSanJoseApi } from "@/api/welcome";
import { aduCheck } from "@/features/feasibilityCheck/aduCheck";
import { InfoFilled, SuccessFilled, WarningFilled, CircleCloseFilled } from '@element-plus/icons-vue';

defineOptions({
  name: "parcelzCom"
});
const props = defineProps({
  detail: {
    type: Object,
    default: () => {
      return {};
    }
  }
});

const isLoading = ref(false);
const myProject: any = ref({});
const apnLink = ref("");
const aduSpecs: any = ref({});
const msgTypeMap = {
  pass: "pass",
  fail: "fail",
  info: "info",
  warn: "warn",
};
const fhszlraMap: any = ref({
  0: "Null Outside",
  1: "Moderate",
  2: "HIGH",
  3: "VERY HIGH" 
})
const aduMaxSize = ref(0);
const messageObject: any = ref({
  pass: [],
  fail: [],
  warn: [],
  info: [],
});
const developmentStandard = ref("city");
const developmentStandardOptions = ref([
  {
    value: "city",
    label: "CITY STANDARDS",
  },
  {
    value: "state",
    label: "STATE STANDARDS",
  },
]);

function buildApnLink() {
  const apn = myProject.value.apn || "";
  if (apn) {
    apnLink.value = `https://sccdpdapps.com/profile/profile_web.html?apn=${apn}`;
  } else {
    apnLink.value = "";
  }
}


function filterMessageByType(list: any, type: string) {
  const res: any = [];
  if (list?.length > 0 && type) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (type === item.type) {
        res.push(item);
      }
    }
  }
  return res;
}

function onCheckAdu(adu?: any) {
  const { property, detached, story } = myProject.value;
  const projectObject = JSON.parse(JSON.stringify(myProject.value)) || {};
  const aduType = adu?.dedicated ?? detached ?? true;
  const projectAddress = projectObject.address || "";
  const msgRes = aduCheck(
    projectAddress,
    property,
    aduType,
    adu?.stories ?? story ?? 1,
    developmentStandard.value,
    projectObject
  );
  // console.log("msgRes.developmentSpecs", msgRes.developmentSpecs);
  aduSpecs.value = msgRes.developmentSpecs;
  projectObject.frontSetback = msgRes.developmentSpecs.frontSB;
  projectObject.rearYardFrontSetback = msgRes.developmentSpecs.rearYardFrontSB;
  projectObject.rearSetback = msgRes.developmentSpecs.rearSB;
  projectObject.sideSetback = msgRes.developmentSpecs.sideSB;
  projectObject.separation = msgRes.developmentSpecs.separation;
  aduMaxSize.value = msgRes.developmentSpecs.maxSize;
  myProject.value = projectObject;

  const warnMsgList = filterMessageByType(msgRes.findings, msgTypeMap.warn);
  const failMsgList = filterMessageByType(msgRes.findings, msgTypeMap.fail);
  const passMsgList = filterMessageByType(msgRes.findings, msgTypeMap.pass);
  const infoMsgList = filterMessageByType(msgRes.findings, msgTypeMap.info);
  const msgs = {
    pass: passMsgList,
    fail: failMsgList,
    warn: warnMsgList,
    info: infoMsgList,
  };
  return msgs;
}

function onChangeDevStandard() {
  messageObject.value = onCheckAdu();
}

async function getData() {
  const address = props.detail.address || "";
  const city = props.detail.city || "";
  const state = props.detail.state || "";
  const zip = props.detail.zip || "";
  const allAddress = `${address}, ${city}, ${state} ${zip}, USA`;
  const lat = props.detail.lat || '';
  const lon = props.detail.lon;
  const params = {
    address: allAddress,
    longitude: lon,
    latitude: lat,
  };
  isLoading.value = true;
  let res;
  if (city?.toUpperCase() === 'SAN JOSE') {
    res = await getParcelzSanJoseApi(params);
  } else {
    res = await getNotParcelzSanJoseApi(params);
  }
  myProject.value = res || {};
  isLoading.value = false;
  buildApnLink();
  messageObject.value = onCheckAdu();
}

function init() {
  getData();
}

init();
</script>

<template>
  <div class="parcelz-com" v-if="!isLoading">
    <div class="summary-table">
      <table v-if="myProject.apn">
        <tbody>
          <!--tr>
            <td colspan="4">{{ myProject.address }}</td>
          </tr-->
          <tr>
            <td class="text-subtitle-2">
              APN
            </td>
            <td>
              <el-link v-if="apnLink" type="primary" target="_blank" :href="apnLink">{{
                myProject.apn
              }}</el-link>
              <span v-else>{{ myProject.apn }}</span>
            </td>
            <td class="text-subtitle-2">Lot(sqft)</td>
            <td>
              {{ myProject.sqft && Number(myProject.sqft?.toFixed(0) || 0) }}
            </td>
          </tr>

          <tr class="tr-line">
            <td colspan="2" class="text-subtitle-2">
              Zoning / General Plan
            </td>
            <td colspan="2">
              {{ myProject.zoning }} / {{ myProject.generalPlan }}
            </td>
          </tr>

          <tr>
            <td colspan="4">
              <span class="text-subtitle-2">Development standards:</span>
              <el-select-v2
                @change="onChangeDevStandard"
                v-model="developmentStandard"
                :options="developmentStandardOptions"
                placeholder="Please select"
                :props="{
                  label: 'label',
                  value: 'value',
                }"
                style="width: 250px; margin-left: 5px"
              />
            </td>
          </tr>

          <!-- <tr v-if="myProject?.apn"> -->
          <tr>
            <td colspan="4">
              <span class="text-subtitle-2 text-left mr-2">Front setback</span
              >{{ myProject.frontSetback }},
              <span class="text-subtitle-2 text-left mx-2">Rear setback</span
              >{{ myProject.rearSetback }},
              <span class="text-subtitle-2 text-left mx-2">Side setback</span
              >{{ myProject.sideSetback }}
            </td>
          </tr>

          <tr>
            <td>
              <span class="text-subtitle-2 text-left mr-2">Separation</span>
              {{ aduSpecs?.separation }}
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <tr v-if="fhszlraMap[myProject.fhszlra]">
            <td colspan="4" class="text-subtitle-2">
              Fire harzard severity zone
            </td>
          </tr>
          <tr v-if="fhszlraMap[myProject.fhszsra]">
            <td colspan="4" class="text-subtitle-2">
              State responsiblity area:{{ fhszlraMap[myProject.fhszsra] }}
            </td>
          </tr>
          <tr v-if="fhszlraMap[myProject.fhszlra]">
            <td colspan="4" class="text-subtitle-2">
              Local responsiblity area:{{ myProject.fhszlra }}
            </td>
          </tr>

          <!-- <tr v-if="myProject?.apn"> -->
          <tr>
            <td colspan="2" class="text-subtitle-2">
              Max sqft of potential
            </td>
            <td colspan="2">
              Attached:
              {{ aduMaxSize === Number.MAX_SAFE_INTEGER ? "N/A" : aduMaxSize }},
              Detached:
              {{ aduMaxSize === Number.MAX_SAFE_INTEGER ? "N/A" : aduMaxSize }}
            </td>
          </tr>
          <tr v-if="messageObject?.fail?.length > 0">
            <td colspan="4">
              <div
                v-for="item in messageObject.fail"
                class="my-2 message-box message-box-error"
              >
                <div class="message-panel">
                  <el-icon :size="20" class="mr-1"><CircleCloseFilled /></el-icon>
                  <div style="display: inline" v-html="item.content"></div>
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="messageObject?.warn?.length > 0">
            <td colspan="4">
              <div
                v-for="item in messageObject.warn"
                class="my-2 message-box message-box-warn"
              >
                <div class="message-panel">
                  <el-icon :size="20" class="mr-1"><WarningFilled /></el-icon>
                  <div style="display: inline" v-html="item.content"></div>
                </div>
              </div>
            </td>
          </tr>

          <tr v-if="messageObject?.info?.length > 0">
            <td colspan="4">
              <div
                v-for="item in messageObject.info"
                class="my-2 message-box message-box-info"
              >
                <div class="message-panel">
                  <el-icon :size="20" class="mr-1"><InfoFilled /></el-icon>
                  <div style="display: inline" v-html="item.content"></div>
                </div>
              </div>
            </td>
          </tr>
          <tr v-if="messageObject?.pass?.length > 0">
            <td colspan="4">
              <div
                v-for="item in messageObject.pass"
                class="my-2 message-box message-box-pass"
              >
                <div class="message-panel">
                  <el-icon :size="20" class="mr-1"><SuccessFilled /></el-icon>
                  <div style="display: inline" v-html="item.content"></div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else>
        <el-empty description="No data" />
      </div>
    </div>
  </div>
  <div v-else>
    <div v-loading="isLoading"></div>
  </div>
</template>
<style lang="scss" scoped>
.parcelz-com {
  .title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin: 20px 0;
  }

  table td {
    border: none !important;
    height: 52px;
  }

  .text-subtitle-2 {
    color: rgba(0, 0, 0, 0.87);
    font-size: 14px;
    font-weight: 500;
  }

  table tr.tr-line td {
    border-bottom: 1px solid #d0d1d2 !important;
  }

  .message-box {
    border-radius: 8px;
    padding: 8px;
    font-size: 14px;
    display: inline-block;
    margin-right: 10px;

    .message-panel {
      display: flex;
    }

    &.message-box-error {
      background: rgba(255, 39, 101, 0.1);
      color: rgba(255, 39, 101, 1) !important;
    }

    &.message-box-warn {
      background: rgba(253, 135, 1, 0.1);
      color: rgba(253, 135, 1, 1);
    }

    &.message-box-info {
      background: rgba(26, 118, 250, 0.1);
      color: rgba(26, 118, 250, 1);
    }

    &.message-box-pass {
      background: rgba(0, 150, 136, 0.1);
      color: rgba(0, 150, 136, 1);
    }
  }
}
</style>
