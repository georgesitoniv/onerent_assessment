import React, { Component } from "react";
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText,
  FlatButton
} from 'material-ui';
import Lightbox from "react-images";

class PropertyDetail extends Component{
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      lightboxIsOpen: false
     };
  }

  onExpandChange = (expanded) => {
    this.setState({expanded: expanded});
  };

  getCardMedia(property){
    if(property.defaultImage){
      if(property.defaultImage.medium){
        return(
          <CardMedia expandable={true}>
            <img
              src={property.defaultImage.medium} alt=""
              onTouchTap={this.handleOpen}
              />
            <div className="margin-vertical-5 text-center">
              <FlatButton
                label="Expand Image"
                primary={true}
                onClick={() => this.setState({ lightboxIsOpen: true})}/>
            </div>
          </CardMedia>
        )
      }
    } else {
      return;
    }
  }

  renderLightbox(){
    const {property} = this.props;
    if(property.defaultImage){
      return (<Lightbox
        images={[{ src: property.defaultImage.large }]}
        isOpen={this.state.lightboxIsOpen}
        onClose={() => this.setState({lightboxIsOpen: false})}
      />);
    }
  }

  render(){
    const { property } = this.props;
    return(
      <div className="col col-xs-12 col-sm-12 col-md-6 col-lg-6 margin-vertical-10">
        <Card expanded={this.state.expanded}
          onExpandChange={(expanded) => this.setState({expanded: expanded})}>
           <CardHeader
             title={`${property.address}, ${property.city}, ${property.state}`}
             actAsExpander={true}
             showExpandableButton={true}
           />
          {this.getCardMedia(property)}
           <CardText>
             <p>Target Rent: ${property.targetRent}</p>
             <p>Target Deposit: ${property.targetDeposit}</p>
           </CardText>
         </Card>
         {this.renderLightbox()}
      </div>
    )
  }
}

export default PropertyDetail;
