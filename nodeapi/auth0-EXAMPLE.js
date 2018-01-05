// Auth0
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const jwtAuthz = require('express-jwt-authz');

// Authentication middleware. When used, the
// access token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
    // Dynamically provide a signing key
    // based on the kid in the header and 
    // the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: ``
    }),
  
    // Validate the audience and the issuer.
    audience: '',
    issuer: ``,
    algorithms: ['RS256']
});

//let checkScopeIsAdmin = jwtAuthz([ 'scope:admin' ]);


module.exports = {
//    jwt: jwt,
//    jwksRsa: jwksRsa,
//    jwtAuthz: jwtAuthz,
    checkJwt: checkJwt,
    checkScopeIs: {
        admin: jwtAuthz([ 'scope:admin' ])
    }
};
