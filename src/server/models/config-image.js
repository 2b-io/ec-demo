import mongoose from 'infrastructure/mongoose'

const schema = mongoose.Schema({
  bucket: String,
  s3Key: String,
  config: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
}, {
  timestamps: true,
  collection: 'ConfigImage'
})

export default mongoose.model('ConfigImage', schema)
