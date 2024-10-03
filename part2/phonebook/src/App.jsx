import { useState, useEffect } from 'react'
import personService from './services/persons'


const Person = ({person, handleDelete}) => <li>{person.name} {person.number} <button onClick={() => handleDelete(person.id)}>delete</button></li>

const Filter = ({searchQuery, handleSearch}) =>(
  <div>
        filter shown with <input value={searchQuery} onChange={handleSearch} />
  </div>
)

const Persons = ({queryPersons, handleDelete}) =>(
  <ul>
    {queryPersons.map(person => <Person key={person.id} person={person} handleDelete={handleDelete}/>)}
  </ul>
)

const PersonForm = ({addPerson, handleNameChange, handleNumberChange, newName, newNumber}) => (
  <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {personService.getAll().then(initialPersons => setPersons(initialPersons))}, [])

  const addPerson = (event) => {
    event.preventDefault()
    if(persons.some(person => person.name === newName)){
      let id = persons.find(p => p.name === newName).id
      let result = confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if(result){
        const personObject = {
          name:newName,
          number: newNumber,
          id: id
        }
        personService.update(id, personObject).then(returnedPerson => {setPersons(persons.map(p => (p.id == id ? returnedPerson : p)))})
      }
    }
    else{
      const personObject = {
        name: newName,
        number: newNumber,
        id: String(persons.length + 1)
      }
      personService.create(personObject).then(returnedPerson => {setPersons(persons.concat(returnedPerson))})
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleDelete = id => {
    console.log(`${id} Delete attemp`)
    personService.deleteEntry(id).then(setPersons(persons.filter(p => p.id !== id)))    
  }

  const queryPersons = searchQuery === '' ? persons : persons.filter(person => person.name.toUpperCase().includes(searchQuery.toUpperCase()))
    return (
      <div>
        <h2>Phonebook</h2>
        <Filter searchQuery={searchQuery} handleSearch={handleSearch}/>
        <h2>add a new</h2>
        <PersonForm addPerson={addPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} newName={newName} newNumber={newNumber} />
        <h2>Numbers</h2>
        <Persons queryPersons={queryPersons} handleDelete={handleDelete}/>
      </div>
    )
}

export default App