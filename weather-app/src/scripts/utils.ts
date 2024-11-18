const FARENHEIT_CONSTANT = 32;

export const convertFarToCel = (fTemp: number):number => {
    // console.log("FARHNEIT TEMP = " + fTemp);
    // console.log("FARENHEIT_CONSTANT = " + FARENHEIT_CONSTANT);
    let cTemp:number;
    cTemp = (fTemp - FARENHEIT_CONSTANT) * 5 / 9;
    return parseFloat(Math.round(cTemp).toFixed(1));
}

export const cleanCityNames = (cityName:string):string => {
    const cityNameTrimmed = cityName.split(",")[0].trim();
    return cityNameTrimmed;
}