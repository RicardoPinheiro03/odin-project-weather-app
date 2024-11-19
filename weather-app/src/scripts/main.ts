// ToDo List:
    // Add events for search here
    // Add form validation
    // Add favourite cities to know how to work with the LocalStorage
    // Add animation when the results are fetched
    // Add expanding containers when clicking on the containers themselves & add grid with containers inside
    // ------------------------------------------------------------------
    // Deploy this to GH Pages using the methods shown on TOP or that Medium article

import '../styles/style.css'
import { fetchWeatherData, WeatherData } from './weather-app-fetch'
import { cleanCityNames, convertFarToCel, loadingPathA, loadingPathB } from './utils'

const cities:string[] = ['london', 'paris', 'berlin', 'madrid', 'lisbon']

const emojiResults = (desc:string):string => {
    let result:string = '';
    
    if(desc.includes('rain')) {
        result = '🌧️';
    } else if(desc.includes('partly-cloudy-day')) {
        result = '☁️';
    } else if(desc.includes('clear-day')) {
        result = '☀️';
    }

    return result;
};

const createEmptyCityDiv = (containerLoadDiv: HTMLElement, id: number):void => {
    const cityDiv = document.createElement('div'); 
    const classListInitialContainers:string = 'bg-white shadow rounded-lg p-6 opacity-80';

    cityDiv.className = classListInitialContainers;
    cityDiv.id = `weather-results-${id}`;
    cityDiv.style.textAlign = 'center';

    containerLoadDiv.appendChild(cityDiv);
};

const initialCitiesLoad = async ():Promise<void> => {
    let idxCity: number = 0;
    let idxCityDivSearch: number = 0;
    let weatherDataResults:WeatherData[];
    const gridWeatherResults:HTMLElement = document.getElementById('grid-weather-results')!;
    
    // Create initial containers
    while(idxCityDivSearch < cities.length) {
        createEmptyCityDiv(gridWeatherResults, idxCityDivSearch);
        // const emptyCityDiv:HTMLElement = document.getElementById(`weather-results-${idxCityDivSearch}`)!;
        idxCityDivSearch++;
        // createAndAttachLoadingStatus(emptyCityDiv);
    }
    
    try {
        weatherDataResults = await Promise.all(
            cities.map((cityName) => fetchWeatherData(cityName))
        );
    }
    finally {
        // document.getElementById('loading-div-svg').innerHTML = '';
    }

    weatherDataResults.forEach((resultSearch:WeatherData) => {
        const cityNameP:HTMLElement = document.createElement('p');
        const currTempP:HTMLElement = document.createElement('p');
        const currWeatherStatus:HTMLElement = document.createElement('p');
        const cityDiv:HTMLElement = document.getElementById(`weather-results-${idxCity}`)!;
        idxCity++;
                
        cityNameP.style.textAlign = 'center';
        cityNameP.style.fontWeight = 'bold';

        currWeatherStatus.style.textAlign = 'center';
        currWeatherStatus.style.fontSize = '30px';
        
        if(resultSearch.resolvedAddress) {
            cityNameP.textContent = cleanCityNames(resultSearch.resolvedAddress);
            currTempP.textContent = `${convertFarToCel(resultSearch.days[0].tempmin).toString()}ºC`;
            currWeatherStatus.textContent = `${emojiResults(resultSearch.days[0].icon)}`;
            // console.log(`Emoji = ${emojiResults(resultSearch.days[0].icon)}`);
            
            cityDiv.appendChild(cityNameP);
            cityDiv.appendChild(currTempP);
            cityDiv.appendChild(currWeatherStatus);
            gridWeatherResults.appendChild(cityDiv);
        } else {
            cityNameP.textContent = `City data for ${cities[idxCity]} not available.`;
            cityDiv.appendChild(cityNameP);
            gridWeatherResults.appendChild(cityDiv);
        }

        console.log(resultSearch); // Debug of JSON results
    });
}

const createAndAttachLoadingStatus = (htmlElementToAttach:HTMLElement): void => {
    const svgNodeClass:string = `w-8 
                                h-8 
                                text-gray-200 
                                animate-spin 
                                dark:text-gray-600 
                                fill-blue-600`;
    const svgNodeViewBox:string = `0 0 100 101`;
    const svgNodeFill:string = 'none';
    const svgNodeXmlns:string = 'http://www.w3.org/2000/svg';
    const svgNodeID:string = 'loading-div-svg';

    const loadingDiv:HTMLElement = document.createElement('div');
    loadingDiv.setAttribute('id', svgNodeID);

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

    console.log(htmlElementToAttach);

    htmlElementToAttach.appendChild(loadingDiv);
};

window.onload = () => {
    initialCitiesLoad();
}


