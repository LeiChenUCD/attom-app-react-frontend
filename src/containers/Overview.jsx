import { loadCensusTract, loadContactInfo, getCensusTractInfo, getContactInfo, initConnection } from "../util/util"
import CensusTractEntry from "../components/CensusTractEntry"
import CensusTractHeader from "../components/CensusTractHeader"
import React from "react"
import AllEntry from "../components/AllEntry"
function Overview(props) {

    const {setCensusTract, setAuthorName, authorName} = props
    const [loaded, setLoaded] = React.useState(false)
    // overview info group by censustract from postgres
    const [censusTractInfo, setCensusTractInfo] = React.useState([])
    // overview info by censustract from lark overview table
    const [censusTractOverviewInfo, setCensusTractOverviewInfo] = React.useState([])

    const [loadingStatement, setLoadingStatement] = React.useState("Connecting to Server... (1/4)")
    
    React.useEffect(() => {
        async function loadInfo() {
            if (loaded) return
            await initConnection()
            // get overview info group by censustract
            setLoadingStatement("Loading Data from ATTOM... (2/4)")
            const censusTractRes = await loadCensusTract()
            setCensusTractInfo(censusTractRes)

            setLoadingStatement("Loading Comment Overview Info... (3/4)")
            const response = await getCensusTractInfo()

            setLoadingStatement("Loading Contact Info... (4/4)")
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

                
                <AllEntry 
                authorName={authorName}
                totalHomeCount={totalHomeCount}
                totalCommentedHouseCount={totalCommentedHouseCount}
                setCensusTract={setCensusTract}
                />
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
            {loadingStatement}
        </div>
        }
    </div>
}

export default Overview