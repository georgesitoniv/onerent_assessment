import axios from "axios";
import _ from "lodash";

export const UPDATE_SEARCH_LABELS = 'UPDATE_SEARCH_LABELS';
export const FETCH_PROPERTIES = 'FETCH_ALL_PROPERTIES';
const TOTAL_CONFIDENCE_RATING = "totalConfidenceRating";

const fetchProperties =  () => {
  return axios.post('http://www.onerent.co/api/Property/availableProperties');
}

const filterPropertiesByRent = (properties, maxRent, minRent) => {
  return _.filter(properties, (property) => {
    const validations = { maxRent: true, minRent: true};
    if(property.targetRent < minRent){
      validations.minRent = false;
    }
    if(maxRent > minRent){
      if(property.targetRent > maxRent){
        validations.maxRent = false;
      }
    }
    if(validations.maxRent && validations.minRent){
      return property;
    }
  });
}

//filters properties by search labels entered
//loops through the searchLabels for each property and validates if search label
//is present. the validations are stored on hasLabels. if hasLabels contains
//'false', the current property is discarded.
const filterPropertiesByLabel = (properties, searchLabels) => {
  const filteredProperties = _.filter(properties, (property) => {
    if(property.hasOwnProperty('defaultImage')){
      if(property.defaultImage.hasOwnProperty('labels')){
        const hasLabels =  _.map(searchLabels, (searchLabel) => {
          if(searchLabel.match(/( *)+city+(: *)/ig)){
            const city = searchLabel.replace(/( *)+city+(: *)/ig, '')
            return property.city.toString().toLowerCase() == city.toLowerCase();
          } else {
            return property.defaultImage.labels.hasOwnProperty(
              searchLabel.toLowerCase()
            );
          }
        });
        if(!(hasLabels.includes(false))){
          return property;
        }
      }
    }
  });
  return filteredProperties;
}

//sums all the confidence ratings of the search labels
//selected for each property.
const getPropertiesWithRatings = (properties, searchLabels) => {
  return _.map(properties, (property) => {
    let total_rating= 0;
    _.map(searchLabels, (searchLabel) =>{
      const rating = _.toNumber(property.defaultImage.labels[searchLabel]);
      if(!_.isNaN(rating)){
        total_rating += rating;
      }
    });
    property[TOTAL_CONFIDENCE_RATING] = total_rating;
    return property;
  });
}

//gets the all filtered properties by label and
// their corresponding total confindence rating.
//The total confidence rating is used to sort the properties.
const sortPropertiesByLabel = (properties, searchLabels) => {
  const filteredProperties = filterPropertiesByLabel(properties, searchLabels);
  const propertiesWithRatings = getPropertiesWithRatings(
    filteredProperties,
    searchLabels
  );
  const sortedProperties = _.reverse(
    _.sortBy(propertiesWithRatings, TOTAL_CONFIDENCE_RATING)
  );
  return sortedProperties;
}

//dispatches null to the reducer while the api is being fetch.
export function fetchAllProperties(){
  const properties = fetchProperties();
  return (dispatch) => {
    dispatch({ type: FETCH_PROPERTIES, payload: null });
    properties.then(({data}) => {
      dispatch({
        type: FETCH_PROPERTIES,
        payload: _.mapKeys(data, "id")
      })
    })
  }
}

//dispatches null to the reducer while the api is being fetch.
export function fetchPropertiesFiltered(searchLabels, maxRent, minRent){
  const properties = fetchProperties();
  return (dispatch) => {
    dispatch({ type: FETCH_PROPERTIES, payload: null});
    properties.then(({data}) => {
      //filters the properties by rent
      const filteredPropertiesByRent = filterPropertiesByRent(
        data, maxRent, minRent
      );
      dispatch({
        type: FETCH_PROPERTIES,
        payload: _.mapKeys(
          sortPropertiesByLabel(filteredPropertiesByRent, searchLabels),
           "id"
         )
      })
    })
  }
}
