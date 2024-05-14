function InfoEntry(props) {
    const { fieldName, fieldValue } = props

    const entryStyle = {
        display: "flex", 
        width: "50%", 
        height: "30px", 
        borderRight: "1px solid black", 
        fontSize: "12px", 
        alignItems: "center", 
        textAlign: "center", 
        justifyContent: "center"
    }

    return <div style={{display: "flex", flexDirection: "row", width: "49.75%", border: "1px solid black"}}>
        <div style={entryStyle}>
            {fieldName}
        </div>

        <div style={entryStyle}>
            {fieldValue}
        </div>
    </div>
}

export default InfoEntry