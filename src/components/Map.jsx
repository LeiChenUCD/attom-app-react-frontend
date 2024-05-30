import { MapContainer, TileLayer, Marker, useMap, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS to override default styles
import React from 'react';
import L from 'leaflet'
import { isBetween } from '../util/util';
// npm i @changey/react-leaflet-markercluster
// https://www.npmjs.com/package/react-leaflet-markercluster
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import '@changey/react-leaflet-markercluster/dist/styles.min.css'
import { convexHull, getSouthwestLatitude, getNortheastLatitude, getSouthwestLongitude, getNortheastLongitude, getHouses } from '../util/util';

function MyComponent(props) {
    const {zoom, houseEntry, setATTOMID} = props
    const map = useMap();
    React.useEffect(() => {
        setATTOMID(houseEntry[5])
        map.setView([houseEntry[2], houseEntry[3]], zoom);
    }, [houseEntry]);
    return null
}

function MapEventHandlers(props) {
    const {setTop, setRight, setBottom, setLeft, setZoom, setCenter} = props
    const map = useMap();

    React.useEffect(() => {
        const handleMoveEnd = () => {
            const bound = map.getBounds()
            if (bound === null) return
            const top = bound._northEast.lat
            const right = bound._northEast.lng
            const bottom = bound._southWest.lat
            const left = bound._southWest.lng
            setTop(top)
            setRight(right)
            setBottom(bottom)
            setLeft(left)
            setZoom(map.getZoom())
        };

        map.on("moveend", handleMoveEnd);

        // Cleanup function to remove the event listener when component unmounts
        return () => {
            map.off("moveend", handleMoveEnd);
        };
    }, [map, setTop, setRight, setBottom, setLeft, setZoom, setCenter]);
  
    return null;
}

  
function Map(props) {
    
    const {houseEntry, sortedSubset, center, setCenter, setHouseEntry, setSelectedAddr, zoom, setZoom, setATTOMID} = props
    const [top, setTop] = React.useState(getNortheastLatitude(getHouses()))
    const [right, setRight] = React.useState(getNortheastLongitude(getHouses()))
    const [bottom, setBottom] = React.useState(getSouthwestLatitude(getHouses()))
    const [left, setLeft] = React.useState(getSouthwestLongitude(getHouses()))
    const maxZoom = 21
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png')
    })

    const greenCluster = (cluster) => {
        const count = cluster.getChildCount();
        const size = count < 100 ? 'small' : count < 1000 ? 'medium' : 'large';
        const options = {
            iconSize: [40, 40],
            className: `cluster-marker cluster-marker-${size}`,
            html: `<div style="background-color: green; color: white; border-radius: 50%; text-align: center; line-height: 40px;">${count}</div>`,
        };
        return L.divIcon(options);
    };

    const blueCluster = (cluster) => {
        const count = cluster.getChildCount();
        const size = count < 100 ? 'small' : count < 1000 ? 'medium' : 'large';
        const options = {
            iconSize: [40, 40],
            className: `cluster-marker cluster-marker-${size}`,
            html: `<div style="background-color: blue; color: white; border-radius: 50%; text-align: center; line-height: 40px;">${count}</div>`,
        };
        return L.divIcon(options);
    };
    
    const commentedStyles = `
        background-color: green;
        width: 1.5rem;
        height: 1.5rem;
        display: block;
        left: -1.5rem;
        top: -1.5rem;
        position: relative;
        border-radius: 3rem 3rem 0;
        transform: rotate(45deg);
        border: 1px solid #FFFFFF`

    const commentedIcon = L.divIcon({
        className: "my-custom-pin",
        iconSize: [1, 1],
        iconAnchor: [-11, 10],
        popupAnchor: [0, -36],
        html: `<span style="${commentedStyles}" />`
    })

    const commentedBiggerStyles = `
        background-color: green;
        width: 3rem;
        height: 3rem;
        display: block;
        left: -1.5rem;
        top: -1.5rem;
        position: relative;
        border-radius: 3rem 3rem 0;
        transform: rotate(45deg);
        border: 1px solid #FFFFFF`

    const commentedBiggerIcon = L.divIcon({
        className: "my-custom-pin",
        iconSize: [40, 60], // Set the size of the icon
        iconAnchor: [1, 37], // Set the anchor point of the icon
        popupAnchor: [1, -34],
        html: `<span style="${commentedBiggerStyles}" />`
    })

    const uncommentedStyles = `
        background-color: blue;
        width: 1.5rem;
        height: 1.5rem;
        display: block;
        left: -1.5rem;
        top: -1.5rem;
        position: relative;
        border-radius: 3rem 3rem 0;
        transform: rotate(45deg);
        border: 1px solid #FFFFFF`

    const uncommentedIcon = L.divIcon({
        className: "my-custom-pin",
        iconSize: [1, 1],
        iconAnchor: [-11, 10],
        popupAnchor: [0, -36],
        html: `<span style="${uncommentedStyles}" />`
    })
    
    const uncommentedBiggerStyles = `
        background-color: blue;
        width: 3rem;
        height: 3rem;
        display: block;
        left: -1.5rem;
        top: -1.5rem;
        position: relative;
        border-radius: 3rem 3rem 0;
        transform: rotate(45deg);
        border: 1px solid #FFFFFF`

    const uncommentedBiggerIcon = L.divIcon({
        className: "my-custom-pin",
        iconSize: [40, 60], // Set the size of the icon
        iconAnchor: [1, 37], // Set the anchor point of the icon
        popupAnchor: [1, -34],
        html: `<span style="${uncommentedBiggerStyles}" />`
    })
    
    const subsetOnMap = sortedSubset.filter(house => {
        return isBetween(house[2], top, bottom) && isBetween(house[3], left, right)
    })
    .filter(house => {
        return !(house[2] === center[0] && house[3] === center[1])
    })

    const border = [
        [getSouthwestLatitude(getHouses()), getSouthwestLongitude(getHouses())], // Bottom-left corner
        [getNortheastLatitude(getHouses()), getNortheastLongitude(getHouses())]  // Top-right corner
    ];

    const handleMarkerClick = (event) => {
        // console.log('Marker clicked:', event.latlng); // Log marker position when clicked
        setCenter([event.latlng.lat, event.latlng.lng])
        const newHouse = subsetOnMap.filter(house => house[2] === event.latlng.lat && house[3] === event.latlng.lng)[0]
        setHouseEntry(newHouse)
        setSelectedAddr(newHouse[0])
    };

    const selectedAddrWithinMap = isBetween(center[0], top, bottom) && isBetween(center[1], left, right)
    const additionalHouse = selectedAddrWithinMap ? 1 : 0
    const bounds = L.latLngBounds(border);
    
    return (
        <div style={{ 
            width: window.innerWidth > 450 ? "450px" : window.innerWidth, height: "450px", 
            marginBottom: "10px" }}>
            <MapContainer 
            bounds={bounds}
            maxZoom={maxZoom}
            style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    maxZoom={maxZoom}
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="(C) Esri"
                />
            
                <MapEventHandlers 
                setTop={setTop}
                setRight={setRight}
                setBottom={setBottom}
                setLeft={setLeft}
                setCenter={setCenter}
                setZoom={setZoom}
                />

                {
                center[0] !== -1 &&
                <MyComponent 
                houseEntry={houseEntry}
                setATTOMID={setATTOMID}
                center={center}
                zoom={zoom} 
                />
                }

                {houseEntry[4] === true ? <Marker position={center} icon={commentedBiggerIcon}/> : <Marker position={center} icon={uncommentedBiggerIcon}/>}

                {subsetOnMap.length < 1000 ?
                zoom >= 18 ? 
                <>
                {subsetOnMap.filter(house => house[4] === true).map((house, idx) => {
                    return <Marker 
                    key={idx} 
                    position={[house[2], house[3]]}
                    eventHandlers={{ click: handleMarkerClick }}
                    icon={commentedIcon}
                    />
                })}
                {subsetOnMap.filter(house => house[4] === false).map((house, idx) => {
                    return <Marker 
                    key={idx} 
                    position={[house[2], house[3]]}
                    eventHandlers={{ click: handleMarkerClick }}
                    icon={uncommentedIcon}
                    />
                })}
                </>
                 : 
                <>
                <MarkerClusterGroup 
                iconCreateFunction={greenCluster}
                >
                    {/* with comment */}
                    {subsetOnMap.filter(house => house[4] === true).map((house, idx) => {
                    return <>
                    <Marker 
                    key={idx} 
                    position={[house[2], house[3]]}
                    eventHandlers={{ click: handleMarkerClick }}
                    icon={commentedIcon} // Apply custom style here
                >
                </Marker>
                    </>
                })}
                </MarkerClusterGroup>

                <MarkerClusterGroup 
                iconCreateFunction={blueCluster}
                >
                    {/* without comment */}
                    {subsetOnMap.filter(house => house[4] === false).map((house, idx) => {
                    return <Marker 
                    key={idx} 
                    position={[house[2], house[3]]}
                    eventHandlers={{ click: handleMarkerClick }}
                    icon={uncommentedIcon} // Apply custom style here
                >
                </Marker>
                
                })}
                </MarkerClusterGroup>
                </>
                :
                <>
                <Polygon positions={convexHull(subsetOnMap.map((house, idx) => [house[2], house[3]]))}/>
                {/* <div>hi</div> */}
                </>
                }

            </MapContainer>
            {subsetOnMap.length + additionalHouse} household{subsetOnMap.length + additionalHouse > 1 && 's'} within the map
        </div>
    );
}

export default Map;
