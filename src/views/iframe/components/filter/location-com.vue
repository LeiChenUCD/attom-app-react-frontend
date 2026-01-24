<script setup lang="ts">
import { ref } from "vue";
import { getPropertiesList } from "@/api/welcome";
import { objectParamsToQueryString } from "@/utils/common";

defineOptions({
  name: "LocationCom"
});
const props = defineProps({});
const propsValue = {
  label: "value",
  value: "value"
};
const emit = defineEmits(["onFiler"]);

const locationValue = ref("");
const loading = ref(false);
const options = ref([]);

const remoteMethod = async (query: string) => {
  if (!query) {
    return;
  } else if (query.indexOf(",") !== -1) {
    query = query.split(",")[0].trim();
  }
  loading.value = true;
  const params = {
    query
  };
  const queryString = objectParamsToQueryString(params);
  const res = await getPropertiesList(queryString, params);
  const result = res?.result || [];
  const sorted = result.sort((a, b) =>
    a.field === "city" ? -1 : b.field === "city" ? 1 : 0
  );
  options.value = sorted;
  loading.value = false;
};

function handleChange() {
  if (locationValue.value) {
    const selectedOption = options.value.find(
      option => option.value === locationValue.value
    );
    emit("onFiler", selectedOption);
  } else {
    emit("onFiler", null);
  }
}

remoteMethod("");
</script>

<template>
  <el-select-v2
    v-model="locationValue"
    style="width: 100%"
    :props="propsValue"
    filterable
    remote
    :remote-method="remoteMethod"
    clearable
    :options="options"
    :loading="loading"
    placeholder="City, Zip Code, Address"
    @change="handleChange"
  />
</template>

<style scoped lang="scss"></style>
