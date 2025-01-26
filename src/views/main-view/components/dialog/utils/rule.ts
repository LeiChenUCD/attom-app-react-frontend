import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { isAlphaNumeric } from "@/utils/rules";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  comment: [{ required: true, message: "Please enter comment", trigger: "change" }],
});
