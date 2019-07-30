import React from 'react'
import { connect } from 'react-redux'
import plupload from 'plupload'
import styled, { css } from 'styled-components'
import uuid from 'uuid'

import { mapDispatch } from 'app/services/redux-helpers'
import { actions, selectors } from 'app/state/interface'

// import upload from 'app/services/upload'

import {
  Container,
  Break,
  PrimaryButton,
  ProgressBar
} from 'app/ui/elements'

import arrToMap from 'services/array-to-map'
import TemplateConfig from './template-config'

const ID = uuid.v4()

const WrapperItem = styled.div`
  display: block
  margin: auto
  text-align: center
  padding: 16px
`
const ItemUpload = styled.div`
  display: grid
  grid-gap: 4px;
  grid-template-columns: 1fr 1fr;
`

const MIME_FILE = {
  zip: { title: 'Zip files', extensions: 'zip' },
  images: { title : 'Image files', extensions : 'jpg,gif,png' }
}

class UploadForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      files: [],
      templateFile: [],
      mimeType:'zip'
    }

    this.changeMimeType = this.changeMimeType.bind(this)
  }

  uploadAllFiles() {
    this.props.uploadFiles(this.state.plupTemplate, this.state.plupItems, this.state.gravity)
  }

  uploadTemplate() {
    const plupTemplate = new plupload.Uploader({
      browse_button: 'browseTemplate',
      max_retries: 3,
      chunk_size: '200kb',
      init: {
        FilesAdded: (up, files) => {
          this.setState({ templateFile: arrToMap(files, 'id') })
        },
        UploadProgress: (up, file) => {
          const { templateFile } = this.state
          this.setState({ templateFile })
        },
        UploadComplete: (up, files) => {
          if (files.length) {
            this.props.uploadFilesCompleted('UPLOAD_TEMPLATE_COMPLETED')
          }
        }
      },
      filters : {
        mime_types: [
          { title : 'Image files', extensions : 'png' },
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
      max_retries: 3,
      chunk_size: '200kb',
      init: {
        FilesAdded: (up, files) => {
          this.setState({ files: arrToMap(files, 'id') })
        },
        UploadProgress: (up, file) => {
          const { files } = this.state
          this.setState({ files })
        },
        UploadComplete: (up, files) => {
          if (files.length) {
            this.props.uploadFilesCompleted('UPLOAD_ITEMS_COMPLETED')
          }
        },
      },
      filters: {
        mime_types: [
          mimeTypes
        ]
      }
    })

    plupItems.init(MIME_FILE[ 'zip' ])

    this.setState({
      plupItems
    })
  }

  resetPlupload(mimeType) {
    this.state.plupItems.destroy()
    this.uploadItems(MIME_FILE[ mimeType ])
  }

  componentDidMount() {
    this.uploadTemplate()
    this.uploadItems(MIME_FILE[ 'zip' ])
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

  handleGravity(gravity) {
    this.setState({
      gravity
    })
  }
  downloadFile(){
    window.location.href = this.props.linkDownload
  }
  render() {
    const { templateFile, files } = this.state

    const templateUpload = Object.values(templateFile).map((file, index) => {
      return (
        <ItemUpload key = { index } >
          <p>
            { file.name } { plupload.formatSize(file.size) }
          </p>
          <ProgressBar percent={ file.percent }/>
        </ItemUpload>
      )
    })

    const filesUpload = Object.values(files).map((file, index) => {
      return (
        <ItemUpload key = { index } >
          <div>
            <p>
              { file.name } { plupload.formatSize(file.size) }
            </p>
          </div>
          <ProgressBar percent={ file.percent }/>
        </ItemUpload>
      )
    })

    return (
      <Container>
        <WrapperItem>
          <div>
            <label>Upload Template</label>
            <Break/>
              <PrimaryButton
                id="browseTemplate"
                free={ true }
              >
                Browse Template...
              </PrimaryButton>
          </div>
          <div>
            { templateUpload }
          </div>
          <Break/>
          <Break/>
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
            <Break/>
            <PrimaryButton id="browseFiles">Browse Files...</PrimaryButton>
          </div>
          <div>
            { filesUpload }
          </div>
          <Break/>
          <p>Config position </p>
          <TemplateConfig handleGravity={ this.handleGravity.bind(this) }/>
          <Break/>
          <PrimaryButton onClick={ this.uploadAllFiles.bind(this) }>Upload</PrimaryButton>
          <Break/>
          {
            this.props.linkDownload && <PrimaryButton onClick={ this.downloadFile.bind(this) }>
                Download
              </PrimaryButton>
          }
          <Break/>
        </WrapperItem>
      </Container>
    )
  }
}

export default connect(
  (state) => {
    const { linkDownload } = selectors.uploadIdentifier(state)

    return {
      linkDownload
    }
  },
  mapDispatch({
    uploadFiles: actions.uploadFiles,
    uploadFilesCompleted: actions.uploadFilesCompleted
  })
)(UploadForm)
