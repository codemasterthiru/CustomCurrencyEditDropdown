import React from "react";

class Down extends React.Component {
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
        viewBox="0 0 350 350"
        width={this.props.width}
        height={this.props.height}
        className={this.props.className}
        onClick={this.props.onClick}
      >
        <path d="M267.808 117.053c-1.902-1.903-4.093-2.853-6.57-2.853-2.471 0-4.661.95-6.563 2.853L142.466 229.257 30.262 117.05c-1.903-1.903-4.093-2.853-6.567-2.853-2.475 0-4.665.95-6.567 2.853L2.856 131.327C.95 133.23 0 135.42 0 137.893c0 2.474.953 4.665 2.856 6.57l133.043 133.046c1.902 1.903 4.093 2.854 6.567 2.854s4.661-.951 6.562-2.854l133.054-133.046c1.902-1.903 2.847-4.093 2.847-6.565 0-2.474-.951-4.661-2.847-6.567l-14.274-14.278z" />
      </svg>
    );
  }
}

export { Down };
export default { Down };
