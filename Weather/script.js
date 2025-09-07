async function getWeather() {
      let city = document.getElementById("cityInput").value.trim();
      let resultDiv = document.getElementById("weatherResult");

      if (!city) {
        resultDiv.innerHTML = "❌ Lütfen bir şehir adı girin.";
        return;
      }

      city = city.toLowerCase();
      let geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=tr&format=json`;

      try {
        let geoRes = await fetch(geoUrl);
        let geoData = await geoRes.json();

        if (!geoData.results) {
          resultDiv.innerHTML = "❌ Şehir bulunamadı!";
          return;
        }

        let lat = geoData.results[0].latitude;
        let lon = geoData.results[0].longitude;
        let cityName = geoData.results[0].name;

        let weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
        let weatherRes = await fetch(weatherUrl);
        let weatherData = await weatherRes.json();

        let temp = weatherData.current_weather.temperature;
        let wind = weatherData.current_weather.windspeed;

        let sunUrl = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`;
        let sunRes = await fetch(sunUrl);
        let sunData = await sunRes.json();

        const sunrise = new Date(sunData.results.sunrise);
        const sunset = new Date(sunData.results.sunset);
        const now = new Date();

        let dayNight = (now >= sunrise && now <= sunset) ? "Gündüz" : "Gece";

        let weatherCode = weatherData.current_weather.weathercode;
        let weatherDesc = getWeatherDescription(weatherCode);

        resultDiv.innerHTML = `
          <h2>🌤️ Anlık Hava Durumu</h2>
          <h3>📍 ${cityName}</h3>
          <p>🌡️ Sıcaklık: <b>${temp}°C</b></p>
          <p>💨 Rüzgar: ${wind} km/h</p>
          <p>☀️/🌙 Durum: <b>${dayNight}</b></p>
          <p>🌈 Hava Durumu: <b>${weatherDesc}</b></p>
        `;
      } catch (error) {
        resultDiv.innerHTML = "⚠️ Bir hata oluştu!";
        console.error(error);
      }
    }

    function getWeatherDescription(code) {
      if (code === 0) return "Açık Güneşli";
      if (code === 1) return "Parçalı Bulutlu";
      if (code === 2) return "Bulutlu";
      if (code === 3) return "Kapalı";
      if ([45].includes(code)) return "Sisli";
      if ([51, 53, 55].includes(code)) return "Yağmur";
      if ([61, 63, 65].includes(code)) return "Sağanak Yağmur";
      if ([71, 73, 75].includes(code)) return "Kar";
      if ([95].includes(code)) return "Fırtına";
      return "Bilinmiyor";
    }

    document.getElementById("getWeatherBtn").addEventListener("click", getWeather);