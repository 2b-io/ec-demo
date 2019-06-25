import React from 'react'
import plupload from 'plupload'

const FILE_MIME = {
  zip: { title: 'Zip files', extensions: 'zip' },
  images: { title : 'Image files', extensions : 'jpg,gif,png' }
}

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
        },
        UploadProgress: (up, file) => {

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

  uploadItems(mimeTypes) {
    const plup = new plupload.Uploader({
      browse_button: 'browseFiles',
      url: 'http://localhost:3009',
      init: {
        FilesAdded: (up, files) => {
          this.setState({ files })
        }
      },
      filters: {
        mime_types: [
          mimeTypes
        ]
      }
    })

    plup.init()

    this.setState({
      plup
    })
  }

  resetPlupload(mimeType) {
    this.state.plup.destroy()
    this.uploadItems(FILE_MIME[ mimeType ])
  }

  componentDidMount() {
    this.uploadTemplate().init()
    this.uploadItems(FILE_MIME[ 'zip' ])
  }

  changeMimeType(event) {
    const mimeType = event.target.value

    if (mimeType === 'zip') {
      this.resetPlupload(mimeType)

      this.setState({
        mimeType
      })
    } else {
      this.resetPlupload(mimeType)

      this.setState({
        mimeType
      })
    }
  }

  render() {
    const templateUpload = this.state.template.map((file, index) => {
      return (
        <div key = { index } >
          <p>
            { file.name } { plupload.formatSize(file.size) }
          </p>
        </div>
      )
    })
    const filesUpload = this.state.files.map((file, index) => {
      return (
        <div key = { index } >
          <p>
            { file.name } { plupload.formatSize(file.size) }
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
            checked={ this.state.mimeType === 'images' ? true : false  }/>Multiple Files
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
