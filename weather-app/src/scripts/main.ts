// ToDo List:
    // Add events for search here
    // Add form validation
    // Add favourite cities to know how to work with the LocalStorage
    // Add animation when the results are fetched
    // Learn lazy load for the containers / do the Promise.All method to the data to be fetched at the same time

import '../styles/style.css'
import { fetchWeatherData, WeatherData } from './weather-app-fetch'
import { cleanCityNames, convertFarToCel } from './utils'

const cities:string[] = ['london', 'ble', 'berlin', 'madrid', 'lisbon']

const emojiResults = (desc:string):string => {
    let result:string = '';
    
    if(desc === 'rain') {
        result = '🌧️';
    } else if(desc === 'partly-cloudy-day') {
        result = '☁️';
    } else if(desc === 'clear-day') {
        result = '☀️';
    }

    return result;
};

const initialCitiesLoad = async ():Promise<void> => {
    let idx:number = 0;

    const weatherDataResults:WeatherData[] = await Promise.all(
        cities.map((cityName) => fetchWeatherData(cityName))
    );

    weatherDataResults.forEach((resultSearch:WeatherData, idx:number) => {
        const containerLoadDiv:HTMLElement = document.getElementById('container-weather-wrapper')!;
        const classListInitialContainers = 'container mt-40 p-10 bg-gray-50 rounded-md w-80 h-96 bg-opacity-70 flex';
        
        const citiesDiv:HTMLElement = document.createElement('div');
        const cityNameSpan:HTMLElement = document.createElement('span');
        const currTempSpan:HTMLElement = document.createElement('span');
        const currWeather:HTMLElement = document.createElement('span');
        
        citiesDiv.className = classListInitialContainers;
        citiesDiv.id = `weather-results-${idx + 1}`;
        citiesDiv.style.textAlign = 'center';
        citiesDiv.style.display = 'flex';
        citiesDiv.style.justifyContent = 'center';
        citiesDiv.style.flexDirection = 'column';
        
        cityNameSpan.style.textAlign = 'center';
        cityNameSpan.style.fontWeight = 'bold';

        currWeather.style.textAlign = 'center';
        currWeather.style.fontSize = '30px';
        
        if(resultSearch.resolvedAddress) {
            cityNameSpan.textContent = cleanCityNames(resultSearch.resolvedAddress);
            currTempSpan.textContent = `${convertFarToCel(resultSearch.days[0].tempmin).toString()}ºC`;
            currWeather.textContent = `${emojiResults(resultSearch.days[0].icon)}`;
            
            citiesDiv.appendChild(cityNameSpan);
            citiesDiv.appendChild(currTempSpan);
            citiesDiv.appendChild(currWeather);
            containerLoadDiv.appendChild(citiesDiv);
        } else {
            cityNameSpan.textContent = `City data for ${cities[idx]} not available.`;
            citiesDiv.appendChild(cityNameSpan);
            containerLoadDiv.appendChild(citiesDiv);
        }

        console.log(resultSearch); // Debug of JSON results
    });
}


window.onload = () => {
    initialCitiesLoad();
}


