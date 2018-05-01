import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles } from 'material-ui/styles';
import DnDFileReader from "./DnDFileReader"
import DataObjectContent from './DataObjectContent'
import TextField from "./TextField"
import VirtualList from 'react-virtual-list';
import { Button, IconButton } from 'material-ui';

const divStyle = {
  display: "inline",
}

const styles = theme => ({
  cardContainer: {
    display: "flex",
    flexWrap: "wrap"
  },
});

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
  return function (v) {
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
  <TextField value={row[colName]} placeholder={colName} onChange={v => onChange(v, colName)} />
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
    const { csvConf } = props
    this.state = {
      dataObjects: [], //{ src: null, type}
      csvConf: csvConf
    }
  }

  shouldComponentUpdate = (nextState, nextProps) => {
    if (nextState.csvRows != this.state.csvRows) {
      return true
    }
    if (nextState.dataSrc != this.state.dataSrc) {
      return true
    }
    if (nextState.dataObjects != this.state.dataObjects) {
      return true
    }
    return false
  }

  render = () => {
    const { dataObjects } = this.state

    return (
      <div style={divStyle}>
        <DnDFileReader
          event={this.props.event}
          processData={(data, type, size, name, lastModified) => this.processData(data, type, size, name, lastModified)}
        />
        {dataObjects && dataObjects.length >= 1 && <h2>{dataObjects.length} ready to upload</h2>}
        {dataObjects && dataObjects.length >= 1 && this.renderDataObjects(dataObjects)}
      </div>
    )
  }

  handleInputChange = (objIndex, index, key, val) => {
    const dataObjects = this.state.dataObjects
    dataObjects[objIndex]["src"][index][key] = val
    this.setState({
      dataObjects: dataObjects,
    })
    console.log("State after edit ", dataObjects)
  }

  renderDataObjects = (dataObjects) => {
    return (<div className={this.props.classes.cardContainer}>
      {dataObjects.map((data, index) => {
        return this.dataContainer(data, index)
      })}
    </div>)
  }

  removeDataObject = (index) => {
    let dataObjects = this.state.dataObjects
    dataObjects.splice(index, 1);
    this.setState({
      dataObjects: dataObjects
    })
  }

  dataContainer = (data, index) => {
    const { classes } = this.props
    console.log('DATA CONTAINER ', data)
    return <DataObjectContent
      data={data}
      csvConf={this.state.csvConf}
      remove={(idx) => this.removeDataObject(idx)}
      itemIndex={index}
      handleInputChange={(objIndex, index, key, val) => this.handleInputChange(objIndex, index, key, val)} />
  }

  processData = (data, type, name, size, lastModified) => {
    console.log("process Data ", size, name, lastModified)
    let old = this.state.dataObjects
    old.push(this.createSrcObject(data, type, name, size, lastModified))
    this.setState({
      dataObjects: old
    })
  }

  createSrcObject = (src, type, name, size, lastModified) => {
    return { src: src, type: type, size: size, name: name, lastModified: lastModified }
  }

}

export default withStyles(styles)(DnDFileComponent)

