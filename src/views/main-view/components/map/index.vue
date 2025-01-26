<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import L from 'leaflet';
import 'leaflet.markercluster';

defineOptions({
  name: "Map"
});
const props = defineProps({
  houses: {
    type: Array,
    default: () => {
      return [];
    }
  },
});
const mapContainer = ref(null);
const emit = defineEmits(["onFiler"]);
let mapCom = null;
const zoomLevel = ref(10);
const minZoomLevel = ref(3);
const maxZoomLevel = ref(21);
let secondaryPointsLayers = [];

function initMap() {
  if (mapContainer.value) {
    // 初始化地图
    //const map = L.map(mapContainer.value).setView([51.505, -0.09], 13);

    //定义图层样式
    var layer = L.tileLayer("http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}");
    //创建地图
    mapCom = L.map(mapContainer.value, {
      center: [51.505, -0.09],//中心坐标
      zoom: zoomLevel.value,//缩放级别
      minZoom: minZoomLevel.value,
      maxZoom: maxZoomLevel.value,
      zoomControl: true, //缩放组件
      attributionControl: false, //去掉右下角logol
      layers: [layer],//图层
    });

    // 添加OpenStreetMap瓦片层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapCom);
  } else {
    console.error('Map container not found!');
  }
}

function isBetween(num, boundA, boundB) {
  return (boundA >= num && boundB <= num) || (boundA <= num && boundB >= num)
}

function getNortheastLatitude(houses) {
  if (!houses || houses.length === 0) {
    return 0;
  }

  let maxLatitude = houses[0]['propertylatitude']; // Assuming houses are in [lat, long] format

  // Iterate through the list of houses
  for (let i = 1; i < houses.length; i++) {
    const latitude = houses[i]['propertylatitude'];
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

  let maxLongitude = houses[0]['propertylongitude']; // Assuming houses are in [lat, long] format

  // Iterate through the list of houses
  for (let i = 1; i < houses.length; i++) {
    const longitude = houses[i]['propertylongitude'];
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

  let minLatitude = houses[0]['propertylatitude']; // Assuming houses are in [lat, long] format

  // Iterate through the list of houses
  for (let i = 1; i < houses.length; i++) {
    const latitude = houses[i]['propertylatitude'];
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

  let minLongitude = houses[0]['propertylongitude']; // Assuming houses are in [lat, long] format

  // Iterate through the list of houses
  for (let i = 1; i < houses.length; i++) {
    const longitude = houses[i]['propertylongitude'];
    if (longitude < minLongitude) {
      minLongitude = longitude;
    }
  }

  return minLongitude;
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
      //points.push(point);
      const layer = L.marker(point).bindPopup(item.propertyaddressfull);
      secondaryPointsLayers.push(layer)
      markers.addLayer(layer);
    }
    markers.addTo(mapCom);
    //画多边形
	  /*const polygon = L.polygon(points, {color: '#aa0000',fillColor:'#ff15c9',
	              weight:1}).addTo(mapCom);*/
  }
}

// Function to check the correct direction
function isNotRightTurn(a, b, c) {
    return (b[0] - a[0]) * (c[1] - a[1]) - 
           (b[1] - a[1]) * (c[0] - a[0]) <= 0;
}

function convexHull(points) {
    if (points.length < 3) {
        return points;
    }

    points.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);

    const upper = [];
    const lower = [];

    for (const point of points) {
        while (upper.length >= 2 && 
               isNotRightTurn(upper[upper.length - 2], 
               upper[upper.length - 1], point)) {
            upper.pop();
        }
        upper.push(point);
    }

    for (let i = points.length - 1; i >= 0; i--) {
        const point = points[i];
        while (lower.length >= 2 && 
               isNotRightTurn(lower[lower.length - 2], 
               lower[lower.length - 1], point)) {
            lower.pop();
        }
        lower.push(point);
    }

    // lower.push(upper[0])

    const hull = new Set([...upper, ...lower]);
    return Array.from(hull);
}

function initData() {
  if (!mapCom) {
    return;
  }
  // 遍历并删除所有次点图层
  secondaryPointsLayers.forEach(function(layer) {
    mapCom.removeLayer(layer);
});
  if (props.houses?.length > 0) {
    const top = getNortheastLatitude(props.houses);
    const right = getNortheastLongitude(props.houses);
    const bottom = getSouthwestLatitude(props.houses);
    const left = getSouthwestLongitude(props.houses);
    const center = [props.houses[0]['propertylatitude'], props.houses[0]['propertylongitude']];
    //mapCom.value.setView([center[0], center[1]], zoomLevel);
    mapCom.panTo([center[0], center[1]]);
    buildAllPoints(props.houses);

    /*const subsetOnMap = props.houses.filter(house => {
      return isBetween(house['propertylatitude'], top, bottom) && isBetween(house['propertylongitude'], left, right)
    }).filter(house => {
      return !(house['propertylatitude'] === center[0] && house['propertylongitude'] === center[1])
    })
    
    const points = subsetOnMap.map((house, idx) => [house['propertylatitude'], house['propertylongitude']]);
    const polygon = L.polygon(points, {color: '#aa0000',fillColor:'#ff15c9',
	              weight:1}).addTo(mapCom);
                */
  }

}

onMounted(() => {
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
</script>

<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<style scoped lang="scss">
.map-container {
  width: 100%;
  height: 100vh;
}
</style>
