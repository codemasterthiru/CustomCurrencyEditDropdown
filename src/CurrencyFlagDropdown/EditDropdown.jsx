import React, { Component } from "react";
import classNames from "classnames";
import { CloseX } from "./CloseX";
import { Down } from "./Down";
import {
  objectCompare,
  isNonEmptyValue,
  isNonEmptyArray,
  hasOwnProperty,
  deepCopy
} from "./deps";
import Highlighter from "react-highlight-words";
import { getCurrencyFlag } from "./flags";
import noimage from "./noimage.png";

class EditDropdown extends Component {
  inputRef = React.createRef();
  onKeyPressed = false;
  state = {
    showdropdown: false,
    mouseOver: false,
    optionList: [],
    selectedValues: { id: "", name: "" },
    cursor: -1,
    isRemove: false
  };

  componentDidMount() {
    const { options } = this.props;
    this.setState({
      optionList: isNonEmptyArray(options) ? deepCopy(options) : [],
      cursor: -1
    });
    this.updateSelectedValue(this.props);
    this.optionSelected = false;
  }

  unsafe_componentWillReceiveProps(nextProps) {
    if (
      !objectCompare(nextProps.selectedValue, this.props.selectedValue) ||
      !objectCompare(nextProps.options, this.props.options)
    ) {
      this.setState({ cursor: -1 });
      this.updateSelectedValue(nextProps);
      this.optionSelected = false;
    }
  }

  updateSelectedValue = props => {
    const { selectedValue, options = [] } = props;
    let selectedOption = isNonEmptyArray(options)
      ? options.find(obj => {
          return obj.id === selectedValue || obj.name === selectedValue;
        })
      : { id: "", name: "" };
    if (
      isNonEmptyValue(selectedOption) &&
      hasOwnProperty(selectedOption, "name")
    ) {
      this.inputRef.current.value = selectedOption.name;
      this.setState({ selectedValues: selectedOption });
    }
    this.setState({
      optionList: isNonEmptyArray(options) ? deepCopy(options) : [],
      cursor: -1
    });
  };

  onFocus = () => {
    this.setState({ showdropdown: true, isRemove: true }, () => {
      const { onFocus = null, options = [] } = this.props;
      if (onFocus !== null) {
        onFocus();
      }
      if (!this.onKeyPressed) {
        this.setState({
          optionList: isNonEmptyArray(options) ? deepCopy(options) : []
        });
      }
    });
  };

  onBlur = event => {
    if (event) {
      const parent = event.currentTarget.parentElement;
      const imageTag = parent.getElementsByClassName("input-currency-flag")[0];
      const { selectedValues } = this.state;
      if (selectedValues.id === "") {
        this.inputRef.current.value = "";
        imageTag.src = noimage;
      }
      if (!this.stopBlur) {
        this.setState({ showdropdown: false, isRemove: false });
      }
    }
  };

  onMouseOver = () => this.setState({ mouseOver: true });
  onMouseOut = () => this.setState({ mouseOver: false });

  hideDropdown = () => {
    this.setState({ showdropdown: false, mouseOver: false });
  };

  onTextChange = () => {
    const value = this.inputRef.current.value;
    this.onKeyPressed = false;
    const hasValue = isNonEmptyValue(value);
    const { options } = this.props;
    const _self = this;
    clearTimeout(this.setTime);
    this.setTime = setTimeout(function() {
      const newArray = hasValue
        ? _self.filter(value, options)
        : isNonEmptyArray(options)
        ? options
        : [];
      _self.setState({ optionList: deepCopy(newArray), cursor: -1 });
    }, 300);
  };

  filter = (value, data) => {
    if (isNonEmptyArray(data)) {
      const newArray = data.filter(list => {
        return (
          hasOwnProperty(list, "name") &&
          list.name.toLowerCase().includes(value.toLowerCase())
        );
      });

      return isNonEmptyArray(newArray) ? [...newArray] : [];
    }
    return [];
  };

  onDropdownClick = (event, stringList) => {
    event.preventDefault();
    this.optionSelected = true;
    const { onChange = null, id = "", options = [] } = this.props;
    const list = JSON.parse(stringList);
    let imageTag = "";
    if (id.includes("1")) {
      imageTag = document.getElementsByClassName("input-currency-flag")[0];
    } else {
      imageTag = document.getElementsByClassName("input-currency-flag")[1];
    }
    imageTag.src = getCurrencyFlag(list.code);
    this.onKeyPressed = false;
    if (onChange !== null) {
      this.inputRef.current.value = list.name;
      onChange(event, id, list);
    }
    this.setState({
      showdropdown: false,
      mouseOver: false,
      cursor: -1,
      selectedValues: { id: list.id, name: list.name }
    });
  };

  handleKeyDown = event => {
    event.stopPropagation();
    this.onKeyPressed = true;
    const { cursor, optionList = [] } = this.state;
    const scrollElement = document.getElementsByClassName(
      "custom-dropdown-list"
    )[0];

    // Up key in keyboard
    if (event.keyCode === 38 && cursor > 0) {
      if (cursor === 1) {
        scrollElement && scrollElement.scrollTo(0, 0);
      } else {
        scrollElement && scrollElement.scrollTo(0, cursor * 25);
      }
      this.setState(prevState => ({ cursor: prevState.cursor - 1 }));
    }
    // Down key in keyboard
    else if (event.keyCode === 40 && cursor < optionList.length) {
      if (cursor === optionList.length - 1) {
        scrollElement && scrollElement.scrollTo(0, (cursor + 1) * 25);
      } else {
        scrollElement && scrollElement.scrollTo(0, cursor * 25);
        this.setState(prevState => ({ cursor: prevState.cursor + 1 }));
      }
    }
    // Enter key in keyboard
    else if (event.keyCode === 13 && optionList.length > 0) {
      const list = document.getElementsByClassName(
        "custom-option-item active"
      )[0];
      if (list) {
        const id = list.getAttribute("id");
        const name = list.getAttribute("name");
        this.inputRef.current.value = name;
        const newList = { id: id, name: name, value: id, keyPressed: true };
        this.onDropdownClick(event, JSON.stringify(newList));
      }
    }
    // ESC key in keyboard
    else if (event.keyCode === 27) {
      this.inputRef.current.value = "";
      event.target.blur();
    }
  };

  triggerOptionSelection = event => {
    try {
      const currentEl = event.target;
      const currVal = currentEl.value;
      const listParentEl = currentEl.closest(".custom-edit-dropdown-container");
      const listEl = listParentEl.querySelector(".custom-dropdown-list");
      const listItems = listEl && listEl.children ? listEl.children : [];
      for (let el of listItems) {
        let id = el.getAttribute("id") || "";
        let name = el.getAttribute("name");
        if (
          id.toLowerCase() === currVal.toLowerCase() ||
          name.toLowerCase() === currVal.toLowerCase()
        ) {
          el.click();
          break;
        }
      }
    } catch (err) {
      if (err && err.message) {
        console.log(err.message);
      }
    }
  };

  checkAndRevertValue = event => {
    event.persist();
    this.stopBlur = true;

    setTimeout(() => {
      this.triggerOptionSelection(event);
      if (!this.optionSelected) {
        this.updateSelectedValue(this.props);
      }
      this.optionSelected = false;
      this.stopBlur = false;
      this.onBlur();
    }, 300);
  };

  clearInput = event => {
    const parent = event.currentTarget.parentElement;
    const imageTag = parent.getElementsByClassName("input-currency-flag")[0];
    setTimeout(() => {
      this.onFocus();
      this.inputRef.current.value = "";
      imageTag.src = noimage;
    }, 500);
  };

  render() {
    const {
      showdropdown,
      mouseOver,
      optionList = [],
      cursor,
      isRemove
    } = this.state;
    const {
      textValue = "",
      className = "",
      disabled = false,
      placeholder = "Select",
      enabeleRemoveIcon,
      removeValue,
      countryFlag,
      code,
      id
    } = this.props;

    const queryString =
      this.inputRef && this.inputRef.current ? this.inputRef.current.value : "";

    const flag = getCurrencyFlag(code);

    return (
      <div className={classNames("custom-edit-dropdown-container", className)}>
        {textValue !== null && textValue !== "" ? (
          <div className="custom-Text-field">{textValue}</div>
        ) : null}

        <div
          className={classNames({
            "cutom-selection-box": true,
            disabled: disabled
          })}
          onClick={!disabled ? this.onFocus : null}
          onBlur={this.onBlur}
        >
          {code && flag ? (
            <img
              className="input-currency-flag"
              id={id}
              src={flag}
              alt={code}
            />
          ) : (
            ""
          )}
          <input
            type={"text"}
            className={"cutom-input"}
            ref={this.inputRef}
            autoComplete="off"
            placeholder={placeholder}
            onChange={this.onTextChange}
            disabled={disabled}
            onFocus={!disabled ? this.onFocus : null}
            onKeyDown={this.handleKeyDown}
            title={queryString}
            onBlur={this.checkAndRevertValue}
          />
          {isRemove && enabeleRemoveIcon ? (
            <CloseX onClick={this.clearInput} className="remove-text" />
          ) : (
            ""
          )}
          <Down
            className="custom-down-arrow"
            onClick={!disabled ? this.onFocus : null}
          />
        </div>

        {isNonEmptyArray(optionList) && (showdropdown || mouseOver) ? (
          <React.Fragment>
            <div
              className={"custom-dropdown-list"}
              onMouseEnter={this.onMouseOver}
              onMouseLeave={this.onMouseOut}
            >
              {optionList.map((list, index) => {
                if (list.name === removeValue) {
                  return "";
                }
                return (
                  <List
                    key={index}
                    index={index}
                    cursor={cursor}
                    queryString={queryString}
                    stringList={JSON.stringify(list)}
                    onClick={this.onDropdownClick}
                    countryFlag={countryFlag}
                  />
                );
              })}
            </div>
            {showdropdown || mouseOver ? (
              <div
                className="custom-edit-dropdown-mask"
                onClick={this.hideDropdown}
              />
            ) : null}
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

const List = props => {
  const {
    index = 0,
    cursor = -1,
    stringList,
    onClick = null,
    queryString = "",
    countryFlag
  } = props;

  const list = JSON.parse(stringList);

  const onchange = event => {
    event.preventDefault();
    if (onClick !== null) {
      onClick(event, stringList);
    }
  };

  const flag = getCurrencyFlag(list.code);

  return (
    <div
      className={classNames("custom-option-item", cursor === index && "active")}
      id={hasOwnProperty(list, "id") ? list.id : 0}
      name={hasOwnProperty(list, "name") ? list.name : ""}
      onClick={onchange}
    >
      {countryFlag ? (
        <img
          className="currency-flag"
          src={flag ? flag : noimage}
          alt={list.code}
        />
      ) : (
        ""
      )}
      <span className="custom-option-text">
        <Highlighter
          highlightClassName="option-highlight"
          searchWords={
            isNonEmptyValue(queryString) ? queryString.split(" ") : []
          }
          autoEscape={true}
          textToHighlight={hasOwnProperty(list, "name") ? list.name : ""}
        />
      </span>
    </div>
  );
};

export default { EditDropdown };
export { EditDropdown };
