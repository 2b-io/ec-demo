import React from 'react'
import plupload from 'plupload'

import arryToMap from 'services/array-to-map'

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
      mimeType:'zip'
    }

    this.changeMimeType = this.changeMimeType.bind(this)
  }

  uploadTemplate() {
    const plupTemplate = new plupload.Uploader({
      browse_button: 'browseTemplate',
      url: 'http://localhost:3009',
      init: {
        FilesAdded: (up, files) => {
          this.setState({ template: files })
          this.state.plupTemplate.start()
        }
      },
      filters : {
        mime_types: [
          { title : 'Image files', extensions : 'jpg,gif,png' },
        ]
      },
      multi_selection: false
    })

    plupTemplate.init()

    this.setState({
      plupTemplate
    })
  }

  uploadItems(mimeTypes) {
    const plupItems = new plupload.Uploader({
      browse_button: 'browseFiles',
      url: 'http://localhost:3009',
      init: {
        FilesAdded: (up, files) => {
          this.setState({ files: arryToMap(files, 'id') })
          this.state.plupItems.start()
        },
        UploadProgress: (up, file) => {
          const { files } = this.state
          files[ file.id ].percent = file.percent
          this.setState({ files })
        }
      },
      filters: {
        mime_types: [
          mimeTypes
        ]
      }
    })

    plupItems.init(FILE_MIME[ 'zip' ])

    this.setState({
      plupItems
    })
  }

  resetPlupload(mimeType) {
    this.state.plupItems.destroy()
    this.uploadItems(FILE_MIME[ mimeType ])
  }

  componentDidMount() {
    this.uploadTemplate()
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
            { file.name } { plupload.formatSize(file.size) } => uploaded { file.percent }%
          </p>
        </div>
      )
    })

    const filesUpload =  Object.values(this.state.files).map((file, index) => {
      return (
        <div key = { index } >
          <p>
            { file.name } { plupload.formatSize(file.size) } => uploaded { file.percent }%
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
