import { getCachedData, serializeCache } from './cachingFetch'
import express from 'express'

const app = express()

app.get('/', (req, res) => {
	let data
	//  data = getCachedData(url)
	const serializedCache = serializeCache()

	res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Preloaded Data</title>
    </head>
    <body>
      <div id="root">
        <h1>Data from Server</h1>
        <pre id="preloaded-data">${JSON.stringify(data, null, 2)}</pre>
      </div>
      <script>
        window.__PRELOADED_DATA__ = ${JSON.stringify(data)};
        window.__SERIALIZED_CACHE__ = '${serializedCache}';
      </script>
    </body>
    </html>
  `)
})
