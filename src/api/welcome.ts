import { http } from "@/utils/http";

/** 获取列表 */
export const getCensusListApi = (data: any) => {
  return http.request<any>("post", "/api/executeQuery", { data });
};

/** 获取列表 */
export const getCensusTractInfoListApi = (params: any) => {
  return http.request<any>("get", "/api/getCensusTractInfo", { params });
};

export const getNotedATTOMID = (params: any) => {
  return http.request<any>("get", "/api/getNotedATTOMID", { params });
};

export const queryContactInfo = (params: any) => {
  return http.request<any>("get", "/api/contactInfo", { params });
};

export const getPriorityInfoAll = (params: any) => {
  return http.request<any>("get", "/api/getPriorityInfoAll", { params });
};

export const getNoteAll = (params: any) => {
  return http.request<any>("get", "/api/getNoteAll", { params });
};

export const getSellerReply = (params: any) => {
  return http.request<any>("get", "/api/sellerReply", { params });
};

export const getDDPdfs = (params: any) => {
  return http.request<any>("get", "/api/getDDPdfs", { params });
};

export const getNoteById = (data: any) => {
  return http.request<any>("post", "/api/getNote", { data });
};

export const insertNote = (data: any) => {
  return http.request<any>("post", "/api/insertNote", { data });
};

/** 创建 */
export const createAllianceApi = (data?: object) => {
  return http.request<any>("post", "/api/alliances", { data });
};

/** 更新 */
export const updateAllianceApi = (id: any, data?: object) => {
  return http.request<any>("post", `/api/alliances/${id}`, { data });
};

export const deleteAllianceApi = (id: any, data?: object) => {
  return http.request<any>("post", `/api/alliances/delete/${id}`, { data });
};

/** 获取信息 */
export function getAllianceDetailApi(params: any) {
  return http.request<any>("get", `/api/alliances/${params._id}`, { params });
};
