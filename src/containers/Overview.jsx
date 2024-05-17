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
            console.log(getContactInfo)
            // console.log(response.data.items)
            setCensusTractOverviewInfo(response.data.items)
            setLoaded(true)
        }
        loadInfo()
    }, [])
    
    return <div style={{display: "flex", flexDirection: "column"}}>
        {loaded ? 
        
        <div className="centerText" style={{marginTop: "30px"}}>
            <div style={{paddingRight: "750px", paddingBottom: "30px"}}
            onInput={e => {
                setAuthorName(e.target.value)
            }}>
                User: <input placeholder={"Please enter your name"} 
                style={{border: "none", borderBottom: "1px black solid", outline: "none"}}></input>
            </div>
            <CensusTractHeader/>
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
            :
        <div className="centerText" style={{marginTop: "30px"}}>
            Loading...
        </div>
        }
    </div>
}

export default Overview