import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Interface from './Component/Layout';


// expressApp.use(express.static('public'))


function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Interface />} />
                <Route path="/interface" element={<Interface />} />
            </Routes>
        </Router>
    );
}


export default App;
