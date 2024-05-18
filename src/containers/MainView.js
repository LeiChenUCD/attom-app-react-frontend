import React from "react";
import Filters from "../components/Filters";
import HouseHolds from "../components/Households";
import Notes from "../components/Notes";
import Map from "../components/Map";
import MandatoryFields from "../components/MandatoryFields";
import { loadHouseCensusTract, loadContactInfo } from "../util/util";
import L from 'leaflet';
import GeneralInfo from "./GeneralInfo";
// import { houses } from "../assets/households"

function MainView(props) {

    const {censusTract, authorName, setAuthorName, setCensusTract} = props
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
    const [contactInfoSubset, setContactInfoSubset] = React.useState("Both")
    // all prev note, author, time in a big string
    const [prevNotesFull, setPrevNotesFull] = React.useState("")
    const [ATTOMID, setATTOMID] = React.useState("")
    const [curRecordIdx, setCurRecordIdx] = React.useState(0);

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
                <div 
                className="switch_page" 
                style={{fontSize: "20px", paddingLeft: "0"}}
                onClick={e => setCensusTract(-1)}
                >
                    &#8249;
                </div>
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
                setContactInfoSubset={setContactInfoSubset}
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
                    contactInfoSubset={contactInfoSubset}
                    setCurRecordIdx={setCurRecordIdx}
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
                    selectedAddr={selectedAddr}
                    curRecordIdx={curRecordIdx}
                    setCurRecordIdx={setCurRecordIdx}
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