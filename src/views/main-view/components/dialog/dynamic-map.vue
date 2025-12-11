<script setup lang="ts">
import { computed } from "vue";
import { LMap, LTileLayer, LPolygon } from "@vue-leaflet/vue-leaflet";

interface UnidataResult {
  parcel?: string; // WKT string
  footprints?: string[]; // Array of WKT strings
  [key: string]: any;
}

interface MapProps {
  center: [number, number];
  unidata?: UnidataResult;
}

const props = defineProps<MapProps>();

// --- Helper: Parse WKT POLYGON string ---
const parseWktPolygon = (wktString: string): [number, number][] => {
  if (!wktString || typeof wktString !== "string") return [];
  const coordinatesString = wktString.match(/POLYGON\s*\(\((.*)\)\)/)?.[1];
  if (!coordinatesString) return [];

  return coordinatesString.split(",").map(pair => {
    const [lng, lat] = pair.trim().split(" ").map(Number);
    return [lat, lng]; // Leaflet uses [lat, lng]
  });
};

// --- Convert Single Parcel ---
const parcelPositions = computed(() =>
  props.unidata?.parcel ? parseWktPolygon(props.unidata.parcel) : []
);

// --- Convert Multiple Footprints ---
const footprintsPositions = computed(() =>
  props.unidata?.footprints
    ? props.unidata.footprints.map(fp => parseWktPolygon(fp))
    : []
);
</script>

<template>
  <l-map
    :zoom="20"
    :center="center"
    style="width: 100%; height: 400px"
    :zoomControl="true"
    :scrollWheelZoom="false"
  >
    <l-tile-layer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution="&copy; OpenStreetMap contributors"
    />

    <!-- Parcel Polygon -->
    <l-polygon
      v-if="parcelPositions.length > 0"
      :lat-lngs="parcelPositions"
      :color="'red'"
      :fillColor="'#f03'"
      :fillOpacity="0.5"
    />

    <!-- Footprint Polygons -->
    <l-polygon
      v-for="(footprint, idx) in footprintsPositions"
      :key="idx"
      :lat-lngs="footprint"
      :color="'blue'"
      :fillColor="'#03f'"
      :fillOpacity="0.5"
    />
  </l-map>
</template>
