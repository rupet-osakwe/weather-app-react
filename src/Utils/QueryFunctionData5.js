
import axios from 'axios'
const QueryFunction = async (nameOfCity) => {
    const response = axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${nameOfCity}&cnt=5&units=metric&appid=${process.env.REACT_APP_MyWeatherAppKey}`, {
        validateStatus: (status) => status < 500
    })
    return response
}
export default QueryFunction