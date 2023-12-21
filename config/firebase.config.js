const admin = require('firebase-admin')
const { initializeApp } = require('firebase-admin/app')
const serviceAccount = require('./firebase-adminSDK.json')

const initializeFirebase = () => {
  return initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
module.exports = initializeFirebase