// ToDo List:
    // [ ] Add form validation
    // [ ] Add favourite cities to know how to work with the LocalStorage
    // [ ] Add animation when the results are fetched
    // [ ] Add expanding containers when clicking on the containers themselves & add grid with containers inside
    // ------------------------------------------------------------------
    // [ ] Deploy this to GH Pages using the methods shown on TOP or that Medium article

import '../styles/style.css'
import { fetchWeatherData, WeatherData } from './weather-app-fetch'
import { cleanCityNames, convertFarToCel, loadingPathA, loadingPathB } from './utils'

const cities:string[] = ['london', 'paris', 'berlin', 'madrid', 'lisbon'];
let weatherDataResults:WeatherData[] = [];
let london:WeatherData = {
    resolvedAddress: 'London',
    description: 'Lorem ipsem. Lorem ipsem. Lorem ipsem. Lorem ipsem.',
    currentConditions: {
        feelslike: 0,
        temp: 0
    },
    days: [{
        icon: 'rain',
        tempmin: 0.0,
        tempmax: 0.0
    }]
}

let berlin:WeatherData = {
    resolvedAddress: 'Berlin',
    description: 'Lorem ipsem. Lorem ipsem. Lorem ipsem. Lorem ipsem.',
    currentConditions: {
        feelslike: 0,
        temp: 0
    },
    days: [{
        icon: 'clear-day',
        tempmin: 0.0,
        tempmax: 0.0
    }]
}

let gloria:WeatherData = {
    resolvedAddress: 'Glória do Ribatejo',
    description: 'Lorem ipsem. Lorem ipsem. Lorem ipsem. Lorem ipsem.',
    currentConditions: {
        feelslike: 0,
        temp: 0
    },
    days: [{
        icon: 'clear-day',
        tempmin: 0.0,
        tempmax: 0.0
    }]
}

let muge:WeatherData = {
    resolvedAddress: 'Muge',
    description: 'Lorem ipsem. Lorem ipsem. Lorem ipsem. Lorem ipsem.',
    currentConditions: {
        feelslike: 0,
        temp: 0
    },
    days: [{
        icon: 'snow',
        tempmin: 0.0,
        tempmax: 0.0
    }]
}

let porto:WeatherData = {
    resolvedAddress: 'Porto Alto',
    description: 'Lorem ipsem. Lorem ipsem. Lorem ipsem. Lorem ipsem.',
    currentConditions: {
        feelslike: 0,
        temp: 0
    },
    days: [{
        icon: 'partly-cloudy-day',
        tempmin: 0.0,
        tempmax: 0.0
    }]
}

weatherDataResults.push(london);
weatherDataResults.push(berlin);
weatherDataResults.push(gloria);
weatherDataResults.push(muge);
weatherDataResults.push(porto);

const emojiResults = (desc:string):string => {
    let result:string = '';
    
    if(desc.includes('rain')) {
        result = '🌧️';
    } else if(desc.includes('partly-cloudy-day')) {
        result = '☁️';
    } else if(desc.includes('clear-day')) {
        result = '☀️';
    } else if(desc.includes('snow')) {
        result = '❄️';
    }

    return result;
};

const createEmptyCityDiv = (containerLoadDiv: HTMLElement, id: number):void => {
    const cityDiv = document.createElement('div'); 
    const classListInitialContainers:string = 'bg-white shadow rounded-lg p-6 opacity-80 text-xl';

    cityDiv.className = classListInitialContainers;
    cityDiv.id = `weather-results-${id}`;
    cityDiv.style.textAlign = 'center';

    containerLoadDiv.appendChild(cityDiv);
};

const initialCitiesLoad = async ():Promise<void> => {
    let idxCity: number = 0;
    let idxCityDivSearch: number = 0;
    // let weatherDataResults:WeatherData[];
    const gridWeatherResults:HTMLElement = document.getElementById('grid-weather-results')!;
    
    // Create initial containers
    while(idxCityDivSearch < cities.length) {
        createEmptyCityDiv(gridWeatherResults, idxCityDivSearch);
        // const emptyCityDiv:HTMLElement = document.getElementById(`weather-results-${idxCityDivSearch}`)!;
        idxCityDivSearch++;
        // createAndAttachLoadingStatus(emptyCityDiv);
    }
    
    // try {
    //     weatherDataResults = await Promise.all(
    //         cities.map((cityName) => fetchWeatherData(cityName))
    //     );
    // }
    // finally {
    //     // document.getElementById('loading-div-svg').innerHTML = '';
    // }

    weatherDataResults.forEach((resultSearch:WeatherData) => {
        // The below code should be in a different method.
        const cityNameP:HTMLElement = document.createElement('h2');
        const currTempP:HTMLElement = document.createElement('p');
        const currWeatherStatus:HTMLElement = document.createElement('p');
        const descriptionWeather:HTMLElement = document.createElement('p');
        const cityDiv:HTMLElement = document.getElementById(`weather-results-${idxCity}`)!;
        
        cityNameP.style.textAlign = 'center';
        cityNameP.style.fontWeight = 'bold';

        currWeatherStatus.style.textAlign = 'center';
        currWeatherStatus.style.fontSize = '40px';
        
        if(resultSearch.resolvedAddress) {
            cityNameP.innerHTML = `${cleanCityNames(resultSearch.resolvedAddress)}`;
            currTempP.innerHTML = `${convertFarToCel(resultSearch.days[0].tempmin).toString()}ºC`;
            currWeatherStatus.innerHTML = `${emojiResults(resultSearch.days[0].icon)}`;
            descriptionWeather.textContent = resultSearch.description;
            
            cityDiv.appendChild(cityNameP);
            cityDiv.appendChild(currTempP);
            cityDiv.appendChild(currWeatherStatus);
            cityDiv.appendChild(descriptionWeather);
            gridWeatherResults.appendChild(cityDiv);
        } else {
            cityNameP.textContent = `City data for ${cities[idxCity]} not available.`;
            cityDiv.appendChild(cityNameP);
            gridWeatherResults.appendChild(cityDiv);
        }

        idxCity++;
        // console.log(resultSearch); // Debug of JSON results
    });
}

const createAndAttachLoadingStatus = (htmlElementToAttach:HTMLElement): void => {
    const svgNodeClass:string = 'w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600';
    const svgNodeViewBox:string = '0 0 100 101';
    const svgNodeFill:string = 'none';
    const svgNodeXmlns:string = 'http://www.w3.org/2000/svg';
    const svgNodeID:string = 'loading-div-svg';

    const loadingDiv:HTMLElement = document.createElement('div');
    loadingDiv.setAttribute('id', svgNodeID);
    loadingDiv.setAttribute('role', 'status');

    const loadingSVG:HTMLElement = document.createElement('svg');
    loadingSVG.setAttribute('aria-hidden', 'true');
    loadingSVG.setAttribute('class', svgNodeClass);
    loadingSVG.setAttribute('viewBox', svgNodeViewBox);
    loadingSVG.setAttribute('fill', svgNodeFill);
    loadingSVG.setAttribute('xmlns', svgNodeXmlns);

    const loadingPathAElement:HTMLElement = document.createElement('path');
    const loadingPathBElement:HTMLElement = document.createElement('path');
    loadingPathAElement.setAttribute('d', loadingPathA);
    loadingPathAElement.setAttribute('fill', 'currentColor');
    loadingPathBElement.setAttribute('d', loadingPathB);
    loadingPathBElement.setAttribute('fill', 'currentColor');

    loadingSVG.appendChild(loadingPathAElement);
    loadingSVG.appendChild(loadingPathBElement);

    loadingDiv.appendChild(loadingSVG);

    htmlElementToAttach.appendChild(loadingDiv);
};

const searchIndividualStatsCity = async (cityName: string): Promise<void> => {
    let fetchResults:WeatherData;
    const gridWeatherResults:HTMLElement = document.getElementById('grid-weather-results')!;
    gridWeatherResults.innerHTML = '';

    createEmptyCityDiv(gridWeatherResults, 0);
    const cityNameP:HTMLElement = document.createElement('h2');
    const currTempP:HTMLElement = document.createElement('p');
    const currWeatherStatus:HTMLElement = document.createElement('p');
    const descriptionWeather:HTMLElement = document.createElement('p');
    const cityDiv:HTMLElement = document.getElementById('weather-results-0')!;
    const gridDiv:HTMLElement = document.getElementById('grid-weather-results')!;

    let currentClassListCityDiv: string = cityDiv.classList.toString();
    let newCityDivClassList: string = currentClassListCityDiv + ' h-96 mx-auto justify-center text-2xl w-96';
    cityDiv.className = newCityDivClassList;

    gridDiv.className = 'flex justify-center';
    
    cityNameP.style.textAlign = 'center';
    cityNameP.style.fontWeight = 'bold';

    currWeatherStatus.style.textAlign = 'center';
    currWeatherStatus.style.fontSize = '40px';
    createAndAttachLoadingStatus(cityDiv);
    
    // const heroDiv:HTMLElement = document.getElementById('hero-test')!;
    // createAndAttachLoadingStatus(heroDiv);

    try {
        setTimeout(() => {
            cityNameP.innerHTML = 'Sanity test';
            cityDiv.appendChild(cityNameP);
        }, 2000);
        // fetchResults = await fetchWeatherData(cityName);
    } finally {
        const loadingElement:HTMLElement = document.getElementById('loading-div-svg')!;
        // loadingElement.innerHTML = '';
    }

    // if(fetchResults.resolvedAddress) {
    //     cityNameP.innerHTML = `${cleanCityNames(fetchResults.resolvedAddress)}`;
    //     currTempP.innerHTML = `${convertFarToCel(fetchResults.days[0].tempmin).toString()}ºC`;
    //     currWeatherStatus.innerHTML = `${emojiResults(fetchResults.days[0].icon)}`;
    //     descriptionWeather.textContent = fetchResults.description;
        
    //     cityDiv.appendChild(cityNameP);
    //     cityDiv.appendChild(currTempP);
    //     cityDiv.appendChild(currWeatherStatus);
    //     cityDiv.appendChild(descriptionWeather);
    //     gridWeatherResults.appendChild(cityDiv);
    // } else {
    //     cityNameP.textContent = `City data for ${cities[0]} not available.`;
    //     cityDiv.appendChild(cityNameP);
    //     gridWeatherResults.appendChild(cityDiv);
    // }
};

const searchButton: HTMLElement = document.getElementById('search-button')!;
const cityInputText = <HTMLInputElement> document.getElementById('city-search-term')!;
searchButton?.addEventListener('click', () => {
    searchIndividualStatsCity(cityInputText.value!);
});

window.onload = () => {
    initialCitiesLoad();
}