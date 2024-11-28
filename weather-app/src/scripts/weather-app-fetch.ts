import { convertFarToCel, cleanCityNames, getCurrentDate } from "./utils";

const WEATHER_API_KEY:string = 'BASJADVSDHVKYR4ZG8KET3SEJ';
const NUMBER_OF_DAYS_TO_RETRIEVE: number = 5;

class CurrentConditions {
    constructor(public feelslike: number | null, public temp: number | null) {
        this.feelslike = feelslike;
        this.temp = temp;
    }
}

class DailyTemperaturesAndStatus {
    constructor(public tempmin: number | null, 
                public tempmax: number | null, 
                public icon: string | null,
                public datetime: string | null) {
        this.tempmin = tempmin;
        this.tempmax = tempmax;
        this.icon = icon;
        this.datetime = datetime;
    }
}

class WeatherData {
    constructor(public resolvedAddress: string | null, 
                public description: string | null, 
                public currentConditions: CurrentConditions | null, 
                public days: DailyTemperaturesAndStatus[] | null) {
        this.resolvedAddress = resolvedAddress;
        this.description = description;
        this.currentConditions = currentConditions;
        this.days = days;
    }
}

// The easiest version is using try-catch with async and awaits. At least is more readable.
const fetchWeatherData = async(cityToFetch:String):Promise<WeatherData> => {
    const LINK_TO_FETCH_DATA:string = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityToFetch}?key=${WEATHER_API_KEY}`;
    const weatherResultsDiv:HTMLElement = document.getElementById('grid-weather-results')!;
    let tmpDaysList: DailyTemperaturesAndStatus[] = new Array();
    let weatherDataResult: WeatherData = new WeatherData(null, null, null, null);
    
    const cityLocalStorage = localStorage.getItem(cityToFetch.toString())!;
    if(cityLocalStorage === null) {
        await fetch(LINK_TO_FETCH_DATA, 
            {
            method: 'GET',
            mode: 'cors'
            }
        ).then((response) => response.json())
        .then((data) => {
            for(let daysIdx: number = 0; daysIdx < NUMBER_OF_DAYS_TO_RETRIEVE; daysIdx++) {
                let day:DailyTemperaturesAndStatus = new DailyTemperaturesAndStatus(convertFarToCel(data.days[daysIdx].tempmin), 
                                                                                    convertFarToCel(data.days[daysIdx].tempmax),
                                                                                    data.days[daysIdx].icon,
                                                                                    data.days[daysIdx].datetime);
                tmpDaysList.push(day);
            }
    
            let currConditions:CurrentConditions = new CurrentConditions(convertFarToCel(data.currentConditions.feelslike), 
                                                                         convertFarToCel(data.currentConditions.temp));
            weatherDataResult = new WeatherData(cleanCityNames(data.resolvedAddress), data.description, currConditions, tmpDaysList);
            localStorage.setItem(cityToFetch.toString(), JSON.stringify(weatherDataResult));
        }).catch(() => { 
            weatherResultsDiv.innerHTML = ''; // Clear the weather results div
            weatherResultsDiv.innerHTML = `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong class="font-bold">That city does not exist!</strong>
                <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
                    <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                </span>
            </div>`
        });
    } else {
        const dataLocalStg:WeatherData = JSON.parse(cityLocalStorage) as WeatherData;       
        
        if(dataLocalStg.days != null && (dataLocalStg.days[0].datetime!) === getCurrentDate()) {
            weatherDataResult = dataLocalStg;
        }
    }

    return weatherDataResult;
};

export { fetchWeatherData, WeatherData }