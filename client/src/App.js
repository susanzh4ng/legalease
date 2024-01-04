import './App.css';
import {useState, useEffect} from 'react';
import axios from "axios";

function App() {
  const [def, setDef] = useState(''); //storing definition from server
  useEffect(() => {
    const getUrl = 'http://localhost:5000/api/definition'; //backend route
    axios
      .get(getUrl)
      .then(function (response) {
        setDef(response.data.message); //updates def state with server's data
      })
      .catch(function (error) {
        console.log(error);
        alert("Error fetching definition due to "+error+"! Please try again!");
      })
  }, []);

  return (

    <div className="App">
      <h3>legalease</h3>
      <p>{def}</p> {/*displaying definition*/}
    </div>
  );
}

export default App;