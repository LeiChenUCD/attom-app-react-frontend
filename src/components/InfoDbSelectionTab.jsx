function InfoDbSelectionTab(props) {
    const { tab, setDb, db, setCurRecordIdx } = props
    const bold = tab === db ? "bold" : ""
    return <button 
    onClick={e => {
        setDb(tab)
        setCurRecordIdx(0)
    }}
    style={{height: '30px', width: "100%", marginTop: "20px", border: "1px solid black", alignContent: "center", textAlign: "center", fontWeight: bold, cursor: "pointer", fontSize: "14px"}}>
        {tab}
    </button>
}

export default InfoDbSelectionTab