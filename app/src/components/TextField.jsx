import React, { Component } from "react"
import PropTypes from "prop-types"
class TextField extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultValue: this.props.computeValue,
      borderBottom: "2px solid transparent",
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.value !== nextProps.value) {
      return true
    }
    if (this.state.borderBottom !== nextState.borderBottom) {
      return true
    }
    return false
  }

  toggleHover = () => {
    this.setState({ hover: !this.state.hover })
  }

  onFocus = () => {
    this.setState({
      borderBottom: "2px solid rgba(235,190,69, 1)",
    })
  }

  onBlur = () => {
    this.setState({
      borderBottom: "2px solid transparent",
    })
  }

  render = () => {
    const styling = {
      flexBasis: 0,
      flexGrow: 1,
      boxSizing: "border-box",
      display: "inline",
      backgroundColor: "transparent",
      color: "rgba(0, 0, 0, 0.87)",
      border: "none",
      borderBottom: "2px solid transparent",
      outline: "none",
      //width: "60px",
      padding: 0,
      boxShadow: "none",
      borderRadius: "0px",
      fontSize: "16px",
      fontFamily: "inherit",
      lineHeight: "inherit",
      backgroundImage: "none",
      transition: "border-bottom 0.5s",
      textAlign: "center",
    }
    let inputStyle = styling
    inputStyle["borderBottom"] = this.state.borderBottom
    return (
      <input
        type="text"
        style={inputStyle}
        onBlur={() => this.onBlur()}
        onFocus={() => this.onFocus()}
        className="smallInput"
        placeholder={this.props.name}
        value={this.props.value}
        onChange={e => this.props.onChange(e.target.value)}
      />
    )
  }
}

export default TextField
