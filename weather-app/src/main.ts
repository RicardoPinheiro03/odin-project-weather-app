import './style.css'

const WEATHER_API_KEY:string = 'BASJADVSDHVKYR4ZG8KET3SEJ';
const LINK_TO_FETCH_DATA:string = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london?key='

type WeatherData = {
  [index: string]: number | string | object, // Index Signature
  description: string,
  currentConditions: {
    temp: number
  }
}

const fetchWeatherData = async():Promise<WeatherData> => {
  // const weatherResultsDiv:HTMLElement = document.getElementById('weather-results')!;
  let weatherData;
  try {
    const fetchWeatherData = await fetch(LINK_TO_FETCH_DATA + WEATHER_API_KEY, 
      {
        method: 'GET',
        mode: 'cors'
      }
    )

    if(!fetchWeatherData.ok)
      throw new Error('Something went wrong.');

    weatherData = await fetchWeatherData.json();
    
  } catch(error) {
    console.error('Something went wrong');
  }
  
  return weatherData;
};

const result = await fetchWeatherData();
console.log(result.description);
