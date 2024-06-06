function HouseEntryHeader() {
    return <div style={{minHeight: "30px", border: "1px solid black", display: "flex", flexDirection: "row", fontSize: window.innerWidth > 768 ? "14px" : "13px"}}>
        <div style={{minWidth: "300px", borderRight: "1px solid black", alignContent: "center", textAlign: "center"}}>PropertyAddressFull</div>
        <div style={{minWidth: "100px", borderRight: "1px solid black", alignContent: "center", textAlign: "center"}}>AreaLotSF</div>
        <div style={{minWidth: "100px", borderRight: "1px solid black", alignContent: "center", textAlign: "center"}}>Zonedcodelocal</div>
        <div style={{minWidth: "100px", borderRight: "1px solid black", alignContent: "center", textAlign: "center"}}>Bedroomscount</div>
        <div style={{minWidth: "100px", borderRight: "1px solid black", alignContent: "center", textAlign: "center"}}>Bathcount</div>
        <div style={{minWidth: "100px", borderRight: "1px solid black", alignContent: "center", textAlign: "center"}}>Priority</div>
        <div style={{minWidth: "100px", alignContent: "center", textAlign: "center"}}>Seller Reply</div>
    </div>
}

export default HouseEntryHeader;