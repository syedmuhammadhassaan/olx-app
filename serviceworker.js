var cacheName = "my-demo-app_04";
var dataCacheName = "my-demo-app_data_03";

var filesToCache = [
  "/serviceindex.js",
  // "/serviceworker.js",
  "/public/css/bootstrap.css",
  "/public/css/style.css",
  "/public/js/bootstrap.js",
  "/app.js",
  "/manifest.json",
  "/views/layouts/layouts.handlebars",
  "/views/index.handlebars",
  "/views/login.handlebars",
  "/views/register.handlebars",
  "/views/prop.handlebars",
  "/routes/index.js",
  "/routes/users.js",
  "/models/user.js",
  "/"
];

// self.addEventListener("install", function(e) {
//   console.log("[ServiceWorker] Install");

//   e.waitUntil(
//     caches
//       .open(cacheName)
//       .then(function(cache) {
//         console.log("[ServiceWorker] Caching app shell");
//         return cache.addAll(filesToCache);
//       })
//       .catch(function(err) {
//         console.log("Problem");
//       })
//   );
// });

self.addEventListener("install", function(e) {
  console.log("[ServiceWorker] Install");
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log("[ServiceWorker] Caching app shell");
      return cache.addAll(filesToCache);
    })
  );
});
// self.addEventListener("activate", function(e) {
//   console.log("[ServiceWorker] Activate");
//   e.waitUntil(
//     caches.keys().then(function(keyList) {
//       return Promise.all(
//         keyList.map(function(key) {
//           if (key !== cacheName) {
//             console.log("[ServiceWorker] Removing old cache", key);
//             return caches.delete(key);
//           }
//         })
//       );
//     })
//   );
self.addEventListener("activate", function(e) {
  console.log("[ServiceWorker] Activate");
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(
        keyList.map(function(key) {
          if (key !== cacheName && key !== dataCacheName) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.open(dataCacheName).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        return (
          response ||
          fetch(event.request).then(function(response) {
            cache.put(event.request, response.clone());
            return response;
          })
        );
      });
    })
  );
  // console.log("[ServiceWorker] Fetch", e.request.url);
  // if (e.request.url.startsWith("http://localhost:3000")) {
  //   caches.open(dataCacheName).then(function(cache) {
  //     return fetch(e.request).then(function(response) {
  //       cache.put(e.request, response.clone());
  //       return response;
  //     });
  //   });
  // } else {
  //   e.respondWith(
  //     caches.match(e.request).then(function(response) {
  //       return response || fetch(e.request);
  //     })
  //   );
  // }
});
// self.addEventListener("fetch", function(event) {
//   event.respondWith(
//     caches.match(event.request).then(function(response) {
//       return response || fetch(event.request);
//     })
//   );
// });
