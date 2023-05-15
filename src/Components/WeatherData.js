import React, { useState } from 'react'
import '../App.css'
import moment from 'moment/moment';
import { FcSearch, FcGlobe, FcEnteringHeavenAlive, FcMultipleInputs, FcDepartment } from "react-icons/fc";
import { IoIosPeople } from "react-icons/io";
import CurrentDate from '../Utils/CurrentDate';
import QueryFunction from '../Utils/QueryFunctionData5';
import clearWeatherIcon from '../imagesAndIcons/clearWeatherIcon.png';
import cloudyWeatherIcon from '../imagesAndIcons/cloudyweather-icon.png'
import sun from '../imagesAndIcons/sun.png';
import rainyWeatherIcon from '../imagesAndIcons/rainyWeatherIcon.png'
import mistyWeatherIcon from '../imagesAndIcons/mistyWeatherIcon.png'
import fewClouds from '../imagesAndIcons/fewClouds.png'


const WeatherData = () => {
    const [nameOfCity, setNameOfCity] = useState("")
    const [weatherInfo, setWeatherInfo] = useState({
        town: "", country: "", celcius1: "", humidity1: "", speed1: "", population: "", cloud1: "", cloudDescription1: "", dateTime1: "", image: "",
    })
    const [error, setError] = useState("")
    const handleChange = (event) => {
        setNameOfCity(event.target.value)
    }
    const handleSearch = async () => {
        if (nameOfCity !== "") {
            try {
                const response = await QueryFunction(nameOfCity);


                if (response.status === 404) {
                    setError('Oops! city not found')
                    return
                }

                if (response.status === 401) {
                    setError(response.data.message)
                    return
                }
                const data = response.data

                let imagePath = ""
                const weatherDescription = data.list[0].weather[0].description.toLowerCase();
                if (weatherDescription === 'overcast clouds') {
                    imagePath = cloudyWeatherIcon
                } else if (weatherDescription === 'clear sky') {
                    imagePath = clearWeatherIcon
                } else if (weatherDescription === 'heavy intensity rain') {
                    imagePath = rainyWeatherIcon
                } else if (weatherDescription === 'light rain') {
                    imagePath = mistyWeatherIcon
                } else if (weatherDescription === 'broken clouds') {
                    imagePath = fewClouds
                }
                else if (weatherDescription === 'scattered clouds') {
                    imagePath = rainyWeatherIcon
                }
                else if (weatherDescription === 'few clouds') {
                    imagePath = sun
                }
                else if (weatherDescription === 'moderate rain') {
                    imagePath = rainyWeatherIcon
                }
                else {
                    imagePath = clearWeatherIcon
                }

                console.log(data)
                setWeatherInfo({
                    ...weatherInfo, town: data.city.name, country: data.city.country, population: data.city.population, celcius1: data.list[0].main.temp, humidity1: data.list[0].main.humidity, speed1: data.list[0].wind.speed, cloud1: data.list[0].weather, cloudDescription1: data.list[0].weather[0].description, dateTime1: data.list[0].dt_txt,
                    image: imagePath
                })

            }
            catch (error) {
                setError(error.message)
            }
            finally {
                setNameOfCity("")
                setTimeout(() => setError(""), 4000)
            }
        }
    }

    return (
        <div>
            <section className={typeof weatherInfo.celcius1 !== "undefined" && weatherInfo.cloudDescription1 === 'broken clouds' ? 'warmWeather' : weatherInfo.cloudDescription1 === 'overcast clouds' ? 'cloudyWeather' : weatherInfo.cloudDescription1 === 'light rain' ? 'rainyWeather' : weatherInfo.cloudDescription1 === 'moderate rain' ? 'fewShower' : weatherInfo.cloudDescription1 === 'heavy intensity rain' ? 'rainyWeather' : weatherInfo.cloudDescription1 === 'clear sky' ? 'sunnyWeather' : weatherInfo.cloudDescription1 === 'scattered clouds' || 'few clouds' ? 'cloudyWeather' : 'mainArea'}>

                <div className='searchArea'>
                    <FcGlobe className='globe' />
                    <input className='searchInput' placeholder='Search...' type='text' value={nameOfCity} onChange={handleChange} onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                            handleSearch()
                        }
                    }} />
                    <button className='searchIconButton' onClick={handleSearch}><FcSearch /></button>
                </div>
                <span className='date'><FcDepartment />{CurrentDate(new Date())}</span>
                <div className='error'>{error}</div>
                {(weatherInfo.town !== "") ? (
                    <div className="weatherDetails" >
                        <div className='block'>
                            <h4 className='temp'>{Math.round(weatherInfo.celcius1)}<sup>o</sup>c</h4>
                            <h4 className='city'>{weatherInfo.town},&nbsp;
                                {weatherInfo.country}</h4>
                            <img className='cloudIcon' src={weatherInfo.image} alt='A descriptive cloud ' />
                            <div className='cloud'>
                                {weatherInfo.cloud1 && weatherInfo.cloud1.description} {weatherInfo.cloudDescription1}<br />{moment(weatherInfo.dateTime1).format('LLLL')}
                            </div>
                            <div className='population'><IoIosPeople className='populationIcon' /><div className='populationFigure'>{weatherInfo.population}</div></div>
                            <div className='colContainer'>
                                <div className='Col'>
                                    <FcMultipleInputs className='windIcon' />
                                    <div className='wind'>
                                        <span>WindSpeed</span>
                                        <span>{Math.round(weatherInfo.speed1)}Km/h</span>
                                    </div>
                                </div>
                                <div className='Col'>
                                    <FcEnteringHeavenAlive className='humidityIcon' />
                                    <div className='humidValue'>
                                        <span>Humidity</span>
                                        <span>{Math.round(weatherInfo.humidity1)}%</span>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : ("")}

            </section>
        </div>
    )
}

export default WeatherData

