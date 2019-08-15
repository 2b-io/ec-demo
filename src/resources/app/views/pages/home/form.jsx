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
  grid-gap: 8px;
  grid-template-columns: 1fr 1fr 1fr;
`

const Slider = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-template-columns: 5fr 1fr;
`
const DropDown = styled.select`
  width: 60px;
  height: 24px;
`
const Input = styled.input.attrs( props => {
  type: props.type;
  max: props.max;
  min: props.min;
})`
  width: 60px;
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

const Grid = styled.div`
  display: grid;
  ${
    ({ columns, gap = 8 }) => css`
      grid-gap: ${ gap }px;
      grid-template-columns: repeat(${ columns }, 1fr);
    `
  }
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

const Collection = styled.div`
  padding-top: 8px;
  display: grid;
  grid-gap: 8px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  max-height: 400px;
  overflow-y: scroll;
`

const ThumbnailPreview = styled.img.attrs( props => {
  src: props.src
})`
  width: 100px;
  object-fit: cover;
`

const Upload = styled.div`
  display: grid;
  grid-template-columns: 128px 128px;
`
const ListUpload = styled.div`
  max-height: 312px;
  overflow-y: scroll;
`
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
      templatePreview: {},
      templateWidth: 0,
      templateHeight: 0,
      ratioTemplate: 10,
      imagesPreview: '',
      typeResizeTemplate:'percent'
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
            reader.onload = (e) => {
              const img = new Image()
              img.src = e.target.result
              img.onload = (event) => {
                this.setState({
                  templatePreview: reader.result,
                  templateHeight: event.path[ 0 ].height,
                  templateWidth: event.path[ 0 ].width
                })
              }
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
            reader.onload = (e) => {
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

  changeRatioTemplate(e){
    this.setState({ ratioTemplate: e.target.value })
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

  changeImagePreview(image){
    const img = new Image()
    img.src = image
    img.onload = (event) => {
      this.setState({
        previewImage: image,
      })
    }
  }

  changeTypeResize(e){
    this.setState({
      typeResizeTemplate: e.target.value
    })
  }
  render() {
    const {
      templateFile,
      imageFiles,
      imagePreviews,
      templatePreview,
      templateWidth,
      templateHeight,
      previewImage,
      typeResizeTemplate
    } = this.state
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

    const thumbnails = Object.values(imagePreviews).map((image, index) => {
      return (
        <ThumbnailPreview
          src={ image }
          key={ index }
          onClick={ this.changeImagePreview.bind(this, image)}
        />
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
              padding={{
                top: this.state.paddingTop,
                left: this.state.paddingLeft,
                right: this.state.paddingRight,
                bottom: this.state.paddingBottom
              }}
              opacity={ this.state.opacity / 100 }
              templatePreview={ templatePreview }
              previewImage={ this.state.previewImage }
              defaultPreviewImage = { previewImage || Object.values(imagePreviews)[0] }
              templateHeight = { templateHeight }
              templateWidth = { templateWidth }
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
            <LabelItem>Resize Template</LabelItem>
            <Break/>
            <DropDown name='TypeResize' size='1' onChange={ this.changeTypeResize.bind(this) }>
              <option value='percent'>Ratio</option>
              <option value='pixel'>Pixel</option>
            </DropDown>
            <Break/>
              { typeResizeTemplate === 'percent' ? <div>
                <LabelItem>Ratio Template By Percent</LabelItem>
                <Slider>
                  <input
                    type='range'
                    defaultValue={ 10 }
                    onChange={ this.changeRatioTemplate.bind(this) }
                  />
                  <Input
                    type='number'
                    max='100'
                    min='0'
                    value={ this.state.ratioTemplate }
                    onChange={ this.changeRatioTemplate.bind(this) }
                  />
                </Slider>
                </div>
                :
                <div>
                  <LabelItem>Ratio Template By Pixel</LabelItem>
                  <Break/>
                  <Grid columns={ 4 }>
                    <div>
                      <label>Width </label>
                      <Input
                        type='number'
                        defaultValue={ 0 }
                        onChange={ this.changeRatioTemplate.bind(this) }
                      />
                      <label> px</label>
                    </div>
                    <div>
                      <label>Height </label>
                      <Input
                        type='number'
                        defaultValue={ 0 }
                        onChange={ this.changeRatioTemplate.bind(this) }
                      />
                      <label> px</label>
                    </div>
                  </Grid>
                </div>
              }
            <Break/>
            <LabelItem>Opacity</LabelItem>
            <Slider>
              <input
                type='range'
                defaultValue={ 100 }
                onChange={ this.changeOpacity.bind(this) }
              />
              <Input
                type='number'
                max='100'
                min='0'
                value={ this.state.opacity }
                onChange={ this.changeOpacity.bind(this) }
              />
            </Slider>
            <Break/>
          </div>
          <div>
          <Collection>
            { thumbnails }
          </Collection>
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
