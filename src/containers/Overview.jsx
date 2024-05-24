import { loadCensusTract, loadContactInfo, getCensusTractInfo, getContactInfo } from "../util/util"
import CensusTractEntry from "../components/CensusTractEntry"
import CensusTractHeader from "../components/CensusTractHeader"
import React from "react"
function Overview(props) {

    const {setCensusTract, setAuthorName, authorName} = props
    const [loaded, setLoaded] = React.useState(false)
    // overview info group by censustract from postgres
    const [censusTractInfo, setCensusTractInfo] = React.useState([])
    // overview info by censustract from lark overview table
    const [censusTractOverviewInfo, setCensusTractOverviewInfo] = React.useState([])
    
    React.useEffect(() => {
        async function loadInfo() {
            // get overview info group by censustract
            const censusTractRes = await loadCensusTract()
            setCensusTractInfo(censusTractRes)
            const response = await getCensusTractInfo()
            await loadContactInfo()
            // console.log(response.data.items)
            setCensusTractOverviewInfo(response.data.items)
            setLoaded(true)
        }
        loadInfo()
    }, [])
    
    const totalHomeCount = censusTractInfo.map(info => parseInt(info.count)).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    const totalCommentedHouseCount = censusTractOverviewInfo.map(info => info.fields['Count']).reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    
    return <div 
    // style={{display: "flex", justifyContent: window.innerWidth > 768 ? "" : "center"}}
    >
        {loaded ? 
        <div style={{display: "flex", 
        overflowX: "auto",
        flexDirection: window.innerWidth > 768 ? "column": ""}}>
            <div className="centerText" style={{marginTop: "30px"}}>
                <div 
                style={{paddingRight: window.innerWidth > 768 ? "750px" : "690px", 
                paddingBottom: "30px"}}
                >
                    User: <input placeholder={"Please enter your name"} onChange={e => {
                        setAuthorName(e.target.value)
                    }}
                    value={authorName !== '' ? authorName : ''}
                    style={{border: "none", borderBottom: "1px black solid", outline: "none"}}></input>
                </div>
                <CensusTractHeader/>

                <div style={{display: "flex", flexDirection: "row", placeContent: "center"}}>
                    <div style={{minWidth: "100px", height: "30px", border: "1px solid black"}} className="centerText">
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

                {censusTractInfo && censusTractInfo.map(
                    (info, idx) => {
                        return <CensusTractEntry 
                        authorName={authorName}
                        key={idx} 
                        info={info} 
                        setCensusTract={setCensusTract}
                        censusTractOverviewInfo={censusTractOverviewInfo.filter(overviewInfo => {
                            return overviewInfo.fields['Census Tract'] === info.censustract
                        })}
                        />
                    }
                )}

            </div>
        </div>
            :
        <div className="centerText" style={{marginTop: "30px"}}>
            Loading...
        </div>
        }
    </div>
}

export default Overview