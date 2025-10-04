<script setup lang="ts">
import { ref } from "vue";
import {
  getPropertiesList
} from "@/api/welcome";
import { objectParamsToQueryString } from "@/utils/common";

defineOptions({
  name: "LocationCom"
});
const props = defineProps({
});
const propsValue = {
  label: 'value',
  value: 'value',
}
const emit = defineEmits(["onFiler"]);

const locationValue = ref('');
const loading = ref(false);
const options = ref([]);

const remoteMethod = async (query: string) => {
  if (!query) {
    return
  }
  loading.value = true
  const params = {
    query
  }
  const queryString = objectParamsToQueryString(params);
  const res = await getPropertiesList(queryString, params);
  const result = res?.result || [];
  options.value = result;
  loading.value = false
}

function handleChange() {
  if (locationValue.value) {
    const selectedOption = options.value.find(option => option.value === locationValue.value);
    emit("onFiler", selectedOption);
  } else {
    emit("onFiler", null);
  }
}

remoteMethod('')

</script>

<template>
  <el-select-v2
    v-model="locationValue"
    style="width: 100%"
    :props="propsValue"
    filterable
    remote
    :remote-method="remoteMethod"
    @change="handleChange"
    clearable
    :options="options"
    :loading="loading"
    placeholder="City, Zip Code, Address"
  />
</template>

<style scoped lang="scss">

</style>
