function PrevNote(props) {
    const {noteFull} = props

    return <div style={{borderLeft: "1px solid black", borderRight: "1px solid black"}}>
        <div dangerouslySetInnerHTML={{ __html: noteFull.replace(/\n/g, "<br>") }} />
    </div>
}

export default PrevNote