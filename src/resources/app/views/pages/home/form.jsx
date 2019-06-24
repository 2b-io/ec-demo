import React from 'react'
import plupload from 'plupload'

class UploadForm extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      files: [],
      template: [],
      mimeType: 'zip',
      mimeTypesFilter: {
        title : 'Zip files',
        extensions : 'zip'
      }
    }

    this.changeMimeType = this.changeMimeType.bind(this)
  }

  uploadTemplate() {
    return new plupload.Uploader({
      browse_button: 'browseTemplate',
      url: 'http://localhost:3009',
      init: {
        FilesAdded: (up, files) => {
          this.setState({ template: files })
        }
      },
      filters : {
        mime_types: [
          { title : 'Image files', extensions : 'jpg,gif,png' },
        ]
      },
      multi_selection: false
    })
  }

  uploadItems() {
    return new plupload.Uploader({
      browse_button: 'browseFiles',
      url: 'http://localhost:3009',
      init: {
        FilesAdded: (up, files) => {
          this.setState({ files })
        }
      },
      filters : {
        mime_types: [
          {
            title : 'Zip files',
            extensions : 'zip'
          }
        ]
      }
    })
  }

  componentDidMount() {
    this.uploadTemplate().init()
    this.uploadItems().init()
  }

  changeMimeType(event) {
    const mimeType = event.target.value
    if (mimeType === 'zip') {
      this.setState({ mimeType })
    } else {
      this.setState({ mimeType })
    }
  }

  render() {
    const templateUpload = this.state.template.map((file, index) => {
      return (
        <div key = { index } >
          <p>
            { file.name }
          </p>
        </div>
      )
    })
    const filesUpload = this.state.files.map((file, index) => {
      return (
        <div key = { index } >
          <p>
            { file.name }
          </p>
        </div>
      )
    })
    return (
      <div id="container">
        <div>
          <label> Upload Template</label>
          <br/>
          <button id="browseTemplate">Browse Template...</button>
        </div>
        <div>
          { templateUpload }
        </div>
        <br/>
        <div>
          <label> Upload Images</label>
          <input
            type='radio'
            name='zip'
            value='zip'
            onChange={ this.changeMimeType }
            checked={ this.state.mimeType === 'zip' ? true : false  }/>Zip
          <input
            type='radio'
            name='images'
            value='images'
            onChange={ this.changeMimeType }
            checked={ this.state.mimeType === 'images' ? true : false  }/>Images
          <br/>
          <button id="browseFiles">Browse Files...</button>
        </div>
        <div>
          { filesUpload }
        </div>
      </div>
    )
  }
}

export default UploadForm
