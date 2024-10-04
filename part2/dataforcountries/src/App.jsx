import { useState, useEffect } from 'react'
import countryService from './services/restcountries'
import weatherService from './services/openweather'

const Search = ({searchQuery, handleSearch}) =>(
  <div>
        find countries <input value={searchQuery} onChange={handleSearch} />
  </div>
)

const Country = ({country, handleShow}) => <li>{country.name.common}<button onClick={() => handleShow(country)}>show</button></li>

const Language = ({language}) => <li>{language}</li>

const CountryDetails = ({country, currentWeather}) => {

  return (
  <div>
    <h1>{country.name.common}</h1>
    <div>capital {country.capital[0]}</div>
    <div>area {country.area}</div>
    <h3>languages:</h3>
    <ul>
      {Object.values(country.languages).map(language => <Language key={language} language={language}/>)}
    </ul>
    <img src={country.flags.png} alt={country.flags.alt} />
    <h2>Weather in {country.capital[0]}</h2>
    <div>temperature {currentWeather?.main.temp} celsius</div>
    <img src={`https://openweathermap.org/img/wn/${currentWeather?.weather[0].icon}@2x.png`} alt={currentWeather?.weather[0].description} />
    <div>wind {currentWeather?.wind.speed} m/s</div>
  </div>
  )
}
const Countries = ({queryCountries, handleShow, currentWeather}) =>{
  if(queryCountries.length > 10){
    return ('Too many matches, specify another filter')
  }
  if(queryCountries.length === 1){

    return <CountryDetails country={queryCountries[0]} currentWeather={currentWeather} />
  }
  return (
  <ul>
    {queryCountries.map(country => <Country key={country.cca2} country={country} handleShow={handleShow}/>)}
  </ul>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentWeather, setCurrentWeather] = useState(null)
  useEffect(() => {countryService.getAll().then(response => setCountries(response))}, [])

  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
    if(queryCountries.length===1){
      weatherService.getWeather(queryCountries[0].capital[0]).then(response => {
        console.log(response)
        setCurrentWeather(response.data)})
    }
  }

  const handleShow = country => {
    setSearchQuery(country.name.common)
    weatherService.getWeather(country.capital[0]).then(response => {
      console.log(response)
      setCurrentWeather(response.data)})
  }

  const queryCountries = searchQuery === '' ? [] : countries.filter(country => country.name.common.toUpperCase().includes(searchQuery.toUpperCase()))
  
  return (
    <div>
      <Search searchQuery={searchQuery} handleSearch={handleSearch}/>
      <Countries queryCountries={queryCountries} handleShow={handleShow} currentWeather={currentWeather}/>
    </div>
  )
}

export default App
