import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { isAlphaNumeric } from "@/utils/rules";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "会议名称为必填项", trigger: "change" }],
  code: [
    { required: true, message: "会议编码为必填项", trigger: "change" },
    { validator: isAlphaNumeric, trigger: "change" }
  ],
  remark: [{ required: true, message: "备注为必填项", trigger: "change" }],
});
