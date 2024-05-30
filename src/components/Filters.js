import { getHouses } from "../util/util"
function Filters(props) {
    const {setLotAreaLower, setLotAreaUpper, setAddrFilter, setSortMethod, setCurPage, setNotedSubset, 
        setContactInfoSubset, setZoneFilter, setBedroomUpper, setBedroomLower, setBathroomLower, 
        setBathroomUpper, setPriorityLower, setPriorityUpper, setNoteFilter} = props
    const inputStyle = {
        width: "60px"
    }
    return <div style={{display: "flex", flexDirection: "column"}}>
        Address
        <input onInput={e => {
            setAddrFilter(e.target.value.trim())
            setCurPage(0)
        }}></input>

        Note
        <input onInput={e => {
            setNoteFilter(e.target.value.trim())
            setCurPage(0)
        }}></input>

        AreaLotSF
        <div>
        <input style={inputStyle} onInput={e => {
            setLotAreaLower(e.target.value.trim() === "" ? 0 : parseInt(e.target.value))
            setCurPage(0)
            }}></input>
        ————
        <input style={inputStyle} onInput={e => {
            setLotAreaUpper(e.target.value.trim() === "" ? Number.MAX_SAFE_INTEGER : parseInt(e.target.value))
            setCurPage(0)
            }}></input>
        </div>

        zonedcodelocal
        <select onChange={e => {
            console.log(e.target.value)
            setZoneFilter(e.target.value)
            setCurPage(0)
            }}>
                <option>All</option>
                {[...new Set(getHouses().filter(house => house[7] !== null).map(house => house[7]))]
                .map((code, idx) => <option key={idx}>{code}</option>)}
        </select>

        bedroomscount
        <div>
        <input style={inputStyle} onInput={e => {
            setBedroomLower(e.target.value.trim() === "" ? 0 : parseInt(e.target.value))
            setCurPage(0)
            }}></input>
        ————
        <input style={inputStyle} onInput={e => {
            setBedroomUpper(e.target.value.trim() === "" ? Number.MAX_SAFE_INTEGER : parseInt(e.target.value))
            setCurPage(0)
            }}></input>
        </div>

        bathcount
        <div>
        <input style={inputStyle} onInput={e => {
            setBathroomLower(e.target.value.trim() === "" ? 0 : parseInt(e.target.value))
            setCurPage(0)
            }}></input>
        ————
        <input style={inputStyle} onInput={e => {
            setBathroomUpper(e.target.value.trim() === "" ? Number.MAX_SAFE_INTEGER : parseInt(e.target.value))
            setCurPage(0)
            }}></input>
        </div>

        Priority
        <div>
        <input style={inputStyle} onInput={e => {
            setPriorityLower(e.target.value.trim() === "" ? 0 : parseInt(e.target.value))
            setCurPage(0)
            }}></input>
        ————
        <input style={inputStyle} onInput={e => {
            setPriorityUpper(e.target.value.trim() === "" ? Number.MAX_SAFE_INTEGER : parseInt(e.target.value))
            setCurPage(0)
            }}></input>
        </div>

        Order By
        <select onChange={e => {
            setSortMethod(e.target.value)
            setCurPage(0)
            }}>
            <option>Default</option>
            <option>PropertyAddressFull (A-Z)</option>
            <option>PropertyAddressFull (Z-A)</option>
            <option>Smallest AreaLotSF</option>
            <option>Biggest AreaLotSF</option>
            <option>Fewest Bedroomscount</option>
            <option>Most Bedroomscount</option>
            <option>Fewest Bathcount</option>
            <option>Most Bathcount</option>
            <option>Lowest Priority</option>
            <option>Highest Priority</option>
        </select>

        Noted?
        <select onChange={e => {
            setNotedSubset(e.target.value)
            setCurPage(0)
            }}>
            <option>Both</option>
            <option>Noted Addresses</option>
            <option>Not Noted Addresses</option>
        </select>

        Contact Info?
        <select onChange={e => {
            setContactInfoSubset(e.target.value)
            setCurPage(0)
            }}>
            <option>Both</option>
            <option>With Contact Info</option>
            <option>Without Contact Info</option>
        </select>
    </div>
    // <div style={{width: "100px"}}></div>
}

export default Filters