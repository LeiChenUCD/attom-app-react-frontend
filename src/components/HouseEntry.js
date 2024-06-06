import React from "react";
import { insertNote, setATTOMIDNoted, parseTime, insertPriorityInfo, deletePriorityInfo } from "../util/util"

function HouseEntry(props) {
    const {house, setSelectedAddr, selectedAddr, setHouseEntry, setCenter, authorName, prevNotesFull, id, censusTract, setZoom, zoom, setATTOMID, ATTOMID, setCurRecordIdx} = props

    const [dropdownNumber, setDropdownNumber] = React.useState(house[14])

    React.useEffect(() => {
        setDropdownNumber(house[14])
    }, [house])
    
    async function insertPriorityInfoAsync(id, ATTOMID, priority, censusTract) {
        if (house[13] === "") {
            const res = await insertPriorityInfo(id, ATTOMID, priority, censusTract)
            house[13] = res.data.record.id
        } else {
            insertPriorityInfo(id, ATTOMID, priority, censusTract)
        }
    }
    const bold = house[5] === ATTOMID ? "bold" : ""
    return <div className="bottom right left" style={{minHeight: "30px", display: "flex", flexDirection: "row", fontWeight: bold, fontSize: "14px", 
    }}>
        
        <div style={{display: "flex", minWidth: "300px", borderRight: "1px solid black", alignItems: "center", placeContent: "center", cursor: "pointer"}}
        onClick={e => {
            if (authorName.trim() === "" && 
            document.getElementById("note") !== null && 
            document.getElementById("note").innerText.trim() !== "" && 
            document.getElementById("note").innerText.trim() !== "loading...") {
                alert("please enter your name")
                return
            }

            if (document.getElementById("note") !== null && (document.getElementById("note").innerText.trim() === "" || document.getElementById("note").innerText.trim() === "loading...")) {
                setHouseEntry(house)
                setATTOMID(house[5])
                setCenter([house[2], house[3]])
                setSelectedAddr(house[0])
                setZoom(Math.max(18, zoom))
                setCurRecordIdx(0)
                return
            }
            
            if (document.getElementById("note") !== null && document.getElementById("note").innerText.trim() !== "") {
                
                const ending = prevNotesFull.length > 0 && prevNotesFull[prevNotesFull.length - 1] !== '\n' ? '\n' : ''
                const noteCombined = `${prevNotesFull}${ending}[${parseTime(Date.now())}] ${authorName}: ${document.getElementById("note").innerText}`
                insertNote(id, selectedAddr, noteCombined, censusTract === 0 ? house[16] : censusTract, authorName, ATTOMID)

                setATTOMIDNoted(ATTOMID)
            }
            
            setHouseEntry(house)
            setATTOMID(house[5])
            setCenter([house[2], house[3]])
            setSelectedAddr(house[0])
            setZoom(Math.max(18, zoom))
            setCurRecordIdx(0)

            if (document.getElementById("note") !== null) {
                document.getElementById("note").innerHTML = ""
            }
        }}>
            <div style={{width: "250px", textAlign: "center"}}>
                {house[0]}
            </div>

        </div>

        <div style={{minWidth: "100px", borderRight: "1px solid black", alignContent: "center", textAlign: "center"}}>{house[1]}</div>

        <div style={{minWidth: "100px", borderRight: "1px solid black", alignContent: "center", textAlign: "center"}}>{house[7]}</div>

        <div style={{minWidth: "100px", borderRight: "1px solid black", alignContent: "center", textAlign: "center"}}>{house[8]}</div>

        <div style={{minWidth: "100px", borderRight: "1px solid black", alignContent: "center", textAlign: "center"}}>{house[9]}</div>
        <div style={{minWidth: "100px", borderRight: "1px solid black", alignContent: "center", textAlign: "center"}}>
            <select style={{width: "100%", height: "100%", textAlign: "center", border: "0", outline: "none", fontWeight: bold === "bold" ? "bolder" : ""}}
            value={dropdownNumber}
            onChange={e => {
                house[14] = parseInt(e.target.value)
                setDropdownNumber(house[14])
                console.log(house)
                if (e.target.value === "3" && house[13] !== "") {
                    deletePriorityInfo(house[13])
                    house[13] = ""
                } 
                if (e.target.value !== "3") {
                    insertPriorityInfoAsync(house[13], house[5], parseInt(e.target.value), censusTract === 0 ? house[16] : censusTract)
                }
                
            }}>
                <option value={5}>5</option>
                <option value={4}>4</option>
                <option value={3}>3</option>
                <option value={2}>2</option>
                <option value={1}>1</option>
            </select>
        </div>
        <div style={{minWidth: "100px", alignContent: "center", textAlign: "center"}}>
            <a href={house[17]} target="_blank">
                {house[17] === "" ? "" : "Link"}
            </a>
        </div>
    </div>
}
export default HouseEntry