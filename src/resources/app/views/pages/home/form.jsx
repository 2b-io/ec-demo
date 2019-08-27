import React from 'react'
import { connect } from 'react-redux'
import plupload from 'plupload'

import styled, { css } from 'styled-components'

import imageSize from 'app/services/image-size'
import { mapDispatch } from 'app/services/redux-helpers'
import { actions, selectors } from 'app/state/interface'

import defaultPreviewImage from 'img/image-preview.jpg'
import defaultPreviewWatermark from 'img/watermark.png'

import {
  Container,
  Break,
  PrimaryButton,
  ProgressBar,
  ProgressCircular,
  PlainButton,
} from 'app/ui/elements'

import arrToMap from 'services/array-to-map'

import WatermarkPosition from './watermark-config/position'
import WatermarkPadding from './watermark-config/padding'
import Preview from './preview'

const Marriage = styled.button`
  ${
    ({ active, theme }) => active ?
    css`
      background: ${ theme.secondary.base };
      color: ${ theme.secondary.on.base };
    ` :
    css`
      background: 'none';
    `
  }
  &:hover {
    background-color: #007FFF;
    color: white;
  }
  transition:
    background .3s linear,
    color .3s linear;

  width: 60px;
  margin: 0 auto;
  border: none;
  outline: none;
  appearance: none;
  cursor: pointer;
  font-size: 24px;
`

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
  width: 80px;
  height: 24px;
  margin-right: 8px;
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

const WatermarkUpload = styled.div`
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

  p {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
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
      listImagePreview: {},
      watermarkSrc: '',
      imageSrc: '',
      widthOriginWatermark: 1,
      heightOriginWatermark: 1,
      percentWatermark: 20,
      imagesPreview: '',
      modeResize: 'keepRatioPercent',
      marriageActive: true,
      widthPercentWatermark: 100,
      heightPercentWatermark: 100
    }

    this.imageDemo = React.createRef()
    this.changeMimeType = this.changeMimeType.bind(this)
  }

  uploadAllFiles() {
    const {
      plupWatermark,
      plupItems,
      gravity,
      paddingTop,
      paddingLeft,
      paddingRight,
      paddingBottom,
      opacity,
      modeResize,
      heightWatermark,
      widthWatermark,
      percentWatermark,
    } = this.state

    const padding = {
      paddingTop,
      paddingLeft,
      paddingRight,
      paddingBottom
    }

    this.props.uploadFiles(
      plupWatermark,
      plupItems,
      gravity,
      padding,
      opacity,
      modeResize,
      heightWatermark,
      widthWatermark,
      percentWatermark
    )
  }

  handlePadding(padding) {
    this.setState({ ...padding })
  }

  uploadWatermark() {
    const plupWatermark = new plupload.Uploader({
      browse_button: 'browseWatermark',
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
                  watermarkSrc: reader.result,
                  heightOriginWatermark: event.path[ 0 ].height,
                  widthOriginWatermark: event.path[ 0 ].width
                })
              }
            }
            reader.readAsDataURL(file.getNative())
          })
        },
        FilesRemoved: (uploader ,files) => {
          this.setState({ watermarkSrc:'' })
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

    plupWatermark.init()

    this.setState({
      plupWatermark
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
                listImagePreview: {
                  ...this.state.listImagePreview,
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
          const listImagePreview = files.reduce((state, file) => {
            const { [file.id]: removed, ...reducedState } = state
            return reducedState
          }, this.state.listImagePreview)
          this.setState({ listImagePreview })
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

  async componentDidUpdate(prevProps, prevState) {
    const lastImageSrc = Object.values(prevState.listImagePreview)[0]
    const imageSrc = Object.values(this.state.listImagePreview)[0]

    if (lastImageSrc !== imageSrc || prevState.watermarkSrc !== this.state.watermarkSrc) {
      let { width: widthOriginImage, height: heightOriginImage } = await imageSize(imageSrc)
      const { percentWatermark } = this.state

      const { widthWatermark, heightWatermark, widthImagePreivew, heightImagePreivew } = this.ratioWatermark(
        widthOriginImage,
        heightOriginImage,
        percentWatermark
      )

      this.setState({
        imageSrc,
        widthWatermark,
        heightWatermark,
        widthOriginImage,
        heightOriginImage,
        widthImagePreivew,
        heightImagePreivew
      })
    }
    if (prevState.widthPixelWatermark !== this.state.widthPixelWatermark ||
        prevState.heightPixelWatermark !== this.state.heightPixelWatermark
      ) {
        const {
          widthImagePreivew,
          heightImagePreivew
        } = this.ratioImagePreview(this.state.widthOriginImage, this.state.heightOriginImage)

        const {
          widthWatermarkByRatio,
          heightWatermarkByRatio
        } = this.ratioWatermarkByPixel(this.state.widthOriginImage, this.state.heightOriginImage, widthImagePreivew, heightImagePreivew)

      this.setState({
        widthWatermarkByRatio,
        heightWatermarkByRatio
      })
    }
  }

  componentDidMount() {
    const {
      widthWatermark,
      heightWatermark
    } = this.ratioWatermark()

    this.setState({
      widthWatermark,
      heightWatermark
    })
    this.uploadWatermark()
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

  ratioImagePreview(widthOriginImage, heightOriginImage) {
    let _widthOriginImage = widthOriginImage || 600
    let _heightOriginImage = heightOriginImage || 600
    const ratio = (_widthOriginImage / _heightOriginImage)

    if (ratio < 1) {
      _widthOriginImage = Math.round(_widthOriginImage / (_heightOriginImage / 300))
      return {
        widthImagePreivew: _widthOriginImage,
        heightImagePreivew: 300,
      }
    }

    _heightOriginImage = Math.round( _heightOriginImage / (_widthOriginImage / 300))

    return {
      heightImagePreivew: _heightOriginImage,
      widthImagePreivew: 300,
    }
  }

  ratioWatermark(widthOriginImage, heightOriginImage, percentWatermark = this.state.percentWatermark){
    const { widthOriginWatermark, heightOriginWatermark } = this.state

    let _widthOriginImage = widthOriginImage || 600
    let _heightOriginImage = heightOriginImage || 600
    const ratio = (_widthOriginImage / _heightOriginImage)

    if (ratio < 1) {
      _widthOriginImage = Math.round(_widthOriginImage / (_heightOriginImage / 300))
      let widthWatermark = Math.round(_widthOriginImage * (percentWatermark / 100))
      let heightWatermark = Math.round(heightOriginWatermark * (widthWatermark / widthOriginWatermark))

      return {
        widthImagePreivew: _widthOriginImage,
        heightImagePreivew: 300,
        widthWatermark,
        heightWatermark
      }
    } else {
      _heightOriginImage = Math.round( _heightOriginImage / (_widthOriginImage / 300))
      let heightWatermark = Math.round(_heightOriginImage * (percentWatermark / 100))
      let widthWatermark = Math.round(widthOriginWatermark * (heightWatermark / heightOriginWatermark))

      return {
        heightImagePreivew: _heightOriginImage,
        widthImagePreivew: 300,
        widthWatermark,
        heightWatermark
      }
    }
  }

  changeRatioWatermark(e){
    const percentWatermark = e.target.value
    const {
      widthOriginImage,
      heightOriginImage
    } = this.state

    const { widthWatermark, heightWatermark } = this.ratioWatermark(
      widthOriginImage,
      heightOriginImage,
      percentWatermark
    )

    this.setState({
      widthWatermark,
      heightWatermark,
      percentWatermark
    })
  }

  downloadFile(){
    window.location.href = this.props.linkDownload
  }

  removeWatermark(file){
    const { plupWatermark } = this.state
    plupWatermark.removeFile(file)
  }

  removeImage(file){
    const { plupItems } = this.state
    plupItems.removeFile(file)
  }

  changeImagePreview(image){
    const img = new Image()
    const {
      percentWatermark,
      modeResize,
      widthPercentWatermark,
      heightPercentWatermark,
      widthPixelWatermark,
      heightPixelWatermark
    } = this.state

    img.src = image
    let that = this
    img.onload = async (event) => {
      const { width: widthOriginImage, height: heightOriginImage } = await imageSize(image)

      if (modeResize === 'keepRatioPercent') {
        let { widthWatermark, heightWatermark } = that.ratioWatermark(widthOriginImage, heightOriginImage, percentWatermark)
        this.setState({
          imageSrc: image,
          widthWatermark,
          heightWatermark
        })
      }

      if (modeResize === 'noKeepRatioPercent') {
        this.setState({
          widthWatermark: Math.round(widthOriginImage * (widthPercentWatermark / 100)),
          heightWatermark: Math.round(heightOriginImage * (heightPercentWatermark / 100)),
          imageSrc: image
        })
      }

      if (modeResize === 'keepPercentPixel' || modeResize === 'pixel') {
        const { widthImagePreivew, heightImagePreivew } = this.ratioImagePreview(widthOriginImage, heightOriginImage)

        const {
          widthWatermarkByRatio,
          heightWatermarkByRatio
        } = this.ratioWatermarkByPixel(widthOriginImage, heightOriginImage, widthImagePreivew, heightImagePreivew)

        this.setState({
          imageSrc: image,
          widthWatermarkByRatio,
          heightWatermarkByRatio
        })
      }
    }
  }

  ratioWatermarkByPixel(widthOriginImage, heightOriginImage, widthImagePreivew, heightImagePreivew) {
    const _widthOriginImage =  widthOriginImage || this.state.widthOriginImage
    const _heightOriginImage =  heightOriginImage || this.state.heightOriginImage
    const _widthImagePreivew = widthImagePreivew || this.state.widthImagePreivew
    const _heightImagePreivew = heightImagePreivew || this.state.heightImagePreivew
    const widthWatermark = this.state.widthPixelWatermark || this.state.widthWatermark
    const heightWatermark = this.state.heightPixelWatermark || this.state.heightWatermark

    const ratioWidthImage = _widthImagePreivew / _widthOriginImage
    const ratioHeightImage = _heightImagePreivew / _heightOriginImage
    const widthWatermarkByRatio = widthWatermark * ratioWidthImage
    const heightWatermarkByRatio = heightWatermark * ratioHeightImage

    return {
      widthWatermarkByRatio,
      heightWatermarkByRatio
    }
  }

  changeModeResize(e){
    if (e.target.value === 'pixel') {
      const {
        widthWatermarkByRatio,
        heightWatermarkByRatio
      } = this.ratioWatermarkByPixel()

      this.setState({
        modeResize: e.target.value,
        widthWatermarkByRatio,
        heightWatermarkByRatio
      })

      return
    }

    const {
      widthOriginImage,
      heightOriginImage,
      percentWatermark
    } = this.state

    const { widthWatermark, heightWatermark } = this.ratioWatermark(
      widthOriginImage,
      heightOriginImage,
      percentWatermark
    )

    this.setState({
      widthWatermarkByRatio: null,
      heightWatermarkByRatio: null,
      modeResize: e.target.value
    })
  }

  changeSizeWatermark(e){
    const {
      widthWatermark,
      heightWatermark,
      widthOriginImage,
      heightOriginImage,
      heightOriginWatermark,
      widthOriginWatermark
    } = this.state
    //  resize by ratio Pixel
    const ratioWatermark = widthOriginWatermark / heightOriginWatermark

    if (this.state.marriageActive) {
      if (e.target.name === 'widthPixelWatermark') {
        if (!heightWatermark) {
          this.setState({
            [ e.target.name ]: e.target.value,
            widthWatermark: e.target.value,
            heightWatermark: e.target.value
          })
        }
        if (!e.target.value) {
          this.setState({
            heightWatermark: ((1 * heightWatermark) / 1)
          })
        } else {
          let _heightWatermark = Math.round((e.target.value * (heightOriginWatermark / widthOriginWatermark)))

          if (ratioWatermark > 1) {
            _heightWatermark = Math.round((e.target.value * (widthOriginWatermark / heightOriginWatermark)))
          }

          let { widthWatermarkByRatio, heightWatermarkByRatio } = this.ratioWatermarkByPixel()

          this.setState({
            [ e.target.name ]: e.target.value,
            widthWatermark: e.target.value,
            heightWatermark: _heightWatermark
          })
        }
      }

      if (e.target.name === 'heightPixelWatermark') {
        if (!widthWatermark) {
          this.setState({
            [ e.target.name ]: e.target.value,
            widthWatermark: e.target.value,
            heightWatermark: e.target.value
          })
        }
        if (!e.target.value) {
          this.setState({
            [ e.target.name ] : e.target.value,
            widthWatermark: ((1 * widthWatermark) / 1)
          })
        } else {
          let _widthWatermark = Math.round((e.target.value * (widthOriginWatermark / heightOriginWatermark)))

          if (ratioWatermark > 1) {
            _widthWatermark = Math.round((e.target.value * (heightOriginWatermark / widthOriginWatermark)))
          }

          this.setState({
            [ e.target.name ] : e.target.value,
            heightWatermark: e.target.value,
            widthWatermark: _widthWatermark
          })
        }
      }
    }

    // resize no ratio
    if (e.target.name === 'widthPixelWatermark') {
      this.setState({
        widthWatermark: e.target.value,
        [ e.target.name ] : e.target.value
      })
    }

    if (e.target.name === 'heightPixelWatermark') {
      this.setState({
        heightWatermark: e.target.value,
        [ e.target.name ] : e.target.value
      })
    }
  }

  changeModeResizePixel(e){
    const { marriageActive } = this.state

    this.setState({
      modeResize: marriageActive === false ? 'keepPercentPixel' : 'noKeepPercentPixel',
      marriageActive: !marriageActive
    })
  }

  sizeWatermark(originSizeWatermark){
    this.setState({
      heightOriginWatermark: originSizeWatermark.height,
      widthOriginWatermark: originSizeWatermark.width,
      heightPixelWatermark: originSizeWatermark.height,
      widthPixelWatermark: originSizeWatermark.width
    })
  }


  changePercentWatermark(e){
    const percentWatermark = e.target.value
    const  widthOriginImage = this.state.widthOriginImage || 600
    const  heightOriginImage = this.state.heightOriginImage || 600

    if ( e.target.name === 'widthPercentWatermark') {
      this.setState({
        widthWatermark: Math.round(widthOriginImage * (percentWatermark / 100)),
        [ e.target.name ] : e.target.value
      })
      return
    }

    if (e.target.name === 'heightPercentWatermark') {
      this.setState({
        heightWatermark: Math.round(heightOriginImage * (percentWatermark / 100)),
        [ e.target.name ] : e.target.value
      })
    }
  }

  render() {
    const {
      templateFile,
      imageFiles,
      listImagePreview,
      watermarkSrc,
      previewImage,
      modeResize,
      marriageActive,
      originSizeWatermark
    } = this.state

    const watermarkUpload = watermarkSrc.length ? <ImageUpload >
      <p>1</p>
      {
        templateFile.percent !== 0 ?
          <ProgressCircular
            percent={ templateFile.percent }
            />
            :
          <PrimaryButton
            onClick={ this.removeWatermark.bind(this, templateFile) }
            minWidth={ 20 }>
              X
          </PrimaryButton>
      }
      <Thumbnail src={ watermarkSrc }/>
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
            listImagePreview[ file.id ] && <Thumbnail src={ listImagePreview[ file.id ] }/>
          }
          <p>
            { file.name } { plupload.formatSize(file.size) }
          </p>
        </ImageUpload>
      )
    })

    const thumbnails = Object.values(listImagePreview).map((image, index) => {
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
              <LabelItem>Watermark</LabelItem>
              <PrimaryButton
                id="browseWatermark"
                free={ true }
              >
                Browse file...
              </PrimaryButton>
            </Upload>
            <ListUpload>
              { watermarkUpload }
            </ListUpload>
          </div>
          <div>
          <Config>
            <LabelItem>Config position</LabelItem>
          </Config>
          <Break/>
          <Config>
            <WatermarkPosition
              handleGravity={ this.handleGravity.bind(this) }
            />
          </Config>
          </div>
          <div>
            <LabelItem>Preview Config</LabelItem>
            <Break/>
            <Preview
              gravity={ this.state.gravity }
              padding={{
                top: this.state.paddingTop,
                left: this.state.paddingLeft,
                right: this.state.paddingRight,
                bottom: this.state.paddingBottom
              }}
              opacity={ this.state.opacity / 100 }
              watermarkSrc={ this.state.watermarkSrc || defaultPreviewWatermark }
              imageSrc={ this.state.imageSrc || defaultPreviewImage }
              heightWatermark={ this.state.heightWatermark }
              widthWatermark={ this.state.widthWatermark }
              widthWatermarkByRatio={ this.state.widthWatermarkByRatio }
              heightWatermarkByRatio={ this.state.heightWatermarkByRatio }
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
              <WatermarkPadding
                handlePadding={ this.handlePadding.bind(this) }
                gravity={ this.state.gravity }
                paddingTop={ this.state.paddingTop }
                paddingLeft={ this.state.paddingLeft }
                paddingRight={ this.state.paddingRight }
                paddingBottom={ this.state.paddingBottom }
              />
            <Break/>
            <Break/>
            <LabelItem>Resize Watermark</LabelItem>
            <Break/>
            <DropDown
              name='TypeResize'
              size='1'
              onChange={ this.changeModeResize.bind(this) }>
                <option value='percent'>Percent</option>
                <option value='pixel'>Pixel</option>
            </DropDown>
            {
              modeResize === 'percent' ||
              modeResize === 'noKeepRatioPercent' ||
              modeResize === 'keepRatioPercent' ?
              <DropDown
                name='TypeResize'
                size='1'
                onChange={ this.changeModeResize.bind(this) }
              >
                <option value='keepRatioPercent'>Keep Ratio</option>
                <option value='noKeepRatioPercent'>No Keep Ratio</option>
              </DropDown>
              :
              <div></div>
            }
            <Break/>
              { modeResize === 'percent' || modeResize === 'keepRatioPercent' ? <div>
                <LabelItem>Ratio Watermark By Percent</LabelItem>
                <Slider>
                  <input
                    type='range'
                    value={ this.state.percentWatermark }
                    onChange={ this.changeRatioWatermark.bind(this) }
                  />
                  <div>
                    <Input
                      type='number'
                      max='100'
                      min='0'
                      value={ this.state.percentWatermark }
                      onChange={ this.changeRatioWatermark.bind(this) }
                    />
                    <label>%</label>
                  </div>
                </Slider>
                </div>
                :
                modeResize === 'noKeepRatioPercent' ? <div>
                <LabelItem>Ratio Watermark By Percent</LabelItem>
                  <Break/>
                  <Grid columns={ 4 }>
                    <div>
                      <label>Width </label>
                      <Input
                        type='number'
                        name='widthPercentWatermark'
                        value={ this.state.widthPercentWatermark }
                        onChange={ this.changePercentWatermark.bind(this) }
                      />
                      <label>%</label>
                    </div>
                    <div>
                      <label>Height </label>
                      <Input
                        name='heightPercentWatermark'
                        type='number'
                        value={ this.state.heightPercentWatermark }
                        onChange={ this.changePercentWatermark.bind(this) }
                      />
                      <label>%</label>
                    </div>
                  </Grid>
                </div>
                :
                <div>
                  <LabelItem>Ratio Watermark By Pixel</LabelItem>
                  <Break/>
                  <Grid columns={ 4 }>
                    <div>
                      <label>Width </label>
                      <Input
                        type='number'
                        name='widthPixelWatermark'
                        value={ this.state.widthWatermark }
                        onChange={ this.changeSizeWatermark.bind(this) }
                      />
                      <label>px</label>
                    </div>
                    <Marriage
                      onClick={ this.changeModeResizePixel.bind(this) }
                      active={ marriageActive }
                      >
                      &#9901;
                    </Marriage>
                    <div>
                      <label>Height </label>
                      <Input
                        name='heightPixelWatermark'
                        type='number'
                        value={ this.state.heightWatermark }
                        onChange={ this.changeSizeWatermark.bind(this) }
                      />
                      <label>px</label>
                    </div>
                    </Grid>
                </div>
              }
            <Break/>
            <LabelItem>Opacity</LabelItem>
            <Slider>
              <input
                type='range'
                value={ this.state.opacity }
                onChange={ this.changeOpacity.bind(this) }
              />
              <div>
                <Input
                  type='number'
                  max='100'
                  min='0'
                  value={ this.state.opacity }
                  onChange={ this.changeOpacity.bind(this) }
                />
                <label>%</label>
              </div>
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
