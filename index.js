'use strict'

const express = require('express')
const helmet = require('helmet')
const puppeteer = require('puppeteer')
require('dotenv').config()

const app = express()

const port = process.env.NODE_PORT || 3000

app.use(helmet())
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '20mb' }))

const getRandomFileName = () => {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '')
  const random = ('' + Math.random()).substring(2, 8)
  return timestamp + random
}

const getPDF = async ({ htmlContent, pdfName, pdfFormat = 'A4' }) => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox'],
    timeout: 10000,
  })

  const page = await browser.newPage()
  await page.setContent(htmlContent)

  const pdfParams = {
    path: pdfName || `${getRandomFileName()}.pdf`,
    format: pdfFormat,
  }
  const pdfFile = await page.pdf(pdfParams)

  await page.close()
  await browser.close()

  return pdfFile
}

app.get('/pdf', async (req, res, next) => {
  res.contentType('application/pdf')
  try {
    console.log('req', req.body)
    if (!req?.body?.htmlContent) throw `htmlContent is required`
    const pdfFile = await getPDF(req.body)
    return res.send(pdfFile)
  } catch (error) {
    console.error(error)
    return res.send(error)
  }
})

app.get('/', (req, res) => {
  console.log('heee')
  res.send('<h1>Hello World!</h1>')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
