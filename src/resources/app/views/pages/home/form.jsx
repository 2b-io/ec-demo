import React from 'react'
import { connect } from 'react-redux'
import plupload from 'plupload'
import styled, { css } from 'styled-components'

import imageSize from 'app/services/image-size'
import { mapDispatch } from 'app/services/redux-helpers'
import { actions, selectors } from 'app/state/interface'
import defaultPreviewImage from 'img/image-preview.jpg'
import defaultPreviewWatermark from 'img/watermark.png'
import { AddIcon, DownloadIcon, RefreshIcon } from 'app/ui/elements/icons'
import iconZip from 'img/icon-zip.png'
import iconLoading from 'img/loading.gif'

import {
  Container,
  Break,
  PrimaryButton,
  ErrorButton,
  ProgressCircular,
  PlainButton,
  Slider,
  Dialog,
} from 'app/ui/elements'

import arrToMap from 'services/array-to-map'

import WatermarkPosition from './watermark-config/position'
import WatermarkPadding from './watermark-config/padding'
import Preview from './preview'

const RemoveButton = styled.div`
  cursor: pointer;
  z-index: 10;
  position: absolute;
  appearance: none;
  border: none;
  outline: none;
  height: 22px;
  width: 22px;
  opacity: 0.5;
  border-radius: 20px;
  margin-left: 96px;
  text-align: center;

  transition:
    background .3s linear,
    color .3s linear;

  display: block;

  ${
    ({ theme }) =>
      css`
        background: ${ theme.error.base };
        color: ${ theme.error.on.base };
      `
  }

  &:focus {
    outline: none;
  }
  &:hover {
    opacity: 1;
  }
`
const PopupDownload = styled.div`
  display: block;
  text-align: center;
  height: 450px;
`
const IconLoading = styled.img.attrs( props => {
  src: props.src;
  width: props.width;
})`
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`
const DownloadButton = styled.div`
  position: absolute;
  margin: auto;
  top: 50%;
  left: 0;
  right: 0;
`
const Center = styled.div`
  display: block;
  margin: 0 auto;
  max-width: 450px;
`

const Progress = styled.div`
  max-height: 40px;
  display: block;
  position: absolute;
  margin-left: 78px;
`

const WrapperIcon = styled.div`
  margin-top: 40px
`

const UploadButton = styled.div`
  width: 120px;
  height: 120px;

  ${
    ({ theme }) => {
      return css`
        :hover {
          cursor: pointer;
          color: ${ theme.secondary.on.base };
          background-color: ${ theme.primary.base };
        }
        border: ${ theme.primary.base } 1px solid;
      `;
    }
  }
`
const Marriage = styled.p`
  ${
    ({ active, theme }) => active ?
    css`
      color: ${ theme.secondary.base };
    `:
    css`
      color: #777
    `
  }

  ${
    ({ active, theme }) => css`
      &:hover {
        color: ${ theme.primary.base };
      }
    `
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
  font-size: 80px;
`

const WrapperItem = styled.div`
  display: block;
`
const Config = styled.div`
  text-align: center;
`
const ActionButton = styled.div`
  text-align: center;
  padding: 16px;
`

const Session = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-template-columns: 1fr 1fr;
`
const HorizonLine = styled.div`
  ${
    ({ theme }) => {
      return css`
        border-right: 1px ${ theme.primary.base } solid;
      `
    }
  }
`

const ResizeWatermark = styled.div`
  display: inline-block;
  margin: 0 auto;

`
const SliderEl = styled.div`
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

const UnitConfig = styled.div`
  display: grid;
  grid-gap: 8px;
  ${
    ({ columns, gap = 8 }) => css`
      grid-gap: ${ gap }px;
      grid-template-columns: repeat(${ columns }, 132px);
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
  padding-left: 16px;
  padding-right: 16px;
  display: grid;
  grid-gap: 8px;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(7, 1fr);
  max-height: 400px;
  overflow-y: scroll;
`

const ThumbnailPreview = styled.img.attrs( props => {
  src: props.src
})`
  width: 120px;
  height: 120px;
  object-fit: cover;
  ${
    ({ theme }) => css`
      border: 1px ${ theme.primary.base } solid ;
    `
  }

  ${
    ({ opacity }) => css`opacity: ${ opacity }`
  }
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
      heightPercentWatermark: 100,
      isPopoverOpen: false,
      nodeData: [{
        isActive: true,
        isComplete: false,
        label: "Upload Images",
        description: "Upload Images"
      },{
        isActive: false,
        isComplete: false,
        label: "Config Images",
        description: "Config Images"
      },{
        isActive: false,
        isComplete: false,
        label: "Get Images",
        description: "Get Images"
      }]
    }

    this.changeMimeType = this.changeMimeType.bind(this)
    this.removeImage = this.removeImage.bind(this)
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
      widthPercentWatermark,
      heightPercentWatermark
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
      percentWatermark,
      widthPercentWatermark,
      heightPercentWatermark
    )
    this.setState({
      displayUpload: false
    })
  }

  changePadding(padding) {
    const {
      widthOriginImage,
      heightOriginImage,
      widthImagePreivew,
      heightImagePreivew
    } = this.state

    let paddingPreviewValue
    let paddingPreviewKey
    const paddingKey = Object.keys(padding)[0]
    const paddingValue = Object.values(padding)[0]

    if (paddingKey === 'paddingTop' ||
      paddingKey === 'paddingBottom'
    ) {
      paddingPreviewValue = paddingValue * widthImagePreivew / widthOriginImage
    }

    if (paddingKey === 'paddingLeft' ||
      paddingKey === 'paddingRight'
    ) {
      paddingPreviewValue = paddingValue * heightImagePreivew / heightOriginImage
    }

    switch (paddingKey) {
      case 'paddingTop':
        paddingPreviewKey = 'paddingPreviewTop'
        break
      case 'paddingLeft':
        paddingPreviewKey = 'paddingPreviewLeft'
        break
      case 'paddingRight':
        paddingPreviewKey = 'paddingPreviewRight'
        break
      case 'paddingBottom':
        paddingPreviewKey = 'paddingPreviewBottom'
        break
    }
    const paddingPreview = { [ paddingPreviewKey ]: paddingPreviewValue }

    this.setState({
      ...padding,
      ...paddingPreview
    })
  }

  uploadWatermark() {
    const plupWatermark = new plupload.Uploader({
      browse_button: [
        'browseWatermark0',
        'browseWatermark1',
        'browseWatermark2',
        'browseWatermark3',
        'browseWatermark4',
        'browseWatermark5',
        'browseWatermark6',
        'browseWatermark7',
        'browseWatermark8',
      ],
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
                  widthOriginWatermark: event.path[ 0 ].width,
                  displayUpload: true,
                })
              }
            }
            reader.readAsDataURL(file.getNative())
          })
        },
        FilesRemoved: (uploader ,files) => {
          this.setState({
            watermarkSrc:'',
            templateFile:''
          })
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
                  [ file.id ]: {
                    id: file.id,
                    index: new Date().getTime(),
                    src: reader.result
                  }
                }
              })
            }
            reader.readAsDataURL(file.getNative())
          })
        },
        QueueChanged: (queue) => {
          this.setState({
            imageFiles: arrToMap(queue.files, 'id')
          })
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
            this.setState({
              isProgress: true,
              isActiveDialog: true
            })
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

  resetPluploadImage(mimeType) {
    this.state.plupItems.destroy()
    this.uploadItems(MIME_FILE[ mimeType ])
  }

  resetPluploadWatermark() {
    this.state.plupWatermark.destroy()
    this.uploadWatermark()
  }

  async componentDidUpdate(prevProps, prevState) {

    let lastImageSrc = ''
    let imageSrc = ''
    const totalLastImages = Object.values(prevState.listImagePreview).length
    const totalImages = Object.values(this.state.listImagePreview).length

    if (totalLastImages) {
      lastImageSrc = Object.values(prevState.listImagePreview)[ totalLastImages - 1 ].src
    }

    if (totalImages) {
      imageSrc = Object.values(this.state.listImagePreview)[ totalImages - 1 ].src
    }

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
        } = this.ratioWatermarkByPixel(
          this.state.widthOriginImage,
          this.state.heightOriginImage,
          widthImagePreivew,
          heightImagePreivew
        )

      this.setState({
        widthWatermarkByRatio,
        heightWatermarkByRatio
      })
    }

    if (this.state.watermarkSrc === '' && prevState.watermarkSrc !== this.state.watermarkSrc) {
      this.uploadWatermark()
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
      this.resetPluploadImage(mimeType)

      this.setState({
        mimeType,
        listImagePreview: {},
        imageFiles: {}
      })
    } else {
      this.resetPluploadImage(mimeType)

      this.setState({
        mimeType,
        listImagePreview: {},
        imageFiles: {}
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
      paddingPreviewTop: 0,
      paddingPreviewLeft: 0,
      paddingPreviewRight: 0,
      paddingPreviewBottom: 0
    })
  }

  changeOpacity(value){
    this.setState({ opacity: value })
  }

  ratioImagePreview(widthOriginImage, heightOriginImage) {
    let _widthOriginImage = widthOriginImage || 600
    let _heightOriginImage = heightOriginImage || 600
    const ratio = (_widthOriginImage / _heightOriginImage)

    if (ratio < 1) {
      _widthOriginImage = Math.round(_widthOriginImage / (_heightOriginImage / 450))
      return {
        widthImagePreivew: _widthOriginImage,
        heightImagePreivew: 450,
      }
    }

    _heightOriginImage = Math.round( _heightOriginImage / (_widthOriginImage / 450))

    return {
      heightImagePreivew: _heightOriginImage,
      widthImagePreivew: 450,
    }
  }

  ratioWatermark(widthOriginImage, heightOriginImage, percentWatermark = this.state.percentWatermark){
    const { widthOriginWatermark, heightOriginWatermark } = this.state

    let _widthOriginImage = widthOriginImage || 600
    let _heightOriginImage = heightOriginImage || 600
    const ratio = (_widthOriginImage / _heightOriginImage)

    if (ratio < 1) {
      _widthOriginImage = Math.round(_widthOriginImage / (_heightOriginImage / 450))
      let widthWatermark = Math.round(_widthOriginImage * (percentWatermark / 100))
      let heightWatermark = Math.round(heightOriginWatermark * (widthWatermark / widthOriginWatermark))

      return {
        widthImagePreivew: _widthOriginImage,
        heightImagePreivew: 450,
        widthWatermark,
        heightWatermark
      }
    } else {
      _heightOriginImage = Math.round( _heightOriginImage / (_widthOriginImage / 450))
      let heightWatermark = Math.round(_heightOriginImage * (percentWatermark / 100))
      let widthWatermark = Math.round(widthOriginWatermark * (heightWatermark / heightOriginWatermark))

      return {
        heightImagePreivew: _heightOriginImage,
        widthImagePreivew: 450,
        widthWatermark,
        heightWatermark
      }
    }
  }

  changeRatioWatermark(value){
    const percentWatermark = value
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

    this.state.plupWatermark.destroy()
  }

  removeImage(file){
    console.log('remove file');
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
        const { widthImagePreivew, heightImagePreivew } = this.ratioImagePreview(widthOriginImage, heightOriginImage)
        this.setState({
          widthWatermarkByRatio: Math.round( widthPercentWatermark * (widthImagePreivew / 100)),
          heightWatermarkByRatio: Math.round(heightPercentWatermark * (heightImagePreivew / 100)),
          widthWatermark: Math.round(widthOriginImage * (widthPercentWatermark / 100)),
          heightWatermark: Math.round(heightOriginImage * ( heightPercentWatermark / 100)),
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
    const {
      widthOriginImage,
      heightOriginImage,
      percentWatermark
    } = this.state

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

    if (e.target.value === 'noKeepRatioPercent') {
      const {
        widthPercentWatermark,
        heightPercentWatermark,
        widthImagePreivew,
        heightImagePreivew
      } = this.state

      this.setState({
        widthWatermarkByRatio: Math.round( widthPercentWatermark * (widthImagePreivew / 100)),
        heightWatermarkByRatio: Math.round(heightPercentWatermark * (heightImagePreivew / 100)),
        widthWatermark: Math.round(widthOriginImage * (widthPercentWatermark / 100)),
        heightWatermark: Math.round(heightOriginImage * ( heightPercentWatermark / 100)),
      })

    }


    const { widthWatermark, heightWatermark } = this.ratioWatermark(
      widthOriginImage,
      heightOriginImage,
      percentWatermark
    )

    this.setState({
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

    const {
      heightOriginImage,
      widthOriginImage,
      imageSrc
    } = this.state

    const { widthImagePreivew, heightImagePreivew } = this.ratioImagePreview(widthOriginImage, heightOriginImage)

    if ( e.target.name === 'widthPercentWatermark') {
      this.setState({
        widthWatermark: Math.round(widthOriginImage * (percentWatermark / 100)),
        widthWatermarkByRatio: Math.round(widthImagePreivew * (percentWatermark / 100)),
        [ e.target.name ] : e.target.value
      })
    }

    if (e.target.name === 'heightPercentWatermark') {
      this.setState({
        heightWatermark: Math.round(heightOriginImage * (percentWatermark / 100)),
        heightWatermarkByRatio: Math.round(heightImagePreivew * (percentWatermark / 100)),
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
      originSizeWatermark,
      mimeType,
      isPopoverOpen
    } = this.state

    const thumbnails = Object.values(listImagePreview)
      .sort((image, nextImage) => nextImage.index - image.index)
      .map((image, index) => {

        const imageFile = imageFiles[ image.id ]
        if (mimeType !== 'images') {
          return (
            <div key={ index }>
              {
                imageFile.percent ?
                <Progress>
                  <ProgressCircular percent={ imageFile.percent }/>
                  <Break/>
                </Progress>
                :
                <RemoveButton onClick={ () => this.removeImage(imageFile) }>
                  X
                </RemoveButton>
              }
              {
                imageFile.percent < 100 ?
                  <ThumbnailPreview src={ iconZip } opacity={ 0.1 }/> :
                  <ThumbnailPreview src={ iconZip } opacity={ 1 }/>
              }
            </div>
          )
        }
        return (
          <div key={ index }>
            {
              imageFile.percent ?
              <Progress>
                <ProgressCircular percent={ imageFile.percent }/>
                <Break/>
              </Progress>
              :
              <RemoveButton onClick={ () => this.removeImage(imageFile) }>
                X
              </RemoveButton>
            }
            {
              imageFile.percent < 100 ?
              <ThumbnailPreview
                opacity={ 0.3 }
                src={ image.src }
                onClick={ this.changeImagePreview.bind(this, image.src)}
              />
              :
              <ThumbnailPreview
                opacity={ 1 }
                src={ image.src }
                onClick={ this.changeImagePreview.bind(this, image.src)}
              />
            }

          </div>
        )
      })

    return (
      <WrapperItem>
        <Session>
          <HorizonLine>
            <Break />
            <Break />
            <Config>
              <LabelItem>Position</LabelItem>
            </Config>
            <Break/>
            <Config>
              <WatermarkPosition
                handleGravity={ this.handleGravity.bind(this) }
                watermarkSrc={ watermarkSrc }
                removeWatermark={ this.removeWatermark.bind(this, templateFile) }
                percent={ templateFile.percent }
              />
            </Config>
          </HorizonLine>
          <Config>
            <Break />
            <Break />
            <LabelItem>Preview</LabelItem>
            <Break/>
            <Preview
              gravity={ this.state.gravity }
              padding={{
                top: this.state.paddingPreviewTop,
                left: this.state.paddingPreviewLeft,
                right: this.state.paddingPreviewRight,
                bottom: this.state.paddingPreviewBottom
              }}
              opacity={ this.state.opacity / 100 }
              watermarkSrc={ this.state.watermarkSrc || defaultPreviewWatermark }
              imageSrc={ this.state.imageSrc || defaultPreviewImage }
              heightWatermark={ this.state.heightWatermark }
              widthWatermark={ this.state.widthWatermark }
              widthWatermarkByRatio={ this.state.widthWatermarkByRatio }
              heightWatermarkByRatio={ this.state.heightWatermarkByRatio }
              modeResize={ this.state.modeResize }
              heightImagePreivew= { this.state.heightImagePreivew }
              widthImagePreivew= { this.state.widthImagePreivew }
            />
          </Config>
        </Session>
        <Session>
        <HorizonLine>
          <Config>
            <Break/>
            <Break/>
            <LabelItem>Padding</LabelItem>
            <Break/>
            <div>
              <WatermarkPadding
                handlePadding={ this.changePadding.bind(this) }
                gravity={ this.state.gravity }
                paddingTop={ this.state.paddingTop }
                paddingLeft={ this.state.paddingLeft }
                paddingRight={ this.state.paddingRight }
                paddingBottom={ this.state.paddingBottom }
              />
            </div>
            <Break/>
            <Break/>
            <LabelItem>Resize Watermark</LabelItem>
            <Break/>
            <DropDown
              name='TypeResize'
              size='1'
              onChange={ this.changeModeResize.bind(this) }>
                <option value='keepRatioPercent'>Percent</option>
                <option value='pixel'>Pixel</option>
            </DropDown>
            {
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
            <Center>
              { modeResize === 'keepRatioPercent' ? <div>
                <Slider
                  label="Ratio Watermark By Percent"
                  name="quality"
                  min="0"
                  max="100"
                  value={ this.state.percentWatermark }
                  onChange={ this.changeRatioWatermark.bind(this) }
                  unit="%"
                />
              </div>:
                modeResize === 'noKeepRatioPercent' ? <div>
                  <LabelItem>Ratio Watermark By Percent</LabelItem>
                    <Break/>
                    <ResizeWatermark>
                      <UnitConfig columns = { 2 }>
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
                      </UnitConfig>
                    </ResizeWatermark>
                  </div>
                  :
                  <div>
                    <LabelItem>Ratio Watermark By Pixel</LabelItem>
                    <Break/>
                    <ResizeWatermark>
                      <UnitConfig columns = { 3 }>
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
                        {
                          marriageActive ?
                            <Marriage
                              onClick={ this.changeModeResizePixel.bind(this) }
                              active={ marriageActive }
                              >
                              &#x26AD;
                            </Marriage>
                            :
                            <Marriage
                              onClick={ this.changeModeResizePixel.bind(this) }
                              active={ marriageActive }
                              >
                              &#x26AE;
                            </Marriage>
                        }

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
                      </UnitConfig>
                    </ResizeWatermark>
                  </div>
                }
                <Break/>
                <Slider
                  label="Opacity"
                  name="Opacity"
                  min="0"
                  max="100"
                  value={ this.state.opacity }
                  onChange={ this.changeOpacity.bind(this) }
                  unit="%"
                />
              </Center>
              <Break/>
            </Config>
          </HorizonLine>
          <div>
            <Break/>
            <Config>
              <FileType>
                 <input
                  type='radio'
                  name='images'
                  value='images'
                  onChange={ this.changeMimeType }
                  checked={ this.state.mimeType === 'images' ? true : false }/>Images
                  &nbsp;
                  &nbsp;
                 <input
                   type='radio'
                   name='zip'
                   value='zip'
                   onChange={ this.changeMimeType }
                   checked={ this.state.mimeType === 'zip' ? true : false }/>Zip
               </FileType>
             </Config>
            {
              <Collection>
                <UploadButton id='browseFiles'>
                  <WrapperIcon>
                    <AddIcon />
                  </WrapperIcon>
                </UploadButton>
                  { thumbnails }
               </Collection>
            }
          </div>
        </Session>
        <ActionButton>
          {
            this.state.displayUpload && <PrimaryButton
              onClick={ this.uploadAllFiles.bind(this) }>
              Upload
            </PrimaryButton>
          }
          {
            (this.props.linkDownload && !this.state.isActiveDialog) && <PrimaryButton
              onClick={ this.downloadFile.bind(this) }>
                Download
              </PrimaryButton>
          }
          {
            (this.state.isProgress) &&
              <Dialog
              isActive={ this.state.isActiveDialog }
              onOverlayClick={ ()=> {
                if (this.props.linkDownload) {
                  this.setState({ isActiveDialog: false })
                }
              } }
              content={() => <PopupDownload>
                  {
                    !this.props.linkDownload && <IconLoading src={ iconLoading } width={ 100 }/>
                  }
                  {
                    this.props.linkDownload && <DownloadButton>
                      <PrimaryButton onClick={ this.downloadFile.bind(this) }>
                        Download
                      </PrimaryButton>
                      	&nbsp;
                      	&nbsp;
                      	&nbsp;
                      	&nbsp;
                      	&nbsp;
                      <ErrorButton onClick={ () =>
                          {
                            this.setState({ isActiveDialog: false })
                            location.reload()
                          }
                        }>
                        Reload
                      </ErrorButton>
                      </DownloadButton>
                  }
                </PopupDownload>
              }/>
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
