import React from "react";

class CloseX extends React.Component {
  static defaultProps = {
    width: "25px",
    height: "25px",
    className: "",
    onClick: null
  };
  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 339.75 339.75"
        width={this.props.width}
        height={this.props.height}
        className={this.props.className}
        onClick={this.props.onClick}
      >
        <path d="M215.875 169.75l114 114c13 13 13 33 0 46-6 6-15 10-23 10s-17-4-23-10l-114-114-114 114c-6 6-15 10-23 10s-17-4-23-10c-13-13-13-33 0-46l114-114-114-114c-13-13-13-33 0-46s33-13 46 0l114 114 114-114c13-13 33-13 46 0s13 33 0 46l-114 114z" />
      </svg>
    );
  }
}

export { CloseX };
export default { CloseX };
