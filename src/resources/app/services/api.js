import request from 'superagent'

import config from 'infrastructure/config'
const callApi = async (method, path, body) => {
  const response = await request(method, `${ path }`)
    .send(body)

  return response.body
}

export default {
  callApi
}
