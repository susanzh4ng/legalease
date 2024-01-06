import './App.css';
import {useState} from 'react';
import magglass from './button.svg';
import axios from "axios";

function App() {
  const [term, setTerm] = useState({  //setting up state for the term
    text: ""
  });
  const [def, setDef] = useState(''); //storing definition from server
  const [isLoading, setIsLoading] = useState(true);


  /**
   * handleChange
   * 
   * event handler for changing the value of an input field
   * Since the form is now a state object, can only be changed with the setTerm() function
   * @param e the event object
   * */ 
  function handleChange(e) {
    setIsLoading(true)
    const {name, value} = e.target
    setTerm(prevTerm => {
      return {
        ...prevTerm, //maintaining input field's previous content ...
        [name]: value // ... while updating text in the input field
      }
    })
  }

  /**
   * handleSubmit
   * 
   * Handles the form submission event
   * Asynchronous operation; post request must finish before get request can occur
   * @param e the event object
   */
  async function handleSubmit(e) {
    e.preventDefault()
    console.log(term.text)

    const url = 'http://localhost:5000/api/definition'; //backend route

    await axios //post request has to be completed before the get request can occur
      .post(url, term)
      .catch(function (error) {
        console.log(error);
        alert("Error posting term due to "+error+"! Please try again!");
      });

    axios
      .get(url)
      .then(function (response) {
        setDef(response.data.message); //updates def state with server's data
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        if (error.response && error.response.data && error.response.data.message) {
          setDef(error.response.data.message); //setting as server's error message
        } else {
          setDef("Error: This term is not defined in the U.S. Courts Glossary.");
        }
        setIsLoading(false);
      })
  };
  return (
    <div className="App">
      <h9>h999i</h9>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          placeholder="Search ..."
          name="text" //attributes this to the term object
          value={term.text} //value is from term state
          onChange={handleChange} //updating state
        />
        <button><img src={magglass} width="26" height="26" alt='search' /></button>
      </form>
      <div className={isLoading ? "" : "hide"}>
        <p>Define legal terms with ease with <span>Legalease</span></p>
      </div>
      <div className={isLoading ? "hide": ""}> {/*hide this div while loading*/}
        <h3>{term.text}</h3>
        <p>{def}</p> {/*displaying definition*/}
      </div>
      <footer>
        <i>All terms and definitions have been sourced from the Administrative Office of the U.S. Courts.</i>
      </footer>
    </div>
  );
}

export default App;