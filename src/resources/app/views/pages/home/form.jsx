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
  ProgressCircular,
  PlainButton
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
  grid-template-columns: 1fr;
`
const ActionButton = styled.div`
  text-align: center;
  padding: 16px;
`

const Session = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`

const Thumbnail = styled.img.attrs( props => {
  src: props.src
})`
  margin-top: 2px;
  width: 40px;
  height: 40px;
  object-fit: contain;
`

const LabelItem = styled.span`
  font-size: 18px;
  font-weight: 500;
`

const TemplateUpload = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`
const ImageUpload = styled.div`
  padding-top: 24px;
  display: grid;
  grid-gap: 4px;
  grid-template-columns: 1fr 1fr 1fr 10fr;

  p {
    padding: 8px
  }

  button {
    margin: 2px
  }
`

const Upload = styled.div`
  display: grid;
  grid-template-columns: 128px 128px;
`
const ListUpload = styled.div``
const FileType = styled.div`
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
      imageFiles: [],
      templateFile: [],
      mimeType:'images',
      paddingTop: 0,
      paddingLeft: 0,
      paddingRight: 0,
      paddingBottom: 0,
      opacity: 100,
      imagePreviews: {},
      templatePreview: {}
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
      urlstream_upload: true,
      init: {
        FilesAdded: (uploader, files) => {
          files.forEach((file) => {
            const reader = new FileReader()
            reader.onload = () => {
              this.setState({
                templatePreview: reader.result
              })
            }
            reader.readAsDataURL(file.getNative())
          })
        },
        FilesRemoved: (uploader ,files) => {
          this.setState({ templatePreview:'' })
        },
        QueueChanged: (queue) => {
          this.setState({ templateFile: queue.files[0] })
        },
        UploadProgress: (uploader, file) => {
          const { templateFile } = this.state
          this.setState({ templateFile })
        },
        UploadComplete: (uploader, files) => {
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
        FilesAdded: (uploader, files) => {
          files.forEach((file) => {
            const reader = new FileReader()
            reader.onload = () => {
              this.setState({
                imagePreviews: {
                  ...this.state.imagePreviews,
                  [ file.id ]: reader.result
                }
              })
            }
            reader.readAsDataURL(file.getNative())
          })
        },
        QueueChanged: (queue) => {
          this.setState({ imageFiles: arrToMap(queue.files, 'id') })
        },
        FilesRemoved: (uploader ,files) => {
          const imagePreviews = files.reduce((state, file) => {
            const { [file.id]: removed, ...reducedState } = state
            return reducedState
          }, this.state.imagePreviews)
          this.setState({ imagePreviews })
        },
        UploadProgress: (uploader, file) => {
          const { files } = this.state
          this.setState({ files })
        },
        UploadComplete: (uploader, files) => {
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

  removeTemplate(file){
    const { plupTemplate } = this.state
    plupTemplate.removeFile(file)
  }

  removeImage(file){
    const { plupItems } = this.state
    plupItems.removeFile(file)
  }

  render() {
    const { templateFile, imageFiles, imagePreviews, templatePreview } = this.state

    const templateUpload = templatePreview.length ? <ImageUpload >
      <p>1</p>
      {
        templateFile.percent !== 0 ?
          <ProgressCircular
            percent={ templateFile.percent }
            />
            :
          <PrimaryButton
            onClick={ this.removeTemplate.bind(this, templateFile) }
            minWidth={ 20 }>
              X
          </PrimaryButton>
      }
      <Thumbnail src={ templatePreview }/>
      <p>
        { templateFile.name } { plupload.formatSize(templateFile.size) }
      </p>
    </ImageUpload>
    :
    <div></div>

    const filesUpload = Object.values(imageFiles).map((file, index) => {
      return (
        <ImageUpload key = { index } >
          <p>{ index }</p>
          {
            file.percent !== 0 ?
              <ProgressCircular
                percent={ file.percent }
                />
                :
                <PrimaryButton
                onClick={ this.removeImage.bind(this, file) }
                minWidth={ 40 }>
                  X
                </PrimaryButton>
          }
          {
            imagePreviews[ file.id ] && <Thumbnail src={ imagePreviews[ file.id ] }/>
          }
          <p>
            { file.name } { plupload.formatSize(file.size) }
          </p>
        </ImageUpload>
      )
    })

    return (
      <WrapperItem>
        <Session>
          <div>
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
          </div>
          <div>
          <Config>
            <LabelItem>Config position</LabelItem>
          </Config>
          <Break/>
          <Config>
            <TemplatePosition
              handleGravity={ this.handleGravity.bind(this) }
            />
          </Config>
          </div>
          <div>
            <LabelItem>Preview Config</LabelItem>
            <Break/>
            <PreviewConfig
              gravity={ this.state.gravity }
              paddingTop={ this.state.paddingTop }
              paddingLeft={ this.state.paddingLeft }
              paddingRight={ this.state.paddingRight }
              paddingBottom={ this.state.paddingBottom }
              opacity={ this.state.opacity / 100 }
              templatePreview={ templatePreview }
              imagePreviews={ imagePreviews }
            />
          </div>
        </Session>
        <Session>
          <div>
            <Upload>
              <LabelItem>Images</LabelItem>
              <PrimaryButton
                id="browseFiles"
                >
                Browse Files...
              </PrimaryButton>
              <FileType>
                <input
                  type='radio'
                  name='images'
                  value='images'
                  onChange={ this.changeMimeType }
                  checked={ this.state.mimeType === 'images' ? true : false }/>Multiple Files
              </FileType>
              <FileType>
                <input
                  type='radio'
                  name='zip'
                  value='zip'
                  onChange={ this.changeMimeType }
                  checked={ this.state.mimeType === 'zip' ? true : false }/>Zip
              </FileType>
            </Upload>
            <ListUpload>
              { filesUpload }
            </ListUpload>
            <Break/>
          </div>
          <div>
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
            <Break/>
            <LabelItem>Opacity</LabelItem>
            <input
              type="range"
              defaultValue={ 100 }
              onChange={ this.changeOpacity.bind(this) }
            />
            <LabelItem> { this.state.opacity }</LabelItem>
            <Break/>
          </div>
          <div>
          </div>
        </Session>
        <ActionButton>
          <PrimaryButton
            onClick={ this.uploadAllFiles.bind(this) }>
            Upload
          </PrimaryButton>
          &nbsp;
          &nbsp;
          {
            this.props.linkDownload && <PrimaryButton onClick={ this.downloadFile.bind(this) }>
                Download
              </PrimaryButton>
          }
        </ActionButton>
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
