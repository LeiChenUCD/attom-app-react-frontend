<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import L from "leaflet";
import "proj4leaflet";
import "leaflet.markercluster";

defineOptions({
  name: "MapComponent"
});
const props = defineProps({
  detailData: {
    type: Object,
    default: () => {
      return {};
    }
  },
});
const mapContainer = ref(null);
const offsetTop = ref(0);
const emit = defineEmits(["onRowIndex", "onSearchArea"]);
let mapCom = null;
const zoomLevel = ref(10);
const minZoomLevel = ref(3);
const maxZoomLevel = ref(18);
let secondaryPointsLayers = [];
const currentPoint = ref();
let currentMarker;
let pointMarkers;

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
}

function addCurrentPoint(data: any, isMax: boolean) {
  if (!data.lat) return;
 
  // 清除旧标记
  if (currentMarker) mapCom.removeLayer(currentMarker);
 
  // 添加新标记
  currentMarker = L.marker([data.lat, data.lon], {
    icon: highlightIcon,
    title: data.fullAddress
  }).addTo(mapCom);
 
  // 绑定弹出框（可选关闭 permanent）
  currentMarker.bindPopup(data.fullAddress, {
    permanent: false, // 避免永久弹出框影响
    direction: "top",
    offset: L.point(0, -10)
  });
 
  // 强制重新计算地图尺寸
  mapCom.invalidateSize();
 
  // 设置视图（使用 flyTo 更精确）
  const zoom = isMax ? mapCom.getMaxZoom() : zoomLevel.value;
  mapCom.flyTo([data.lat, data.lon], zoom, {
    animate: false,
    duration: 0
  });
 
  // 延迟调整中心点（补偿控件偏移）
  setTimeout(() => {
    if (!currentMarker) return;
 
    // 打开弹出框（如果需要）
    if (!currentMarker.isPopupOpen()) {
      currentMarker.openPopup();
    }
 
    // 计算控件偏移并调整
    const leftControls = document.querySelector('.leaflet-control-container .leaflet-left');
    const adjustX = leftControls ? leftControls.offsetWidth / 2 : 0;
    mapCom.panBy([adjustX, 0], { animate: false });
 
    // 终极调整：强制标记居中
    forceCenter([data.lat, data.lon]);
  }, 100);
}
 
// 强制标记居中的函数
function forceCenter(latlng) {
  const point = mapCom.latLngToContainerPoint(latlng);
  const center = mapCom.latLngToContainerPoint(mapCom.getCenter());
  const offsetX = point.x - center.x;
  const offsetY = point.y - center.y;
  mapCom.panBy([-offsetX, -offsetY], { animate: false });
}

onMounted(() => {
  initMap();
  currentPoint.value = props.detailData;
  setTimeout(() => {
    addCurrentPoint(currentPoint.value, true);
  }, 100);
 
});

</script>

<template>
  <div class="map-com" :class="{ 'map-com-fix': offsetTop > 0 }">
    <div ref="mapContainer" class="map-container" />
  </div>
</template>

<style lang="scss">
.leaflet-control-container {
  display: none;
}
</style>

<style scoped lang="scss">
.map-com {
  position: relative;
  height: 300px;
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
