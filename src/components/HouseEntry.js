import React from "react";
import { insertNote } from "../util/util"
import { splitter, noteSplitter } from "../util/util"
import { setAddrNoted, setATTOMIDNoted, parseTime, insertToggleInfo, deleteToggleInfo } from "../util/util"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff, faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';

function HouseEntry(props) {
    const {houseEntry, setSelectedAddr, selectedAddr, setHouseEntry, setCenter, authorName, prevNotesFull, id, censusTract, setZoom, zoom, setATTOMID, ATTOMID, setCurRecordIdx} = props
    // console.log(houseEntry[11])
    // grey out unwanted houses
    const [keepHouse, setKeepHouse] = React.useState(true)
    // select house in selective entry in overview page
    const [selectedHouse, setSelectedHouse] = React.useState(false)
    // console.log(houseEntry)

    React.useEffect(() => {
        setKeepHouse(houseEntry[11])
        setSelectedHouse(houseEntry[12])
    }, [houseEntry])

    async function insertToggleInfoAsync(id, ATTOMID, keepHouse, selectiveHouse, censusTract) {
        console.log(houseEntry[10])
        if (houseEntry[10] === "") {
            const res = await insertToggleInfo(id, ATTOMID, keepHouse, selectiveHouse, censusTract)
            console.log(res.data.record.id)
            houseEntry[10] = res.data.record.id
        } else {
            insertToggleInfo(id, ATTOMID, keepHouse, selectiveHouse, censusTract)
        }
    }

    const bold = houseEntry[5] === ATTOMID ? "bold" : ""
    return <div className="bottom right left" style={{minHeight: "30px", display: "flex", flexDirection: "row", fontWeight: bold, fontSize: "14px", background: keepHouse ? "" : "grey"}}>
        
        <div style={{display: "flex", minWidth: "300px", borderRight: "1px solid black", alignItems: "center", placeContent: "center"}}
        onClick={e => {
            if (authorName.trim() === "" && 
            document.getElementById("note") !== null && 
            document.getElementById("note").innerText.trim() !== "" && 
            document.getElementById("note").innerText.trim() !== "loading...") {
                alert("please enter your name")
                return
            }

            if (document.getElementById("note") !== null && (document.getElementById("note").innerText.trim() === "" || document.getElementById("note").innerText.trim() === "loading...")) {
                setHouseEntry(houseEntry)
                setATTOMID(houseEntry[5])
                setCenter([houseEntry[2], houseEntry[3]])
                setSelectedAddr(houseEntry[0])
                setZoom(Math.max(18, zoom))
                setCurRecordIdx(0)
                return
            }
            
            if (document.getElementById("note") !== null && document.getElementById("note").innerText.trim() !== "") {
                // const noteCombined = prevNotesFull + document.getElementById("note").innerText + splitter + authorName + splitter + Date.now() + noteSplitter
                
                const ending = prevNotesFull.length > 0 && prevNotesFull[prevNotesFull.length - 1] !== '\n' ? '\n' : ''
                const noteCombined = `${prevNotesFull}${ending}[${parseTime(Date.now())}] ${authorName}: ${document.getElementById("note").innerText}`
                // id, address, note)
                insertNote(id, selectedAddr, noteCombined, censusTract, authorName, ATTOMID)

                setATTOMIDNoted(ATTOMID)
            }
            
            setHouseEntry(houseEntry)
            setATTOMID(houseEntry[5])
            setCenter([houseEntry[2], houseEntry[3]])
            setSelectedAddr(houseEntry[0])
            setZoom(Math.max(18, zoom))
            setCurRecordIdx(0)

            if (document.getElementById("note") !== null) {
                document.getElementById("note").innerHTML = ""
            }
        }}>
            <div style={{width: "250px", textAlign: "center"}}>
                {houseEntry[0]}
            </div>
            <div style={{width: "40px", textAlign: 'center'}}>

            <FontAwesomeIcon 
            style={{paddingRight: "10px"}}
            onClick={e => {
                e.stopPropagation()
                // console.log("hi")
                houseEntry[11] = !houseEntry[11]
                setKeepHouse(houseEntry[11])
                if (!houseEntry[11] && houseEntry[12]) {
                    houseEntry[12] = false
                    setSelectedHouse(houseEntry[12])
                }
                // update greyout / selective information
                // id, ATTOMID, keepHouse, selectiveHouse, censusTract
                if (houseEntry[11] && !houseEntry[12]) {
                    deleteToggleInfo(houseEntry[10])
                    houseEntry[10] = ""
                } else {
                    insertToggleInfoAsync(houseEntry[10], houseEntry[5], houseEntry[11], houseEntry[12], censusTract)
                }
            }}
              icon={houseEntry[11] && keepHouse ? faToggleOff : faToggleOn}
            />

            {keepHouse && <FontAwesomeIcon
            onClick={e => {
                e.stopPropagation()
                houseEntry[12] = !houseEntry[12]
                setSelectedHouse(houseEntry[12])

                // update greyout / selective information
                if (houseEntry[11] && !houseEntry[12]) {
                    deleteToggleInfo(houseEntry[10])
                    houseEntry[10] = ""
                } else {
                    insertToggleInfoAsync(houseEntry[10], houseEntry[5], houseEntry[11], houseEntry[12], censusTract)
                }
            }}
              icon={selectedHouse ? faCheckSquare: faSquare}
            />}
            </div>

        </div>

        <div style={{minWidth: "100px", borderRight: "1px solid black", alignContent: "center", textAlign: "center"}}>{houseEntry[1]}</div>

        <div style={{minWidth: "100px", borderRight: "1px solid black", alignContent: "center", textAlign: "center"}}>{houseEntry[7]}</div>

        <div style={{minWidth: "100px", borderRight: "1px solid black", alignContent: "center", textAlign: "center"}}>{houseEntry[8]}</div>

        <div style={{minWidth: "100px", alignContent: "center", textAlign: "center"}}>{houseEntry[9]}</div>
        
    </div>
}
export default HouseEntry