import { insertNote } from "../util/util"
import { splitter, noteSplitter } from "../util/util"
import { setAddrNoted, setATTOMIDNoted, parseTime } from "../util/util"
function HouseEntry(props) {
    const {houseEntry, setSelectedAddr, selectedAddr, setHouseEntry, setCenter, authorName, prevNotesFull, id, censusTract, setZoom, zoom, setATTOMID, ATTOMID, setCurRecordIdx} = props
    console.log(houseEntry)
    const bold = houseEntry[5] === ATTOMID ? "bold" : ""
    return <div className="bottom right left" style={{minHeight: "30px", display: "flex", flexDirection: "row", fontWeight: bold, fontSize: "14px"}}>
        
        <div style={{width: "300px", borderRight: "1px solid black", alignContent: "center", textAlign: "center"}}
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
        }}>{houseEntry[0]}</div>

        <div style={{minWidth: "100px", borderRight: "1px solid black", alignContent: "center", textAlign: "center"}}>{houseEntry[1]}</div>

        <div style={{minWidth: "100px", borderRight: "1px solid black", alignContent: "center", textAlign: "center"}}>{houseEntry[7]}</div>

        <div style={{minWidth: "100px", borderRight: "1px solid black", alignContent: "center", textAlign: "center"}}>{houseEntry[8]}</div>

        <div style={{minWidth: "100px", alignContent: "center", textAlign: "center"}}>{houseEntry[9]}</div>
        
    </div>
}
export default HouseEntry