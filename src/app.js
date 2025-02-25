const API_KEY = 'XVBJRDCXSCJ5Y4QCW65MXQ9MF';
// const URL_FORMAT = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}`;
const urlLondon = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/London, UK?key=${API_KEY}`;
const searchElement = document.querySelector('#searchInput');


searchElement.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const userResponse = searchElement.value;
        console.log(userResponse);
    }
} )

async function getWeatherData() {
    try {
        const response = await fetch(urlLondon);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data; 

    } catch (error){
        console.error('Error fetching weather data:', error);
        return null;
    }
}

async function consoleData() {
    const data = await getWeatherData();
    processData(data)
}

async function processData(data) {

    const address = data.address;
    const description = data.description;
    const days = [];
    data.days.forEach(day => {
        if (days.length > 6) {
            return;
        }
        days.push(
            {
                "date": day.datetime,
                "tempmax": day.tempmax,
                "tempmin": day.tempmin,
                "temp": day.temp,
                "uvindex": day.uvindex,
                "conditions": day.conditions
            }
        );
    });
    console.log(address)
    console.log(description)
    console.log(days)
}

consoleData();




async function main(){


} 

main();