import { Response } from 'express'
import { RequestExtended } from '@shared/types'
import { asyncWrapper, getUnlockableContentByISRC, verifySignatureForUnlockableContent } from '@shared/helpers'

interface RevealRequest {
  isrc: string
  address: string
  signature: string
}

async function revealUnlockableContent(req: RequestExtended, res: Response): Promise<unknown> {
  // const useCookie = typeof req.body.cookie !== 'undefined' ? req.body.cookie : true

  if(!verifySignatureForUnlockableContent(req))
  {
    return res.boom.badImplementation('Invalid Session')
  }

  const {address, isrc} = req.body as RevealRequest

  let response = await getUnlockableContentByISRC(isrc)

  if(response?.has_unlockable_content)
  {
    console.log(address)
    return res.send({"data":response?.unlockable_url})
  }
  return res.boom.badImplementation('Invalid Session')
}

export default asyncWrapper(revealUnlockableContent)
