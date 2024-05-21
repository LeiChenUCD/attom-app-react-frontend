import { queryRecord, getContactInfo } from "../util/util"
import InfoEntry from "./InfoEntry"
import React from "react"
function InfoDisplay(props) {
    const { ATTOMID, db, setNumberOfOptions, curRecordIdx, selectedAddr } = props
    const [record, setRecord] = React.useState([])
    React.useEffect(() => {
        async function loadData(ATTOMID, db) {
            if (db === "contactinfo") {
                const data = getContactInfo()[selectedAddr] === undefined ? [] : getContactInfo()[selectedAddr]
                setRecord(data)
                setNumberOfOptions(data.length)
            } else {
                const data = await queryRecord(ATTOMID, db)
                setRecord(data)
                setNumberOfOptions(data.length)
            }
        }
        loadData(ATTOMID, db)
    }, [ATTOMID, db])

    return <div style={{width: window.innerWidth > 450 ? "900px" : window.innerWidth * 2, display: 'flex', flexFlow: "wrap"}}>
        {record && record.length > 0 && Object.entries(record[curRecordIdx]).map(
            ([fieldName, fieldValue]) => 
            <InfoEntry 
            key={fieldName}
            fieldName={fieldName}
            fieldValue={fieldValue}
            />
            )}
    </div>
}

export default InfoDisplay