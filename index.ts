import * as pulumi from '@pulumi/pulumi'
import * as aws from '@pulumi/aws'
import * as fs from 'fs'
const fetch = require('node-fetch')

const s3Bucket = new aws.s3.Bucket('s3Bucket', {
  acl: 'private',
  tags: {
    Name: 'My bucket'
  }
})

async function getBtcPrice (): Promise<string> {
  const response = await fetch(
    'https://api.coindesk.com/v1/bpi/currentprice.json'
  )
  const data = await response.json()
  return JSON.stringify(data)
}

async function main () {
  const btcPriceInfo = await getBtcPrice()
  fs.writeFileSync('currentBtcPrices.json', btcPriceInfo)

  const currentBtcPrices = new aws.s3.BucketObject('currentBtcPrices', {
    bucket: s3Bucket,
    key: 'currentBtcPrices.json',
    source: new pulumi.asset.FileAsset('currentBtcPrices.json')
  })
}

main()
