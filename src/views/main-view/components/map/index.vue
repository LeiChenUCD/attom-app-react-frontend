<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import L from "leaflet";
import proj4 from "proj4";
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
  }
});
const mapContainer = ref(null);
const offsetTop = ref(0);
const filterStyle = ref({
  position: "relative",
  top: 0 + "px"
});
const emit = defineEmits(["onRowIndex","onSearchArea"]);
let mapCom = null;
const zoomLevel = ref(10);
const isShowSearchBtnArea = ref(false);
const minZoomLevel = ref(3);
const maxZoomLevel = ref(21);
let secondaryPointsLayers = [];
const currentPoint = ref();
let currentMarker;

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
  medianIncome: {
    layerName: "mygis:tl_2024_us_zcta520",
    layerTitle: "Median Income",
    options: {
      bbox: "-176.696692,-14.373776,145.830505,71.341324",
      srs: "EPSG:4269"
    }
  },
  sjZoning: {
    layerName: "mygis:SJ_zoning",
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
const crs2227 = new L.Proj.CRS(
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
    currentWMSLayer.addTo(mapCom);

    // 如果是EPSG:2227图层，设置合适的地图视图
    if (options.srs === "EPSG:2227") {
      const [minX, minY, maxX, maxY] = options.bbox.split(",").map(Number);
      const southWest = crs2227.projection.unproject(L.point(minX, minY));
      const northEast = crs2227.projection.unproject(L.point(maxX, maxY));
      mapCom.fitBounds(L.latLngBounds(southWest, northEast));
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
const highlightIcon = L.icon({
  iconUrl: "marker-cur.svg", // 图标路径
  iconSize: [50, 50], // 图标大小
  popupAnchor: [5, -90],
  iconAnchor: [22, 94] // 图标锚点
  //popupAnchor: [-3, -56] // 弹出框锚点
});

// 灰色图标
const grayIcon = L.icon({
  iconUrl: "marker-icon-2x.png", // 灰色图标路径
  iconSize: [50, 50], // 图标大小
  popupAnchor: [5, -90],
  iconAnchor: [22, 94] // 图标锚点
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
  mapCom.on('moveend', function() {
    isShowSearchBtnArea.value = true;
    // 清除之前的定时器（如果存在）
    if (timeoutID) {
      clearTimeout(timeoutID);
      timeoutID = null;
    }
    
    timeoutID = setTimeout(() => {
        isShowSearchBtnArea.value = false;
    }, 5000);
  });
}

function onSearchThisArea() {
  const bounds = mapCom?.getBounds();
  // 获取四个角的经纬度
  const topLat = bounds.getNorth();    // 最北纬度（上边界）
  const bottomLat = bounds.getSouth(); // 最南纬度（下边界）
  const leftLong = bounds.getWest();   // 最西经度（左边界）
  const rightLong = bounds.getEast();  // 最东经度（右边界）
  
  console.log({
    topLat,
    bottomLat,
    leftLong,
    rightLong
  });
  emit("onSearchArea",{
    topLat,
    bottomLat,
    leftLong,
    rightLong
  })
}

function isBetween(num, boundA, boundB) {
  return (boundA >= num && boundB <= num) || (boundA <= num && boundB >= num);
}

function getNortheastLatitude(houses) {
  if (!houses || houses.length === 0) {
    return 0;
  }

  let maxLatitude = houses[0]["propertylatitude"]; // Assuming houses are in [lat, long] format

  // Iterate through the list of houses
  for (let i = 1; i < houses.length; i++) {
    const latitude = houses[i]["propertylatitude"];
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

  let maxLongitude = houses[0]["propertylongitude"]; // Assuming houses are in [lat, long] format

  // Iterate through the list of houses
  for (let i = 1; i < houses.length; i++) {
    const longitude = houses[i]["propertylongitude"];
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

  let minLatitude = houses[0]["propertylatitude"]; // Assuming houses are in [lat, long] format

  // Iterate through the list of houses
  for (let i = 1; i < houses.length; i++) {
    const latitude = houses[i]["propertylatitude"];
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

  let minLongitude = houses[0]["propertylongitude"]; // Assuming houses are in [lat, long] format

  // Iterate through the list of houses
  for (let i = 1; i < houses.length; i++) {
    const longitude = houses[i]["propertylongitude"];
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

function addCurrentPoint(data: any) {
  // 添加标记
  currentMarker = L.marker([data.propertylatitude, data.propertylongitude], {
    icon: highlightIcon,
    title: data.propertyaddressfull //鼠标hover显示
  }).addTo(mapCom);
  secondaryPointsLayers.push(currentMarker);
  // 绑定工具提示
  currentMarker.bindPopup(data.propertyaddressfull, {
    permanent: true, // 是否永久显示（false 表示鼠标悬停时显示）
    direction: "top" // 提示框显示的方向（top, bottom, left, right）
    //offset: [0, -65], //偏移量
    //opacity: 0.9 // 提示框的透明度
  });
  // 自动定位到标记的位置
  //mapCom.setView(marker.getLatLng(), zoomLevel.value);
  mapCom.panTo([data.propertylatitude, data.propertylongitude]);
  if (!currentMarker.isPopupOpen()) {
    currentMarker.openPopup();
  }
}

function clearAllMarkers() {
  // 遍历并删除所有次点图层
  secondaryPointsLayers.forEach(function (layer) {
    mapCom.removeLayer(layer);
  });
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
    const center = [
      props.houses[0]["propertylatitude"],
      props.houses[0]["propertylongitude"]
    ];
    //mapCom.value.setView([center[0], center[1]], zoomLevel);
    //mapCom.panTo([center[0], center[1]]);
    currentPoint.value = props.houses[0];
    mapCom.panTo([
      currentPoint.value.propertylatitude,
      currentPoint.value.propertylongitude
    ]);
    buildAllPoints(props.houses);
    addCurrentPoint(props.houses[0]);
    /*const subsetOnMap = props.houses.filter(house => {
      return isBetween(house['propertylatitude'], top, bottom) && isBetween(house['propertylongitude'], left, right)
    }).filter(house => {
      return !(house['propertylatitude'] === center[0] && house['propertylongitude'] === center[1])
    })
    
    const points = subsetOnMap.map((house, idx) => [house['propertylatitude'], house['propertylongitude']]);
    const polygon = L.polygon(points, {color: '#aa0000',fillColor:'#ff15c9',
	              weight:1}).addTo(mapCom);
                */
    // 为每个点绑定点击事件
    bindMarkerEvent();
  }
}

function bindMarkerEvent() {
  secondaryPointsLayers.forEach(marker => {
    marker.on("click", function () {
      resetAllMarkers(true);
      // 将当前点击的点的图标设置为高亮
      marker.setIcon(highlightIcon);
      if (!marker.isPopupOpen()) {
        marker.openPopup();
      }
      const latLng = marker.getLatLng();
      const curHouseIndex = getCurHouseIndex(latLng, props.houses);
      emit("onRowIndex", curHouseIndex);
    });
  });
}

function getCurHouseIndex(latLng: any, list: any) {
  let res = 0;
  if (latLng && list?.length > 0) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (
        latLng.lat === item.propertylatitude &&
        latLng.lng === item.propertylongitude
      ) {
        res = i;
        break;
      }
    }
  }
  return res;
}

function buildAllPoints(list: any) {
  // 使用MarkerClusterer来聚合标记
  /*const markers = L.markerClusterGroup({
      // 可以在这里配置MarkerClusterer的选项，如最大聚类半径、图标等
      maxClusterRadius: 80, // 例如，设置最大聚类半径为80像素
      iconCreateFunction: function (cluster) {
          // 自定义聚类图标的函数（可选）
          const childCount = cluster.getChildCount();
          let c = ' marker-cluster-';
          if (childCount < 10) {
              c += 'small';
          } else if (childCount < 100) {
              c += 'medium';
          } else {
              c += 'large';
          }
          return L.divIcon({ html: '<b>' + childCount + '</b>', className: c, iconSize: L.point(40, 40) });
      }
  });*/
  secondaryPointsLayers = [];
  const markers = L.markerClusterGroup();
  if (list?.length > 0) {
    //const points = [];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const point = [item.propertylatitude, item.propertylongitude];
      let layer;
      if (currentPoint.value["[attom id]"] !== item["[attom id]"]) {
        //points.push(point);
        layer = L.marker(point, { icon: grayIcon }).bindPopup(
          item.propertyaddressfull,
          {
            permanent: true, // 是否永久显示（false 表示鼠标悬停时显示）
            direction: "top" // 提示框显示的方向（top, bottom, left, right）
            //offset: [0, -65], //偏移量
            //opacity: 0.9 // 提示框的透明度
          }
        );
        secondaryPointsLayers.push(layer);
        markers.addLayer(layer);
      } else {
      }
    }
    markers.addTo(mapCom);
    //画多边形
    /*const polygon = L.polygon(points, {color: '#aa0000',fillColor:'#ff15c9',
	              weight:1}).addTo(mapCom);*/
    // 添加 GeoServer WMS 图层
    //rendWmsLayer();
    loadWMSLayer2();
  }
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
  secondaryPointsLayers.forEach(m => {
    /*const latLng = m.getLatLng();
    m.setZIndexOffset(1);
    if (m.isPopupOpen()) {
      m.closePopup();
    }
    if (latLng.lat === currentPoint.value.propertylatitude && latLng.lng === currentPoint.value.propertylongitude) {
      if (isClick) {
        m.setIcon(grayIcon);
      } else {
        m.setZIndexOffset(999999);
        m.setIcon(highlightIcon);
        mapCom.panTo([currentPoint.value.propertylatitude, currentPoint.value.propertylongitude]);
        if (!m.isPopupOpen()) {
          m.openPopup();
        }
      }
    } else {
      m.setIcon(grayIcon);
    }*/
    m.setIcon(grayIcon);
  });
}

function getElemTop() {
  setTimeout(() => {
    // 对于元素
    const elements = document.getElementsByClassName("el-scrollbar__wrap");
    const filter = document.getElementById("filter-main-box");
    if (filter && elements?.length > 1) {
      elements[1].addEventListener("scroll", function () {
        offsetTop.value = this.scrollTop - filter.offsetHeight;
        if (window.innerWidth <= 760) {
          const overviewBox = document.getElementById("overview-main-box");
          const tableBox = document.getElementById("table-main-box");
           offsetTop.value = offsetTop.value - overviewBox?.offsetHeight - tableBox?.offsetHeight;
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

onMounted(() => {
  getElemTop();
  initMap();
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
    isShowSearchBtnArea.value = false;
    currentPoint.value = props.detailData;
    clearAllMarkers();
    buildAllPoints(props.houses);
    addCurrentPoint(currentPoint.value);
    // 为每个点绑定点击事件
    bindMarkerEvent();
    //resetAllMarkers(false);
  },
  {
    deep: true
  }
);
</script>

<template>
  <div class="map-com" :class="{ 'map-com-fix': offsetTop > 0 }">
    <div class="map-filter-box" :style="filterStyle">
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
    </div>
    <div ref="mapContainer" class="map-container" />
    <el-button @click="onSearchThisArea()" v-if="isShowSearchBtnArea" type="primary" class="btn-search-area">Search this area</el-button>
  </div>
</template>

<style scoped lang="scss">
.map-com {
  position: relative;
  .btn-search-area {
    position: absolute;
    left: 50%;
    top: 50%;
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
    height: 100vh;
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
