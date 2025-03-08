import { http } from "@/utils/http";
import axios from "axios";
import {generateUUID} from "@/utils/common";
import {message} from "@/utils/message";
import { baseApiUrl } from "./base";

/** 上线接口 **/
export const uploadTokenApi = (params?: object) => {
  return http.request<any>("get", `${baseApiUrl}/api/admin/upload/uptoken`, { params });
};

export const uploadToAliyunOSS2 = async (file: any,filePath?: any,  uploadParams?: any) => {
  const filename = file.name;
  const uuid = generateUUID()
  const fileUrl = `${filePath}${uuid}_${filename}`
  const formData = new FormData();
  // formData.append('name',filename);
  // formData.append('policy', uploadParams.policy);
  // formData.append('OSSAccessKeyId', uploadParams.OSSAccessKeyId);
  // formData.append('success_action_status', '200');
  // formData.append('signature', uploadParams.signature);
  formData.append('folder', filePath);
  // file必须为最后一个表单域，除file以外的其他表单域无顺序要求。
  formData.append('file', file);

  const url = `${baseApiUrl}/api/upload/file`;//`${uploadParams.domain}`;

  try {
    const {data} = await axios({
      method: 'post',
      url,
      data: formData,
      // 移除或注释掉下面的 headers 设置
      // headers: {
      //   'Content-Type': 'multipart/form-data' // 不需要手动设置这个
      // }
    });
    console.dir([data])
    if (data?.data?.fileUrl) {
      return {
        aliUrl: `${data?.data?.fileUrl}`,
        showUrl: `${data?.data?.fileUrl}`
      }
    } else {
      message(data?.message, { type: "error" });
      throw new Error(data?.message + data?.statusCode);
    }
  } catch (error) {
    if (error.response) {
    }
    throw error;
  }
};

/** 上线到阿里云 **/
export const uploadToAliyunOSS = async (filePath: any, file: any, uploadParams: any) => {
  const filename = file.name;
  const uuid = generateUUID()
  const fileUrl = `${filePath}${uuid}_${filename}`
  const formData = new FormData();
  formData.append('name',filename);
  formData.append('policy', uploadParams.policy);
  formData.append('OSSAccessKeyId', uploadParams.OSSAccessKeyId);
  formData.append('success_action_status', '200');
  formData.append('signature', uploadParams.signature);
  formData.append('key', fileUrl);
  // file必须为最后一个表单域，除file以外的其他表单域无顺序要求。
  formData.append('file', file);

  const url = `${uploadParams.domain}`;

  try {
    const response = await axios({
      method: 'post',
      url,
      data: formData,
      // 移除或注释掉下面的 headers 设置
      // headers: {
      //   'Content-Type': 'multipart/form-data' // 不需要手动设置这个
      // }
    });

    if (response.status === 200) {
      return {
        aliUrl: `${fileUrl}`,
        showUrl: `${url}/${fileUrl}`
      }
    } else {
      throw new Error('File upload to Aliyun OSS failed with status: ' + response.status);
    }
  } catch (error) {
    if (error.response) {
    }
    throw error;
  }
};
