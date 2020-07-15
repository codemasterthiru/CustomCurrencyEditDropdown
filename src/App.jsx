import React from "react";
import "./styles.css";
import { CurrencyFlagEditDropDown } from "./CurrencyFlagDropdown";
import { currency } from "./fixture";

class App extends React.Component {
  state = {
    currency,
    selectedObj: {
      name: "USD United States Dollar",
      code: "USD",
      id: ""
    }
  };
  dropdownOnChange1 = (event, id, list) => {
    const { dropDownChangeCurrency } = this.props;
    if (dropDownChangeCurrency) {
      dropDownChangeCurrency(list);
    }
    this.setState({
      selectedObj: list
    });
  };
  currencyManipulation = props => {
    const { name } = props;
    const currCode = name.split(" ")[0];
    return {
      ...props,
      code: currCode
    };
  };
  render() {
    let newCurrencyData = this.state.currency.map(this.currencyManipulation);
    const dropdownAttribute1 = {
      options: newCurrencyData,
      hidePlaceholder: true,
      selectedValue: this.state.selectedObj.name,
      onChange: this.dropdownOnChange1,
      enabeleRemoveIcon: true,
      code: this.state.selectedObj.code,
      id: "currency-flag"
    };
    return (
      <div className="App">
        <CurrencyFlagEditDropDown dropdownAttribute={dropdownAttribute1} />
      </div>
    );
  }
}

export { App };
export default { App };
