const origin = "https://dev.jooo.tech"; // idk where else to put ok?
const apiKey = "AIzaSyDPd41N40KlY6TvlPUVeA0MYIB6jmYIY64";

const max_rounds = 5;

const boundings = {
    latMin: 59.6295025,
    latMax: 59.7095025,

    lonMin: 9.6108472,
    lonMax: 9.6908472
}

function calculateArea(latMin: number, latMax: number, lonMin: number, lonMax: number) {
    return (latMax - latMin) * (lonMax - lonMin);
}

function isValidStreetView(lat: number, lng: number) {
    return fetch(`https://maps.googleapis.com/maps/api/streetview/metadata?key=${apiKey}&location=${lat},${lng}`)
        .then(res => res.json())
        .then(data => data.status == "OK");
}

// in stackoverflow we trust
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function calculateScore(round: any) {
    const distance = round.distance;
    const time = round.time_taken;

    //return Math.max(0, 1000 - (distance / 1000) - (time / 1000));
    return Math.max(0, 1000 - distance);
}

async function getRandomPlace(): Promise<{ lat: number, lng: number }> {
    let lat = Math.random() * (boundings.latMax - boundings.latMin) + boundings.latMin;
    let lon = Math.random() * (boundings.lonMax - boundings.lonMin) + boundings.lonMin;

    let response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
    let data = await response.json();
    const [latMin, latMax, lonMin, lonMax] = data.boundingbox.map(Number);
    const area = calculateArea(latMin, latMax, lonMin, lonMax);

    if (area > 1E-7) {
        console.log("area too big, retrying", area);
        return await getRandomPlace();
    }

    if (!await isValidStreetView(lat, lon)) {
        console.log("not a valid street view, retrying");
        return await getRandomPlace();
    }

    return {
        lat: lat,
        lng: lon,
    }
}

export default { getRandomPlace, calculateDistance, calculateScore, origin, apiKey, max_rounds };