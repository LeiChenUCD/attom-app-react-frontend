import { http } from "@/utils/http";
import { baseApiUrl } from "./base";

/** 获取图片列表 */
export const getImagesListApi = (data: any) => {
  return http.request<any>(
    "post",
    `${baseApiUrl}/api/property-pic-urls/${data.attomId}`,
    {
      data
    }
  );
};

/** 获取列表 */
export const getCensusListApi = (data: any) => {
  return http.request<any>("post", `${baseApiUrl}/api/executeQuery`, { data });
};

/** 获取列表 */
export const getCensusListApi2 = (queryString: string, data: any) => {
  return http.request<any>(
    "post",
    `${baseApiUrl}/api/recorder-records?${queryString}`,
    { data }
  );
};

/** 获取列表 */
export const getCensusListApi3 = (queryString: string, data: any) => {
  return http.request<any>(
    "post",
    `${baseApiUrl}/api/recorder-records-combined?${queryString}`,
    { data }
  );
};

export const getHouseDetailApi = (queryString: string, data: any) => {
  return http.request<any>(
    "post",
    `${baseApiUrl}/api/property-details?${queryString}`,
    { data }
  );
};

/** 获取列表 */
export const getCensusTractInfoListApi = (params: any) => {
  return http.request<any>("get", `${baseApiUrl}/api/getCensusTractInfo`, {
    params
  });
};

export const getNotedATTOMID = (params: any) => {
  return http.request<any>("get", `${baseApiUrl}/api/getNotedATTOMID`, {
    params
  });
};

export const queryContactInfo = (params: any) => {
  return http.request<any>("get", `${baseApiUrl}/api/contactInfo`, { params });
};

export const getPriorityInfoAll = (params: any) => {
  return http.request<any>("get", `${baseApiUrl}/api/getPriorityInfoAll`, {
    params
  });
};

export const getNoteAll = (params: any) => {
  return http.request<any>("get", `${baseApiUrl}/api/getNoteAll`, { params });
};

export const getSellerReply = (params: any) => {
  return http.request<any>("get", `${baseApiUrl}/api/sellerReply`, { params });
};

export const getDDPdfs = (params: any) => {
  return http.request<any>("get", `${baseApiUrl}/api/getDDPdfs`, { params });
};

export const getNoteById = (data: any) => {
  return http.request<any>("post", `${baseApiUrl}/api/getNote`, { data });
};

export const insertNote = (data: any) => {
  return http.request<any>("post", `${baseApiUrl}/api/insertNote`, { data });
};

/** 创建 */
export const createAllianceApi = (data?: object) => {
  return http.request<any>("post", `${baseApiUrl}/api/alliances`, { data });
};

/** 更新 */
export const updateAllianceApi = (id: any, data?: object) => {
  return http.request<any>("post", `${baseApiUrl}/api/alliances/${id}`, {
    data
  });
};

export const deleteAllianceApi = (id: any, data?: object) => {
  return http.request<any>("post", `${baseApiUrl}/api/alliances/delete/${id}`, {
    data
  });
};

/** 获取信息 */
export function getAllianceDetailApi(params: any) {
  return http.request<any>("get", `${baseApiUrl}/api/alliances/${params._id}`, {
    params
  });
}
