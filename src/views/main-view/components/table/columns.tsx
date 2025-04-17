import { delay } from "@pureadmin/utils";
import { ref, onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  getCensusListApi2,
  getNotedATTOMID,
  queryContactInfo,
  getPriorityInfoAll,
  getNoteAll,
  getSellerReply,
  getDDPdfs
} from "@/api/welcome";
import type { PaginationProps } from "@pureadmin/table";
import ThumbUp from "@iconify-icons/ri/thumb-up-line";
import Hearts from "@iconify-icons/ri/hearts-line";
import Empty from "./empty.svg?component";
import type { Column } from "element-plus";
import { TableV2SortOrder, ElLoading } from "element-plus";
import type { SortBy } from "element-plus";
import { cloneDeep } from "@pureadmin/utils";
import { objectParamsToQueryString } from "@/utils/common";
import {
  ElButton,
  ElIcon,
  ElLink,
  ElTooltip,
  TableV2FixedDir
} from "element-plus";

export function useColumns() {
  const houses = ref([]);
  const allTableData = ref([]);
  let contactInfo = new Map();
  const infoMapData = ref({});
  const theNotesData = ref({});
  const housesResData = ref([]);
  const notedATTOMIDSetData = ref({});
  const sellerReplyData = ref({});
  const dDPdfsData = ref({});
  const loading = ref(true);
  const route = useRoute();
  const { params, query } = route;
  const censustractId = ref(params.censustractId || "0");
  const queryParams = ref({});
  const zonedcodelocalOptions = ref([
    {
      value: "All",
      label: "All"
    }
  ]);
  const currentRowData = ref({});
  const currentRowIndex = ref(0);
  const columns: Column<any>[] = [
    {
      key: "propertyaddressfull",
      title: "PropertyAddressFull",
      dataKey: "propertyaddressfull",
      slotName: "propertyaddressfull",
      width: 200,
      sortable: true,
      fixed: true
    },
    {
      key: "arealotsf",
      title: "AreaLotSF",
      dataKey: "arealotsf",
      sortable: true,
      width: 120
    },
    {
      key: "zonedcodelocal",
      title: "Zonedcodelocal",
      dataKey: "zonedcodelocal",
      sortable: true,
      width: 130
    },
    {
      key: "bedroomscount",
      title: "Bedroomscount",
      dataKey: "bedroomscount",
      sortable: true,
      width: 130
    },
    {
      key: "bathcount",
      title: "Bathcount",
      dataKey: "bathcount",
      sortable: true,
      width: 120
    },
    {
      key: "priority",
      title: "Priority",
      dataKey: "priority",
      sortable: true,
      width: 120
    },
    {
      key: "sellerReplyAddr",
      title: "Seller Reply",
      dataKey: "sellerReplyAddr",
      width: 300,
      cellRenderer: ({ rowData }) => (
        <ElLink type="primary" target="_blank" href={rowData.sellerReplyLink}>
          {rowData.sellerReplyAddr}
        </ElLink>
      )
    },
    {
      key: "dueDiligence",
      title: "Due Diligence",
      dataKey: "dueDiligence",
      width: 120,
      cellRenderer: ({ rowData }) => (
        <ElLink type="primary" target="_blank" href={rowData.dueDiligenceLink}>
          {rowData.dueDiligence}
        </ElLink>
      )
    }
  ];

  const sortState = ref<SortBy>({
    key: "column-0",
    order: TableV2SortOrder.ASC
  });

  const onSort = (sortBy: SortBy) => {
    houses.value = sortTable(houses.value, sortBy.key, sortBy.order);
    sortState.value = sortBy;
  };

  // 排序函数
  function sortTable(data, field, order = "asc") {
    return data.sort((a, b) => {
      if (a[field] < b[field]) {
        return order === "asc" ? -1 : 1;
      }
      if (a[field] > b[field]) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  /** 分页配置 */
  const pagination = reactive<PaginationProps>({
    pageSize: 10,
    currentPage: 1,
    layout: "prev, pager, next",
    total: 0,
    align: "center"
    //background: true
  });

  function onCurrentChange(page: number) { }

  function isNeedLoadData() {
    let res = true;
    const params: any = queryParams.value || {};
    if (params.lotAreaLower) {
      res = true;
    } else if (params.lotAreaUpper) {
      res = true;
    } else if (params.bathcountLower) {
      res = true;
    } else if (params.bathcountUpper) {
      res = true;
    } else if (params.bedroomscountLower) {
      res = true;
    } else if (params.bedroomscountUpper) {
      res = true;
    } else if (params.zonedcodelocal && params.zonedcodelocal !== "All") {
      res = true;
    } else if (params.addrFilter) {
      //address
      res = true;
    }
    return res;
  }

  function getFilerParams() {
    let res = "minorcivildivisionname='SAN JOSE'";
    const params: any = queryParams.value || {};
    if (params.lotAreaLower) {
      res += ` and arealotsf>=${params.lotAreaLower}`;
    }

    if (params.lotAreaUpper) {
      res += ` and arealotsf<=${params.lotAreaUpper}`;
    }

    if (params.bathcountLower) {
      res += ` and bathcount>=${params.bathcountLower}`;
    }

    if (params.bathcountUpper) {
      res += ` and bathcount<=${params.bathcountUpper}`;
    }

    if (params.bedroomscountLower) {
      res += ` and bedroomscount>=${params.bedroomscountLower}`;
    }

    if (params.bedroomscountUpper) {
      res += ` and bedroomscount<=${params.bedroomscountUpper}`;
    }

    if (params.zonedcodelocal && params.zonedcodelocal !== "All") {
      res += ` and zonedcodelocal='${params.zonedcodelocal}'`;
    }

    if (params.addrFilter) {
      //address
      res += ` and propertyaddressfull LIKE '%${params.addrFilter}%' `;
    }
    return res;
  }

  async function loadHousesFromATTOMPostgresAll() {
    const obj = {
      query: `\
        SELECT \
        PropertyAddressFull, \
        AreaLotSF, \
        PropertyLatitude, \
        PropertyLongitude, \
        "[attom id]", \
        zonedcodelocal, \
        bedroomscount, \
        bathcount, \
        censustract, \
        propertyaddresscity, \
        parcelnumberraw \
    FROM \
        taxassessor \
    where \
        (PropertyAddressCity = 'CAMPBELL' OR PropertyAddressCity = 'LOS ALTOS') \
        AND PropertyAddressFull IS NOT NULL \
        AND AreaLotSF IS NOT NULL \
        AND PropertyLatitude IS NOT NULL \
        AND PropertyLongitude IS NOT NULL \
     `
    };
    const param = JSON.stringify(obj);
    //minorcivildivisionname='SAN JOSE' and arealotsf>8000 and arealotsf<10000 and bathcount=5 and bedroomscount>3 and zonedcodelocal='R1'
    const params = {
      where: getFilerParams(), //`minorcivildivisionname='SAN JOSE'`,
      maxResultSize: 3000,
      objectIds: "",
      resultOffset: 0,
      //outFields: `propertyusegroup,propertyaddressfull,fid,"[attom id]"`
      outFields: `propertyusegroup,propertyaddressfull,fid,"[attom id]",propertylatitude,propertylongitude,arealotsf,bathcount,bedroomscount,censustract,zonedcodelocal,PropertyAddressCity,parcelnumberraw`
      //outFields: `propertyusegroup,propertyaddressfull,fid,"[attom id]",arealotsf,bathcount,bedroomscount,censustract,parcelnumberraw,propertyaddresscity,propertyaddressfull,propertylatitude,propertylongitude,zonedcodeloca`
    };

    const queryString = objectParamsToQueryString(params);
    const houseRes = await getCensusListApi2(queryString, params);
    pagination.total = houseRes?.totalSize || 0;
    return houseRes?.result || [];
  }

  async function getNotedATTOMIDSet() {
    const res = await getNotedATTOMID({});
    const notedATTOMID = res.data.items.map(
      addr => addr.fields.ATTOMID[0].text
    );
    const notedATTOMIDSet = new Set(notedATTOMID);
    return notedATTOMIDSet;
  }

  async function queryAllData() {
    const housesRes = await loadHousesFromATTOMPostgresAll();
    return housesRes;
  }
  /**
   * 
   * // console.log(houseRes)
    // first false: has comments or not
    // second false: has contact info or not
    // 0 house.propertyaddressfull
    // 1 house.arealotsf
    // 2 house.propertylatitude
    // 3 house.propertylongitude
    // 4 have notes - false
    // 5 house['[attom id]']
    // 6 have contact info - false
    // 7 house.zonedcodelocal
    // 8 house.bedroomscount
    // 9 house.bathcount
    // 10 id for greyout / selective house table
    // 11 keep or not (greyout for not keeping)
    // 12 selective house?
    // 13 priority table id
    // 14 priority value
    // 15 note
    // 16 census track
    // 17 link to seller reply
    // 18 address of seller reply
    // 19 apn
    // 20 link to dd
    // 21 house.propertyaddresscity
   */
  function buildHousesList(
    list: any,
    notedATTOMIDSet: any,
    infoMap: any,
    theNotes: any,
    sellerReply: any,
    dDPdfs: any
  ) {
    const res = [];
    if (list?.length > 0) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const attomId = item["[attom id]"];
        if (notedATTOMIDSet.has(attomId)) {
          item.noted = true;
        } else {
          item.noted = false;
        }
        if (contactInfo[item.propertyaddressfull]) {
          item["haveContactInfo"] = true;
          item["contactInfo"] = contactInfo[item.propertyaddressfull] || null;
        } else {
          item["haveContactInfo"] = false;
          item["contactInfo"] = null;
        }

        if (attomId in infoMap) {
          item["priorityTableId"] = infoMap[attomId][0];
          item["priority"] = infoMap[attomId][1];
        } else {
          item["priority"] = 3;
        }

        if (attomId in theNotes) {
          item["note"] = theNotes[attomId];
        }

        if (item.propertyaddressfull in sellerReply) {
          item["sellerReplyLink"] =
            sellerReply[item.propertyaddressfull][0] || "";
          item["sellerReplyAddr"] =
            sellerReply[item.propertyaddressfull][1] || "";
          item["sellerReplyState"] = "matched";
        } else {
          item["sellerReplyLink"] = "";
          item["sellerReplyAddr"] = "";
          item["sellerReplyState"] = "none";
        }

        const files = dDPdfs.data.files.reduce((acc, cur) => {
          acc[cur.name.replace(".pdf", "")] = [cur.url];
          return acc;
        }, {});
        if (item["parcelnumberraw"] in files) {
          item["dueDiligenceLink"] = files[item["parcelnumberraw"]][0] || "";
        } else {
          item["dueDiligenceLink"] = "";
        }

        if (item["dueDiligenceLink"]) {
          item["dueDiligence"] = "matched";
        } else {
          item["dueDiligence"] = "";
        }

        if (item["zonedcodelocal"]) {
          const zonedcodelocalItem = {
            value: item["zonedcodelocal"],
            label: item["zonedcodelocal"]
          };
          let alreadyExists = zonedcodelocalOptions.value.some(
            item => item.value === zonedcodelocalItem.value
          );
          // 如果不存在，则添加到数组中
          if (!alreadyExists) {
            zonedcodelocalOptions.value.push(zonedcodelocalItem);
          }
        }
        res.push(item);
      }
    }
    return res;
  }

  async function onQueryContactInfo() {
    contactInfo = await queryContactInfo({});
  }

  async function onGetPriorityInfoAll() {
    const res = await getPriorityInfoAll({});
    const priorityDict = {};
    for (let item of res.data.items) {
      priorityDict[item.fields.ATTOMID[0].text] = [
        item.record_id,
        item.fields.Priority
      ];
    }
    return priorityDict;
  }

  async function onGetNoteAll() {
    const res = await getNoteAll({});
    const theNotes = res.data.items.reduce((acc, house) => {
      if (!acc[house.fields.ATTOMID[0].text]) {
        acc[house.fields.ATTOMID[0].text] = house.fields.Notes.map(
          note => note.text
        ).join("");
      }
      return acc;
    }, {});
    return theNotes;
  }

  function queryDataByCensustractId() { }

  async function initTableData(init: boolean) {
    loading.value = true;
    const loadingData = ElLoading.service({
      lock: true,
      text: "Loading 0%",
      background: "rgba(0, 0, 0, 0.7)"
    });
    if (init) {
      await onQueryContactInfo();
    }
    loadingData.setText("Loading 10%");
    if (censustractId.value === "0") {
      if (init || isNeedLoadData()) {
        const housesRes = await queryAllData();
        housesResData.value = housesRes || [];
      }
      if (init) {
        notedATTOMIDSetData.value = await getNotedATTOMIDSet();
      }
      loadingData.setText("Loading 20%");
      if (init) {
        infoMapData.value = await onGetPriorityInfoAll();
      }
      loadingData.setText("Loading 40%");
      if (init) {
        theNotesData.value = await onGetNoteAll();
      }
      loadingData.setText("Loading 60%");
      if (init) {
        sellerReplyData.value = await getSellerReply({});
      }
      loadingData.setText("Loading 80%");
      if (init) {
        dDPdfsData.value = await getDDPdfs({});
      }

      loadingData.setText("Loading 100%");
      houses.value = buildHousesList(
        housesResData.value,
        notedATTOMIDSetData.value,
        infoMapData.value,
        theNotesData.value,
        sellerReplyData.value,
        dDPdfsData.value
      );
      //houses.value = res.housesRes;
      allTableData.value = cloneDeep(houses.value);
      loadingData.close();
      initCurrentRowData();
    } else {
      queryDataByCensustractId();
    }
    loading.value = false;
  }

  async function onFilerData(params: any) {
    queryParams.value = params;
    await initTableData(false);
    let filteredData = allTableData.value;
    if (params.lotAreaLower) {
      filteredData = filteredData.filter(
        house => house.arealotsf >= params.lotAreaLower
      );
    }

    if (params.lotAreaUpper) {
      filteredData = filteredData.filter(
        house => house.arealotsf <= params.lotAreaUpper
      );
    }

    if (params.bedroomscountLower) {
      filteredData = filteredData.filter(
        house => house.bedroomscount >= params.bedroomscountLower
      );
    }

    if (params.bedroomscountUpper) {
      filteredData = filteredData.filter(
        house => house.bedroomscount <= params.bedroomscountUpper
      );
    }

    if (params.bathcountLower) {
      filteredData = filteredData.filter(
        house => house.bathcount >= params.bathcountLower
      );
    }

    if (params.bathcountUpper) {
      filteredData = filteredData.filter(
        house => house.bathcount <= params.bathcountUpper
      );
    }

    if (params.priorityLower) {
      filteredData = filteredData.filter(
        house => house.priority >= params.priorityLower
      );
    }

    if (params.priorityUpper) {
      filteredData = filteredData.filter(
        house => house.priority <= params.priorityUpper
      );
    }

    if (params.addrFilter) {
      filteredData = filteredData.filter(house =>
        house.propertyaddressfull
          ?.toLowerCase()
          .includes(params.addrFilter?.toLowerCase())
      );
    }

    if (params.noteFilter) {
      filteredData = filteredData.filter(house =>
        house.note?.toLowerCase().includes(params.noteFilter.toLowerCase())
      );
    }

    if (params.citySubset !== "All") {
      filteredData = filteredData.filter(
        house => house.propertyaddresscity === params.citySubset
      );
    }

    if (params.zonedcodelocal !== "All") {
      filteredData = filteredData.filter(
        house => house.zonedcodelocal === params.zonedcodelocal
      );
    }

    /*if (keptSubset === "Kept Houses") {
        filteredData = filteredData.filter(house => house[11] === true)
    } else if (keptSubset === "Eliminated Houses") {
        filteredData = filteredData.filter(house => house[11] === false)
    }*/

    /*if (selectiveSubset === "Selective Houses") {
        filteredData = filteredData.filter(house => house[12] === true)
    } else if (selectiveSubset === "Non-Selective Houses") {
        filteredData = filteredData.filter(house => house[12] === false)
    }*/

    if (params.sellerReplyAddr === "With Seller Reply") {
      filteredData = filteredData.filter(
        house => house.sellerReplyAddr && house.sellerReplyAddr !== ""
      );
    } else if (params.sellerReplyAddr === "Without Seller Reply") {
      filteredData = filteredData.filter(house => house.sellerReplyAddr === "");
    }

    if (params.dueDiligence === "With Due Diligence") {
      filteredData = filteredData.filter(house => house.dueDiligence !== "");
    } else if (params.dueDiligence === "Without Due Diligence") {
      filteredData = filteredData.filter(house => house.dueDiligence === "");
    }

    if (params.noted === "Noted Addresses") {
      filteredData = filteredData.filter(house => house.noted === true);
    } else if (params.noted === "Not Noted Addresses") {
      filteredData = filteredData.filter(house => house.noted === false);
    }

    if (params.contactInfo === "With Contact Info") {
      filteredData = filteredData.filter(
        house => house.haveContactInfo === true
      );
    } else if (params.contactInfo === "Without Contact Info") {
      filteredData = filteredData.filter(
        house => house.haveContactInfo === false
      );
    }
    houses.value = filteredData;
    initCurrentRowData();
  }

  function initCurrentRowData() {
    if (houses.value?.length > 0) {
      currentRowData.value = houses.value[0];
    } else {
      currentRowData.value = {};
    }
  }

  function onTableRowIndex(index: number) {
    currentRowIndex.value = index;
    currentRowData.value = houses.value[index];
  }

  onMounted(() => {
    initTableData(true);
  });

  return {
    Empty,
    loading,
    columns,
    sortState,
    houses,
    currentRowIndex,
    currentRowData,
    pagination,
    zonedcodelocalOptions,
    onCurrentChange,
    onSort,
    onTableRowIndex,
    onFilerData
  };
}
