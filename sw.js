const cacheName = 'v1';
const cacheFiles = [
    '/',
    'index.html',
    'restaurant.html',
    './js/swController.js',
    './js/main.js',
    './js/restaurant_info.js',
    './css/styles.css',
    './data/restaurants.json',
    './img/'
];

/**
 *  - Install event
 */
self.addEventListener('install', event => {
    console.log('ServiceWorker Installed');
    event.waitUntil(
        caches.open(cacheName).then(cache => {

            return cache.addAll(cacheFiles);
        })
    );
});

/**
 * - Activate event
 */
self.addEventListener('activate', event => {

    console.log('ServiceWorker Activated');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(cacheNames.map(thisCacheName => {
                if (thisCacheName !== cacheName) {

                    return caches.delete(thisCacheName);
                }
            }));
        })
    );
});


/**
 * - Fetch event
 */
self.addEventListener('fetch', event => {

    event.respondWith(
        caches.open(cacheName).then(cache => {
            return cache.match(event.request).then(response => {
                console.log("ServiceWorker Found in Cache", event.request.url, response);
                return response || fetch(event.request).then(response => {
                    console.log('ServiceWorker not Found in Cache, need to search in the network', event.request.url);
                    cache.put(event.request, response.clone());
                    console.log('ServiceWorker New Data Cached', event.request.url);
                    return response;
                });
            });
        })
    );
});