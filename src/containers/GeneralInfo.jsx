import InfoDisplay from "../components/InfoDisplay"
import InfoDbSelection from "../components/InfoDbSelection"
import React from "react"

function GeneralInfo(props) {
    const {ATTOMID, selectedAddr, curRecordIdx, setCurRecordIdx} = props
    const [db, setDb] = React.useState("amortizedequity")
    const [numberOfOptions, setNumberOfOptions] = React.useState(4);
    // multiple records with the same id from recorder table
    
    return <div>
        <InfoDbSelection
        setDb={setDb}
        db={db}
        setCurRecordIdx={setCurRecordIdx}
        />
        {(db === "recorder" || db === "contactinfo") && 
        <>
        <select onChange={e => setCurRecordIdx(e.target.value)}>
        {[...Array(numberOfOptions)].map((_, index) => (
          <option key={index} value={index}>{index}</option>
        ))}
      </select>
       ({numberOfOptions})
      </>
        }
        {ATTOMID !== "" &&
            <InfoDisplay 
            ATTOMID={ATTOMID}
            db={db}
            setNumberOfOptions={setNumberOfOptions}
            curRecordIdx={curRecordIdx}
            selectedAddr={selectedAddr}
            />
        }
        
    </div>
}

export default GeneralInfo