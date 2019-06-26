import React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { injectIntl } from "react-intl";
import { defineMessages, FormattedMessage } from 'react-intl.macro';
import { Context } from "../../data/ItemCharacteristicsStore";




const messages = defineMessages({
  name: {
    id: 'add.results.name.help',
    defaultMessage: 'To help you remember what it is',
    description: 'To help you remember what it is',
  },
  date: {
    id: 'add.results.date.label',
    defaultMessage: 'Change expiration date (optional)',
    description: 'Change expiration date (optional)',
  },
});



const styles = theme => ({
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    textAlign: 'center',
    marginLeft: theme.spacing(2),
  },  
  divWizard: {
    marginTop: theme.spacing(2),
  },
});


class Results extends React.Component {
  static propTypes = {
  }


  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleAddNew() { this.props.resetState(); this.props.firstStep();}
  handleTextChange(event) { this.props.handleChange({name: 'name', value: event.target.value});  }
  handleDateChange(event) { this.props.handleChange({name: 'expirationDate', value: event.target.value});  }


  componentDidMount() {
    console.log('Results.componentDidMount');
  }


  render() {
    // State is NOT stored in this wizard tab, but in the parent (wizard component)
    const { classes, state } = this.props;

    if(!state.category || !state.details) return null;

    // Get the categories from the context.
    // They contain the expiration information
    const { categories: items } = this.context;

    // Find the expiration & expiration exceptions for this category
    const item = items.find(item => item.id2 === state.category);
    const {expiration, expirationMinusPlus} = item;
    // console.log('Results.render: expiration=', expiration, " - expirationMinusPlus=", expirationMinusPlus);

    // Find the expiration by taking the category expiration value
    // then + or - the exceptions
    let expirationInMonth = parseInt(expiration);
    state.details.forEach(detail => {
      const variation = expirationMinusPlus[detail];
      // console.log('Results.render: variation=', variation);

      if(variation) {
        const intVariation = parseInt(variation);
        expirationInMonth += intVariation
        // console.log('Results.render: intVariation=', intVariation, " - expirationInMonth=", expirationInMonth);
      }
    });

    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + expirationInMonth);
    // console.log("Date after " + expirationInMonth + " months:", expirationDate);

    return (

      <div className={"flex-max-height flex-direction-column"}>

        <div className={"flex-max-height flex-direction-column"}>
          <div className={"flex-normal-height flex-direction-column margin-down margin-top"}>
            <Typography variant="h4" className={"margin-down"}>
              {state.code}
            </Typography>
            <Typography variant="subtitle1">
              <ul>
                <li><FormattedMessage id="add.results.explanation1" defaultMessage="Write down this code on a sticker" /></li>
                <li><FormattedMessage id="add.results.explanation2" defaultMessage="Stick it to your container" /></li>
              </ul>
              <FormattedMessage id="add.results.explanation3" defaultMessage="We'll send you a reminder in {expirationInMonth} months" values={{expirationInMonth}} />
            </Typography>
          </div>

          <FormControl className={"flex-normal-height flex-direction-column huge-margin-down"}>
            <InputLabel htmlFor="name"><FormattedMessage id="add.results.name.label" defaultMessage="Name (optional)" /></InputLabel>
            <Input
              id="name"
              value={state.name}
              onChange={this.handleTextChange.bind(this)}
              aria-describedby="name-text"
              fullWidth
            />
            <FormHelperText id="name-text">{this.props.intl.formatMessage(messages.name)}</FormHelperText>
          </FormControl>

          <div className={"flex-normal-height flex-direction-column huge-margin-down"}>
              <TextField
                id="date"
                label={this.props.intl.formatMessage(messages.date)}
                type="date"
                defaultValue={state.expirationDate}
                onChange={this.handleDateChange.bind(this)}
                fullWidth
              />
          </div>

          <div className={"flex-max-height flex-direction-column"}>
            &nbsp;
          </div>

        </div>

        <div className={"flex-normal-height flex-direction-row flex-justifiy-between"}>
          <Button variant="contained" color="secondary" onClick={this.handleAddNew.bind(this)} className={classes.button}>
            <FormattedMessage id="button.addnew" defaultMessage="Add a new item" />
          </Button> 
          <Button variant="contained" color="primary" component={Link} to="/" className={classes.button}>
            <FormattedMessage id="button.backhome" defaultMessage="Back Home" />
          </Button>   
        </div>

      </div>

    );
  }
}
Results.contextType = Context;


export default injectIntl(withStyles(styles)(Results));