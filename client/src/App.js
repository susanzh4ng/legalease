import './App.css';
import {useState, useEffect} from 'react';
import axios from "axios";

function App() {
  const [def, setDef] = useState('');
  useEffect(() => {
    const getUrl = 'http://localhost:5000/api/definition';
    axios
      .get(getUrl)
      .then(function (response) {
        setDef(response.data.message);
      })
      .catch(function (error) {
        console.log(error);
        alert("Error fetching definition due to "+error+"! Please try again!");
      })
  }, []);

  return (

    <div className="App">
      <h3>legalease</h3>
      <p>{def}</p>
    </div>
  );
}

export default App;