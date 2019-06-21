import React from 'react'
import plupload from 'plupload'

const UploadForm = () => {
  const uploader = new plupload.Uploader({
    browse_button: 'browse',
    url: 'localhost:3006'
  })
 
  uploader.init()

  return (
    <div id="container">
      <div>
        <label> Upload Template</label>
        <br/>
        <button id="browse">Browse Files...</button>
      </div>
      <br/>
      <div>
        <label> Upload Images</label>
        <input type='radio' name='zip' value='zip' />Zip
        <input type='radio' name='images' value='images' />Images
        <br/>
        <button id="browse">Browse Files...</button>
      </div>
    </div>
  )
}

export default UploadForm
