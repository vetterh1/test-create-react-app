import React from 'react';
import PropTypes from 'prop-types';
import { Context } from "../../data/ItemCharacteristicsStore";
import {ItemsList, WizNavBar, WizPageTitle} from "./WizUtilComponents";



class ContainerForm extends React.Component {
  static propTypes = {
    handleChange: PropTypes.func.isRequired,
  }

  handleClick = (id) => {
    const { handleChange, currentStep, nextStep, goToStep } = this.props;
    let { colors } = this.context;

    // Update the wizard with the container id
    handleChange({ name: 'container', value: id });

    // Look if this chosen container supports colors
    const containerHasColors = colors.filter(color => color.parentIds.find(oneParentId => oneParentId === id)).length > 0;
    if(containerHasColors) {
      nextStep();
    }
    else {
      goToStep(currentStep + 2);
    }
  };

  handlePrevious = () => { this.props.handleChange({ name: 'container', value: undefined }); this.props.previousStep(); };



  render() {
    // Get the containers to display from the context
    // and the (possibly) already selected container from the props.state (state from parent)
    let { containers: items } = this.context;
    const { container: itemInState } = this.props.state;
    return (
      <div className={"flex-max-height flex-direction-column"}>
        <WizPageTitle id="add.container.title" defaultMessage="What container are you using?" variable1="" />
        <ItemsList items={items} itemInState={itemInState} itemInStateIsAnArray={false} handleClick={this.handleClick} />
        <WizNavBar onClickNext={null} onClickPrevious={this.handlePrevious.bind(this)} />
      </div>

    )
  };
}
ContainerForm.contextType = Context;

export default ContainerForm;