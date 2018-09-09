
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
