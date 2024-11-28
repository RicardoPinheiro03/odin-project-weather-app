// ToDo List:
    // [ ] Add expanding containers when clicking on the containers themselves & add grid with containers inside
    // ------------------------------------------------------------------
    // [ ] Deploy this to GH Pages

import '../styles/style.css'
import { retrieveWeatherData, WeatherData } from './weather-app-fetch'
import { cleanCityNames, loadingPathA, loadingPathB, delay } from './utils'

const cities:string[] = ['london', 'paris', 'berlin', 'madrid', 'lisbon'];

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
            cities.map((cityName) => retrieveWeatherData(cityName))
        );
    } catch {
        throw new Error('Something went wrong.');
    }

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
        
        if(resultSearch.resolvedAddress && resultSearch.days != null) {
            cityNameP.innerHTML = `${cleanCityNames(resultSearch.resolvedAddress)}`;
            currTempP.innerHTML = `${resultSearch.currentConditions?.temp!.toString()}ºC`;
            currWeatherStatus.innerHTML = `${emojiResults(resultSearch.days[0].icon!)}`;
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
    const svgNodeID:string = 'loading-div-svg';
    const svgNodeClass:string = 'w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600';
    const svgNodeViewBox:string = '0 0 100 101';
    const svgNodeFill:string = 'none';
    const svgNodeXmlns:string = 'http://www.w3.org/2000/svg';

    // Create div section for the spinning SVG
    const loadingSection:HTMLElement = document.createElement('div');
    loadingSection.setAttribute('id', svgNodeID);
    loadingSection.setAttribute('role', 'status');

    // Create SVG element
    const svgElement = document.createElementNS(svgNodeXmlns, 'svg') as SVGSVGElement;
    svgElement.setAttribute('class', svgNodeClass);
    svgElement.setAttribute('aria-hidden', 'true');
    svgElement.setAttribute('viewBox', svgNodeViewBox);
    svgElement.setAttribute('fill', svgNodeFill);
    svgElement.setAttribute('xmlns', svgNodeXmlns);

    // Create 2 paths to be appended into the SVG element
    const loadingPathAElement = document.createElementNS(svgNodeXmlns, 'path');
    const loadingPathBElement = document.createElementNS(svgNodeXmlns, 'path');
    loadingPathAElement.setAttribute('d', loadingPathA);
    loadingPathAElement.setAttribute('fill', 'currentColor');
    loadingPathBElement.setAttribute('d', loadingPathB);
    loadingPathBElement.setAttribute('fill', 'currentFill');

    svgElement.appendChild(loadingPathAElement);
    svgElement.appendChild(loadingPathBElement);

    loadingSection.appendChild(svgElement);

    htmlElementToAttach.appendChild(loadingSection);
};

const cleanDivInnerHTML = (element: HTMLElement):void => {
    element.innerHTML = '';
}

const searchIndividualStatsCity = async (cityName: string): Promise<void> => {
    const spinnerCityDivClass:string = ' h-96 mx-auto justify-center text-2xl w-96 flex items-center';
    const cityDivClass:string = 'bg-white shadow rounded-lg p-6 opacity-80 text-xl h-96 mx-auto justify-center text-2xl w-96';
    
    let fetchResults; // Results from the Weather API call
    
    // Clean current div containing the default cities
    const gridWeatherResults:HTMLElement = document.getElementById('grid-weather-results')!;
    cleanDivInnerHTML(gridWeatherResults);

    // Create empty bigger div for individual location
    createEmptyCityDiv(gridWeatherResults, 0);
    const cityNameP:HTMLElement = document.createElement('h2');
    const currTempP:HTMLElement = document.createElement('p');
    const currWeatherStatus:HTMLElement = document.createElement('p');
    const descriptionWeather:HTMLElement = document.createElement('p');
    const cityDiv:HTMLElement = document.getElementById('weather-results-0')!;
    const gridDiv:HTMLElement = document.getElementById('grid-weather-results')!;

    // Change dimensions of the container to be larger than the default one
    let currentClassListCityDiv: string = cityDiv.classList.toString();
    let newCityDivClassList: string = currentClassListCityDiv + spinnerCityDivClass; // Align spinner to the vertical center of the div
    cityDiv.className = newCityDivClassList;

    gridDiv.className = 'flex justify-center';
    
    cityNameP.style.textAlign = 'center';
    cityNameP.style.fontWeight = 'bold';

    currWeatherStatus.style.textAlign = 'center';
    currWeatherStatus.style.fontSize = '40px';
    createAndAttachLoadingStatus(cityDiv);
    
    try {
        await delay(3000);
        fetchResults = await retrieveWeatherData(cityName);
    } finally {
        const loadingElement:HTMLElement = document.getElementById('loading-div-svg')!;
        cityDiv.removeChild(loadingElement);

        let newCityDivClassList: string = cityDivClass; 
        cityDiv.className = newCityDivClassList;
    }

    // Deserialize fetch into the container of the results
    if(fetchResults != null && fetchResults.days) {
        cityNameP.innerHTML = `${cleanCityNames(fetchResults.resolvedAddress!)}`;
        currTempP.innerHTML = `${fetchResults.currentConditions?.temp!.toString()}ºC`;
        currWeatherStatus.innerHTML = `${emojiResults(fetchResults.days[0].icon!)}`;
        descriptionWeather.textContent = fetchResults.description;
        
        cityDiv.appendChild(cityNameP);
        cityDiv.appendChild(currTempP);
        cityDiv.appendChild(currWeatherStatus);
        cityDiv.appendChild(descriptionWeather);
        gridWeatherResults.appendChild(cityDiv);
    } else {
        cityNameP.textContent = `City data for ${cityName} not available.`;
        cityDiv.appendChild(cityNameP);
        gridWeatherResults.appendChild(cityDiv);
    }
};

const searchButton: HTMLElement = document.getElementById('search-button')!;
const cityInputText = <HTMLInputElement> document.getElementById('city-search-term')!;
searchButton?.addEventListener('click', () => {
    // If the input is a number or empty, reject the form submit
    if(!isNaN(Number(cityInputText.value)) || cityInputText.value === '')
        alert('Please introduce a valid city name.');
    else
        searchIndividualStatsCity(cityInputText.value!);
});

window.onload = () => {
    initialCitiesLoad();
}