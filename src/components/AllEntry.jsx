import React from "react";
function AllEntry(props) {
    const {totalHomeCount, totalCommentedHouseCount, authorName, setCensusTract} = props

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
            setCensusTract(0)
        }}
        className="centerText">
        All
    </div>

    <div style={{minWidth: "100px", height: "30px", border: "1px solid black"}} className="centerText">
        {totalHomeCount}
    </div>

    <div style={{minWidth: "200px", height: "30px", border: "1px solid black"}} className="centerText">
        {totalCommentedHouseCount}
    </div>

    <div style={{minWidth: "100px", height: "30px", border: "1px solid black"}} className="centerText">
        {((totalCommentedHouseCount / totalHomeCount) * 100).toFixed(2)}%
    </div>

    <div style={{minWidth: "150px", height: "30px", border: "1px solid black"}} className="centerText">
        
    </div>

    <div style={{minWidth: "150px", height: "30px", border: "1px solid black"}} className="centerText">
        
    </div>

    <div style={{minWidth: "150px", height: "30px", border: "1px solid black"}} className="centerText">
        
    </div>
</div>
}

export default AllEntry