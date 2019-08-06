import React from 'react'
import { connect } from 'react-redux'
import plupload from 'plupload'
import styled, { css } from 'styled-components'

import { mapDispatch } from 'app/services/redux-helpers'
import { actions, selectors } from 'app/state/interface'

import {
  Container,
  Break,
  PrimaryButton,
  ProgressBar,
} from 'app/ui/elements'

import arrToMap from 'services/array-to-map'
import TemplatePosition from './template-position'
import TemplatePadding from './template-padding'
import PreviewConfig from './preview-config'

const WrapperItem = styled.div`
  display: block;
  padding-top: 32px;
`
const Config = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`
const ActionButton = styled.div``

const LabelItem = styled.span`
  padding-right: 64px;
  font-size: 18px;
  font-weight: 500;
`

const TemplateUpload = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
`
const ImageUpload = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
`

const Upload = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`
const ListUpload = styled.ol`
  padding-left: 32px;
`
const FileType = styled.div`
  text-align: right;
  padding-top: 24px;
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
      mimeType:'images',
      paddingTop: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingBottom: 0,
      opacity: 100
    }

    this.changeMimeType = this.changeMimeType.bind(this)
  }

  uploadAllFiles() {
    const {
      plupTemplate,
      plupItems,
      gravity,
      paddingTop,
      paddingLeft,
      paddingRight,
      paddingBottom,
      opacity
    } = this.state

    const padding = {
      paddingTop,
      paddingLeft,
      paddingRight,
      paddingBottom
    }

    this.props.uploadFiles(plupTemplate, plupItems, gravity, padding, opacity)
  }


  handlePadding(padding) {
    this.setState({ ...padding })
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

    plupItems.init(MIME_FILE[ 'images' ])

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
    this.uploadItems(MIME_FILE[ 'images' ])
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
      gravity,
      paddingTop: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingBottom: 0,
    })
  }
  changeOpacity(e){
    this.setState({ opacity: e.target.value })
  }
  downloadFile(){
    window.location.href = this.props.linkDownload
  }
  render() {
    const { templateFile, files } = this.state
    const templateUpload = Object.values(templateFile).map((file, index) => {
      return (
        <li key = { index } >
          <p>
            { file.name } { plupload.formatSize(file.size) }
          </p>
          {
            file.percent !== 0 && <ProgressBar percent={ file.percent }/>
          }
        </li>
      )
    })

    const filesUpload = Object.values(files).map((file, index) => {
      return (
        <li key = { index } >
          <div>
            <p>
              { file.name } { plupload.formatSize(file.size) }
            </p>
          </div>
          {
            file.percent !== 0 && <ProgressBar percent={ file.percent }/>
          }
        </li>
      )
    })

    return (
      <WrapperItem>
        <TemplateUpload>
          <Upload>
            <LabelItem>Template</LabelItem>
            <PrimaryButton
              id="browseTemplate"
              free={ true }
            >
              Browse file...
            </PrimaryButton>
          </Upload>
          <ListUpload>
            { templateUpload }
          </ListUpload>
        </TemplateUpload>
        <Break/>
        <Break/>
        <ImageUpload>
          <div>
            <Upload>
              <LabelItem>Images</LabelItem>
              <PrimaryButton
                id="browseFiles"
                >
                Browse Files...
              </PrimaryButton>
            </Upload>
            <FileType>
              <input
                type='radio'
                name='images'
                value='images'
                onChange={ this.changeMimeType }
                checked={ this.state.mimeType === 'images' ? true : false  }/>Multiple Files
              <input
                type='radio'
                name='zip'
                value='zip'
                onChange={ this.changeMimeType }
                checked={ this.state.mimeType === 'zip' ? true : false  }/>Zip
            </FileType>
          </div>
          <ListUpload>
            { filesUpload }
          </ListUpload>
        </ImageUpload>
        <Break/>
        <Config>
          <LabelItem>Config position</LabelItem>
          <LabelItem>Preview Config</LabelItem>
        </Config>
        <Break/>
        <Config>
          <TemplatePosition
            handleGravity={ this.handleGravity.bind(this) }
          />
          <PreviewConfig
            gravity={ this.state.gravity }
            paddingTop={ this.state.paddingTop }
            paddingLeft={ this.state.paddingLeft }
            paddingRight={ this.state.paddingRight }
            paddingBottom={ this.state.paddingBottom }
            opacity={ this.state.opacity / 100 }
          />
        </Config>
        <Break/>
        <LabelItem>Config padding</LabelItem>
        <Break/>
          <TemplatePadding
            handlePadding={ this.handlePadding.bind(this) }
            gravity={ this.state.gravity }
            paddingTop={ this.state.paddingTop }
            paddingLeft={ this.state.paddingLeft }
            paddingRight={ this.state.paddingRight }
            paddingBottom={ this.state.paddingBottom }
          />
          <Break/>
          <LabelItem>Opacity</LabelItem>
          <input
            type="range"
            defaultValue={ 100 }
            onChange={ this.changeOpacity.bind(this) }
          />
          <LabelItem> { this.state.opacity }</LabelItem>
        <Break/>
        <ActionButton>
          <PrimaryButton onClick={ this.uploadAllFiles.bind(this) }>Upload</PrimaryButton>
          &nbsp;
          &nbsp;
          {
            this.props.linkDownload && <PrimaryButton onClick={ this.downloadFile.bind(this) }>
                Download
              </PrimaryButton>
          }
        </ActionButton>
        <Break/>
      </WrapperItem>
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
