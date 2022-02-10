import { Router } from 'express'
// import { Strategy } from 'passport-twitter'
import { Strategy } from 'passport-twitter-oauth2'
import { initProvider } from './utils'
import { PROVIDERS, COOKIES } from '@shared/config'

export default (router: Router): void => {
  const options = PROVIDERS.twitter

  initProvider(
    router,
    'twitter',
    Strategy,
    {
      userProfileURL:
        'https://api.twitter.com/2/account/verify_credentials.json?include_email=true',
      includeEmail: true
    },
    (req, res, next) => {
      if (!PROVIDERS.twitter) {
        return res.boom.badImplementation(
          `Please set the TWITTER_ENABLED env variable to true to use the auth/providers/twitter routes.`
        )
      } else if (!options?.consumerKey || !options?.consumerSecret || !COOKIES.SECRET) {
        return res.boom.badImplementation(`Missing environment variables for Twitter OAuth.`)
      } else if (!COOKIES.SECRET) {
        return res.boom.badImplementation(
          'Missing COOKIE_SECRET environment variable that is required for Twitter OAuth.'
        )
      } else {
        return next()
      }
    }
  )
}
