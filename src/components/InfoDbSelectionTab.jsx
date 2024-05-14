function InfoDbSelectionTab(props) {
    const { tab, setDb, db, setCurRecordIdx } = props
    const bold = tab === db ? "bold" : ""
    return <div 
    onClick={e => {
        setDb(tab)
        setCurRecordIdx(0)
    }}
    style={{height: '30px', width: "100%", marginTop: "20px", border: "1px solid black", alignContent: "center", textAlign: "center", fontWeight: bold}}>
        {tab}
    </div>
}

export default InfoDbSelectionTab