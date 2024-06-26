import React from "react"
import { getHouses } from "../util/util"
import HouseEntry from "./HouseEntry"
import HouseEntryHeader from "./HouseEntryHeader"
import PageManager from "./PageManager"
import { sortHouseHold } from "../util/util"

function HouseHolds(props) {

    const {LotAreaLower, LotAreaUpper, addrFilter, setSelectedAddr, id, selectedAddr, sortMethod, curPage, setCurPage, setHouseEntry, sortedSubset, setSortedSubset, setCenter, authorName, prevNotesFull, notedSubset, censusTract, setZoom, zoom, setATTOMID, ATTOMID, contactInfoSubset, setCurRecordIdx, zoneFilter, bedroomLower, bedroomUpper, bathroomLower, bathroomUpper, keptSubset, selectiveSubset} = props
    const [pageSize, setPageSize] = React.useState(10)
    const [filteredSubset, setFilteredSubset] = React.useState([]);

    // Filter the houses based on LotAreaLower, LotAreaUpper, and addrFilter
    React.useEffect(() => {
        let filteredData = getHouses()
            .filter(house => house[1] >= LotAreaLower)
            .filter(house => house[1] <= LotAreaUpper)
            .filter(house => house[8] >= bedroomLower)
            .filter(house => house[8] <= bedroomUpper)
            .filter(house => house[9] >= bathroomLower)
            .filter(house => house[9] <= bathroomUpper);

        if (addrFilter !== "") {
            filteredData = filteredData.filter(house => house[0].toLowerCase().includes(addrFilter.toLowerCase()));
        }

        if (zoneFilter !== "All") {
            filteredData = filteredData.filter(house => house[7] === zoneFilter)
        }

        if (keptSubset === "Kept Houses") {
            filteredData = filteredData.filter(house => house[11] === true)
        } else if (keptSubset === "Eliminated Houses") {
            filteredData = filteredData.filter(house => house[11] === false)
        }

        if (selectiveSubset === "Selective Houses") {
            filteredData = filteredData.filter(house => house[12] === true)
        } else if (selectiveSubset === "Non-Selective Houses") {
            filteredData = filteredData.filter(house => house[12] === false)
        }

        if (notedSubset === "Noted Addresses") {
            filteredData = filteredData.filter(house => house[4] === true)
        } else if (notedSubset === "Not Noted Addresses") {
            filteredData = filteredData.filter(house => house[4] === false)
        }

        if (contactInfoSubset === "With Contact Info") {
            filteredData = filteredData.filter(house => house[6] === true)
        } else if (contactInfoSubset === "Without Contact Info") {
            filteredData = filteredData.filter(house => house[6] === false)
        }

        setFilteredSubset(filteredData);
    }, [LotAreaLower, LotAreaUpper, bedroomLower, bedroomUpper, bathroomLower, bathroomUpper, addrFilter, notedSubset, contactInfoSubset, zoneFilter, keptSubset, selectiveSubset]);

    // Sort the filteredSubset based on sortMethod
    React.useEffect(() => {
        let sortedData = [...filteredSubset]; // Create a copy of filteredSubset

        sortHouseHold(sortedData, sortMethod)

        setSortedSubset(sortedData);
    }, [filteredSubset, sortMethod, setSortedSubset]);

    

    // data that is current displaying
    const startIdx = curPage * pageSize;
    const endIdx = Math.min(startIdx + pageSize, sortedSubset.length);
    const display = sortedSubset.slice(curPage * pageSize, endIdx)

    const pageNum = Math.ceil(sortedSubset.length / pageSize)

    return <div>
        <PageManager 
        totalCount={sortedSubset.length} 
        startIdx={startIdx} 
        endIdx={endIdx}
        setCurPage={setCurPage}
        curPage={curPage}
        setPageSize={setPageSize}
        pageNum={pageNum}
        />
        <HouseEntryHeader/>
        {display.map((house, idx) => 
        <HouseEntry key={idx} 
        setHouseEntry={setHouseEntry}
        houseEntry = {house} 
        setSelectedAddr={setSelectedAddr} 
        selectedAddr={selectedAddr}
        id={id}
        setCenter={setCenter}
        authorName={authorName}
        prevNotesFull={prevNotesFull}
        censusTract={censusTract}
        setZoom={setZoom}
        zoom={zoom}
        setATTOMID={setATTOMID}
        ATTOMID={ATTOMID}
        setCurRecordIdx={setCurRecordIdx}
        />
        )}
    </div>
}

export default HouseHolds