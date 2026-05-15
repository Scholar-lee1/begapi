const background = document.getElementById("background");

async function getBackground() {
const apiKey = typeof NASA_API_KEY !== 'undefined' ? NASA_API_KEY : 'DEMO_KEY';

const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

  try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const result = await response.json();
  console.log(result);

  if (result.media_type !== "image") {
    console.log("APOD returned a non-image media type.");
    return null;
  }

  return result.url;
} catch (error) {
  console.log(error.message);
  return null;
}


}

window.onload = function () {
  getBackground().then(function (imageUrl) {
    if (!imageUrl) return;

    console.log(imageUrl);

    if (background) {
      background.style["background-image"] = `url('${imageUrl}')`;
    }
  });
  getQuote();
};

setInterval(() => {
  let dateObject = new Date();

  let msInMinute = 60 * 1000;
  let localMs = dateObject.getTime() - (dateObject.getTimezoneOffset() * msInMinute);
  
  // ms for day
  let msInADay = 24 * 60 * 60 * 1000;
  let msToday = localMs % msInADay;

  // Converting remainder to hours, minutes, and seconds
  let hours = Math.floor(msToday / (60 * 60 * 1000));
  let minutes = Math.floor((msToday / (60 * 1000)) % 60);
  let seconds = Math.floor((msToday / 1000) % 60);

  let displayH = hours < 10 ? `0${hours}` : hours;
  let displayM = minutes < 10 ? `0${minutes}` : minutes;
  let displayS = seconds < 10 ? `0${seconds}` : seconds;

  console.log(`Some logs, and a ${displayH}:${displayM}:${displayS}!`);

  const time = document.getElementById("time");
  time.innerText = `Whoa!!, Time spent so far today is: ${displayH}:${displayM}:${displayS}!`;

}, 1000);


  // Weather
  async function getWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,precipitation_probability&temperature_unit=fahrenheit&wind_speed_unit=mph`;
    
    try {
      const response = await fetch(url);
      const data = await response.json(); // Return the whole JSON object
      return data;
    } catch (err) {
      console.error("Weather fetch failed:", err);
    }
  }

  // Getting the user's location
  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Call the function
    const weatherData = await getWeather(lat, lon);

    if (weatherData && weatherData.current) {
      // Picking the values from JSON 
      const temp = weatherData.current.temperature_2m;
      const wind = weatherData.current.wind_speed_10m;
      const precip = weatherData.current.precipitation_probability;

      // input
      const weatherElement = document.getElementById("weather");
      if (weatherElement) {
        // Formatting: 0% 50.2°F 8.2 mp/h
        weatherElement.innerText = `Then Our weather is: ${precip}% ${temp}°F ${wind} mp/h`;
      }
    }
  });
  

  async function getQuote() {
    try{
  
      const response = await fetch("https://api.adviceslip.com/advice");
  
      const data = await response.json();

      const quoteText = data.slip.advice;

      const factElement = document.getElementById("fact-ticker");
      if (factElement) {
        factElement.innerText = `"${quoteText}"`;
      }
    } catch (err) {

    console.error("Quote failed:", err);
    document.getElementById("fact-ticker").innerText = "Stay curious. (Fallback Quote)";
    }

}

