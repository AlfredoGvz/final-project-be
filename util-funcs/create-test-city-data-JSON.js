const axios = require('axios');
const fs = require('fs').promises;

const cityNames = [
    'Manchester',
    'Liverpool',
    'Leeds',
    'Coventry',
    'Cardiff',
    'Bristol',
    'Sheffield',
    'York',
    'Belfast',
    'Glasgow'
];

async function getCityCoordinates(cityNames) {
    const cityCoordinates = [];
    for (const cityName of cityNames) {
        try {
            let apiUrl = "https://nominatim.openstreetmap.org/search?format=json&q=" + encodeURIComponent(cityName);
            const response = await axios.get(apiUrl);
            if (response.data && response.data.length > 0) {
                const { lat, lon } = response.data[0]; 
                cityCoordinates.push({ cityName, lat, lon });
            } else {
                throw new Error(`Coordinates for ${cityName} not found`);
            }
        } catch (error) {
            console.error("Error fetching city coordinates:", error);
        }
    }
    return cityCoordinates;
}

async function writeCityCoordinatesToFile(cityCoordinates) {
    try {
        await fs.writeFile('all-cities.json', JSON.stringify(cityCoordinates, null, 2));
        console.log('City coordinates written to all-cities.json');
    } catch (error) {
        console.error('Error writing city coordinates to file:', error);
    }
}

// Example usage
getCityCoordinates(cityNames)
    .then(cityCoordinates => {
        writeCityCoordinatesToFile(cityCoordinates);
    })
    .catch(error => {
        console.error('Error:', error);
    });
