import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
// const jwksUrl = 'https://dev-suopy9ma.us.auth0.com/.well-known/jwks.json'

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJEBi29dKLl8w8MA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1zdW9weTltYS51cy5hdXRoMC5jb20wHhcNMjAwODAyMDA0ODA0WhcN
MzQwNDExMDA0ODA0WjAkMSIwIAYDVQQDExlkZXYtc3VvcHk5bWEudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlPQye2nTHVkcdNDv
ksuInyWeVyJkUStfnXpFW44KEl4wUKWhW6i/lf5zKHxFquKiCSLaZUg2VKO8rjJo
5ijjjNlRaVg19+FUV0HX60zw6x3FEZBj7HzfP1KSBBFm2kr/dIOFKSigIQDzgmen
ck+6Y/jnrIEeE1nEV65KP4UDiOwjOHJzmAaWrizwGqrG45eh1DhcW0O1JCEaygae
mJecnAAqkG6OJT5t+8LHghaA5AmDgLTmBFUDQdfdJynG7mApXeOc30woVkpcig3j
UAg5MIs08YnniwaUXJYi8bw2k2ZBDV7TqJD4n6dkCx7IX8qsRLf2CS4ccFnhJeGq
ghw9EwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTGdx4hW/ak
yKBCAnEorTNquJ/UtDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AD9YDDgBP+J+rPB3gfei9v0/pA1fRVGwO97U0AL6F8jqw7PmSetbZ9XCszks+vyU
hgRCGOpbOn6Jj9Kkqo2yTUGZ31yK+duraAA+HVNKSMSTv7B8U4xG1US6gLM0mPZE
WZGEGaUkLjoM+LZubeWYelsbZr0fwauzZrCXvNTTLu+GkzuqX5Kz1PZXRYk/Xonp
NFXnIB9AreIruHv0dtty76L8q1G14G5VtnTm4D/2KNIZUesWIcZ4fjj0FRh9Gvyl
82TKefLwFa93ynL9s13sLr1ZckphfOySN+6aiL+ba2xXWhDsTNS7YqZND1xyKb+7
VPvID/+PdVAJyu1aICnf7K4=
-----END CERTIFICATE-----` 

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  
  logger.info(token)
  logger.info(jwt)

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
