import React from "react";
import "./styles.css";
import { CurrencyFlagEditDropDown } from "./CurrencyFlagDropdown";
import { currency } from "./fixture";

class App extends React.Component {
  dropdownOnChange1 = (event, id, list) => {
    const { dropDownChangeCurrency1 } = this.props;
    if (dropDownChangeCurrency1) {
      dropDownChangeCurrency1(list);
    }
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
    let newCurrencyData = currency.map(this.currencyManipulation);
    const dropdownAttribute1 = {
      options: newCurrencyData,
      hidePlaceholder: true,
      selectedValue: "USD United States Dollar",
      onChange: this.dropdownOnChange1,
      enabeleRemoveIcon: true,
      code: "USD",
      id: "currency-flag-1"
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
