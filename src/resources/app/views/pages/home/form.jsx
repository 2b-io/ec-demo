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

import arryToMap from 'services/array-to-map'
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
    this.props.getUploadIdentifier(this.state.plupTemplate, this.state.plupItems, this.state.gravity)
  }

  uploadTemplate() {
    const plupTemplate = new plupload.Uploader({
      browse_button: 'browseTemplate',
      url: `http://localhost:3009/upload/${this.props.requestId}/image`,
      chunk_size: '500kb',
      max_retries: 3,
      init: {
        FilesAdded: (up, files) => {
          this.setState({ templateFile: arryToMap(files, 'id') })
        },
        UploadProgress: (up, file) => {
          const { templateFile } = this.state
          templateFile[ file.id ].percent = file.percent
          this.setState({ templateFile })
        },
        UploadComplete: (up, files) => {
          console.log('files', files)
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
      url: `http://localhost:3009/upload/${this.props.requestId}/image`,
      chunk_size: '500kb',
      max_retries: 3,
      init: {
        FilesAdded: (up, files) => {
          this.setState({ files: arryToMap(files, 'id') })
        },
        UploadProgress: (up, file) => {
          const { files } = this.state
          files[ file.id ].percent = file.percent
          this.setState({ files })
        },
        UploadComplete: (up, files) => {
          console.log('files', files)
        }
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
        </WrapperItem>
      </Container>
    )
  }
}

export default connect(
  (state) => {
    const requestId = selectors.uploadIdentifier(state)

    return {
      requestId
    }
  },
  mapDispatch({
    getUploadIdentifier: actions.getUploadIdentifier
  })
)(UploadForm)
