import React from "react";
import Filters from "../components/Filters";
import HouseHolds from "../components/Households";
import Notes from "../components/Notes";
import Map from "../components/Map";
import MandatoryFields from "../components/MandatoryFields";
import { loadHouseCensusTract, loadPriorityInfoCensusTract, loadNoteCensusTract, loadHouseAll, loadPriorityInfoAll, 
    loadNoteAll, initConnection } from "../util/util";
import GeneralInfo from "./GeneralInfo";

function MainView(props) {

    const {censusTract, authorName, setAuthorName, setCensusTract} = props
    const [LotAreaLower, setLotAreaLower] = React.useState(0)
    const [LotAreaUpper, setLotAreaUpper] = React.useState(Number.MAX_SAFE_INTEGER)
    const [bedroomLower, setBedroomLower] = React.useState(0)
    const [bedroomUpper, setBedroomUpper] = React.useState(Number.MAX_SAFE_INTEGER)
    const [bathroomLower, setBathroomLower] = React.useState(0)
    const [bathroomUpper, setBathroomUpper] = React.useState(Number.MAX_SAFE_INTEGER)
    const [priorityLower, setPriorityLower] = React.useState(0)
    const [priorityUpper, setPriorityUpper] = React.useState(Number.MAX_SAFE_INTEGER)
    const [addrFilter, setAddrFilter] = React.useState("")
    const [noteFilter, setNoteFilter] = React.useState("")
    const [zoneFilter, setZoneFilter] = React.useState("All")
    const [selectedAddr, setSelectedAddr] = React.useState("")
    const [id, setId] = React.useState("")
    const [sortMethod, setSortMethod] = React.useState("Default")
    const [curPage, setCurPage] = React.useState(0)
    const [houseEntry, setHouseEntry] = React.useState([])
    const [sortedSubset, setSortedSubset] = React.useState([]);
    const [center, setCenter] = React.useState(houseEntry.length === 0 ? [-1, -1] : [houseEntry[2], houseEntry[3]])
    const [zoom, setZoom] = React.useState(17)
    
    const [loaded, setLoaded] = React.useState(false)
    const [keptSubset, setKeptSubset] = React.useState("Both")
    const [selectiveSubset, setSelectiveSubset] = React.useState("Both")
    const [notedSubset, setNotedSubset] = React.useState("Both")
    const [contactInfoSubset, setContactInfoSubset] = React.useState("Both")
    // all prev note, author, time in a big string
    const [prevNotesFull, setPrevNotesFull] = React.useState("")
    const [ATTOMID, setATTOMID] = React.useState("")
    const [curRecordIdx, setCurRecordIdx] = React.useState(0);
    const [loadingStatement, setLoadingStatement] = React.useState("Connecting to Server... (1/4)")
    React.useEffect(() => {
        async function loading() {
            if (loaded) return
            await initConnection()
            if (censusTract === 0) {
                setLoadingStatement("Loading All House Information... (2/4)")
                await loadHouseAll()
                setLoadingStatement("Loading All Priority Information... (3/4)")
                await loadPriorityInfoAll()
                setLoadingStatement("Loading All Notes... (4/4)")
                await loadNoteAll()
            } else {
                setLoadingStatement(`Loading House Information from Census Tract ${censusTract}... (2/4)`)
                await loadHouseCensusTract(censusTract)
                setLoadingStatement(`Loading Priority Information from Census Tract ${censusTract}... (3/4)`)
                await loadPriorityInfoCensusTract(censusTract)
                setLoadingStatement(`Loading Notes from Census Tract ${censusTract}... (4/4)`)
                await loadNoteCensusTract(censusTract)
            }
            setLoaded(true)
        }
        loading()
    }, [])
    
    return <div style={{}}
    >
        {
            loaded ? 
        <div style={{display: "flex", 
        flexDirection: window.innerWidth > 768 ? "row" : "column", justifyContent: "center", paddingTop: "30px"}}>
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
                setBedroomLower={setBedroomLower}
                setBedroomUpper={setBedroomUpper}
                setBathroomLower={setBathroomLower}
                setBathroomUpper={setBathroomUpper}
                setPriorityLower={setPriorityLower}
                setPriorityUpper={setPriorityUpper}
                setAddrFilter={setAddrFilter}
                setSortMethod={setSortMethod}
                setCurPage={setCurPage}
                setKeptSubset={setKeptSubset}
                setSelectiveSubset={setSelectiveSubset}
                setNotedSubset={setNotedSubset}
                setContactInfoSubset={setContactInfoSubset}
                setZoneFilter={setZoneFilter}
                setNoteFilter={setNoteFilter}
                />
            </div>
                

            <div style={{width: "10px"}}></div>

            <div>
                
                <div style={{display: "flex", 
                overflowX: window.innerWidth > 768 ? "" : "auto",
                marginTop: window.innerWidth > 768 ? "" : "20px",
                }}>

                    <HouseHolds 
                    curPage={curPage}
                    setCurPage={setCurPage}
                    LotAreaLower={LotAreaLower} 
                    LotAreaUpper={LotAreaUpper} 
                    bedroomLower={bedroomLower}
                    bedroomUpper={bedroomUpper}
                    bathroomLower={bathroomLower}
                    bathroomUpper={bathroomUpper}
                    priorityLower={priorityLower}
                    priorityUpper={priorityUpper}
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
                    zoneFilter={zoneFilter}
                    keptSubset={keptSubset}
                    selectiveSubset={selectiveSubset}
                    noteFilter={noteFilter}
                    />
                </div>

                <div style={{display: "flex", 
                flexDirection: window.innerWidth > 768 ? "row" : "column", 
                paddingTop: "30px",
                }}>
                
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
                    setATTOMID={setATTOMID}
                    />
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
        </div> :
        <div className="centerText" style={{marginTop: "30px"}}>
            {loadingStatement}
        </div>
        }
    </div>
}

export default MainView;