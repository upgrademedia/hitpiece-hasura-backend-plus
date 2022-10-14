import { asyncWrapper } from '@shared/helpers'
import { Request, Response } from 'express'

import fs from 'fs'
import path from 'path'

async function progress(req: Request, res: Response): Promise<unknown> {
  try {
    const { fileName } = req.body

    if (!fileName) return res.status(400).send()

    if (!fs.existsSync(path.join(__dirname, `/progress/${fileName}.json`)))
    return res.status(200).send()

    const json = fs.readFileSync(path.join(__dirname, `/progress/${fileName}.json`))
    const data = json ? JSON.parse(json.toString()) : null

    return res.status(200).send(data)
  } catch (err) {
    console.error('Unable to track the uploading status')
    console.error(err)
    return res.status(400).send()
  }
}

export default asyncWrapper(progress)