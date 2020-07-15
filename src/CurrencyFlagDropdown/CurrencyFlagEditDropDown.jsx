import React from "react";
import { EditDropdown } from "./EditDropdown";
import './style.scss';

class CurrencyFlagEditDropDown extends React.Component {
  render() {
    const { dropdownAttribute } = this.props;
    const attr = {
      ...dropdownAttribute,
      countryFlag: true,
    }
    return (
      <>
        <EditDropdown {...attr} />
      </>
    )
  }
}

export { CurrencyFlagEditDropDown };
export default { CurrencyFlagEditDropDown };