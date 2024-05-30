function MandatoryFields(props) {
    const {setAuthorName, censusTract, authorName} = props

    return <div style={{display: "flex", flexDirection: "column"}} 
    onInput={e => setAuthorName(e.target.value)}>
        <div>
        Census Tract: {censusTract === 0 ? "All" : censusTract}
        </div>
        User: {authorName}
        {/* <input placeholder={"Please enter your name here"}></input> */}
        
    </div>
}

export default MandatoryFields;