function CensusTractHeader() {
    return <div style={{display: "flex", flexDirection: "row", placeContent: "center"}}>
    <div style={{width: "100px", height: "30px", border: "1px solid black"}} className="centerText">
        Census Tract
    </div>

    <div style={{width: "100px", height: "30px", border: "1px solid black"}} className="centerText">
        Home Count
    </div>

    <div style={{width: "200px", height: "30px", border: "1px solid black"}} className="centerText">
        Commented House Count
    </div>

    <div style={{width: "100px", height: "30px", border: "1px solid black"}} className="centerText">
        Comment %
    </div>

    <div style={{width: "150px", height: "30px", border: "1px solid black"}} className="centerText">
        Median Lot Area sf
    </div>

    <div style={{width: "150px", height: "30px", border: "1px solid black"}} className="centerText">
        Last Comment Time
    </div>

    <div style={{width: "150px", height: "30px", border: "1px solid black"}} className="centerText">
        Last Comment By
    </div>
</div>
}

export default CensusTractHeader