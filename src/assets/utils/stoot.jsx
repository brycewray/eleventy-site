const axios = require('axios')

module.exports = async (instance, id) => {
  const mastodonTarget = "https://" + instance + "/api/v1/statuses/" + id

  async function getToot(urlToGet) {
    const response = await axios
      .get(urlToGet)
    let data = response.data
    return data
  }

  let tootJSON = await getToot(mastodonTarget)
  tootJSON = JSON.stringify(tootJSON)

  let stringToRet = ``

  return stringToRet

}
