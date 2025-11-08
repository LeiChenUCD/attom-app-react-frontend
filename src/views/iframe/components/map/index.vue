<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import L from "leaflet";
import { CloseBold } from "@element-plus/icons-vue";
//import * as L from 'leaflet';
import "proj4leaflet";
import "leaflet.markercluster";
import { wmsApiBaseUrl } from "@/api/base";

defineOptions({
  name: "MapComponent"
});
const props = defineProps({
  houses: {
    type: Array,
    default: () => {
      return [];
    }
  },
  detailData: {
    type: Object,
    default: () => {
      return {};
    }
  },
  isResetPoint: {
    type: Boolean,
    default: false
  },
  isSearch: {
    type: Boolean,
    default: false
  }
});
const mapContainer = ref(null);
const activePopover = reactive({
  show: false,
  placement: "top",
  width: 240,
  virtualRef: null,
  data: null
});
const offsetTop = ref(0);
const filterStyle = ref({
  position: "relative",
  top: 0 + "px"
});
const emit = defineEmits(["onRowIndex", "onSearchArea", "onViewDetail"]);
let mapCom = null;
const zoomLevel = ref(10);
const isShowSearchBtnArea = ref(false);
const minZoomLevel = ref(3);
const maxZoomLevel = ref(18);
let secondaryPointsLayers = [];
let currentClickedMarker;
const currentPoint = ref();
let currentMarker;
let pointMarkers;

let currentWMSLayer: L.TileLayer | null = null;

const wmsBaseUrl = `${wmsApiBaseUrl}/geoserver/mygis/wms`;
const wsmLayerService = {
  opportunityZone: {
    layerName: "mygis:SJ_OpportunityZone",
    layerTitle: "Opportunity Zone",
    options: {
      bbox: "5524887.424340556,219826.4230909512,8370883.153681659,3658602.321874021",
      srs: "EPSG:2227"
    }
  },
  caSuperfund: {
    layerName: "mygis:CA_superfund",
    layerTitle: "CA_superfund",
    options: { bbox: "-124.2317,33.3066,-115.8647,43.048", srs: "EPSG:4326" }
  },
  powerline: {
    layerName: "mygis:US_powerline",
    layerTitle: "Powerline",
    options: {
      bbox: "-159.779336177,13.44758099999999,144.8234994919999,65.01721",
      srs: "EPSG:4326"
    }
  },
  floodZone: {
    layerName: "mygis:SJ_flood_hazard_area",
    layerTitle: "Flood Zone",
    key: "floodZone",
    options: {
      bbox: "6066842.12822391,1785331.943761736,6354963.577898502,2001812.617098733",
      srs: "EPSG:2227"
    }
  },
  noise2018: {
    layerName: "mygis:CA_rail_road_and_aviation_noise_2018",
    layerTitle: "CONUS_rail_road_and_aviation_noise_2018",
    options: {
      bbox: "-2353800.0,1242090.0,-1647060.0,2452830.0",
      srs: "EPSG:5070"
    }
  },
  fireRisk: {
    layerName: "mygis:fhszs06_3",
    layerTitle: "Fire Fhszs06_3",
    options: {
      bbox: "-373976.29890000075,-602050.9533000002,375097.69239999907,450029.8724000008",
      srs: "EPSG:3310"
    }
  },
  liquefaction: {
    layerName: "mygis:liquefaction_union",
    layerTitle: "Liquefaction Union",
    options: {
      bbox: "571743.9400000004,4122848.8000000007,610812.9400000004,4147033.6981000006",
      srs: "EPSG:26710"
    }
  },
  /*medianIncome: {
    layerName: "mygis:tl_2024_us_zcta520",
    layerTitle: "Median Income",
    options: {
      bbox: "-176.696692,-14.373776,145.830505,71.341324",
      srs: "EPSG:4269"
    }
  },*/
  medianIncome: {
    layerName: "mygis:tl_2024_ca_B07011_zcta520", // 更新为新的图层名称
    layerTitle: "Median Income", // 更新标题表明是加州范围
    options: {
      bbox: "-124.409591,32.534189,-114.22195,42.009503", // 加州地理范围
      srs: "EPSG:4269" // NAD83地理坐标系
    }
  },
  sjZoning: {
    layerName: "mygis:SJ_zone",
    layerTitle: "San Jose Zoning",
    options: {
      bbox: "5823176.279241634,1724173.2793831213,7344103.223655108,2456022.576740115",
      srs: "EPSG:2227"
    }
  }
};

const currentWms = ref("opportunityZone");
const wmsOptions = ref([
  {
    value: "opportunityZone",
    label: wsmLayerService["opportunityZone"].layerTitle
  },
  {
    value: "caSuperfund",
    label: wsmLayerService["caSuperfund"].layerTitle
  },
  {
    value: "powerline",
    label: wsmLayerService["powerline"].layerTitle
  },
  {
    value: "floodZone",
    label: wsmLayerService["floodZone"].layerTitle
  },
  {
    value: "noise2018",
    label: wsmLayerService["noise2018"].layerTitle
  },
  {
    value: "fireRisk",
    label: wsmLayerService["fireRisk"].layerTitle
  },
  {
    value: "liquefaction",
    label: wsmLayerService["liquefaction"].layerTitle
  },
  {
    value: "medianIncome",
    label: wsmLayerService["medianIncome"].layerTitle
  },
  {
    value: "sjZoning",
    label: wsmLayerService["sjZoning"].layerTitle
  }
]);

// 定义 EPSG:2227 投影
/*const crs2227 = new L.Proj.CRS(
  "EPSG:2227",
  "+proj=lcc +lat_1=36.5 +lat_2=35.46666666666667 +lat_0=34.83333333333334 +lon_0=-120.5 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs",
  {
    resolutions: [
      2116.670900008467, 1058.3354500042335, 529.1677250021168,
      264.5838625010584, 132.2919312505292, 66.1459656252646, 33.0729828126323,
      16.53649140631615, 8.268245703158075, 4.134122851579037,
      2.0670614257895186, 1.0335307128947593, 0.5167653564473796,
      0.2583826782236898, 0.1291913391118449, 0.06459566955592245,
      0.03229783477796123, 0.016148917388980614, 0.008074458694490307,
      0.004037229347245154, 0.002018614673622577, 0.0010093073368112884
    ],
    origin: [0, 0],
    bounds: L.bounds([2000000, 500000], [2500000, 1000000]) // 示例范围，需调整
  }
);*/

const crs2227 = new L.Proj.CRS(
  "EPSG:2227",
  "+proj=lcc +lat_1=36.5 +lat_2=35.46666666666667 +lat_0=34.83333333333334 +lon_0=-120.5 +x_0=2000000.0001016 +y_0=500000.0001016 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs +units=us-ft",
  {
    resolutions: [
      2116.670900008467, 1058.3354500042335, 529.1677250021168,
      264.5838625010584, 132.2919312505292, 66.1459656252646, 33.0729828126323,
      16.53649140631615, 8.268245703158075, 4.134122851579037,
      2.0670614257895186, 1.0335307128947593, 0.5167653564473796,
      0.2583826782236898, 0.1291913391118449, 0.06459566955592245,
      0.03229783477796123, 0.016148917388980614, 0.008074458694490307,
      0.004037229347245154, 0.002018614673622577, 0.0010093073368112884
    ],
    origin: [2000000, 500000], // 假东/假北原点
    bounds: L.bounds([2000000, 500000], [2500000, 1000000]) // 示例范围
  }
);

const loadWMSLayer2 = () => {
  const wsmData = wsmLayerService[currentWms.value];
  if (!wsmData) {
    if (currentWMSLayer) {
      mapCom?.removeLayer(currentWMSLayer);
      currentWMSLayer = null;
    }
    return;
  }

  const layerName = wsmData.layerName;
  const layerTitle = wsmData.layerTitle;
  const options = wsmData.options;

  if (currentWMSLayer) {
    mapCom?.removeLayer(currentWMSLayer);
    currentWMSLayer = null;
  }

  // 为不同CRS的图层设置不同参数
  let layerOptions = {
    layers: layerName,
    format: "image/png",
    transparent: true,
    version: "1.1.1",
    attribution: `WMS Layer: ${layerTitle}`,
    crs: null,
    srs: ""
  };

  // 根据图层CRS设置不同参数
  if (options.srs === "EPSG:2227") {
    layerOptions.crs = crs2227;
    layerOptions.srs = "EPSG:2227";
  } else if (options.srs === "EPSG:4269") {
    layerOptions.crs = L.CRS.EPSG4326; // Leaflet使用EPSG:4326
    layerOptions.srs = "EPSG:4326"; // 请求WMS使用4326
  } else {
    layerOptions.crs = L.CRS.EPSG3857;
  }

  //currentWMSLayer = L.tileLayer.wms(wmsBaseUrl, layerOptions);

  currentWMSLayer = L.tileLayer.wms(wmsBaseUrl, {
    layers: layerName,
    format: "image/png",
    transparent: true,
    crs: L.CRS.EPSG3857,
    srs: "EPSG:3857", // 强制使用Web Mercator
    version: "1.1.1",
    attribution: `WMS Layer: ${layerTitle}`
  });

  if (mapCom) {
    //currentWMSLayer.addTo(mapCom);

    // 如果是EPSG:2227图层，设置合适的地图视图
    if (wsmData.key !== "floodZone" && options.srs === "EPSG:2227") {
      const [minX, minY, maxX, maxY] = options.bbox.split(",").map(Number);
      const southWest = crs2227.projection.unproject(L.point(minX, minY));
      const northEast = crs2227.projection.unproject(L.point(maxX, maxY));
      mapCom.fitBounds(L.latLngBounds(southWest, northEast));

      /*
      // 设置地图视图
      mapCom.fitBounds(L.latLngBounds(southWest, northEast), {
        padding: [50, 50], // 添加边距
        maxZoom: 15 // 限制最大缩放级别
      });*/
    } else if (options.srs === "EPSG:4269") {
      // 调整视图到加州范围
      mapCom.fitBounds([
        [32.534189, -124.409591], // 西南角
        [42.009503, -114.22195] // 东北角
      ]);
    }
  }
};

const loadWMSLayer = () => {
  const wsmData = wsmLayerService[currentWms.value];
  if (!wsmData) {
    if (currentWMSLayer) {
      mapCom?.removeLayer(currentWMSLayer);
      currentWMSLayer = null;
    }
    return;
  }

  const layerName = wsmData.layerName;
  const layerTitle = wsmData.layerTitle;
  const options = wsmData.options;

  if (currentWMSLayer) {
    mapCom?.removeLayer(currentWMSLayer);
    currentWMSLayer = null;
  }

  // 移除 bbox 参数，Leaflet 会自动计算
  currentWMSLayer = L.tileLayer.wms(wmsBaseUrl, {
    layers: layerName,
    format: "image/png",
    transparent: true,
    crs: L.CRS.EPSG3857, // 或根据服务调整
    version: "1.1.1", // 明确指定版本
    attribution: `WMS Layer: ${layerTitle}`
  });

  if (mapCom) {
    currentWMSLayer.addTo(mapCom);

    // 可能需要调整地图视图以适应图层范围
    // 您可以使用 options.bbox 来设置地图视图
    /*const [minX, minY, maxX, maxY] = options.bbox.split(",").map(Number);
    mapCom.fitBounds([
      [minY, minX], // 西南角
      [maxY, maxX] // 东北角
    ]);*/
  }
};

// 高亮图标
/*const highlightIcon = L.icon({
  iconUrl: "marker-cur.svg", // 图标路径
  iconSize: [50, 50], // 图标大小
  popupAnchor: [5, -90],
  iconAnchor: [22, 94] // 图标锚点
  //popupAnchor: [-3, -56] // 弹出框锚点
});*/

const highlightIcon = L.icon({
  iconUrl: "marker-cur.svg",
  iconSize: [50, 50], // 图标尺寸 [width, height]
  iconAnchor: [25, 50], // 调整锚点（假设图标底部中心是 [25,50]）
  popupAnchor: [0, -50] // 调整弹出框位置（相对于 iconAnchor）
});

// 灰色图标
const grayIcon = L.icon({
  iconUrl: "location-sky.svg", // 灰色图标路径
  iconSize: [50, 50], // 图标大小
  iconAnchor: [25, 50],
  popupAnchor: [0, -50]
});

// 灰色图标
const skyIcon = L.icon({
  iconUrl: "location-green.svg", // 灰色图标路径
  iconSize: [50, 50], // 图标大小
  iconAnchor: [25, 50], // 假设是底部居中的指针图标
  popupAnchor: [0, -50] // 弹窗出现在图标正上方
});

function onChangeWms() {
  loadWMSLayer2();
}

function initMap() {
  if (mapContainer.value) {
    // 初始化地图
    //const map = L.map(mapContainer.value).setView([51.505, -0.09], 13);

    //定义图层样式
    var layer = L.tileLayer(
      "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}"
    );
    //创建地图
    mapCom = L.map(mapContainer.value, {
      center: [51.505, -0.09], //中心坐标
      zoom: zoomLevel.value, //缩放级别
      minZoom: minZoomLevel.value,
      maxZoom: maxZoomLevel.value,
      zoomControl: true, //缩放组件
      attributionControl: false, //去掉右下角logol
      layers: [layer] //图层
    });

    // 添加OpenStreetMap瓦片层
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapCom);
  } else {
    console.error("Map container not found!");
  }
  onMapMove();
}

function onMapMove() {
  // 监听地图移动（拖拽或缩放）事件
  let timeoutID;
  isShowSearchBtnArea.value = false;
  mapCom.on("moveend", function () {
    isShowSearchBtnArea.value = true;
    // 清除之前的定时器（如果存在）
    if (timeoutID) {
      clearTimeout(timeoutID);
      timeoutID = null;
    }

    timeoutID = setTimeout(() => {
      isShowSearchBtnArea.value = false;
    }, 15000);
  });
}

function onSearchThisArea() {
  const bounds = mapCom?.getBounds();
  // 获取四个角的经纬度
  const topLat = bounds.getNorth(); // 最北纬度（上边界）
  const bottomLat = bounds.getSouth(); // 最南纬度（下边界）
  const leftLong = bounds.getWest(); // 最西经度（左边界）
  const rightLong = bounds.getEast(); // 最东经度（右边界）

  isShowSearchBtnArea.value = false;
  emit("onSearchArea", {
    topLat,
    bottomLat,
    leftLong,
    rightLong
  });
}

function isBetween(num, boundA, boundB) {
  return (boundA >= num && boundB <= num) || (boundA <= num && boundB >= num);
}

function getNortheastLatitude(houses) {
  if (!houses || houses.length === 0) {
    return 0;
  }

  let maxLatitude = houses[0]["lat"]; // Assuming houses are in [lat, long] format

  // Iterate through the list of houses
  for (let i = 1; i < houses.length; i++) {
    const latitude = houses[i]["lat"];
    if (latitude > maxLatitude) {
      maxLatitude = latitude;
    }
  }

  return maxLatitude;
}

function getNortheastLongitude(houses) {
  if (!houses || houses.length === 0) {
    return 0;
  }

  let maxLongitude = houses[0]["lon"]; // Assuming houses are in [lat, long] format

  // Iterate through the list of houses
  for (let i = 1; i < houses.length; i++) {
    const longitude = houses[i]["lon"];
    if (longitude > maxLongitude) {
      maxLongitude = longitude;
    }
  }

  return maxLongitude;
}

function getSouthwestLatitude(houses) {
  if (!houses || houses.length === 0) {
    return 0;
  }

  let minLatitude = houses[0]["lat"]; // Assuming houses are in [lat, long] format

  // Iterate through the list of houses
  for (let i = 1; i < houses.length; i++) {
    const latitude = houses[i]["lat"];
    if (latitude < minLatitude) {
      minLatitude = latitude;
    }
  }

  return minLatitude;
}

function getSouthwestLongitude(houses) {
  if (!houses || houses.length === 0) {
    return 0;
  }

  let minLongitude = houses[0]["lon"]; // Assuming houses are in [lat, long] format

  // Iterate through the list of houses
  for (let i = 1; i < houses.length; i++) {
    const longitude = houses[i]["lon"];
    if (longitude < minLongitude) {
      minLongitude = longitude;
    }
  }

  return minLongitude;
}

// Function to check the correct direction
function isNotRightTurn(a, b, c) {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) <= 0;
}

function convexHull(points) {
  if (points.length < 3) {
    return points;
  }

  points.sort((a, b) => (a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]));

  const upper = [];
  const lower = [];

  for (const point of points) {
    while (
      upper.length >= 2 &&
      isNotRightTurn(upper[upper.length - 2], upper[upper.length - 1], point)
    ) {
      upper.pop();
    }
    upper.push(point);
  }

  for (let i = points.length - 1; i >= 0; i--) {
    const point = points[i];
    while (
      lower.length >= 2 &&
      isNotRightTurn(lower[lower.length - 2], lower[lower.length - 1], point)
    ) {
      lower.pop();
    }
    lower.push(point);
  }

  // lower.push(upper[0])

  const hull = new Set([...upper, ...lower]);
  return Array.from(hull);
}

function addCurrentPoint(data: any, isMax: boolean) {
  if (!data.lat) {
    return;
  }
  // 添加标记
  /*currentMarker = L.marker([data.lat, data.lon], {
    icon: highlightIcon,
    title: data.address //鼠标hover显示
  }).addTo(mapCom);*/
  currentMarker = L.marker([data.lat, data.lon], {
    icon: createCustomMarkerIcon(data),
    riseOnHover: true,
    title: data.address
  });
  //secondaryPointsLayers.push(currentMarker);

  // 缩放到最大级别（maxZoom）
  if (isMax || props.isSearch) {
    mapCom.setView([data.lat, data.lon], mapCom.getMaxZoom());
  } else {
    mapCom.setView([data.lat, data.lon], zoomLevel.value);
  }
  // 自动定位到标记的位置
  //mapCom.setView(marker.getLatLng(), zoomLevel.value);
  mapCom.panTo([data.lat, data.lon]);
  if (!currentMarker.isPopupOpen()) {
    currentMarker.openPopup();
  }
}

const openPopoverAtMarker = (markerData, event) => {
  // 关闭之前的 popover
  closeAllPopovers();

  // 设置虚拟引用（使用 Leaflet 的坐标转像素方法）
  activePopover.virtualRef = {
    getBoundingClientRect: () => {
      // 将经纬度转换为地图容器上的像素坐标
      const latLng = L.latLng(markerData.lat, markerData.lon); // Leaflet 的经纬度对象
      const point = mapCom.latLngToContainerPoint(latLng); // 转换为像素坐标

      // 获取地图容器的边界矩形
      const mapRect = mapCom.getContainer().getBoundingClientRect();

      return {
        width: 0,
        height: 0,
        top: mapRect.top + point.y - 10, // 像素 Y 坐标 + 地图容器顶部偏移
        left: mapRect.left + point.x, // 像素 X 坐标 + 地图容器左侧偏移
        right: mapRect.left + point.x,
        bottom: mapRect.top + point.y
      };
    }
  };

  activePopover.data = markerData;
  setTimeout(() => {
    activePopover.show = true;
  }, 300);
};

const closeAllPopovers = () => {
  activePopover.show = false;
  activePopover.data = null;
};

function clearAllMarkers() {
  // 遍历并删除所有次点图层
  /*secondaryPointsLayers.forEach(function (layer) {
    mapCom.removeLayer(layer);
  });*/
  if (pointMarkers) {
    mapCom.removeLayer(pointMarkers); // 直接移除聚类组
    // 确保所有 marker 都被移除
    secondaryPointsLayers.forEach(marker => {
      if (mapCom.hasLayer(marker)) {
        mapCom.removeLayer(marker);
      }
    });
    secondaryPointsLayers = [];
    currentClickedMarker = null; // 清除高亮标记引用
  }
}

function initData() {
  isShowSearchBtnArea.value = false;
  if (!mapCom) {
    return;
  }
  clearAllMarkers();
  if (props.houses?.length > 0) {
    const top = getNortheastLatitude(props.houses);
    const right = getNortheastLongitude(props.houses);
    const bottom = getSouthwestLatitude(props.houses);
    const left = getSouthwestLongitude(props.houses);
    const center = [props.houses[0]["lat"], props.houses[0]["lon"]];
    //mapCom.value.setView([center[0], center[1]], zoomLevel);
    //mapCom.panTo([center[0], center[1]]);
    const houseList: any = props.houses;
    let index = houseList.findIndex(
      item => item.lat !== null && item.lat !== undefined
    );
    index = index || 0;
    currentPoint.value = props.houses[index];
    currentPoint.value.lat
      ? mapCom.panTo([currentPoint.value.lat, currentPoint.value.lon])
      : null;
    buildAllPoints(props.houses);
    /*const subsetOnMap = props.houses.filter(house => {
      return isBetween(house['lat'], top, bottom) && isBetween(house['lon'], left, right)
    }).filter(house => {
      return !(house['lat'] === center[0] && house['lon'] === center[1])
    })
    
    const points = subsetOnMap.map((house, idx) => [house['lat'], house['lon']]);
    const polygon = L.polygon(points, {color: '#aa0000',fillColor:'#ff15c9',
	              weight:1}).addTo(mapCom);
                */
    // 为每个点绑定点击事件
    bindMarkerEvent();
    addCurrentPoint(props.houses[0], false);
  }
}

function bindMarkerEvent() {
  /*secondaryPointsLayers.forEach(marker => {
    marker.on("click", function () {
      resetAllMarkers(true);
      currentClickedMarker = marker;
      // 将当前点击的点的图标设置为高亮
      marker.setIcon(highlightIcon);
      if (!marker.isPopupOpen()) {
        marker.openPopup();
      }
      const latLng = marker.getLatLng();
      const curHouseIndex = getCurHouseIndex(latLng, props.houses);
      emit("onRowIndex", curHouseIndex);
    });
  });*/
  if (secondaryPointsLayers?.length > 0) {
    for (let i = 0; i < secondaryPointsLayers.length; i++) {
      const marker = secondaryPointsLayers[i];
      marker.on("click", function (e) {
        //resetAllMarkers(true);
        currentClickedMarker = marker;
        // 将当前点击的点的图标设置为高亮
        //marker.setIcon(highlightIcon);
        if (!marker.isPopupOpen()) {
          marker.openPopup();
        }
        // const latLng = marker.getLatLng();
        // const curHouseIndex = getCurHouseIndex(latLng, props.houses);
        openPopoverAtMarker(props.houses[i], e);
        emit("onRowIndex", i);
      });
    }
  }
}

function getCurHouseIndex(latLng: any, list: any) {
  let res = 0;
  if (latLng && list?.length > 0) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (latLng.lat === item.lat && latLng.lng === item.lon) {
        res = i;
        break;
      }
    }
  }
  return res;
}

function buildAllPoints(list: any) {
  secondaryPointsLayers = [];
  pointMarkers = L.markerClusterGroup();
  if (list?.length > 0) {
    //const points = [];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.lat) {
        const point = [item.lat, item.lon];
        let layer;
        if (currentPoint.value["fid"] !== item["fid"]) {
          //points.push(point);
          let icon = grayIcon;
          if (item["alphaxheld"]) {
            icon = skyIcon;
          }
          /*layer = L.marker(point, { icon: icon }).bindPopup(item.address, {
            permanent: true, // 是否永久显示（false 表示鼠标悬停时显示）
            direction: "top" // 提示框显示的方向（top, bottom, left, right）
            //offset: [0, -65], //偏移量
            //opacity: 0.9 // 提示框的透明度
          });*/
          layer = L.marker([item.lat, item.lon], {
            icon: createCustomMarkerIcon(item),
            riseOnHover: true,
            title: item.address
          });
        } else {
          layer = L.marker([item.lat, item.lon], {
            icon: createCustomMarkerIcon(item),
            riseOnHover: true,
            title: item.address
          });

          /*layer = L.marker(point, { icon: highlightIcon }).bindPopup(
            item.address,
            {
              permanent: true, // 是否永久显示（false 表示鼠标悬停时显示）
              direction: "top" // 提示框显示的方向（top, bottom, left, right）
              //offset: [0, -65], //偏移量
              //opacity: 0.9 // 提示框的透明度
            }
          );*/
        }
        secondaryPointsLayers.push(layer);
        pointMarkers.addLayer(layer);
      }
    }
    pointMarkers.addTo(mapCom);
    //画多边形
    /*const polygon = L.polygon(points, {color: '#aa0000',fillColor:'#ff15c9',
	              weight:1}).addTo(mapCom);*/
    // 添加 GeoServer WMS 图层
    //rendWmsLayer();
    loadWMSLayer2();
  }
}

// Function to format price for marker display (remains unchanged, used by map markers)
function formatPriceForMarker(price) {
  if (price === null || isNaN(price)) return "";
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`;
  } else if (price >= 1000) {
    return `$${(price / 1000).toFixed(0)}K`;
  }
  return `$${price}`;
}

// Custom marker icon creator (remains unchanged)
function createCustomMarkerIcon(property) {
  const status = property?.mlsstatus;
  const price =
    status === "Active" || status === "PendingDoNotShow"
      ? property.listprice
      : property.closeprice;
  const formattedPrice = formatPriceForMarker(price);
  return L.divIcon({
    className: "price-marker",
    html: formattedPrice,
    iconSize: [65, 32],
    iconAnchor: [32, 16],
    popupAnchor: [0, -16]
  });
}

function rendWmsLayer() {
  var wmsLayer = L.tileLayer
    .wms("http://162.235.126.57/geoserver/mygis/wms", {
      layers:
        "mygis:ust_oppo_fund_potential_sites__ust_cleanup_fund_potential_sites",
      format: "image/png",
      transparent: true,
      styles: "", // 应用自定义 SLD 样式
      attribution: "GeoServer WMS"
    })
    .addTo(mapCom);
  wmsLayer.setZIndex(999);
}

function resetAllMarkers(isClick: boolean) {
  // 将所有点的图标设置为灰色
  /*secondaryPointsLayers.forEach(m => {
    const latLng = m.getLatLng();
    m.setZIndexOffset(1);
    if (m.isPopupOpen()) {
      m.closePopup();
    }
    if (latLng.lat === currentPoint.value.lat && latLng.lng === currentPoint.value.lon) {
      if (isClick) {
        m.setIcon(grayIcon);
      } else {
        m.setZIndexOffset(999999);
        m.setIcon(highlightIcon);
        mapCom.panTo([currentPoint.value.lat, currentPoint.value.lon]);
        if (!m.isPopupOpen()) {
          m.openPopup();
        }
      }
    } else {
      m.setIcon(grayIcon);
    }
  });*/
  if (secondaryPointsLayers?.length > 0) {
    for (let i = 0; i < secondaryPointsLayers.length; i++) {
      const m = secondaryPointsLayers[i];
      const house: any = props.houses[i];
      if (house?.alphaxheld) {
        //m.setIcon(skyIcon);
      } else {
        //m.setIcon(grayIcon);
      }
      m.closePopup();
    }
  }
}

function getElemTop() {
  setTimeout(() => {
    // 对于元素
    const elements = document.getElementsByClassName("el-scrollbar__wrap");
    const filter = document.getElementById("filter-main-box");
    if (filter && elements?.length > 1) {
      elements[1].addEventListener("scroll", function () {
        offsetTop.value = this.scrollTop - filter.offsetHeight - 60;
        if (window.innerWidth <= 760) {
          const overviewBox = document.getElementById("overview-main-box");
          const tableBox = document.getElementById("table-main-box");
          offsetTop.value =
            offsetTop.value -
            overviewBox?.offsetHeight -
            tableBox?.offsetHeight -
            35;
        }
        if (offsetTop.value > 0) {
          filterStyle.value = {
            position: "absolute",
            top: offsetTop.value + "px"
          };
        } else {
          filterStyle.value = {
            position: "relative",
            top: "0px"
          };
        }
      });
    }
  }, 100);
}

function onShowViewDetail() {
  emit("onViewDetail", props.detailData);
}

onMounted(() => {
  getElemTop();
  initMap();
  //initData();
});

watch(
  () => props.houses,
  val => {
    initData();
  },
  {
    deep: true,
    immediate: true
  }
);

watch(
  () => props.detailData,
  () => {
    if (props.isResetPoint) {
      isShowSearchBtnArea.value = false;
      currentPoint.value = props.detailData;
      clearAllMarkers();
      buildAllPoints(props.houses);
      addCurrentPoint(currentPoint.value, true);
      // 为每个点绑定点击事件
      bindMarkerEvent();
      //resetAllMarkers(false);
    }
  },
  {
    deep: true
  }
);
</script>

<template>
  <div class="map-com" :class="{ 'map-com-fix': offsetTop > 0 }">
    <!--div class="map-filter-box" :style="filterStyle">
      <span>WMS:</span>
      <el-select-v2
        v-model="currentWms"
        filterable
        :options="wmsOptions"
        :props="{
          label: 'label',
          value: 'value'
        }"
        clearable
        placeholder="Please select wms"
        style="width: 400px"
        @change="onChangeWms"
      />
    </div-->
    <div ref="mapContainer" class="map-container" />
    <!--el-button
      v-if="isShowSearchBtnArea"
      type="primary"
      class="btn-search-area"
      @click="onSearchThisArea()"
      >Search this area</el-button
  -->
    <el-popover
      v-model:visible="activePopover.show"
      :placement="activePopover.placement"
      :width="activePopover.width"
      :trigger="null"
      popper-class="dynamic-popover"
      :virtual-ref="activePopover.virtualRef"
      virtual-triggering
    >
      <div class="popover-content">
        <h4 class="title">{{ activePopover.data?.title }}</h4>
        <div class="address">{{ activePopover.data?.address }}</div>
        <div class="price">
          <span
            v-if="
              activePopover.data?.mlsstatus == 'Active' ||
              activePopover.data?.mlsstatus == 'PendingDoNotShow'
            "
            >${{ activePopover.data?.listprice }}</span
          >
          <span v-else>${{ activePopover.data?.closeprice }}</span>
        </div>
        <div class="bed-bath">
          <svg
            data-v-4a17f7ac=""
            data-v-1d2a0c97=""
            data-insp-path="D:/project/attom-app-react-frontend/src/views/iframe/components/overview/index.vue:181:15:svg"
            t="1755761273208"
            class="icon"
            viewBox="0 0 1280 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="6052"
            width="20"
            height="20"
          >
            <path
              data-v-4a17f7ac=""
              data-v-1d2a0c97=""
              data-insp-path="D:/project/attom-app-react-frontend/src/views/iframe/components/overview/index.vue:181:187:path"
              d="M352 512c88.22 0 160-71.78 160-160s-71.78-160-160-160-160 71.78-160 160 71.78 160 160 160z m704-256H608c-17.68 0-32 14.32-32 32v288H128V160c0-17.68-14.32-32-32-32H32C14.32 128 0 142.32 0 160v704c0 17.68 14.32 32 32 32h64c17.68 0 32-14.32 32-32v-96h1024v96c0 17.68 14.32 32 32 32h64c17.68 0 32-14.32 32-32V480c0-123.72-100.28-224-224-224z"
              p-id="6053"
            />
          </svg>
          {{
            activePopover.data?.bedrooms
              ? Number(activePopover.data?.bedrooms).toFixed(0) + " Beds"
              : "--"
          }}
          <span class="line">|</span>
          <svg
            data-v-4a17f7ac=""
            data-v-1d2a0c97=""
            data-insp-path="D:/project/attom-app-react-frontend/src/views/iframe/components/overview/index.vue:189:15:svg"
            t="1755761642535"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="7503"
            width="20"
            height="20"
          >
            <path
              data-v-4a17f7ac=""
              data-v-1d2a0c97=""
              data-insp-path="D:/project/attom-app-react-frontend/src/views/iframe/components/overview/index.vue:189:187:path"
              d="M950.857143 621.714286v109.714285q0 96.571429-73.142857 163.428572v110.857143q0 8-5.142857 13.142857t-13.142858 5.142857h-36.571428q-8 0-13.142857-5.142857t-5.142857-13.142857v-67.428572q-36 12.571429-73.142858 12.571429H292.571429q-37.142857 0-73.142858-12.571429v62.857143q0 9.714286-5.428571 16.285714T201.142857 1024h-36.571428q-7.428571 0-12.857143-6.571429T146.285714 1001.142857v-106.285714q-73.142857-66.857143-73.142857-163.428572v-109.714285h877.714286zM402.285714 384q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142857 13.142857-5.142857 13.142857 5.142857 5.142857 13.142857z m36.571429-36.571429q0 8-5.142857 13.142858t-13.142857 5.142857-13.142858-5.142857-5.142857-13.142858 5.142857-13.142857 13.142858-5.142857 13.142857 5.142857 5.142857 13.142857z m-36.571429-36.571428q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142857 13.142857-5.142857 13.142857 5.142857 5.142857 13.142857z m73.142857 0q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142857 13.142857-5.142857 13.142857 5.142857 5.142857 13.142857z m-36.571428-36.571429q0 8-5.142857 13.142857t-13.142857 5.142858-13.142858-5.142858-5.142857-13.142857 5.142857-13.142857 13.142858-5.142857 13.142857 5.142857 5.142857 13.142857z m-36.571429-36.571428q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142857 13.142857-5.142858 13.142857 5.142858 5.142857 13.142857z m621.714286 292.571428v36.571429q0 8-5.142857 13.142857t-13.142857 5.142857H18.285714q-8 0-13.142857-5.142857t-5.142857-13.142857v-36.571429q0-8 5.142857-13.142857t13.142857-5.142857h54.857143V146.285714q0-60.571429 42.857143-103.428571T219.428571 0q61.714286 0 105.142858 44.571429 26.285714-10.857143 56-6.857143t53.142857 22.285714l12.571428-12.571429q6.285714-6.285714 12.571429 0l24 24q6.285714 6.285714 0 12.571429L303.428571 263.428571q-6.285714 6.285714-12.571428 0l-24-24q-6.285714-6.285714 0-12.571428l12.571428-12.571429q-20.571429-26.285714-23.142857-59.428571T269.714286 93.142857q-21.142857-20-50.285715-20-30.285714 0-51.714285 21.428572T146.285714 146.285714v365.714286h859.428572q8 0 13.142857 5.142857t5.142857 13.142857zM512 274.285714q0 8-5.142857 13.142857t-13.142857 5.142858-13.142857-5.142858-5.142858-13.142857 5.142858-13.142857 13.142857-5.142857 13.142857 5.142857 5.142857 13.142857z m-36.571429-36.571428q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142857 13.142857-5.142858 13.142857 5.142858 5.142857 13.142857z m-36.571428-36.571429q0 8-5.142857 13.142857t-13.142857 5.142857-13.142858-5.142857-5.142857-13.142857 5.142857-13.142857 13.142858-5.142857 13.142857 5.142857 5.142857 13.142857z m109.714286 36.571429q0 8-5.142858 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142857 13.142857-5.142858 13.142857 5.142858 5.142858 13.142857z m-36.571429-36.571429q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142858-13.142857 5.142858-13.142857 13.142857-5.142857 13.142857 5.142857 5.142857 13.142857z m-36.571429-36.571428q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142858 13.142857-5.142857 13.142857 5.142857 5.142857 13.142858z m109.714286 36.571428q0 8-5.142857 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142857 13.142857-5.142857 13.142857 5.142857 5.142857 13.142857z m-36.571428-36.571428q0 8-5.142858 13.142857t-13.142857 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142858 13.142857-5.142857 13.142857 5.142857 5.142858 13.142858z m73.142857 0q0 8-5.142857 13.142857t-13.142858 5.142857-13.142857-5.142857-5.142857-13.142857 5.142857-13.142858 13.142857-5.142857 13.142858 5.142857 5.142857 13.142858z"
              p-id="7504"
            />
          </svg>
          {{
            activePopover.data?.bathcount
              ? Number(activePopover.data?.bathcount).toFixed(0) + " Baths"
              : "--"
          }}
        </div>
        <div class="view-detail">
          <el-button
            class="btn-view-detail"
            style="
              width: 100%;
              background: rgb(154, 137, 187);
              color: rgb(255, 255, 255);
            "
            @click="onShowViewDetail()"
            >View Detail</el-button
          >
        </div>
        <el-icon class="btn-close" @click="closeAllPopovers"
          ><CloseBold
        /></el-icon>
      </div>
    </el-popover>
  </div>
</template>

<style lang="scss">
.leaflet-control-container {
  display: none;
}
/* Price Marker Styles */
.price-marker {
  background-color: white;
  color: black;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto !important;
  cursor: pointer;
}

.price-marker:hover {
  transform: scale(1.1);
  background-color: #f0f0f0;
  border-color: #999;
  z-index: 1000 !important;
}
</style>

<style scoped lang="scss">
.popover-content {
  font-size: 14px;
  position: relative;
  .address {
    margin-bottom: 20px;
  }
  .price {
    margin-bottom: 20px;
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }
  .bed-bath {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    svg {
      margin-right: 5px;
    }
    .line {
      margin: 0 5px;
    }
  }
  .btn-close {
    position: absolute;
    right: 0px;
    top: 0px;
    cursor: pointer;
    z-index: 1;
  }
}
.map-com {
  position: relative;
  height: 100%;
  .btn-search-area {
    position: absolute;
    left: 50%;
    top: 20%;
    margin-left: -67px;
    margin-top: -16px;
    z-index: 999;
  }
  .map-filter-box {
    display: flex;
    justify-content: flex-end; /* 右对齐 */
    margin-bottom: 10px;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 999;
    span {
      margin-right: 10px;
    }
  }
  .map-container {
    width: 100%;
    height: 100%;
  }
  &.map-com-fix {
    padding-top: 42px;
    .map-filter-box {
      background: #fff;
      padding: 10px 0 10px 10px;
      border-radius: 5px;
    }
  }
}
</style>
