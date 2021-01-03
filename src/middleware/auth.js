const auth = require('basic-auth');

const admin = { name: process.env.USERNAME, password: process.env.PASSWORD }

module.exports = (request, response, next) => {
  const user = auth(request)
  if (!user || !admin.name || admin.password !== user.pass) {
    response.set('WWW-Authenticate', 'Basic realm="example"')
    return response.status(401).send()
  }
  return next()
}