import React from "react";
import { AppBar } from "material-ui";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import SearchBar from "./SearchBar";
import PropertyList from "./PropertyList";

const App = props => {
  return(
    <MuiThemeProvider>
      <div>
        <AppBar
          title="One Rent"
        />
        <div className="container">
          <SearchBar/>
          <PropertyList/>
        </div>
      </div>
    </MuiThemeProvider>
  )
}

export default App;
