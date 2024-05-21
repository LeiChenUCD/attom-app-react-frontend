import InfoDbSelectionTab from "./InfoDbSelectionTab"
function InfoDbSelection(props) {
    const {setDb, db, setCurRecordIdx} = props
    return <div style={{
        width:  window.innerWidth > 450 ? "899px" : window.innerWidth * 2 - 1, marginTop: "20px", display: 'flex', flexDirection: "row"}}>
        <InfoDbSelectionTab tab={"amortizedequity"} setDb={setDb} db={db} setCurRecordIdx={setCurRecordIdx}/>
        <InfoDbSelectionTab tab={"recorder"} setDb={setDb} db={db} setCurRecordIdx={setCurRecordIdx}/>
        <InfoDbSelectionTab tab={"taxassessor"} setDb={setDb} db={db} setCurRecordIdx={setCurRecordIdx}/>
        <InfoDbSelectionTab tab={"contactinfo"} setDb={setDb} db={db} setCurRecordIdx={setCurRecordIdx}/>
    </div>
}

export default InfoDbSelection