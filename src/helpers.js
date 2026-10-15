import { readFile, writeFile } from 'node:fs/promises'

export function getIdFromUrl(request) {
  console.log('request.url:', request.url)
  const segments = request.url.split('/')

  if (segments.length !== 3) return null
  if (segments[2] === '') return null

  return segments[segments.length - 1]
}

export async function readTextFile() {
  try {
    const data = await readFile('src/text.txt', 'utf8')
    // console.log('data:', data)
    return data
  } catch (err) {
    console.error('Error:', err)
  }
}

export async function writeTextFile(data) {
  try {
    await writeFile('src/text.txt', data, 'utf8')
  } catch (err) {
    console.error('Error:', err)
    throw err
  }
}
