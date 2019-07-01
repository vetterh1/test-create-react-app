import * as log from 'loglevel';
import React from 'react';
import { Redirect } from 'react-router'
import PropTypes from 'prop-types';
import { injectIntl, defineMessages } from "react-intl";
// import { defineMessages } from 'react-intl.macro';
import { withStyles } from '@material-ui/core/styles';
import { withUserInfo } from '../../auth/withUserInfo';
import { withItemCharacteristics } from '../../auth/withItemCharacteristics';
import { withItems } from '../../auth/withItems';
import CategoryForm from './CategoryForm';
import DetailsForm from './DetailsForm';
import ContainerForm from './ContainerForm';
import ContainerColorForm from './ContainerColorForm';
import SizeForm from './SizeForm';
import FreezerForm from './FreezerForm';
import LocationForm from './LocationForm';
import Results from './Results';
import StepWizard from 'react-step-wizard';
import { withSnackbar } from 'notistack';
import setStateAsync from '../../utils/setStateAsync';

// import stringifyOnce from '../../utils/stringifyOnce.js'

const styles = theme => ({
  button: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },  
  divWizardPage: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    flex: "1 1 auto", 
  },
  maxHeight: {
    display: "flex",
    flexGrow: 1,
  },
  normalHeight: {
    display: "flex",
    flexGrow: 0,
  },  
});

const logAddWizard = log.getLogger('logAddWizard');
// loglevelServerSend(logAddWizard); // a setLevel() MUST be run AFTER this!
logAddWizard.setLevel('debug');
logAddWizard.debug('--> entering AddWizard.jsx');



const messages = defineMessages({ 
  error: {
    id: 'item.add.error',
    defaultMessage: 'Sorry, saving this item failed. Please try again...',
    description: 'Sorry, saving this item failed. Please try again...',
  },
});



class AddWizard extends React.Component {
  static propTypes = {
    userInfo: PropTypes.object.isRequired,
    items: PropTypes.object.isRequired,
    itemCharacteristics: PropTypes.object.isRequired,
  }

  stepsNumber = 8;

  defaultState = {
    category: null,
    details: [],
    container: null,
    color: null,
    size: null,
    freezer: null,
    location: null,
    name: "",
    expirationDate: null,
    expirationInMonth: 0,
    code: null,
  };

  resetState = () => {
    this.setState({...this.defaultState});
  }

  constructor(props) {
    super(props);
    this.state = {...this.defaultState};

    this.handleChange = this.handleChange.bind(this)
    this.handleArrayToggle = this.handleArrayToggle.bind(this)
    this.onStepChange = this.onStepChange.bind(this)

  }

  
  // Set the received value in the state 
  // (replacing any existing one)
  handleChange = async (updates, updateServer = false) => {
    this.setState(updates);
    if(updateServer) {
      console.log("handleChange: updateServer for id=", this.state.id, ", updates=", updates, "and userInfo=: ", this.props.userInfo);

      try {
        const { updateItemToServer } = this.props.items;
        const itemUpdated = await updateItemToServer(this.state.id , updates, this.props.userInfo);
        console.log('itemUpdated: ', itemUpdated);
        this.handleChange({code: itemUpdated.code})
      } catch (error) {
        console.error('AddWizard.handleChange error: ' , error);
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage(messages.error), 
          {variant: 'error', anchorOrigin: {vertical: 'bottom',horizontal: 'center'}}
        ); 
      }


    }
  }

  // Add the received value to the state value lists if it does not exist yet
  // If it already exists: remove it
  handleArrayToggle = (change) => {
    const {name, value} = change;
    const existingValues = this.state[name];
    const alreadyExists = existingValues.find(valueInList => valueInList === value);
    let newValues;
    if(alreadyExists){
      newValues = existingValues.filter(valueInList => valueInList !== value);
    } else {
      newValues = [...existingValues, value];
    }
    this.setState({[name]: newValues})    
  }

  onStepChange = async ({activeStep}) => {
    console.log("AddWizard.onStepChange: ", activeStep);
    if(activeStep === this.stepsNumber) {
      const { saveItemToServer } = this.props.items;
      console.log("State before setStateAsync ", this.state);


      try {
        const {itemCharacteristics} = this.props;
        const { category, details } = this.state;
        const expirationInMonth = itemCharacteristics.computeExpiration(category, details);
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + expirationInMonth);
        console.log("Date after " + expirationInMonth + " months:", expirationDate);
        await setStateAsync(this, {expirationDate, expirationInMonth});
        console.log("State after setStateAsync ", this.state);


        const itemUpdated = await saveItemToServer(this.state, this.props.userInfo);
        // console.log('itemUpdated: ', itemUpdated);
        this.handleChange({code: itemUpdated.code})
        this.handleChange({id: itemUpdated.id})
      } catch (error) {
        console.error('AddWizard.onStepChange error: ' , error);
        this.props.enqueueSnackbar(
          this.props.intl.formatMessage(messages.error), 
          {variant: 'error', anchorOrigin: {vertical: 'bottom',horizontal: 'center'}}
        ); 
      }
    }
  }




  render() {
    const { classes } = this.props;
    const { isAuthenticated } = this.props.userInfo;
    if (!isAuthenticated()) return <Redirect to='/' />;


    return (
          <div className={classes.divWizardPage}>
            <StepWizard
              isHashEnabled 
              className={"flex-max-height flex-direction-column"} 
              classNameWrapper={'flex-max-height flex-direction-column'}
              onStepChange={this.onStepChange}
            >
              {/* !!!! update variable stepsNumber whenever this list changes !!!! */}
              <CategoryForm  hashKey={'category'} handleChange={this.handleChange} state={this.state} />
              <DetailsForm hashKey={'details'} handleChange={this.handleChange} handleArrayToggle={this.handleArrayToggle} state={this.state} />
              <ContainerForm hashKey={'container'} handleChange={this.handleChange} state={this.state} />
              <ContainerColorForm hashKey={'color'} handleChange={this.handleChange} state={this.state} />
              <SizeForm hashKey={'size'} handleChange={this.handleChange} state={this.state} />
              <FreezerForm hashKey={'freezer'} handleChange={this.handleChange} state={this.state} />
              <LocationForm hashKey={'location'} handleChange={this.handleChange} state={this.state} />
              <Results hashKey={'results'} handleChange={this.handleChange} resetState={this.resetState} state={this.state} />
              {/* !!!! update variable stepsNumber whenever this list changes !!!! */}
              </StepWizard>
          </div>
      );
  }
}

export default injectIntl(withSnackbar(withItems(withItemCharacteristics(withUserInfo(withStyles(styles, { withTheme: true })(AddWizard))))));







  