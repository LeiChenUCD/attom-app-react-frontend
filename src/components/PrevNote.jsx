import { splitter } from "../util/util"
function PrevNote(props) {
    const {noteFull} = props
    // const {time, author, note} = props
    // const splittedNote = noteFull.split(splitter)
    // const note = splittedNote[0]
    // const author = splittedNote[1]
    // const time = parseFloat(splittedNote[2])
    // const dateSplitter = "-"
    // const showDayOfWeek = false
    
    // const date = new Date(time)
    // const day = date.getDate()
    // const month = date.getMonth() + 1
    // const year = date.getFullYear()
    // const hour = date.getHours()
    // var minute = date.getMinutes()
    // minute = minute < 10 ? "0" + minute : minute
    // const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    // const dayOfWeek = days[date.getDay()]

    // const dateStr = showDayOfWeek ? 
    // `${year}${dateSplitter}${month}${dateSplitter}${day} (${dayOfWeek}) ${hour}:${minute}` 
    // : `${year}${dateSplitter}${month}${dateSplitter}${day} ${hour}:${minute}`

    return <div style={{borderLeft: "1px solid black", borderRight: "1px solid black"}}>
        {/* {`[${dateStr}] ${author}: ${note}`} */}
        <div dangerouslySetInnerHTML={{ __html: noteFull.replace(/\n/g, "<br>") }} />
        {/* {noteFull.replace(/\n/g, "<br>")} */}
    </div>
}

export default PrevNote