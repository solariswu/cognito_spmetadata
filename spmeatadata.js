exports.handler = async (event) => {
    
    var aws = require('aws-sdk');
    aws.config.logger = console;
    
    console.log('userpool_id', event.userpool_id);
    
    const userpool_id = event.userpool_id;
    const region = userpool_id.split('_')[0]; 
    console.log ('region', region);
    
    const slo_enabled = event.slo_enabled;
    console.log("slo_enabled:", slo_enabled);

    const CognitoIdentityServiceProvider = aws.CognitoIdentityServiceProvider;
    const client = new CognitoIdentityServiceProvider({ apiVersion: '2016-04-19', region });
    
    const params = {
        UserPoolId : userpool_id,
    }    

    // TODO implement
    let response = {
        statusCode: 501,
        body: 'Error',
    };

    try {
        const getSigningCertificate = await client.getSigningCertificate(params).promise();
        const userpooldetails = await client.describeUserPool(params).promise();

        const date = new Date()
    
        date.setDate(date.getDate() + 365);
        
        const domain = userpooldetails.UserPool.CustomDomain ? userpooldetails.UserPool.CustomDomain : (userpooldetails.UserPool.Domain + '.auth.' + region + '.amazoncognito.com');
        
            let xml_content = '';
            
            xml_content = '<?xml version="1.0"?><md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" validUntil="';
            xml_content = xml_content + date.toISOString();
            xml_content  = xml_content + '" cacheDuration="PT604800S" entityID="urn:amazon:cognito:sp:';
            xml_content  = xml_content + userpool_id;
            xml_content  = xml_content + '"><md:SPSSODescriptor AuthnRequestsSigned="false" WantAssertionsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol"><md:KeyDescriptor use="signing"><ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#"><ds:X509Data><ds:X509Certificate>'
            xml_content  = xml_content + getSigningCertificate.Certificate;
            xml_content  = xml_content + '</ds:X509Certificate></ds:X509Data></ds:KeyInfo></md:KeyDescriptor><md:NameIDFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:persistent</md:NameIDFormat><md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://';
            xml_content  = xml_content + domain;
            xml_content  = xml_content + '/saml2/idpresponse" index="1"/>';
            if (slo_enabled.trim().toLowerCase() === "true") {
                xml_content  = xml_content + '<md:SingleLogoutService Location="https://';
                xml_content  = xml_content + domain;
                xml_content  = xml_content + '/saml2/logout" Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"/>';
            }
            xml_content  = xml_content + '</md:SPSSODescriptor></md:EntityDescriptor>';
            
            // TODO implement
            response = {
                statusCode: 200,
                body: JSON.stringify( xml_content ),
            };
        
    }
    catch (err) {
        console.log('getSigningCertificate error:', err);
        console.log('RequestId: ' + this.requestId);
    }

    return response;
};
