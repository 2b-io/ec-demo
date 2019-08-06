export default {
  get: [
    (req, res, next) => {
      res.render('pages/home', {
        body: []
      })
    }
  ]
}
