import http from 'node:http'
// import { readFile, writeFile } from 'node:fs/promises'
import { getIdFromUrl, readTextFile, writeTextFile } from './helpers.js'
let requestCounter = 0
const server = http.createServer(async (request, response) => {
  const chunks = []
  const message = []
  const infoMessage = []
  let count = 0
  let requestId = 0
  console.log('HTTP:start')
  if (request.url === '/' && request.method === 'GET') {
    response.end('This is log')
  } else if (request.url === '/file' && request.method === 'GET') {
    const res = await readTextFile()
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify(res))
  } else if (request.url === '/file' && request.method === 'POST') {
    request.on('data', (chunk) => {
      // console.log('chunk:', chunk)
      // console.log('typeof chunk:', typeof chunk)
      // console.log('chunk.length:', chunk.length)
      count += 1
      console.log('count:DATA', count)
      message.push(chunk)
    })

    request.on('end', async () => {
      const body = message.join('')
      console.log('count:END', count)
      try {
        await writeTextFile(body)
      } catch (err) {
        response.writeHead(500, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify({ status: 'error' }))
        return
      }
      response.end(body)
    })
    count = 10
    console.log('HTTP:ready')
  } else if (request.url === '/health' && request.method === 'GET') {
    response.setHeader('Content-Type', 'application/json')
    response.end(JSON.stringify({ status: 'ok' }))
  } else if (request.url === '/users' && request.method === 'POST') {
    console.log('11111')
    request.on('data', (chunk) => {
      chunks.push(chunk)
    })
    request.on('end', () => {
      const body = chunks.join('')
      console.log('body:', body)
      response.end(body)
    })
  } else if (request.url === '/request-info' && request.method === 'POST') {
    let chunkCount = 0
    let totalBytes = 0
    requestCounter += 1
    const requestId = requestCounter
    request.on('data', (chunk) => {
      chunkCount += 1
      totalBytes += chunk.byteLength
      infoMessage.push(chunk)
    })

    request.on('end', () => {
      response.setHeader('Content-Type', 'application/json')
      console.log('infoMessage:', infoMessage)
      const body = infoMessage.join('')

      response.end(
        JSON.stringify({
          requestId: requestId,
          chunkCount: chunkCount,
          byteCount: totalBytes,
          message: body,
        })
      )
    })
  } else if (request.url === '/users' && request.method === 'GET') {
    response.end('This is users GET')
  } else if (request.url === '/test' && request.method === 'GET') {
    response.end('This is test')
  } else if (
    request.url.split('/').length === 3 &&
    request.url.split('/')[1] === 'test' &&
    request.method === 'GET'
  ) {
    response.end(`This is test/${getIdFromUrl(request)}`)
  } else if (
    request.url.split('/').length === 3 &&
    request.url.split('/')[1] === 'users' &&
    request.method === 'GET'
  ) {
    response.end(`This is users/${getIdFromUrl(request)}`)
  } else {
    response.writeHead(404, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ status: 'error' }))
  }
})

server.listen(3000)
