export default {
  get: [
    (req, res, next) => {
      const { identifier } = req.params
      console.log('identifier', identifier)
      res.render('pages/result', {
        downloadLink: identifier
      })
    }
  ]
}
