import Overview from "./Overview"
import React from "react"
import MainView from "./MainView"

// Done:
// 1. give access to acquisition team to use - 用起来提实际建议
// 2. coldcall直接用this acquisition tool
// 6. 把一些房子和区域可以叉掉 以后肯定不会买的。 标注一下灰色之类的。
// 7. 回主页
// 8. 有一列是leads （seller有回复，挑出来重点关注的，放在主页一列）
// 9. overview sum
// 10. phone view

// Working on:
// 3. comments和podio同步起来 
// 4. 和REI reply 同步起来 - text message
// 5. 和mail chimp 同步起来 - email campaign

function Root() {
    const [censusTract, setCensusTract] = React.useState(-1)
    const [authorName, setAuthorName] = React.useState("")
    console.log("endpoint:", process.env.REACT_APP_ENDPOINT)
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