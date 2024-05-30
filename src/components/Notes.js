import { useEffect } from "react"
import React from "react"
import PrevNote from "./PrevNote"
import { getNote, insertNote, setATTOMIDNoted, parseTime } from "../util/util"

// write to existing record
async function submitOneNote(e, address, note, author, id, prevNotesFull, setId, setPrevNotesFull, censusTract, ATTOMID) {
    if (document.getElementById("note") !== null && (document.getElementById("note").innerText.trim() === "" || document.getElementById("note").innerText.trim() === "loading...")) {
        return
    }
    document.getElementById("submit").innerHTML = "Submitting..."
    setATTOMIDNoted(ATTOMID)
    const ending = prevNotesFull.length > 0 && prevNotesFull[prevNotesFull.length - 1] !== '\n' ? '\n' : ''
    const noteCombined = `${prevNotesFull}${ending}[${parseTime(Date.now())}] ${author}: ${note}`
    setPrevNotesFull(noteCombined)
    const idRet = await insertNote(id, address, noteCombined, censusTract, author, ATTOMID)
    setId(idRet.data.record.id)
    document.getElementById("submit").innerHTML = "Submit"
}

function Notes(props) {
    const {selectedAddr, authorName, setId, id, setPrevNotesFull, prevNotesFull, houseEntry, censusTract, ATTOMID} = props
    const hideClass = selectedAddr === "" ? "hide" : ""
    const [prevNotes, setPrevNotes] = React.useState("")
    function appendText(text) {
        document.getElementById("note").innerHTML += text
    }

    useEffect(() => {
        async function fetchData(ATTOMID) {
            setPrevNotes([])
            if (ATTOMID === "") return
            setId("")
            setPrevNotesFull("")
            var res = undefined
            document.getElementById("note").innerHTML = "loading..."
            res = await getNote(ATTOMID)
            if (res === undefined) {
                document.getElementById("note").innerHTML = ""
                return
            }
            if (res.data.total === 0) {
                document.getElementById("note").innerHTML = ""
                return
            }
            setId(res.data.items[0].record_id)
            var overallNotes = ""
            for (var i = 0; i < res.data.items[0].fields.Notes.length; i++) {
                overallNotes += res.data.items[0].fields.Notes[i].text
            }
            setPrevNotesFull(overallNotes)
            setPrevNotes(res.data.items)
            document.getElementById("note").innerHTML = ""
        }
        fetchData(ATTOMID)
    }, [ATTOMID, houseEntry])

    return <div style={{width: window.innerWidth > 450 ? "450px" : window.innerWidth, 
    display: "flex", 
    flexDirection: "column", 
    marginTop: window.innerWidth > 768 ? "" : "20px",
    marginLeft: window.innerWidth > 768 ? "10px" : "0", 
    }}>

        
        <div style={{className: "top", height: "30px"}} className="centerText left bottom right top">
            {selectedAddr}
            </div>

        <div>
            <PrevNote noteFull={prevNotesFull}/>
        </div>

        <div className="left right" style={{minHeight: "280px", outline: "0px solid transparent"}} contentEditable="true" id="note">
            
        </div>
        
        <div style={{display: "flex", direction: "rtl"}} className="left bottom right">
            <button 
            style={{display: "flex", alignSelf: "end", margin: "5px 10px",
                fontSize: window.innerWidth > 768 ? "" : "16px"
            }} 
            className={`${hideClass}`} 
            onClick={e => {
                e.preventDefault();
                if (authorName.trim() === "") {
                    alert("please enter your name")
                    return
                }
                if (document.getElementById("note").innerHTML !== "") {
                    submitOneNote(e, selectedAddr, document.getElementById("note").innerText, authorName, id, prevNotesFull, setId, setPrevNotesFull, censusTract === 0 ? houseEntry[16] : censusTract, houseEntry[5])
                    const ending = prevNotesFull.length > 0 && prevNotesFull[prevNotesFull.length - 1] !== '\n' ? '\n' : ''
                    const newNote = `${ending}[${parseTime(Date.now())}] ${authorName}: ${document.getElementById("note").innerText}`
                    setPrevNotes(prevNotes + newNote)
                    document.getElementById("note").innerHTML = ""
                }
            }}
            id="submit"
            >Submit</button>
        </div>
        
        
        <div style={{}}>
            <button style={{fontSize: window.innerWidth > 768 ? "" : "15px", textAlign: "left"}} onClick={e => {appendText(e.target.innerHTML)}}>
                Called, cannot reach 
            </button>
            <br></br>
            <button style={{fontSize: window.innerWidth > 768 ? "" : "15px", textAlign: "left"}} onClick={e => {appendText(e.target.innerHTML)}}>
                Called owner, not interested 
            </button>
            <br></br>
            <button style={{fontSize: window.innerWidth > 768 ? "" : "15px", textAlign: "left"}} onClick={e => {appendText(e.target.innerHTML)}}>
                Called owner, need to follow up 
            </button>
            <br></br>
            <button style={{fontSize: window.innerWidth > 768 ? "" : "16px", textAlign: "left"}} onClick={e => {appendText(e.target.innerHTML)}}>
                (Priority) called owner, show interest of selling, FOLLOW UP 
            </button>
            <br></br>
            <button style={{fontSize: window.innerWidth > 768 ? "" : "16px", textAlign: "left"}} onClick={e => {appendText(e.target.innerHTML)}}>
                Replied to REI with interest
            </button>
            <br></br>
            <button style={{fontSize: window.innerWidth > 768 ? "" : "16px", textAlign: "left"}} onClick={e => {appendText(e.target.innerHTML)}}>
            Replied to mail chimp with interest
            </button>
            <br></br>
        </div>
        

    </div>
}

export default Notes