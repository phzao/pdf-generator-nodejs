'use strict'

const express = require('express')
const helmet = require('helmet')
const puppeteer = require('puppeteer')

const app = express()

const port = process.env.NODE_PORT || 3000

app.use(helmet())

const getRandomFileName = () => {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '')
  const random = ('' + Math.random()).substring(2, 8)
  return timestamp + random
}

const getPDF = async ({ pdfName, pdfFormat = 'A4', htmlContent }) => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox'],
    timeout: 10000,
  })

  const page = await browser.newPage()

  await page.setContent(htmlContent)

  const pdfFile = await page.pdf({
    path: pdfName || `${getRandomFileName()}.pdf`,
    format: pdfFormat,
  })

  await page.close()
  await browser.close()

  return pdfFile
}

app.get('/download/pdf', async (req, res, next) => {
  res.contentType('application/pdf')
  try {
    if (!req?.body?.htmlContent) throw `htmlContent is required`

    const pdfFile = await getPDF(req.body)
    return res.send(pdfFile)
  } catch (error) {
    console.error(error)
  }
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
