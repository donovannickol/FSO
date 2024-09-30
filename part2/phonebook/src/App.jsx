import { useState } from 'react'

const Person = ({person}) => <li>{person.name} {person.number}</li>

const Filter = ({searchQuery, handleSearch}) =>(
  <div>
        filter shown with <input value={searchQuery} onChange={handleSearch} />
  </div>
)

const Persons = ({queryPersons}) =>(
  <ul>
    {queryPersons.map(person => <Person key={person.id} person={person}/>)}
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
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  
const addPerson = (event) => {
  event.preventDefault()
  if(persons.some(person => person.name === newName)){
    alert(`${newName} is already added to phonebook`)
  }
  else{
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }
    setPersons(persons.concat(personObject))
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

const queryPersons = searchQuery === '' ? persons : persons.filter(person => person.name.toUpperCase().includes(searchQuery.toUpperCase()))
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchQuery={searchQuery} handleSearch={handleSearch}/>
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} newName={newName} newNumber={newNumber} />
      <h2>Numbers</h2>
      <Persons queryPersons={queryPersons}/>
    </div>
  )
}

export default App