import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import PropertyDetail from "./PropertyDetail";
import { LinearProgress, Paper } from "material-ui";

class PropertyList extends Component {
  renderProperties(){
    return _.map(this.props.properties,
      (property) => {
        return(
          <PropertyDetail property={property} key={property.id}/>
        )
      }
    )
  }

  render(){
    if(!this.props.properties){
      return (
        <div className="text-center margin-vertical-30">
          <LinearProgress mode="indeterminate" />
        </div>
      );
    }

    const propertiesLength = Object.keys(this.props.properties).length;
    if(propertiesLength == 0){
      return(
        <Paper zDepth={1}>
          <div className="padding-30 text-center margin-vertical-10">
            <h4>Sorry, No Properties Found.</h4>
          </div>
        </Paper>
      )
    }

    return(
      <div>
        <div className="text-right">
          <h6>
            Results: {propertiesLength} Properties
          </h6>
        </div>
        <div className="row">
          {this.renderProperties()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ properties }) =>{ return { properties } }

export default connect(mapStateToProps)(PropertyList);
