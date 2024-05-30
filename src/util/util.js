import { households } from "../assets/households";
// const endpoint = "http://localhost:3001/"
// const endpoint = "https://attom-app-react-backend.onrender.com/"
const endpoint = process.env.REACT_APP_ENDPOINT
console.log("endpoint:", process.env.REACT_APP_ENDPOINT)
export function execPostgresQuery(query) {
    const obj = {
        query
    }
    const requestOptions = {
        // mode: 'no-cors',
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    };
    // console.log(requestOptions.body)
    return fetch(endpoint + "executeQuery", requestOptions)
    .then(res => res.json())
    .then(data => {
        // console.log(data)
        return data
    })
    .catch((error) => {
        // alert(error);
        console.error("Error:", error);
    });
}

export function insertNote(id, address, note, censusTract, author, ATTOMID) {
    // console.log(note.trim() === "")
    if (note === "loading...") return
    if (note.trim() === "") return
    const obj = {
        id,
        censusTract,
        author,
        fields: {
            fields: {
                Address: address,
                Notes: note,
                ATTOMID: ATTOMID,
                "Census Tract": censusTract
            }
        }
    }
    const requestOptions = {
        // mode: 'no-cors',
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    };
    // console.log(requestOptions.body)
    return fetch(endpoint + "insertNote", requestOptions)
    .then(res => res.json())
    .then(data => {return data})
    .catch((error) => {
        // alert(error);
        console.error("Error:", error);
      });
}

export function insertOneNote(address, note, author) {
    if (note === "loading...") return
    if (note.trim() === "") return
    if (author.trim() === "") {
        alert("please enter your name")
        return
    }
    const obj = {
        fields: {
            fields: {
                Address: address,
                Notes: note,
                Author: author,
                Time: Date.now()
            }
        }
    }
    const requestOptions = {
        // mode: 'no-cors',
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    };
    // console.log(requestOptions.body)
    return fetch(endpoint + "insertOneNote", requestOptions)
    .then(res => res.json())
    .then(data => {return data})
    .catch((error) => {
        // alert(error);
        console.error("Error:", error);
      });
}

export function insertToggleInfo(id, ATTOMID, keepHouse, selectiveHouse, censusTract) {
    const obj = {
        id,
        fields: {
            fields: {
                ATTOMID,
                "Keep House": keepHouse ? "true" : "false",
                "Selective House": selectiveHouse ? "true" : "false",
                "Census Tract": censusTract
            }
        }
    }
    const requestOptions = {
        // mode: 'no-cors',
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    };
    // console.log(requestOptions.body)
    return fetch(endpoint + "insertToggleInfo", requestOptions)
    .then(res => res.json())
    .then(data => {return data})
    .catch((error) => {
        // alert(error);
        console.error("Error:", error);
      });
}

export function deleteToggleInfo(id) {
    const obj = {
        id
    }
    const requestOptions = {
        // mode: 'no-cors',
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    };
    // console.log(requestOptions.body)
    return fetch(endpoint + "deleteToggleInfo", requestOptions)
    .then(res => res.json())
    .then(data => {return data})
    .catch((error) => {
        // alert(error);
        console.error("Error:", error);
    });
}

export function insertPriorityInfo(id, ATTOMID, priority, censusTract) {
    const obj = {
        id,
        fields: {
            fields: {
                ATTOMID,
                Priority: priority,
                "Census Tract": censusTract
            }
        }
    }
    const requestOptions = {
        // mode: 'no-cors',
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    };
    // console.log(requestOptions.body)
    return fetch(endpoint + "insertPriorityInfo", requestOptions)
    .then(res => res.json())
    .then(data => {return data})
    .catch((error) => {
        // alert(error);
        console.error("Error:", error);
      });
}

export function deletePriorityInfo(id) {
    const obj = {
        id
    }
    const requestOptions = {
        // mode: 'no-cors',
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    };
    // console.log(requestOptions.body)
    return fetch(endpoint + "deletePriorityInfo", requestOptions)
    .then(res => res.json())
    .then(data => {return data})
    .catch((error) => {
        // alert(error);
        console.error("Error:", error);
    });
}

export function loadToggleInfoCensusTract(censusTract) {
    const obj = {
        censusTract
    }
    const requestOptions = {
        // mode: 'no-cors',
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    };
    // console.log(requestOptions.body)
    return fetch(endpoint + "getToggleInfoCensusTract", requestOptions)
    .then(res => res.json())
    .then(data => {
        // house[5] is attom id
        // console.log(data.data.items)
        var toggleDict = {}
        for (var item of data.data.items) {
            toggleDict[item.fields.ATTOMID[0].text] = [item.record_id, item.fields["Keep House"][0].text, item.fields["Selective House"][0].text]
        }
        // console.log(toggleDict)
        houses = houses.map(house => {
            if (house[5] in toggleDict) {
                house[10] = toggleDict[house[5]][0]
                house[11] = toggleDict[house[5]][1] === "true" ? true : false
                house[12] = toggleDict[house[5]][2] === "true" ? true : false
            }
            return house
        })
        // console.log(houses)
        return data
    })
    .catch((error) => {
        // alert(error);
        console.error("Error:", error);
    });
}

export function loadPriorityInfoCensusTract(censusTract) {
    const obj = {
        censusTract
    }
    const requestOptions = {
        // mode: 'no-cors',
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    };
    // console.log(requestOptions.body)
    return fetch(endpoint + "getPriorityInfoCensusTract", requestOptions)
    .then(res => res.json())
    .then(data => {
        // house[5] is attom id
        // console.log(data.data.items)
        var priorityDict = {}
        for (var item of data.data.items) {
            priorityDict[item.fields.ATTOMID[0].text] = [item.record_id, item.fields.Priority]
        }
        // console.log(priorityDict)
        houses = houses.map(house => {
            if (house[5] in priorityDict) {
                house[13] = priorityDict[house[5]][0]
                house[14] = priorityDict[house[5]][1]
            }
            return house
        })
        // console.log(houses)
        return data
    })
    .catch((error) => {
        // alert(error);
        console.error("Error:", error);
    });
}

export function loadPriorityInfoAll() {
    const requestOptions = {
        // mode: 'no-cors',
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    };
    // console.log(requestOptions.body)
    return fetch(endpoint + "getPriorityInfoAll", requestOptions)
    .then(res => res.json())
    .then(data => {
        // house[5] is attom id
        // console.log(data.data.items)
        var priorityDict = {}
        for (var item of data.data.items) {
            priorityDict[item.fields.ATTOMID[0].text] = [item.record_id, item.fields.Priority]
        }
        // console.log(priorityDict)
        houses = houses.map(house => {
            if (house[5] in priorityDict) {
                house[13] = priorityDict[house[5]][0]
                house[14] = priorityDict[house[5]][1]
            }
            return house
        })
        // console.log(houses)
        return data
    })
    .catch((error) => {
        // alert(error);
        console.error("Error:", error);
    });
}

function getNotedAddress() {
    const requestOptions = {
        // mode: 'no-cors',
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    };
    
    return fetch(endpoint + "getNotedAddress", requestOptions)
    .then(res => res.json())
    .then(data => {
        // console.log(data.data.items.map(addr => addr.fields.Address[0].text))
        return data.data.items.map(addr => addr.fields.Address[0].text)
    })
    .catch((error) => {
        // alert(error);
        console.error("Error:", error);
    });
}

function getNotedATTOMID() {
    const requestOptions = {
        // mode: 'no-cors',
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    };
    
    return fetch(endpoint + "getNotedATTOMID", requestOptions)
    .then(res => res.json())
    .then(data => {
        // console.log(data.data.items.map(addr => addr.fields.Address[0].text))
        return data.data.items.map(addr => addr.fields.ATTOMID[0].text)
    })
    .catch((error) => {
        // alert(error);
        console.error("Error:", error);
    });
}

export function getNote(ATTOMID) {
    const obj = {
        ATTOMID
    }
    const requestOptions = {
        // mode: 'no-cors',
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    };
    // console.log(requestOptions.body)
    return fetch(endpoint + "getNote", requestOptions)
    .then(res => {
        // Check if the response is ok (status code 200)
        // console.log(res)
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        // Parse the JSON response and return it (returns a Promise)
        return res.json();
      })
    .then(res => {
        // console.log(res)
        return res})
    .catch((error) => {
        // alert(error);
        console.error("Error:", error);
      });
}

export function loadNoteCensusTract(censusTract) {
    const obj = {
        censusTract
    }
    const requestOptions = {
        // mode: 'no-cors',
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    };
    // console.log(requestOptions.body)
    return fetch(endpoint + "getNoteCensusTract", requestOptions)
    .then(res => res.json())
    .then(data => {
        const theNotes = data.data.items.reduce((acc, house) => {
            acc[house.fields.ATTOMID[0].text] = house.fields.Notes.map(note => note.text).join('');
            return acc;
          }, {});
        // console.log(theNotes)
        for (var house of houses) {
            if (house[5] in theNotes) {
                house[15] = theNotes[house[5]]
            }
        }
        return data
    })
    .catch((error) => {
        // alert(error);
        console.error("Error:", error);
    });
}

export function loadNoteAll() {
    const requestOptions = {
        // mode: 'no-cors',
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    // console.log(requestOptions.body)
    return fetch(endpoint + "getNoteAll", requestOptions)
    .then(res => res.json())
    .then(data => {
        const theNotes = data.data.items.reduce((acc, house) => {
            acc[house.fields.ATTOMID[0].text] = house.fields.Notes.map(note => note.text).join('');
            return acc;
          }, {});
        // console.log(theNotes)
        for (var house of houses) {
            if (house[5] in theNotes) {
                house[15] = theNotes[house[5]]
            }
        }
        return data
    })
    .catch((error) => {
        // alert(error);
        console.error("Error:", error);
    });
}

// loadNoteCensusTract(507205)

var censusTractInfo = {}
export function getCensusTractInfo() {
    // if (Object.keys(censusTractInfo).length > 0) {
    //     return censusTractInfo
    // }
    const requestOptions = {
        // mode: 'no-cors',
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    // console.log(requestOptions.body)
    return fetch(endpoint + "getCensusTractInfo", requestOptions)
    .then(res => {
        // Check if the response is ok (status code 200)
        // console.log(res)
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        // Parse the JSON response and return it (returns a Promise)
        return res.json();
      })
    .then(res => {
        censusTractInfo = res
        return res})
    .catch((error) => {
        // alert(error);
        console.error("Error:", error);
      });
}

export function parseTime(time, showDayOfWeek = false) {
    const dateSplitter = "-"
    
    const date = new Date(time)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const hour = date.getHours()
    var minute = date.getMinutes()
    minute = minute < 10 ? "0" + minute : minute
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const dayOfWeek = days[date.getDay()]

    const dateStr = showDayOfWeek ? 
    `${year}${dateSplitter}${month}${dateSplitter}${day} (${dayOfWeek}) ${hour}:${minute}` 
    : `${year}${dateSplitter}${month}${dateSplitter}${day} ${hour}:${minute}`
    return dateStr
}

export function sortHouseHold(sortedData, sortMethod) {
    if (sortMethod === "PropertyAddressFull (A-Z)") {
        sortedData.sort((a, b) => {
            const addressA = a[0].toUpperCase();
            const addressB = b[0].toUpperCase();
            if (addressA < addressB) {
                return -1;
            }
            if (addressA > addressB) {
                return 1;
            }
            return 0;
        });
    } else if (sortMethod === "PropertyAddressFull (Z-A)") {
        sortedData.sort((a, b) => {
            const addressA = a[0].toUpperCase();
            const addressB = b[0].toUpperCase();
            if (addressA < addressB) {
                return 1;
            }
            if (addressA > addressB) {
                return -1;
            }
            return 0;
        });
    } else if (sortMethod === "Smallest AreaLotSF") {
        sortedData.sort((a, b) => {
            if (a[1] < b[1]) {
                return -1;
            }
            if (a[1] > b[1]) {
                return 1;
            }
            return 0;
        });
    } else if (sortMethod === "Biggest AreaLotSF") {
        sortedData.sort((a, b) => {
            if (a[1] < b[1]) {
                return 1;
            }
            if (a[1] > b[1]) {
                return -1;
            }
            return 0;
        });
    } else if (sortMethod === "Fewest Bedroomscount") {
        sortedData.sort((a, b) => {
            if (a[8] < b[8]) {
                return -1;
            }
            if (a[8] > b[8]) {
                return 1;
            }
            return 0;
        });
    } else if (sortMethod === "Most Bedroomscount") {
        sortedData.sort((a, b) => {
            if (a[8] < b[8]) {
                return 1;
            }
            if (a[8] > b[8]) {
                return -1;
            }
            return 0;
        });
    } else if (sortMethod === "Fewest Bathcount") {
        sortedData.sort((a, b) => {
            if (a[9] < b[9]) {
                return -1;
            }
            if (a[9] > b[9]) {
                return 1;
            }
            return 0;
        });
    } else if (sortMethod === "Most Bathcount") {
        sortedData.sort((a, b) => {
            if (a[9] < b[9]) {
                return 1;
            }
            if (a[9] > b[9]) {
                return -1;
            }
            return 0;
        });
    } else if (sortMethod === "Lowest Priority") {
        sortedData.sort((a, b) => {
            if (a[14] < b[14]) {
                return -1;
            }
            if (a[14] > b[14]) {
                return 1;
            }
            return 0;
        });
    } else if (sortMethod === "Highest Priority") {
        sortedData.sort((a, b) => {
            if (a[14] < b[14]) {
                return 1;
            }
            if (a[14] > b[14]) {
                return -1;
            }
            return 0;
        });
    }
}

export function isBetween(num, boundA, boundB) {
    return (boundA >= num && boundB <= num) || (boundA <= num && boundB >= num)
}

export const splitter = "%-%"
export const noteSplitter = "%^%"

export function convexHull(points) {
    if (points.length < 3) {
        return points;
    }

    points.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);

    const upper = [];
    const lower = [];

    for (const point of points) {
        while (upper.length >= 2 && 
               isNotRightTurn(upper[upper.length - 2], 
               upper[upper.length - 1], point)) {
            upper.pop();
        }
        upper.push(point);
    }

    for (let i = points.length - 1; i >= 0; i--) {
        const point = points[i];
        while (lower.length >= 2 && 
               isNotRightTurn(lower[lower.length - 2], 
               lower[lower.length - 1], point)) {
            lower.pop();
        }
        lower.push(point);
    }

    // lower.push(upper[0])

    const hull = new Set([...upper, ...lower]);
    return Array.from(hull);
}
// Nikunj Sonigara

// Function to check the correct direction
function isNotRightTurn(a, b, c) {
    return (b[0] - a[0]) * (c[1] - a[1]) - 
           (b[1] - a[1]) * (c[0] - a[0]) <= 0;
}

// [PropertyAddressFull, AreaLotSF, lat, long, noted (bool)]

var houses = []
// get houses from ATTOM database
async function loadHousesFromATTOMPostgres() {
    // var houses = [["1510 CAMDEN AVE",9424.0,37.267636,-121.942385],["1500 CAMDEN AVE",8132.0,37.267784,-121.942569]]
    const houseRes = await execPostgresQuery("\
    SELECT \
        PropertyAddressFull, AreaLotSF, PropertyLatitude, PropertyLongitude \
    FROM \
        taxassessor \
    where \
        PropertyAddressCity = 'CAMPBELL' \
        AND PropertyAddressFull IS NOT NULL \
        AND AreaLotSF IS NOT NULL \
        AND PropertyLatitude IS NOT NULL \
        AND PropertyLongitude IS NOT NULL \
     ")

    houses = houseRes.map(house => 
        [house.propertyaddressfull, house.arealotsf, house.propertylatitude, house.propertylongitude]
    )
    // return houses
}

async function loadHousesFromATTOMPostgresTract(tract) {
    // var houses = [["1510 CAMDEN AVE",9424.0,37.267636,-121.942385],["1500 CAMDEN AVE",8132.0,37.267784,-121.942569]]
    const houseRes = await execPostgresQuery(`\
    SELECT \
        PropertyAddressFull, \
        AreaLotSF, \
        PropertyLatitude, \
        PropertyLongitude, \
        "[attom id]", \
        zonedcodelocal, \
        bedroomscount, \
        bathcount \
    FROM \
        taxassessor \
    where \
        PropertyAddressCity = 'CAMPBELL' \
        AND CensusTract = '${tract}' \
        AND PropertyAddressFull IS NOT NULL \
        AND AreaLotSF IS NOT NULL \
        AND PropertyLatitude IS NOT NULL \
        AND PropertyLongitude IS NOT NULL \
     `)

    // console.log(houseRes)
    // first false: has comments or not
    // second false: has contact info or not
    // 0 house.propertyaddressfull
    // 1 house.arealotsf
    // 2 house.propertylatitude
    // 3 house.propertylongitude
    // 4 have notes - false
    // 5 house['[attom id]']
    // 6 have contact info - false
    // 7 house.zonedcodelocal
    // 8 house.bedroomscount
    // 9 house.bathcount
    // 10 id for greyout / selective house table
    // 11 keep or not (greyout for not keeping)
    // 12 selective house?
    // 13 priority table id
    // 14 priority value
    // 15 note
    // 16 census track
    houses = houseRes.map(house => 
        [house.propertyaddressfull, house.arealotsf, house.propertylatitude, house.propertylongitude, 
            false, house['[attom id]'], false, house.zonedcodelocal, house.bedroomscount, house.bathcount, 
            "", true, false, "", 3, "", 0]
    )
    // return houses
}

async function loadHousesFromATTOMPostgresAll() {
    // var houses = [["1510 CAMDEN AVE",9424.0,37.267636,-121.942385],["1500 CAMDEN AVE",8132.0,37.267784,-121.942569]]
    const houseRes = await execPostgresQuery(`\
    SELECT \
        PropertyAddressFull, \
        AreaLotSF, \
        PropertyLatitude, \
        PropertyLongitude, \
        "[attom id]", \
        zonedcodelocal, \
        bedroomscount, \
        bathcount, \
        censustract \
    FROM \
        taxassessor \
    where \
        PropertyAddressCity = 'CAMPBELL' \
        AND PropertyAddressFull IS NOT NULL \
        AND AreaLotSF IS NOT NULL \
        AND PropertyLatitude IS NOT NULL \
        AND PropertyLongitude IS NOT NULL \
     `)

    // console.log(houseRes)
    // first false: has comments or not
    // second false: has contact info or not
    // 0 house.propertyaddressfull
    // 1 house.arealotsf
    // 2 house.propertylatitude
    // 3 house.propertylongitude
    // 4 have notes - false
    // 5 house['[attom id]']
    // 6 have contact info - false
    // 7 house.zonedcodelocal
    // 8 house.bedroomscount
    // 9 house.bathcount
    // 10 id for greyout / selective house table
    // 11 keep or not (greyout for not keeping)
    // 12 selective house?
    // 13 priority table id
    // 14 priority value
    // 15 note
    // 16 census track
    
    houses = houseRes.map(house => 
        [house.propertyaddressfull, house.arealotsf, house.propertylatitude, house.propertylongitude, 
            false, house['[attom id]'], false, house.zonedcodelocal, house.bedroomscount, house.bathcount, 
            "", true, false, "", 3, "", house.censustract]
    )
    // return houses
}

async function loadHousesFromATTOMMemory() {
    houses = households
}

export async function initConnection() {
    const requestOptions = {
        // mode: 'no-cors',
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    return fetch(endpoint + "initConnection", requestOptions)
    .then(res => {
        // Check if the response is ok (status code 200)
        // console.log(res)
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        // Parse the JSON response and return it (returns a Promise)
        return res.json();
      })
    .then(res => {
        // console.log(res)
        return res})
    .catch((error) => {
        // alert(error);
        console.error("Error:", error);
    });
}

// return houses with notes
export async function loadHouses() {
    // await loadHousesFromATTOMPostgres()
    await loadHousesFromATTOMMemory()
    const notedAddress = await getNotedAddress()
    const notedAddressSet = new Set(notedAddress);
    // assemble house with notes
    houses = houses.map(house => [...house, notedAddressSet.has(house[0])])
}

export async function loadHouseCensusTract(tract) {
    await loadHousesFromATTOMPostgresTract(tract)
    const notedATTOMID = await getNotedATTOMID()
    const notedATTOMIDSet = new Set(notedATTOMID);
    // assemble house with notes
    houses = houses.map(house => {
        house[4] = notedATTOMIDSet.has(house[5])
        return house
    })
    houses = houses.map(house => {
        house[6] = contactInfo[house[0]] !== undefined ? true : false
        return house
    })
}

export async function loadHouseAll() {
    await loadHousesFromATTOMPostgresAll()
    const notedATTOMID = await getNotedATTOMID()
    const notedATTOMIDSet = new Set(notedATTOMID);
    // assemble house with notes
    houses = houses.map(house => {
        house[4] = notedATTOMIDSet.has(house[5])
        return house
    })
    houses = houses.map(house => {
        house[6] = contactInfo[house[0]] !== undefined ? true : false
        return house
    })
}

export function setAddrNoted(addr) {
    for (var i = 0; i < houses.length; i++) {
        if (houses[i][0] === addr) {
            houses[i][4] = true
        }
    }
}

export function setATTOMIDNoted(ATTOMID) {
    for (var i = 0; i < houses.length; i++) {
        if (houses[i][5] === ATTOMID) {
            houses[i][4] = true
        }
    }
}


export function getHouses() {
    return houses
}

export async function queryRecord(attom_id, db) {
    const record = await execPostgresQuery(`\
    SELECT \
        * \
    FROM \
        ${db} \
    where \
        "[attom id]" = ${attom_id} \
     `)

    // console.log(censusTractRes)
    return record
}

// load census tract info
var censusTractRes = []
export async function loadCensusTract() {
    // console.log(censusTractRes.length)
    if (censusTractRes.length > 0) {
        return censusTractRes
    }
    censusTractRes = await execPostgresQuery("\
    SELECT \
        CensusTract, \
        count(1), \
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY AreaLotSF) AS median_AreaLotSF \
    FROM \
        taxassessor \
    where \
        PropertyAddressCity = 'CAMPBELL' \
        AND PropertyAddressFull IS NOT NULL \
        AND AreaLotSF IS NOT NULL \
        AND PropertyLatitude IS NOT NULL \
        AND PropertyLongitude IS NOT NULL \
    group by \
        CensusTract \
    order by \
        count desc \
     ")

    // console.log(censusTractRes)
    return censusTractRes
}

export function getSouthwestLatitude(houses) {
    if (!houses || houses.length === 0) {
        return 0;
    }

    let minLatitude = houses[0][2]; // Assuming houses are in [lat, long] format

    // Iterate through the list of houses
    for (let i = 1; i < houses.length; i++) {
        const latitude = houses[i][2];
        if (latitude < minLatitude) {
            minLatitude = latitude;
        }
    }

    return minLatitude;
}

export function getNortheastLatitude(houses) {
    if (!houses || houses.length === 0) {
        return 0;
    }

    let maxLatitude = houses[0][2]; // Assuming houses are in [lat, long] format

    // Iterate through the list of houses
    for (let i = 1; i < houses.length; i++) {
        const latitude = houses[i][2];
        if (latitude > maxLatitude) {
            maxLatitude = latitude;
        }
    }

    return maxLatitude;
}

export function getSouthwestLongitude(houses) {
    if (!houses || houses.length === 0) {
        return 0;
    }

    let minLongitude = houses[0][3]; // Assuming houses are in [lat, long] format

    // Iterate through the list of houses
    for (let i = 1; i < houses.length; i++) {
        const longitude = houses[i][3];
        if (longitude < minLongitude) {
            minLongitude = longitude;
        }
    }

    return minLongitude;
}

export function getNortheastLongitude(houses) {
    if (!houses || houses.length === 0) {
        return 0;
    }

    let maxLongitude = houses[0][3]; // Assuming houses are in [lat, long] format

    // Iterate through the list of houses
    for (let i = 1; i < houses.length; i++) {
        const longitude = houses[i][3];
        if (longitude > maxLongitude) {
            maxLongitude = longitude;
        }
    }

    return maxLongitude;
}

export function calculateZoomLevel(bounds) {
    // If bounds are not available, return a default zoom level
    if (!bounds) return 10;

    // Calculate the width and height of the bounds
    const width = bounds._northEast.lng - bounds._southWest.lng;
    const height = bounds._northEast.lat - bounds._southWest.lat;

    // Adjust this factor as needed to fit the bounds appropriately
    const factor = 0.5;

    // Calculate the zoom level based on the width and height
    const screenSize = [450, 450];
    const worldSize = 256;
    const zoomLevel = Math.min(
        Math.log2(worldSize * factor / Math.max(width / screenSize[0], height / screenSize[1]))
    );
    return zoomLevel;
}

var contactInfo = new Map()

export async function loadContactInfo() {
    const requestOptions = {
        // mode: 'no-cors',
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    return fetch(endpoint + "contactInfo", requestOptions)
    .then(res => {
        // Check if the response is ok (status code 200)
        // console.log(res)
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        // Parse the JSON response and return it (returns a Promise)
        return res.json();
      })
    .then(res => {
        // console.log(res)
        contactInfo = res
        return res})
    .catch((error) => {
        // alert(error);
        console.error("Error:", error);
      });
}

export function getContactInfo() {
    return contactInfo
}