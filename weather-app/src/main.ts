import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

const WEATHER_API_KEY:string = 'BASJADVSDHVKYR4ZG8KET3SEJ';
const LINK_TO_FETCH_DATA:string = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london?key='

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

type WeatherData = {
  description: string,
  currentConditions: {
    temp: number
  }
}

const fetchWeatherData = async():Promise<WeatherData> => {
  const weatherResultsDiv:HTMLElement = document.getElementById('weather-results')!;
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
    // console.log(consumableWeatherData.description);
    // console.log(consumableWeatherData.currentConditions.temp);
    
  } catch(error) {
    console.error('Something went wrong');
  }
  
  return weatherData;
};

const result = await fetchWeatherData();
console.log(result.description);
