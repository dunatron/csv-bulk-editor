import XLSX from "xlsx"
import React, { Component } from "react"
import PropTypes from "prop-types"
import Papa from "papaparse"
import AlertMessage from "./AlertMessage"
const uuidv5 = require("uuid/v5")

const processCSV = csv => {
  // setting header as conf in papa parse sets key and removes first row from results
  var results = Papa.parse(csv, {
    header: true,
  })
  console.log("Papas Results as CONST", results)
  // remove last result from array as it is an empty string
  results.data.splice(-1, 1)
  return results.data
}

class DnDFileReader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stage: 0,
      dragStatus: "",
      uploading: false,
      uploadPercent: 0,
      fileSrc: null,
      type: null,
      error: null,
      alertText: "",
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.stage !== nextState.stage) {
      return true
    }
    if (this.state.error !== nextState.error) {
      return true
    }
    return false
  }

  render = () => {
    let { error, alertText } = this.state
    console.log("workbookSrc ", this.state.fileSrc)
    let components = []
    let barStyle = {
      width: this.state.uploadPercent + "%",
    }

    if (error) {
      return (
        <AlertMessage
          open={true}
          alertText={alertText}
          dismissAlert={() => this.resetUploader()}
        />
      )
    }

    switch (this.state.stage) {
      case 0:
        this.renderUploadForm(components, barStyle)
        break
      case 1:
        this.renderWait(components, barStyle)
        break
      default:
        this.renderUploadForm(components, barStyle)
    }

    return (
      <div>
        <div className={"dropZoneFileWrap"}>{components}</div>
      </div>
    )
  }

  resetUploader = () => {
    console.log("RESET UPLOADER")
    this.setState({
      stage: 0,
      dragStatus: "",
      uploading: false,
      uploadPercent: 0,
      DisplayFile: null,
      type: null,
      size: null,
      name: null,
      lastModified: null,
      CSVColumns: null,
      error: null,
      alertText: "",
    })
  }

  renderUploadForm = (components, barStyle) => {
    components.push(
      <div>
        <div
          key={"uploadForm"}
          onClick={this.onZoneClick}
          className={"dropZone " + this.state.dragStatus}
          onDrop={this.onDrop}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          onDragOver={this.onDragOver}>
          <span className={"dropTitle"}>{"Drag and drop file"}</span>
          <span className={"dropSubTitle"}>{"or click to upload"}</span>
          <input
            key={"uploadInput"}
            ref={"uploadInput"}
            className={"uploadButton"}
            type={"file"}
            onChange={this.onFileChange}
          />
          <div key={"progressContainer"} className={"progress"}>
            <div style={barStyle} className={"progressBar"} />
          </div>
        </div>
      </div>
    )
  }

  renderWait = (components, barStyle) => {
    components.push(
      <div key={"dropKey"} className={"dropZone " + this.state.dragStatus}>
        <span className={"dropMessage"}>{"Please wait..."}</span>
        <div key={"progressContainer"} className={"progress"}>
          <div style={barStyle} className={"progressBar"} />
        </div>
      </div>
    )
  }

  pushDataUp = gLCodesArray => {
    this.props.recieveData(gLCodesArray, this.state.importOption)
  }

  processFile = file => {
    console.log("processFile ", file)
    let { size, name, lastModified, type } = file
    let fileType = this.getFileType(type)
    let check = this.checkValidFile(fileType, type)
    if (check === false) {
      return // Stop running things
    }

    this.setState({
      type: fileType,
      size: size,
      name: name,
      lastModified: lastModified
    })
    switch (fileType) {
      case "img":
        this.processImage(file)
        break
      case "text":
        this.processText(file)
        break
      case "xlxs":
        this.processXlxsWorkbook(file)
        break
      case "csv":
        this.processCsv(file)
        break
      case "video":
        this.processVideo(file)
        break
      default:
        this.unKownError(
          "Unkown Error ",
          "trying to process an unkown file please contact 'https://github.com/dunatron'"
        )
    }
  }

  processXlxsWorkbook = async file => {
    let rABS = true // true: readAsBinaryString ; false: readAsArrayBuffer
    let workbook, rawData
    let reader = new FileReader()
    reader.readAsBinaryString(file)
    reader.onload = () => {
      let data = reader.result
      let workbook = XLSX.read(data, { type: rABS ? "binary" : "array" })

      /* Do something with the workbook here */
      let first_worksheet = workbook.Sheets[workbook.SheetNames[0]]
      console.log("first Worksheet", first_worksheet)
      let csvData = XLSX.utils.sheet_to_csv(first_worksheet, { header: 1 })
      rawData = csvData
    }

    reader.onloadend = () => {
      this.readPapasCsv(rawData)
    }
  }

  processFileData = (data) => {
    const { type, size, name, lastModified } = this.state
    this.props.processData(data, type, name, size, lastModified)
  }

  processCsv = file => {
    let reader = new FileReader()
    let rawData
    reader.readAsText(file)
    reader.onload = e => {
      let data = reader.result
      rawData = data
    }
    reader.onloadend = () => {
      this.readPapasCsv(rawData)
    }
  }

  readPapasCsv = async data => {
    this.setState({
      type: "csv",
    })
    // try {
    let papasData = await processCSV(data)
    this.processFileData(papasData)
    // } catch (e) {
    //this.unKownError("CSV Error", e)
    // }
  }

  processText = file => { }

  processImage = async file => {
    let reader = new FileReader()
    let imgSrc
    await this.setState({
      type: "img",
    })
    reader.readAsDataURL(file)
    reader.onload = () => {
      imgSrc = reader.result
    }
    reader.onloadend = () => {
      this.processFileData(imgSrc)
    }
  }

  processVideo = async (file) => {
    var URL = window.URL || window.webkitURL
    await this.setState({
      type: "video",
    })
    // https://stackoverflow.com/questions/46880339/cant-save-uploaded-videos-blob-url-at-the-backend-server-using-ajax-call
    // Will probably need to send DataURL version and file itself to store in state/redux
    // Then at Upload time, we can async The files up one at a time.
    // send entire file to server and do a file_put contents type charade.
    // How will graphQL handle this?
    var fileURL = URL.createObjectURL(file)
    this.processFileData(fileURL)
  }

  unKownError = (header, message) => {
    this.setState({
      error: true,
      alertText: header + "\n" + message,
    })
  }

  checkValidFile = (type, extension) => {
    if (type === "invalidType") {
      // reset everything and throw an error
      this.setState({
        error: true,
        alertText: "Invalid File Type \n" + extension,
      })
      return false
    }
    return true
  }

  getFileType = type => {
    // Type expressions
    let imageExpression = /image.*/
    let textExpression = /text.*/
    let csvExpression = /\.csv$/
    let msCSVExpression = /application\/vnd\.ms-excel$/i
    let xlxsExpression =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    let videoExpression = /video.*/

    if (type.match(imageExpression)) {
      return "img"
    } else if (type.match(textExpression)) {
      return "text"
    } else if (type.match(csvExpression)) {
      return "csv"
    } else if (type.match(videoExpression)) {
      return "video"
    } else if (type.match(xlxsExpression)) {
      return "xlxs"
    } else {
      return "invalidType"
    }
  }

  onFileChange = e => {
    e.stopPropagation()
    let file = this.extractSingleFile(this.refs.uploadInput.files)
    this.refs.uploadInput.click()

    this.processFile(file)
  }

  extractSingleFile = files => {
    return files[0]
  }

  onDrop = e => {
    e.stopPropagation()
    e.preventDefault()
    let file = this.extractSingleFile(e.dataTransfer.files)

    this.processFile(file)
  }

  onDragEnter = e => {
    e.stopPropagation()
    e.preventDefault()
    this.setState({
      dragStatus: "dropHover",
    })
  }

  onDragLeave = e => {
    e.stopPropagation()
    e.preventDefault()
    this.setState({
      dragStatus: "",
    })
  }

  onDragOver = e => {
    e.stopPropagation()
    e.preventDefault()
    this.setState({
      dragStatus: "dropHover",
    })
  }

  onZoneClick = e => {
    e.stopPropagation()
    // e.preventDefault()
    // this.refs.uploadInput.click()
  }
}

DnDFileReader.propTypes = {
  FileType: PropTypes.string,
}

export default DnDFileReader
