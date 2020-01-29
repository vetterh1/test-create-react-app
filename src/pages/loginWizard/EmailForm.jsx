import React from 'react';
import { Redirect } from 'react-router'
import { TextField } from '@material-ui/core';
import { injectIntl } from "react-intl";
import { WizNavBar, WizPageTitle} from "../utils/WizUtilComponents";
import validateEmail from "../../utils/validateEmail";


class EmailForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      validData: false,
    }; 
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.timer = setTimeout(
      () => this.textInput.current.focus(),
      1500
    );
  }

  componentWillUnmount() {
    clearInterval(this.timer);
}


  handleTextChange(event) {
    if(!this.props.isActive) return;
    const {value} = event.target;
    if(value === this.props.state.email) return;
    // Verify if email is valid (Next btn only if valid!)
    if(validateEmail(value) !== this.state.validData)
      this.setState((state) => { return {validData: !state.validData}; })
    // Save in parent
    this.props.handleChange({name: 'email', value});
  }
  
  handleNext = (e) => {
    //e.preventDefault should always be the first thing in the function
    e.preventDefault();

    this.props.nextStep(); 
  };

  render() {
    const {name} = this.props.state;
    if(this.props.isActive && name === "") {
      console.debug('[>>> Login:EmailForm ------>>>----- / >>>] Reason: name is empty');
      return <Redirect to='/' />
    }

    // State is NOT stored in this wizard tab, but in the parent (wizard component)
    const { state } = this.props;
    const { email } = state;
    const {validData} = this.state;
    return (

      <div className={"flex-normal-height flex-direction-column"}>

        <WizPageTitle message={this.props.intl.formatMessage({id: 'register.email.title'})} />

        <form onSubmit={this.handleNext} className={"flex-normal-height flex-direction-column"} noValidate>

          <div className={"flex-normal-height flex-direction-column"}>

            <TextField
                id="email"
                autoComplete="email"
                value={email}
                type="email"
                onChange={this.handleTextChange}
                label={this.props.intl.formatMessage({id: 'register.email.label'})}
                helperText={this.props.intl.formatMessage({ id: validData ? 'register.email.help' : 'register.email.error'})}
                error={email !== "" && !validData}
                fullWidth
                inputRef={this.textInput} 
              />
      
          </div>

          <WizNavBar nextIsSubmit isNextDisabled={!validData} />

        </form>

      </div>

    );
  }
}


export default injectIntl(EmailForm);