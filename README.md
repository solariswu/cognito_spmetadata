# cognito_spmetadata

lambda source code of generating cognito userpool's SP meta data file from the same account. 

### Input params: 
+ userpool_id
+ sloEnabled : 
  + True - Single Logout enabled
  + False - Single Logout disabled
+ cacheDuration : 
  + Int : number of days used for validUntil and cacheDuration

### Output:
+ statusCode
+ data : escaped Json format xml metaData

It can be integrated with APIGateway to expose as an Endpoint of generating userpool SP metadata file. 

### Example after integrated with APIGateway

+ Request
curl -X GET 'https://api.yourapigatewaydomain.com/saml/metadata/us-east-1_youruserpoolid?sloEnabled=True&cacheDuration=10'

+ Response

```json
{"statusCode":200,
"body":"\"<?xml version=\\\"1.0\\\"?><md:EntityDescriptor xmlns:md=\\\"urn:oasis:names:tc:SAML:2.0:metadata\\\" validUntil=\\\"2022-07-01T03:56:55.737Z\\\" cacheDuration=\\\"PT14400M\\\" entityID=\\\"urn:amazon:cognito:sp:us-east-1_youruserpoolid\\\"><md:SPSSODescriptor AuthnRequestsSigned=\\\"false\\\" WantAssertionsSigned=\\\"false\\\" protocolSupportEnumeration=\\\"urn:oasis:names:tc:SAML:2.0:protocol\\\"><md:KeyDescriptor use=\\\"signing\\\"><ds:KeyInfo xmlns:ds=\\\"http://www.w3.org/2000/09/xmldsig#\\\"><ds:X509Data><ds:X509Certificate>MIICxzCCAa+gAwIBxxxxxxxxxx==</ds:X509Certificate></ds:X509Data></ds:KeyInfo></md:KeyDescriptor><md:NameIDFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:persistent</md:NameIDFormat><md:AssertionConsumerService Binding=\\\"urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST\\\" Location=\\\"https://domain.auth.us-east-1.amazoncognito.com/saml2/idpresponse\\\" index=\\\"1\\\"/><md:SingleLogoutService Location=\\\"https://domain.auth.us-east-1.amazoncognito.com/saml2/logout\\\" Binding=\\\"urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST\\\"/></md:SPSSODescriptor></md:EntityDescriptor>\""}
```

