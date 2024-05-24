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
    
    return <div style={{display: "flex", flexDirection: "row", width: "49.97%", border: "1px solid black"}}>
        <div style={entryStyle}>
            {fieldName}
        </div>

        <div style={entryStyle}>
            {
                fieldName.includes("email") && 
                <a href={`mailto:${fieldValue}?subject=${encodeURIComponent("")}&body=${encodeURIComponent("")}`}>
                    {fieldValue}
                </a>
            }
            {
                (fieldName === "phone_1" || 
                fieldName === "phone_2" || 
                fieldName === "phone_3") &&
                <a href={`tel:${fieldValue}`}>{fieldValue}</a>
            }
            {
                !fieldName.includes("email") && 
                fieldName !== "phone_1" && 
                fieldName !== "phone_2" && 
                fieldName !== "phone_3" && 
                fieldValue
            }
            
        </div>
    </div>
}

export default InfoEntry