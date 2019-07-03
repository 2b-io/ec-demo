import React from 'react'
import plupload from 'plupload'
import styled, { css } from 'styled-components'
import uuid from 'uuid'

import {
  Container,
  Break,
  PrimaryButton
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
    this.state.plupTemplate.start()
    this.state.plupItems.start()
  }

  uploadTemplate() {
    const plupTemplate = new plupload.Uploader({
      browse_button: 'browseTemplate',
      url: 'http://localhost:3009/image',
      headers: {
        filetype: 'watermark',
        id: ID
      },
      init: {
        FilesAdded: (up, files) => {
          this.setState({ templateFile: arryToMap(files, 'id') })
        },
        UploadProgress: (up, file) => {
          const { templateFile } = this.state
          templateFile[ file.id ].percent = file.percent
          this.setState({ templateFile })
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
      url: 'http://localhost:3009/image',
      headers: {
        filetype: 'item',
        id: ID
      },
      init: {
        FilesAdded: (up, files) => {
          this.setState({ files: arryToMap(files, 'id') })
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

  render() {
    const { templateFile, files } = this.state

    const templateUpload = Object.values(templateFile).map((file, index) => {
      return (
        <div key = { index } >
          <p>
            { file.name } { plupload.formatSize(file.size) } => uploaded { file.percent }%
          </p>
        </div>
      )
    })

    const filesUpload =  Object.values(files).map((file, index) => {
      return (
        <div key = { index } >
          <p>
            { file.name } { plupload.formatSize(file.size) } => uploaded { file.percent }%
          </p>
        </div>
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
          <TemplateConfig />
          <Break/>
          <PrimaryButton onClick={ this.uploadAllFiles.bind(this) } >Upload</PrimaryButton>
          <Break/>
        </WrapperItem>
      </Container>
    )
  }
}

export default UploadForm
