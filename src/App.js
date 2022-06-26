import { useEffect, useState } from "react";

//mui
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const url = "https://restcountries.com//v3.1/";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?";
const access_key = "03f5964a0fcf804dbf8dd8aa6b51b9af";
function App() {
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState([]);
  const [readMore, setReadMore] = useState(false);
  //specific country
  const [specific, setSpecific] = useState();
  const [weather, setWeather] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${url}all`);
        const data = await response.json();
        setLoading(false);
        setCountries(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const clickHandler = async () => {
    setReadMore(!readMore);
    try {
      const response = await fetch(
        `${weatherUrl}lat=${specific.capitalInfo.latlng[0]}&lon=${specific.capitalInfo.latlng[1]}&appid=${access_key}`
      );

      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <main>
      <div className="title">
        <h1>countries</h1>
        <div className="underline"></div>
      </div>
      <div className="selectbox-container">
        <Autocomplete
          id="country-select-demo"
          sx={{ width: 300 }}
          options={countries}
          autoHighlight
          getOptionLabel={(option) => option.name.common} 
          onChange={(event, newValue) => {
            setSpecific(newValue);
            setReadMore(false);
          }}
          renderOption={(props, option) => {
            return (
              <Box
                component="li"
                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                {...props}
              >
                <img loading="lazy" width="20" src={option.flags.png} alt="" />
                {option.name.common}
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose a country"
              inputProps={{
                ...params.inputProps,
                autoComplete: "new-password", // disable autocomplete and autofill
              }}
            />
          )}
        />
      </div>

      {specific ? (
        <div className="single-country">
          <img src={specific.flags.svg} alt="flag" />
          <footer>
            <div className="country-info">
              <h4>Capital : {specific.capital}</h4>
              <h4 className="country-timezone">
                Timezone : {specific.timezones}
              </h4>
            </div>
            <p>Latitude : {specific.capitalInfo?.latlng[0]} N</p>
            <p>Longitude : {specific.capitalInfo?.latlng[1]} E</p>

            {readMore && (
              <>
                <p>Temperatures : {weather?.main.temp} F</p>
                <p>Minimum temperatures : {weather?.main.temp_min} F</p>
                <p>Maximum temperatures : {weather?.main.temp_max} F</p>
                <p>Weather type : {weather?.weather[0].description}</p>
                <p>Humidity : {weather?.main.humidity} </p>
                <p>Visibility : {weather?.visibility} </p>
              </>
            )}
            <button className="read-more" onClick={clickHandler}>
              {readMore ? "show less" : "read more"}
            </button>
          </footer>
        </div>
      ) : (
        <div className="warning">
          <h3>select a country</h3>
        </div>
      )}
    </main>
  );
}

export default App;
