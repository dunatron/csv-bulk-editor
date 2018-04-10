import React, { Component } from "react"
import PropTypes from "prop-types"
import DnDFileReader from "./DnDFileReader"
import TextField from "./TextField"

const divStyle = {
  display: "inline",
}

const ScrollableTable = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  overflowX: "scroll",
}
const TableRow = {
  display: "flex",
}

function getColName(name) {
  return function(v) {
    return v[name]
  }
}

// const IMPORTER_FNS = {
//   TEXT: v => v[name],
// }

// const RENDER_FNS = {
//   TEXT: v => <input />,
// }

const importTextField = colName => ({ row, onChange }) => (
  <TextField value={row[colName]} onChange={v => onChange(v, colName)} />
)

const confObj = {
  agreementID: importTextField("Agreement ID"),
  centreCode: importTextField("Centre Code"),
  agreementKnownAs: importTextField("Agreement Known As"),
  cpi: importTextField("CPI"),
  floorCpi: importTextField("Floor (CPI)"),
  capCpi: importTextField("Cap (CPI)"),
  mixedCpi: importTextField("Mixed (CPI)"),
  market: importTextField("Market"),
  floorMarket: importTextField("Floor (Market)"),
  capMarket: importTextField("Cap (Market)"),
}

const CsvConfig = v => {
  return confObj
}

class DnDFileComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSrc: null,
      dataType: null,
      csvRows: [],
    }
  }

  shouldComponentUpdate = (nextState, nextProps) => {
    if (nextState.csvRows != this.state.csvRows) {
      return true
    }
    if (nextState.dataSrc != this.state.dataSrc) {
      return true
    }
    return false
  }

  render = () => {
    const { dataSrc, dataType, csvRows } = this.state
    console.log("Render Data", dataSrc, dataType)
    console.log("CSV ROWS", csvRows)
    return (
      <div style={divStyle}>
        <DnDFileReader
          event={this.props.event}
          processData={(data, type) => this.processData(data, type)}
        />
        {csvRows &&
          !!csvRows.length && (
            <div style={ScrollableTable}>{this.renderCsvRows(csvRows)}</div>
          )}
      </div>
    )
  }

  renderCsvRows = rows => {
    console.log("renderCsvRows", rows)
    const renderDatas = rows.map((row, index) => {
      return (
        <div key={index} style={TableRow}>
          {Object.entries(confObj).map(([cnfKey, R]) => {
            return (
              <R
                row={row}
                onChange={(v, colName) => {
                  console.log(v, index, colName)
                  this.handleInputChange(index, colName, v)
                }}
              />
            )
          })}
        </div>
        // return (
        //   <div key={index} style={TableRow}>
        //     {Object.entries(v).map((v, key) => {
        //       let colKey = v[0]
        //       console.log("Entries data", v)
        //       console.log("colKey", colKey)
        //       return (
        //         <TextField
        //           value={v[1]}
        //           onChange={v => {
        //             this.handleInputChange(index, colKey, v)
        //           }}
        //         />
        //       )
        //     })}
        //   </div>
        // )
      )
    })
    return renderDatas
  }

  handleInputChange = (index, key, val) => {
    console.log("Handle Change", index, key, val)
    console.log("CHANGE ROW AT INDEX & KEY ", this.state.csvRows)
    console.log(this.state)
    const csvRows = this.state.csvRows
    csvRows[index][key] = val
    this.setState({
      csvRows: csvRows,
    })

    console.log("NEW STATE ", this.state)
  }

  // renderCsvData = src => {
  //   console.log("renderCsvData", src)

  //   let data = src.map((v, i) => {
  //     return CsvConfig(v)
  //   })

  //   this.setState({
  //     csvRows: data,
  //   })
  // }

  renderImage = src => {
    console.log("renderImage", src)
    return <img src={src} height="400" />
  }

  renderDataSrc = (src, type) => {
    if (type === "csv") {
      return this.renderCsvData(src)
    } else if (type === "image") {
      return this.renderImage(src)
    }
  }

  processData = (data, type) => {
    if (type === "csv") {
      //this.setCSVRows(data)
      this.setState({
        csvRows: data,
      })
    }
  }

  // setCSVRows = dataSrc => {
  //   console.log("gettinh here")
  //   const data = dataSrc.map((v, i) => {
  //     //return CsvConfig(v)
  //     console.log(confObj)
  //     return Object.entries(confObj).reduce((row, [key, type]) => {
  //       // fn = IMPORTER_FNS[type]
  //       // row[key] = fnOrColName(v)

  //       if (typeof fnOrColName === "string") {
  //         row[key] = v[fnOrColName]
  //       } else {
  //         row[key] = fnOrColName(v)
  //       }
  //       return row
  //     }, {})
  //   })

  //   console.log("data is", data)

  //   this.setState({
  //     csvRows: data,
  //   })
  // }
}

export default DnDFileComponent
