import React from 'react'

const UploadForm = () => (
  <div>
    <div>
      <label> Upload Template</label>
      <br/>
      <button>Upload</button>
    </div>
    <br/>
    <div>
      <label> Upload Images</label>
      <input type='radio' name='zip' value='zip' />Zip
      <input type='radio' name='images' value='images' />Images
      <br/>
      <button>Upload</button>
    </div>
  </div>
)

export default UploadForm
