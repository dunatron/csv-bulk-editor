import React, { Component } from "react"
import logo from "./logo.svg"
import "./App.css"
import DnDFileComponent from "./components/DnDFileComponent"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      CsvFile: null,
    }
  }

  checkCsv = csv => {
    console.log("Check Csv", csv)
    this.setState({
      CsvFile: csv,
    })
    // TODO
    return true
  }

  render() {
    const csvConfig = {
      agreementID: { type: "text", colName: "Agreement ID" },
      centreCode: { type: "text", colName: "centreCode" },
      CPI: { type: "text", colName: "CPI" }
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <DnDFileComponent csvConf={csvConfig} />

        <div>
          {this.state.CsvFile &&
            this.state.CsvFile.map(row => {
              row = row.substring(0, row.length - 1)
              //console.log(row.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/g))
              let rowArr = row.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/g)
              return <p>{rowArr[0]}</p>
            })}
        </div>
      </div>
    )
  }
}

export default App
