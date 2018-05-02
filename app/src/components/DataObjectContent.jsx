import React, { Component } from "react"
import ReactDOM from 'react-dom'
import PropTypes from "prop-types"
import { withStyles } from 'material-ui/styles';
import DnDFileReader from "./DnDFileReader"
import TextField from "./TextField"
// import VirtualList from 'react-virtual-list';
import VirtualList from 'react-tiny-virtual-list';
import { Button, IconButton } from 'material-ui';
import Avatar from 'material-ui/Avatar';
import Card, { CardHeader, CardMedia, CardContent, CardActions } from 'material-ui/Card';
import VideoPlayer from './VideoPlayer';
import DeleteIcon from 'material-ui-icons/Delete';
import Typography from 'material-ui/Typography';
import moment from 'moment'


/**
 * 
 * NOTES: It would seem we are go over mapping or rows too many times as 
 * importTextField is recieveing all the rows hence the [0] in the below code
 */
const importTextField = colName => ({ row, onChange }) => {
  return (
    <TextField value={row[colName]} placeholder={colName} onChange={v => onChange(v, colName)} />
  )
}

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

const styles = theme => ({
  cardContainer: {
    display: "flex",
    flexWrap: "wrap"
  },
  card: {
    maxWidth: "50%",
    minWidth: 300,
    minHeight: 80,
  },
  cardContent: {
    maxHeight: 280,
    overflow: "hidden",
    overflowX: "auto",
    padding: "0 0 17px 0"
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  virtualRow: {
    display: "flex",
    width: "100%",
  },
  // ScrollableTable = {
  //   display: "flex",
  //   flexDirection: "column",
  //   width: "100%",
  //   overflowX: "scroll",
  // },
  TableRow: {
    display: "flex",
    flexBasis: 0,
    flexGrow: 1,
  }
});

// const ScrollableTable = {
//   display: "flex",
//   flexDirection: "column",
//   width: "100%",
//   overflowX: "scroll",
// }
const TableRow = {
  display: "flex",
  flexBasis: 0,
  flexGrow: 1,
}

class DataObjectContent extends Component {
  constructor(props) {
    super(props);
    const mappings = this.buildConfMap(this.props.csvConf)
    this.state = {
      mappings: mappings
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   // if (this.props.updateTimestamp !== nextProps.updateTimestamp) {
  //   //   return true
  //   // }
  //   if (this.props.data !== nextProps.data) {
  //     return true
  //   }
  //   return false
  // }

  buildConfMap = (conf) => {
    let mappedObject = {}
    const mapped = Object.entries(conf).map(([key, value], index) => {
      let editorType
      if (value.type === "text") {
        mappedObject[key] = importTextField(value.colName)
      }
    })
    return mappedObject
  }

  bytesToSize = (bytes) => {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  }

  render = () => {
    const { data, classes, itemIndex } = this.props
    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="Recipe" className={classes.avatar}>
              {data.type}
            </Avatar>
          }
          action={
            <IconButton
              onClick={() => this.props.remove(itemIndex)}
              className={classes.removeRowButton} aria-label="Delete" color="primary">
              <DeleteIcon />
            </IconButton>
          }
          title={<TextField value={data.name} placeholder={"test"} onChange={() => console.log("tries")} />}
          subheader={`${this.bytesToSize(data.size)} | ${new moment(data.lastModified).format('DD/MM/YYYY')}`}
        />
        <CardContent >
          <div className={classes.cardContent} id="virtualContainer" ref="virtualContainer">
            {this.generateDataComponent(data, itemIndex)}
          </div>
        </CardContent>
      </Card>
    )
  }

  generateDataComponent = ({ src, type, name }, itemIndex) => {
    switch (type) {
      case "img":
        return this.renderImage(src, name)
        break
      case "csv":
        return this.renderCsvVirtualList(src, itemIndex)
        break
      case "video":
        return this.renderVideo(src, name)
        break
      default:
        return "beware your src file cannot be displayed"
    }
  }

  renderVideo = (src, name) => {
    return <VideoPlayer src={src} />
  }

  renderImage = (src, name) => {
    return <CardMedia
      className={this.props.classes.media}
      image={src}
      title={name}
    />
  }

  renderCsvVirtualList = (src, objIndex) => {
    const virtualWidth = ((Object.keys(this.state.mappings).length) * 180)
    let updateTimestamp = this.props
    return <VirtualList
      width={virtualWidth}
      height={280}
      //updateTimestamp={updateTimestamp}
      itemCount={src.length}
      itemSize={32} // Also supports variable heights (array or function getter)
      renderItem={({ index, style }) =>
        <div key={index} className={this.props.classes.virtualRow} style={style}>
          {this.renderEditableRow(src[index], objIndex, index)}
        </div>
      }
    />
  }

  renderEditableRow = (row, objIndex, index) => {
    const { csvConf } = this.props
    return <div key={index} className={this.props.classes.TableRow}>
      {Object.entries(this.state.mappings).map(([cnfKey, R]) => {
        return (
          <R
            row={row}
            onChange={(v, colName) => {
              this.handleInputChange(objIndex, index, colName, v)
            }}
          />
        )
      })}
    </div>
  }

  handleInputChange = (objIndex, index, key, val) => {
    this.props.handleInputChange(objIndex, index, key, val)
  }

}

export default withStyles(styles)(DataObjectContent)
