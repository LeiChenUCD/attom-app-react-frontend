import Overview from "./Overview"
import React from "react"
import MainView from "./MainView"

function Root() {
    const [censusTract, setCensusTract] = React.useState(-1)
    const [authorName, setAuthorName] = React.useState("")
    return <div>
        {censusTract < 0 ? 
        <Overview 
        setCensusTract={setCensusTract}
        authorName={authorName}
        setAuthorName={setAuthorName}
        /> : 
        <MainView 
        setCensusTract={setCensusTract}
        censusTract={censusTract}
        authorName={authorName}
        setAuthorName={setAuthorName}
        />
        }
    </div>
}

export default Root