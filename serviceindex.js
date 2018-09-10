// var express = require('express')
// var router = express.Router()
// var axios = require('axios')

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/serviceworker.js')
    .then(function (registration) {
      //  Registration was successful
      console.log(
        'Registration Successfully completed.....: ',
        registration.scope
      )
    })
    .catch(function (err) {
      //  registration failed :(
      console.log('ServiceWorker registration failed.......: ', err)
    })
}

var imgPreview = document.getElementById('img-preview')
var fileUpload = document.getElementById('file-upload')
var CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dil4s3nc7/upload'
var CLOUDINARY_UPLOAD_PRESET = 'lu2v8ynt'
fileUpload.addEventListener('change', function (event) {
  var file = event.target.files[0]
  var formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  // console.log(file)
  axios({
    url: CLOUDINARY_URL,
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: formData
  }).then(function (res) {
    // console.log(res)
    imgPreview.src = res.data.secure_url
    imgPreview.name = res.data.secure_url
    req.body.imgSrc =  res.data.secure_url
    console.log(imgPreview.name)
  }).catch(function (err) {
    console.log(err)
  })
})
// var imgPreview = document.getElementById('img-preview')
// module.exports = router
//  new OfflinePlugin({
//    cacheMaps: [
//      {
//        match: function(requestUrl) {
//          return new URL('/', location)
//        },
//        requestTypes: ['navigate']
//      }
//    ]
//  })
//   function getData()
//   {
//     console.log('testing')
//     fetch('http:// localhost:3000/').then(function(response)
//     {
//         return response.json()
//     })
//     .then(function(users){
//     console.log('data from network',users)
//     })
//     .catch(function(error){
//     console.log('Not Working')
//     })

//     caches.match('http:// localhost:3000/').then(function(response)
//     {
//       if (!response){

//         console.log('nodata')
//       }
//       return response.json()
//     }).then(function(data){
//       console.log('data from Cache =' ,data)
//     }).then (function(){
//       console.log('error')
//     })

//  }
