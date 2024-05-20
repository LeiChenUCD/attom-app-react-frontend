import { households } from "../assets/households";
// const endpoint = "http://localhost:3001/"
const endpoint = "https://attom-app-react-backend.onrender.com/"

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
                ATTOMID: ATTOMID
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

export function getCensusTractInfo() {
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
    houses = houseRes.map(house => 
        [house.propertyaddressfull, house.arealotsf, house.propertylatitude, house.propertylongitude, false, house['[attom id]'], false, house.zonedcodelocal, house.bedroomscount, house.bathcount]
    )
    // return houses
}

async function loadHousesFromATTOMMemory() {
    houses = households
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
export async function loadCensusTract() {
    const censusTractRes = await execPostgresQuery("\
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