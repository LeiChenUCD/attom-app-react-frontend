import { delay } from "@pureadmin/utils";
import { ref, onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  getCensusListApi3,
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
  const isResetMap = ref(false);
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
  const queryTotal = ref(query.total ? Number(query.total) : 100);
  const censustractId = ref(params.censustractId || "0");
  const queryParams = ref({});
  const searchAreaParams = ref(null);
  const zonedcodelocalOptions = ref([
    /*{
      value: "",
      label: "All"
    }*/
  ]);
  const currentRowData = ref({});
  const isResetPoint = ref(false);
  const currentRowIndex = ref(0);
  const columns: Column<any>[] = [
    {
      key: "address",
      title: "address",
      dataKey: "address",
      slotName: "address",
      width: 200,
      sortable: true,
      fixed: true
    },
    {
      key: "lotsize",
      title: "AreaLotSF",
      dataKey: "lotsize",
      sortable: true,
      width: 120
    },
    {
      key: "zoning",
      title: "Zonedcodelocal",
      dataKey: "zoning",
      sortable: true,
      width: 130
    },
    {
      key: "bedrooms",
      title: "Bedroomscount",
      dataKey: "bedrooms",
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
      key: "closeprice",
      title: "Closeprice",
      dataKey: "closeprice",
      sortable: true,
      width: 120
    },
    {
      key: "mlsstatus",
      title: "MLS status",
      dataKey: "mlsstatus",
      sortable: true,
      width: 120
    },
    /*{
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
    }*/
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

  function onCurrentChange(page: number) {}

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
    } else if (params.bedroomsLower) {
      res = true;
    } else if (params.bedroomsUpper) {
      res = true;
    } else if (params.closePriceLower || params.closePriceUpper) {
      res = true;
    } else if (params.lotSizeAreaLower || params.lotSizeAreaUpper) {
      res = true;
    } else if (params.mlsstatus) {
      res = true;
    } else if (params.zoning && params.zoning !== "All") {
      res = true;
    } else if (params.addrFilter) {
      //address
      res = true;
    } else if (searchAreaParams.value) {
      res = true;
    }
    return res;
  }

  function getMlsFilterParams() {
    let res = "";
    const params: any = queryParams.value || {};
    if (
      params.closePriceLower ||
      params.closePriceUpper ||
      params.lotSizeAreaLower ||
      params.lotSizeAreaUpper ||
      params.mlsstatus
    ) {
      let hasFilter = false;
      if (params.closePriceLower && params.closePriceUpper) {
        res += `closeprice>=${params.closePriceLower} and closeprice<=${params.closePriceUpper}`;
        hasFilter = true;
      } else {
        if (params.closePriceLower) {
          res += `closeprice>=${params.closePriceLower}`;
          hasFilter = true;
        }
        if (params.closePriceUpper) {
          if (hasFilter) {
            res += " and ";
          }
          res += `closeprice<=${params.closePriceUpper}`;
          hasFilter = true;
        }
      }

      if (params.lotSizeAreaLower && params.lotSizeAreaUpper) {
        if (hasFilter) {
          res += " and ";
        }
        res += `lotsizearea>=${params.lotSizeAreaLower} and lotsizearea<=${params.lotSizeAreaUpper}`;
      } else {
        if (params.lotSizeAreaLower) {
          if (hasFilter) {
            res += " and ";
          }
          res += `lotsizearea>=${params.lotSizeAreaLower}`;
          hasFilter = true;
        }
        if (params.lotSizeAreaUpper) {
          if (hasFilter) {
            res += " and ";
          }
          res += `lotsizearea<=${params.lotSizeAreaUpper}`;
        }
      }
      if (params.mlsstatus) {
        if (hasFilter) {
          res += " and ";
        }
        res += `mlsstatus='${params.mlsstatus}'`;
      }
    }
    /*if (searchAreaParams.value) {
      res += `&topLat=${searchAreaParams.value.topLat}&bottomLat=${searchAreaParams.value.bottomLat}&leftLong=${searchAreaParams.value.leftLong}&rightLong=${searchAreaParams.value.rightLong}`;
    }*/
    return res;
  }

  function getFilerParams() {
    let res = ""; //"minorcivildivisionname='SAN JOSE'"; //SAN JOSE
    const params: any = queryParams.value || {};

    if (params.citySubset) {
      if (res) {
        res += ` and`;
      }
      res += ` city='${params.citySubset}'`;
    }

    if (params.lotAreaLower) {
      if (res) {
        res += ` and`;
      }
      res += ` lotsize>=${params.lotAreaLower}`;
    }

    if (params.lotAreaUpper) {
      if (res) {
        res += ` and`;
      }
      res += ` lotsize<=${params.lotAreaUpper}`;
    }

    if (params.bathcountLower) {
      if (res) {
        res += ` and`;
      }
      res += ` bathcount>=${params.bathcountLower}`;
    }

    if (params.bathcountUpper) {
      if (res) {
        res += ` and`;
      }
      res += ` bathcount<=${params.bathcountUpper}`;
    }

    if (params.bedroomsLower) {
      if (res) {
        res += ` and`;
      }
      res += ` bedrooms>=${params.bedroomsLower}`;
    }

    if (params.bedroomsUpper) {
      if (res) {
        res += ` and`;
      }
      res += ` bedrooms<=${params.bedroomsUpper}`;
    }

    if (params.zoning && params.zoning !== "All") {
      if (res) {
        res += ` and`;
      }
      res += ` zoning LIKE '%${params.zoning.toUpperCase()}%'`;
    }

    if (params.addrFilter) {
      if (res) {
        res += ` and`;
      }
      res += ` address LIKE '%${params.addrFilter}%' `;
    }

    if (params.closePriceLower) {
      if (res) {
        res += ` and`;
      }
      res += ` closeprice>=${params.closePriceLower}`;
    }

    if (params.closePriceUpper) {
      if (res) {
        res += ` and`;
      }
      res += ` closeprice<=${params.closePriceUpper}`;
    }

    if (params.mlsstatus) {
      if (res) {
        res += " and";
      }
      res += ` mlsstatus='${params.mlsstatus}'`;
    }

    return res;
  }

  async function loadHousesFromATTOMPostgresAll() {
    const params = {
      where: getFilerParams(), //`minorcivildivisionname='SAN JOSE'`,
      //mlsWhere: getMlsFilterParams(),
      maxResultSize: queryTotal.value,
      objectIds: "",
      resultOffset: 0,
      topLat: "",
      bottomLat: "",
      leftLong: "",
      rightLong: "",
      //outFields: `propertyusegroup,propertyaddressfull,fid,"[attom id]"`
      //outFields: `propertyusegroup,propertyaddressfull,fid,"[attom id]",propertylatitude,propertylongitude,arealotsf,bathcount,bedroomscount,censustract,zonedcodelocal,PropertyAddressCity,parcelnumberraw`
      outFields: `bathcount,bedrooms,lotsize,address,city,state,zip,zoning,alphaxheld,fid,lat,lon,mlsstatus,closeprice`
    };

    if (searchAreaParams.value) {
      params.topLat = searchAreaParams.value.topLat;
      params.bottomLat = searchAreaParams.value.bottomLat;
      params.leftLong = searchAreaParams.value.leftLong;
      params.rightLong = searchAreaParams.value.rightLong;
    } else {
      delete params.topLat;
      delete params.bottomLat;
      delete params.leftLong;
      delete params.rightLong;
    }

    const queryString = objectParamsToQueryString(params);
    const houseRes = await getCensusListApi3(queryString, params);
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
        const attomId = item["fid"];
        if (notedATTOMIDSet.has(attomId)) {
          item.noted = true;
        } else {
          item.noted = false;
        }
        if (contactInfo[item.address]) {
          item["haveContactInfo"] = true;
          item["contactInfo"] = contactInfo[item.address] || null;
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

        if (item.address in sellerReply) {
          item["sellerReplyLink"] = sellerReply[item.address][0] || "";
          item["sellerReplyAddr"] = sellerReply[item.address][1] || "";
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

        if (item["zoning"]) {
          const zonedcodelocalItem = {
            value: item["zoning"],
            label: item["zoning"]
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

  function queryDataByCensustractId() {}

  async function initTableData(init: boolean) {
    loading.value = true;
    const loadingData = ElLoading.service({
      lock: true,
      text: "Loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
    /*if (init) {
      await onQueryContactInfo();
    }*/
    //loadingData.setText("Loading 10%");
    if (censustractId.value === "0") {
      if (init || isNeedLoadData()) {
        const housesRes = await queryAllData();
        housesResData.value = housesRes || [];
      }
      /*if (init) {
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
      houses.value = buildHousesList(
        housesResData.value,
        notedATTOMIDSetData.value,
        infoMapData.value,
        theNotesData.value,
        sellerReplyData.value,
        dDPdfsData.value
      );*/
      houses.value = housesResData.value;
      //loadingData.setText("Loading 100%");
      allTableData.value = cloneDeep(houses.value);
      loadingData.close();
      initCurrentRowData();
    } else {
      queryDataByCensustractId();
    }
    isResetMap.value = false;
    setTimeout(() => {
      isResetMap.value = true;
    }, 100);
    loading.value = false;
  }

  async function queryTabelData() {
    await initTableData(false);
    /*let filteredData = allTableData.value;
    const params: any = queryParams.value || {};
    if (params.lotAreaLower) {
      filteredData = filteredData.filter(
        house => Number(house.lotsize) >= params.lotAreaLower
      );
    }

    if (params.lotAreaUpper) {
      filteredData = filteredData.filter(
        house => Number(house.lotsize) <= params.lotAreaUpper
      );
    }

    if (params.bedroomsLower) {
      filteredData = filteredData.filter(
        house => Number(house.bedrooms) >= params.bedroomsLower
      );
    }

    if (params.bedroomsUpper) {
      filteredData = filteredData.filter(
        house => Number(house.bedrooms) <= params.bedroomsUpper
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
        house.address?.toLowerCase().includes(params.addrFilter?.toLowerCase())
      );
    }

    if (params.noteFilter) {
      filteredData = filteredData.filter(house =>
        house.note?.toLowerCase().includes(params.noteFilter.toLowerCase())
      );
    }

    if (params.citySubset && params.citySubset !== "All") {
      filteredData = filteredData.filter(
        house => house.propertyaddresscity === params.citySubset
      );
    }

    if (params.zoning && params.zoning !== "All") {
      filteredData = filteredData.filter(
        house => house.zoning === params.zoning
      );
    }*/

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

    /*if (params.sellerReplyAddr === "With Seller Reply") {
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
    initCurrentRowData();*/
  }

  function onFilerData(params: any) {
    queryParams.value = params;
    searchAreaParams.value = null;
    queryTabelData();
  }

  function initCurrentRowData() {
    if (houses.value?.length > 0) {
      currentRowData.value = houses.value[0];
    } else {
      currentRowData.value = {};
    }
    isResetPoint.value = true;
  }

  function onTableRowIndex(index: number) {
    currentRowIndex.value = index;
    currentRowData.value = houses.value[index];
  }

  function onSearchArea(params: any) {
    searchAreaParams.value = params;
    queryTabelData();
  }

  onMounted(() => {
    initTableData(true);
  });

  return {
    Empty,
    loading,
    columns,
    sortState,
    isResetMap,
    houses,
    currentRowIndex,
    currentRowData,
    isResetPoint,
    pagination,
    zonedcodelocalOptions,
    onCurrentChange,
    onSort,
    onTableRowIndex,
    onFilerData,
    onSearchArea
  };
}
