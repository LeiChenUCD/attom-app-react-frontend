import React from "react";
import Filters from "../components/Filters";
import HouseHolds from "../components/Households";
import Notes from "../components/Notes";
import Map from "../components/Map";
import MandatoryFields from "../components/MandatoryFields";
import { loadHouses, loadHouseCensusTract, calculateZoomLevel, getSouthwestLatitude, getSouthwestLongitude, getNortheastLatitude, getNortheastLongitude, getHouses } from "../util/util";
import L from 'leaflet';
import GeneralInfo from "./GeneralInfo";
// import { houses } from "../assets/households"

function MainView(props) {

    const {censusTract, authorName, setAuthorName} = props
    const [LotAreaLower, setLotAreaLower] = React.useState(0)
    const [LotAreaUpper, setLotAreaUpper] = React.useState(Number.MAX_SAFE_INTEGER)
    const [addrFilter, setAddrFilter] = React.useState("")
    const [selectedAddr, setSelectedAddr] = React.useState("")
    const [id, setId] = React.useState("")
    const [sortMethod, setSortMethod] = React.useState("Default")
    const [curPage, setCurPage] = React.useState(0)
    const [houseEntry, setHouseEntry] = React.useState([])
    const [sortedSubset, setSortedSubset] = React.useState([]);
    const [center, setCenter] = React.useState(houseEntry.length === 0 ? [-1, -1] : [houseEntry[2], houseEntry[3]])
    const [zoom, setZoom] = React.useState(17)
    
    const [loaded, setLoaded] = React.useState(false)
    const [notedSubset, setNotedSubset] = React.useState("Both")
    // all prev note, author, time in a big string
    const [prevNotesFull, setPrevNotesFull] = React.useState("")
    const [ATTOMID, setATTOMID] = React.useState("")

    React.useEffect(() => {
        async function loading() {
            // await loadHouses()
            await loadHouseCensusTract(censusTract)
            setLoaded(true)
            // const southwest = [getSouthwestLatitude(getHouses()), getSouthwestLongitude(getHouses())];
            // const northeast = [getNortheastLatitude(getHouses()), getNortheastLongitude(getHouses())];
            // const bounds = L.latLngBounds([southwest, northeast]);
            // setCenter(bounds.getCenter())
            // setZoom(calculateZoomLevel(bounds))
        }
        loading()
    }, [])
    
    return <div style={{display: "flex", flexDirection: "row", justifyContent: "center", paddingTop: "30px"}}>
        {
            loaded ? 
        <>
            <div>
            
                <MandatoryFields
                censusTract={censusTract}
                setAuthorName={setAuthorName}
                authorName={authorName}
                />

                <Filters 
                setLotAreaLower={setLotAreaLower} 
                setLotAreaUpper={setLotAreaUpper} 
                setAddrFilter={setAddrFilter}
                setSortMethod={setSortMethod}
                setCurPage={setCurPage}
                setNotedSubset={setNotedSubset}
                />
            </div>
                

            <div style={{width: "10px"}}></div>

            <div>
                
                <div style={{display: "flex"}}>

                    <HouseHolds 
                    curPage={curPage}
                    setCurPage={setCurPage}
                    LotAreaLower={LotAreaLower} 
                    LotAreaUpper={LotAreaUpper} 
                    addrFilter={addrFilter} 
                    setSelectedAddr={setSelectedAddr}
                    id={id}
                    selectedAddr={selectedAddr}
                    sortMethod={sortMethod}
                    setHouseEntry={setHouseEntry}
                    sortedSubset={sortedSubset}
                    setSortedSubset={setSortedSubset}
                    setCenter={setCenter}
                    authorName={authorName}
                    prevNotesFull={prevNotesFull}
                    notedSubset={notedSubset}
                    censusTract={censusTract}
                    setZoom={setZoom}
                    zoom={zoom}
                    setATTOMID={setATTOMID}
                    ATTOMID={ATTOMID}
                    />
                </div>

                <div style={{display: "flex", flexDirection: "row", paddingTop: "30px"}}>
                
                    {selectedAddr === "" ? null : 
                    <Notes selectedAddr={selectedAddr} 
                    id={id} 
                    setId={setId}
                    authorName={authorName}
                    setPrevNotesFull={setPrevNotesFull}
                    prevNotesFull={prevNotesFull}
                    houseEntry={houseEntry}
                    censusTract={censusTract}
                    ATTOMID={ATTOMID}
                    />} 
                    <Map houseEntry={houseEntry}
                    sortedSubset={sortedSubset}
                    center={center}
                    setCenter={setCenter}
                    zoom={zoom}
                    setZoom={setZoom}
                    setHouseEntry={setHouseEntry}
                    setSelectedAddr={setSelectedAddr}
                    authorName={authorName}
                    prevNotesFull={prevNotesFull}
                    id={id}
                    addrFilter={addrFilter}
                    />
                </div>

                <div>
                    <GeneralInfo 
                    ATTOMID={ATTOMID}
                    />
                </div>
            </div>
        </> :
        <>
            Loading...
        </>
        }
    </div>
}

export default MainView;