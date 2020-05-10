import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import BlurOnIcon from '@material-ui/icons/BlurOn';
import './App.css';

import Main from './components/Main';
import CountryContainer from './components/CountryContainer';
import CountriesContainer from './components/CountriesContainer';
import USContainer from './components/USContainer';

function App() {
    const iconStyle = {
        fontSize: 100,
        animation: 'App-logo-spin infinite 20s linear',
        marginBottom: 50
    };

  return (
      <div className="App">
          <header className="App-header">
            <BlurOnIcon color="secondary" style={iconStyle} />
            <BrowserRouter>
                <Main />
                <Switch>
                    <Route exact path="/search-country" component={CountryContainer} />
                    <Route exact path="/countries" component={CountriesContainer} />
                    <Route exact path="/united-states" component={USContainer} />
                </Switch>
            </BrowserRouter>
          </header>
      </div>
  );
}

export default App;
