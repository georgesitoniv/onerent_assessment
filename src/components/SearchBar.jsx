import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchAllProperties, fetchPropertiesFiltered } from "../actions";
import ChipInput from 'material-ui-chip-input'
import { FlatButton, Paper, Dialog, Slider } from "material-ui";

class SearchBar extends Component{
  constructor(props){
    super(props);
    this.state = {
      searchLabels: [],
      errorText: "",
      isInfoOpen: false,
      maxRent: 0,
      minRent: 0
    }
    this.props.fetchAllProperties();
  }

  getMinRentValue(minRent){
    if(minRent > 0){
      return <span>${minRent}</span>
    } else {
      return <span>None</span>
    }
  }

  getMaxRentValue(maxRent){
    if(maxRent > this.state.minRent){
      return <span>${maxRent}</span>
    } else {
      return <span>None</span>
    }
  }

  onAddChip(searchLabel){
    let searchLabels = this.state.searchLabels;
    searchLabels.push(searchLabel.trim())
    this.setState({ searchLabels })
  }

  onClickClear(){
    this.setState({ searchLabels: [], maxRent: 0, minRent: 0})
  }

  onClickShowAll(){
    this.onClickClear();
    this.props.fetchAllProperties();
  }

  onDeleteChip(chip, index){
    let searchLabels = this.state.searchLabels;
    searchLabels.splice(index, 1)
    this.setState({ searchLabels });
  }

  onSubmit(event){
    event.preventDefault();
    const { searchLabels, maxRent, minRent } = this.state;
    if(searchLabels.length > 0 || maxRent > 0 || minRent > 0){
      this.props.fetchPropertiesFiltered(searchLabels, maxRent, minRent);
      this.setState({ errorText: ""})
    } else {
      this.setState({ errorText: "Please add your desired labels."});
    }
  }

  render(){
    return(
      <div>
        <form onSubmit={this.onSubmit.bind(this)}>
          <Paper zDepth={1} className="margin-vertical-20 padding-20">
            <ChipInput
              onRequestAdd={(searchLabels) => this.onAddChip(searchLabels)}
              onRequestDelete={(chip, index) => this.onDeleteChip(chip, index)}
              fullWidth={true}
              placeholder={"Search for properties"}
              value={this.state.searchLabels}
              errorText={this.state.errorText}
            />
          <div className="row margin-vertical-10">
              <div className="col col-12 col-sm-12 col-md-6">
                Minimum Rent: {this.getMinRentValue(this.state.minRent)}
                <Slider min={0} max={10000}
                  value={this.state.minRent}
                  onChange={
                    (event, value)=>
                    this.setState({ minRent: value, maxRent: value})
                  }
                  className="slider-margin-5"
                  />
              </div>
              <div className="col col-12 col-sm-12 col-md-6">
                Maximum Rent: {this.getMaxRentValue(this.state.maxRent)}
                <Slider
                  min={this.state.minRent}
                  max={12000}
                  value={this.state.maxRent}
                  onChange={(event, value)=>this.setState({ maxRent: value})}
                  className="slider-margin-5"
                  />
              </div>
            </div>
            <div className="text-right">
              <FlatButton
                primary={true}
                label="Search"
                type="submit"
                />
              <FlatButton
                secondary={true}
                label="Clear Search"
                onClick={this.onClickClear.bind(this)}
                />
              <FlatButton
                primary={true}
                label="Show All Properties"
                onClick={this.onClickShowAll.bind(this)}
                />
                <FlatButton
                  primary={true}
                  label="Info"
                  onClick={()=>this.setState({isInfoOpen: true})}
                  />
            </div>
          </Paper>
        </form>
        <Dialog
          modal={true}
          open={this.state.isInfoOpen}
        >
          <p>Hi! To start searching for properties please add your desired
          labels such as kitchen, loft, and villa to the search box.
          You can also filter the city of the property by adding a
          label in this format: city:[Name of the City]. When you are done
          adding your desired labels, just click/tap the Search Button.</p>
          <div className="text-right">
            <FlatButton
              primary={true}
              label="Close"
              onClick={()=>this.setState({isInfoOpen: false})}
              />
          </div>
        </Dialog>
      </div>
    )
  }
}

export default connect(null,
  { fetchAllProperties, fetchPropertiesFiltered }
)(SearchBar);
