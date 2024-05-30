import React from "react"
import { parseTime } from "../util/util";
function CensusTractEntry(props) {
    const {info, setCensusTract, censusTractOverviewInfo, authorName} = props
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return <div style={{display: "flex", flexDirection: "row", placeContent: "center"}}>
        <div style={{
            minWidth: "100px", height: "30px", border: "1px solid black", color: "blue", 
            cursor: "pointer", textDecoration: isHovered ? "underline" : "none"
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={e => {
            if (authorName.trim() === "") {
                alert("Please enter your name :)")
                return
            }
            setCensusTract(info.censustract)
        }}
        className="centerText">
            {info.censustract}
        </div>

        <div style={{minWidth: "100px", height: "30px", border: "1px solid black"}} className="centerText">
            {info.count}
        </div>

        <div style={{minWidth: "200px", height: "30px", border: "1px solid black"}} className="centerText">
        {censusTractOverviewInfo.length > 0 ? 
            censusTractOverviewInfo[0].fields.Count
            : 
            0}
        </div>

        <div style={{minWidth: "100px", height: "30px", border: "1px solid black"}} className="centerText">
            {censusTractOverviewInfo.length > 0 ? 
            ((censusTractOverviewInfo[0].fields.Count / info.count) * 100).toFixed(2) 
            : 
            0}%
        </div>

        <div style={{minWidth: "150px", height: "30px", border: "1px solid black"}} className="centerText">
            {info.median_arealotsf}
        </div>

        <div style={{minWidth: "150px", height: "30px", border: "1px solid black"}} className="centerText">
        {censusTractOverviewInfo.length > 0 ? 
            parseTime(censusTractOverviewInfo[0].fields.Date)
            : 
            ""}
        </div>

        <div style={{minWidth: "150px", height: "30px", border: "1px solid black"}} className="centerText">
        {censusTractOverviewInfo.length > 0 ? 
            censusTractOverviewInfo[0].fields["Last Commented By"][0].text
            : 
            ""}
        </div>
    </div>
}

export default CensusTractEntry