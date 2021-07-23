function createCityList(citySearchList) {
    $("#city-list").empty();

    var city = Object.keys(citySearchList);
    for (var i = 0; i < city.length; i++) {
        var cityList = $("<button>");
        cityList.addClass("list-group-item list-group-item-action");

        var splitStr = city[i].toLowerCase().split(" ");
        for (var j = 0; j < splitStr.length; j++) {
            splitStr[j] =
            splitStr[j].charAt(0).toUpperCase() + splitStr[j].substring(1);
        }

        var titleCity = splitStr.join(" ");
        cityList.text(titleCity);

        $("#city-list").append(cityList);

    }
}

function pullCityWeather(city, citySearchList) {
    createCityList(citySearchList);

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=&appid=561a18de159be08528191567a0fae381"+ city;

    var queryURL2 = "https://api.openweathermap.org/data/2.5/forecast?q=&appid=eb72a204a59950230d1b17863f7284d8" + city;

    var latitude;

    var longitude;

    $.ajax({
        url: queryURL,
        method: "GET"
    })

    .then(function(weather){
        console.log(queryURL);
        console.log(weather);

        var nowMoment = moment();

        var displayMoment = $("<h4>");
        $("#city-name").empty();
        $("#city-name").append(
            displayMoment.text("(" + nowMoment.format("MM/DD/YYYY") + ")")
        );

        var cityName = $("<h4>").text(weather.name);
        $("#city-name").prepend(cityName);

        var wthrIcon = $("<img>");
        wthrIcon.attr(
            "src",
            "https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"
        );
        $("#current-icon").empty();
        $("#current-icon").append(weatherIcon);
  
        $("#current-temp").text("Temperature: " + weather.main.temp + " °F");
        $("#current-humidity").text("Humidity: " + weather.main.humidity + "%");
        $("#current-wind").text("Wind Speed: " + weather.wind.speed + " MPH");
  
        latitude = weather.coord.lat;
        longitude = weather.coord.lon;
  
        var queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?q=&appid=67d143452c7120bca566627caabf483d" +
          "&lat=" +
          latitude +
          "&lon=" +
          longitude;
  
        $.ajax({
          url: queryURL3,
          method: "GET"
          // Store all of the retrieved data inside of an object called "uvIndex"
        }).then(function(uvIndex) {
          console.log(uvIndex);
  
          var uvIndexDisplay = $("<button>");
          uvIndexDisplay.addClass("btn btn-danger");
  
          $("#current-uv").text("UV Index: ");
          $("#current-uv").append(uvIndexDisplay.text(uvIndex[0].value));
          console.log(uvIndex[0].value);
  
          $.ajax({
            url: queryURL2,
            method: "GET"
            // Store all of the retrieved data inside of an object called "forecast"
          }).then(function(forecast) {
            console.log(queryURL2);
  
            console.log(forecast);
            // Loop through the forecast list array and display a single forecast entry/time (5th entry of each day which is close to the highest temp/time of the day) from each of the 5 days
            for (var i = 6; i < forecast.list.length; i += 8) {
              // 6, 14, 22, 30, 38
              var forecastDate = $("<h5>");
  
              var forecastPosition = (i + 2) / 8;
  
              console.log("#forecast-date" + forecastPosition);
  
              $("#forecast-date" + forecastPosition).empty();
              $("#forecast-date" + forecastPosition).append(
                forecastDate.text(nowMoment.add(1, "days").format("MM/DD/YYYY"))
              );
  
              var forecastIcon = $("<img>");
              forecastIcon.attr(
                "src",
                "https://openweathermap.org/img/w/" +
                  forecast.list[i].weather[0].icon +
                  ".png"
              );
  
              $("#forecast-icon" + forecastPosition).empty();
              $("#forecast-icon" + forecastPosition).append(forecastIcon);
  
              console.log(forecast.list[i].weather[0].icon);
  
              $("#temp" + forecastPosition).text(
                "Temp: " + forecast.list[i].main.temp + " °F"
              );
              $("#humidity" + forecastPosition).text(
                "Humidity: " + forecast.list[i].main.humidity + "%"
              );
  
              $(".forecast").attr(
                "style",
                "background-color:lightblue; color:white"
              );
            }
          });
        });
      });
  }
  
  $(document).ready(function() {
    var citySearchListStringified = localStorage.getItem("citySearchList");
  
    var citySearchList = JSON.parse(citySearchListStringified);
  
    if (citySearchList == null) {
      citySearchList = {};
    }
  
    createCityList(citySearchList);
  
    $("#current-weather").hide();
    $("#forecast-weather").hide();
  
  
  
    $("#search-button").on("click", function(event) {
      event.preventDefault();
      var city = $("#city-input")
        .val()
        .trim()
        .toLowerCase();
  
      if (city != "") {
        //Check to see if there is any text entered
      
        citySearchList[city] = true;
      localStorage.setItem("citySearchList", JSON.stringify(citySearchList));
  
      pullCityWeather(city, citySearchList);
  
      $("#current-weather").show();
      $("#forecast-weather").show();
      }
  
      
    });
  
    $("#city-list").on("click", "button", function(event) {
      event.preventDefault();
      var city = $(this).text();
  
      pullCityWeather(city, citySearchList);
  
      $("#current-weather").show();
      $("#forecast-weather").show();
    });
  });
