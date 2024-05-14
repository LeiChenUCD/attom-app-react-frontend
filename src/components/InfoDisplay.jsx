import { queryRecord } from "../util/util"
import InfoEntry from "./InfoEntry"
import React from "react"
function InfoDisplay(props) {
    const { ATTOMID, db, setNumberOfOptions, curRecordIdx } = props
    const [record, setRecord] = React.useState([])
    React.useEffect(() => {
        async function loadData(ATTOMID, db) {
            const data = await queryRecord(ATTOMID, db)
            console.log(data)
            setRecord(data)
            setNumberOfOptions(data.length)
        }
        loadData(ATTOMID, db)
    }, [ATTOMID, db])

    return <div style={{width: "900px", display: 'flex', flexFlow: "wrap"}}>
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