import React from "react";
import { insertNote } from "../util/util"
import { splitter, noteSplitter } from "../util/util"
import { setAddrNoted, setATTOMIDNoted, parseTime, insertToggleInfo, deleteToggleInfo, insertPriorityInfo, deletePriorityInfo } from "../util/util"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff, faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';

function HouseEntry(props) {
    const {house, setSelectedAddr, selectedAddr, setHouseEntry, setCenter, authorName, prevNotesFull, id, censusTract, setZoom, zoom, setATTOMID, ATTOMID, setCurRecordIdx} = props
    // console.log(house[11])
    // grey out unwanted houses
    // const [keepHouse, setKeepHouse] = React.useState(true)
    // select house in selective entry in overview page
    // const [selectedHouse, setSelectedHouse] = React.useState(false)
    // console.log(house)

    // React.useEffect(() => {
    //     setKeepHouse(house[11])
    //     setSelectedHouse(house[12])
    // }, [house])

    const [dropdownNumber, setDropdownNumber] = React.useState(house[14])

    React.useEffect(() => {
        setDropdownNumber(house[14])
    }, [house])

    async function insertToggleInfoAsync(id, ATTOMID, keepHouse, selectiveHouse, censusTract) {
        console.log(house[10])
        if (house[10] === "") {
            const res = await insertToggleInfo(id, ATTOMID, keepHouse, selectiveHouse, censusTract)
            console.log(res.data.record.id)
            house[10] = res.data.record.id
        } else {
            insertToggleInfo(id, ATTOMID, keepHouse, selectiveHouse, censusTract)
        }
    }
    
    async function insertPriorityInfoAsync(id, ATTOMID, priority, censusTract) {
        if (house[13] === "") {
            const res = await insertPriorityInfo(id, ATTOMID, priority, censusTract)
            house[13] = res.data.record.id
        } else {
            insertPriorityInfo(id, ATTOMID, priority, censusTract)
        }
    }
    // console.log(house)
    const bold = house[5] === ATTOMID ? "bold" : ""
    return <div className="bottom right left" style={{minHeight: "30px", display: "flex", flexDirection: "row", fontWeight: bold, fontSize: "14px", 
    // background: keepHouse ? "" : "grey" 
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
                // const noteCombined = prevNotesFull + document.getElementById("note").innerText + splitter + authorName + splitter + Date.now() + noteSplitter
                
                const ending = prevNotesFull.length > 0 && prevNotesFull[prevNotesFull.length - 1] !== '\n' ? '\n' : ''
                const noteCombined = `${prevNotesFull}${ending}[${parseTime(Date.now())}] ${authorName}: ${document.getElementById("note").innerText}`
                // id, address, note)
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
            {/* <div style={{width: "40px", textAlign: 'center'}}>

            <FontAwesomeIcon 
            style={{paddingRight: "10px"}}
            onClick={e => {
                e.stopPropagation()
                // console.log("hi")
                house[11] = !house[11]
                setKeepHouse(house[11])
                if (!house[11] && house[12]) {
                    house[12] = false
                    setSelectedHouse(house[12])
                }
                // update greyout / selective information
                // id, ATTOMID, keepHouse, selectiveHouse, censusTract
                if (house[11] && !house[12]) {
                    deleteToggleInfo(house[10])
                    house[10] = ""
                } else {
                    insertToggleInfoAsync(house[10], house[5], house[11], house[12], censusTract)
                }
            }}
              icon={house[11] && keepHouse ? faToggleOff : faToggleOn}
            />

            {keepHouse && <FontAwesomeIcon
            onClick={e => {
                e.stopPropagation()
                house[12] = !house[12]
                setSelectedHouse(house[12])

                // update greyout / selective information
                if (house[11] && !house[12]) {
                    deleteToggleInfo(house[10])
                    house[10] = ""
                } else {
                    insertToggleInfoAsync(house[10], house[5], house[11], house[12], censusTract)
                }
            }}
              icon={selectedHouse ? faCheckSquare: faSquare}
            />}
            </div> */}

        </div>

        <div style={{minWidth: "100px", borderRight: "1px solid black", alignContent: "center", textAlign: "center"}}>{house[1]}</div>

        <div style={{minWidth: "100px", borderRight: "1px solid black", alignContent: "center", textAlign: "center"}}>{house[7]}</div>

        <div style={{minWidth: "100px", borderRight: "1px solid black", alignContent: "center", textAlign: "center"}}>{house[8]}</div>

        <div style={{minWidth: "100px", borderRight: "1px solid black", alignContent: "center", textAlign: "center"}}>{house[9]}</div>
        <div style={{minWidth: "100px", alignContent: "center", textAlign: "center"}}>
            <select style={{width: "100%", height: "100%", textAlign: "center", border: "0", outline: "none", fontWeight: bold === "bold" ? "bolder" : ""}}
            value={dropdownNumber}
            // defaultValue={3}
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
        
    </div>
}
export default HouseEntry