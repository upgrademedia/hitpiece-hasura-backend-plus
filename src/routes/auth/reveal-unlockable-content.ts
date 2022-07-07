import { Response } from 'express'
import { RequestExtended } from '@shared/types'
import { asyncWrapper, getISRCUnlockableContentByISRC, verifySignatureForUnlockableContent } from '@shared/helpers'
import { providers, Contract } from "ethers"
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

  
  try {
    let response = await getISRCUnlockableContentByISRC(isrc)
  
    
    const contractAddress = response.contract?.replace("\\x", "0x")
    const contractAbi = response.contractByContract?.contract_abi?.abi
    const tokenId = response?.token_id

    if(contractAddress)
    {
      const provider = new providers.JsonRpcProvider(process.env.RPC_PROVIDER)
      const contract = new Contract(
        contractAddress,
        contractAbi,
        provider
      )
      const ownerAddress = await contract.ownerOf(
        tokenId,
      )
      if(address.toLowerCase() == ownerAddress.toLowerCase())
      {
        res.cookie('nonce', null)
        return res.send({"data":response?.unlockable_url})
      }
    }
  }catch(e)
  {
      console.log("NFT Owner Validation Error:", e)
  }
  return res.boom.badImplementation('Invalid Owner')
}

export default asyncWrapper(revealUnlockableContent)
