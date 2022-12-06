const forge = require('./lib/index.js');
const fs = require('fs');
const crypto = require("crypto");

function _forge(){};

_forge.prototype.CreatePem = function() {    

    let cert_pem = __dirname + '\\cert\\cert.pem';
    let privateKey_pem = __dirname + '\\cert\\privateKey.pem';

    let path = "./cert";
    const isExists = fs.existsSync( path );
    if( !isExists ) {
        fs.mkdirSync( path, { recursive: true } );
    }
    try {
        let cert_fileExists = fs.existsSync(cert_pem);
        let privateKey_fileExists = fs.existsSync(privateKey_pem);

         if ((!cert_fileExists) || (!privateKey_fileExists)) {
            const keys = forge.pki.rsa.generateKeyPair(2048);
            const cert = forge.pki.createCertificate();
            
            cert.publicKey = keys.publicKey;
        
            cert.serialNumber = '01' + crypto.randomBytes(19).toString("hex");
            cert.validity.notBefore = new Date();
            cert.validity.notAfter = new Date();
            cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
        
            var attrs = [
                { name: 'commonName', value: 'example.Host' }
                , { name: 'countryName', value: 'KR' }
                , { shortName: 'ST', value: 'Seoul' }
                , { name: 'localityName', value: 'myName' }
                , { name: 'organizationName', value: 'co.th' }
                , { shortName: 'OU', value: 'Test' }
                , { name: 'subjectAltName', value: '*.Injae.co.kr' }
            ];
            cert.setSubject(attrs);
            cert.setIssuer(attrs);
            cert.sign(keys.privateKey);
                    
            const privateKey = forge.pki.privateKeyToPem(keys.privateKey);
            const pem = forge.pki.certificateToPem(cert);

            fs.writeFileSync(cert_pem, pem, '', function (err) {
                if (err) {
                    console.log("[X]Create cert File Error:" + err);
                    return false;
                }                
            });

             fs.writeFileSync(privateKey_pem, privateKey, '', function (err) {
                 if (err) {
                     console.log("[X]Create privateKey File Error:" + err);
                     return false;
                 }
             });

             console.log('[!]pem files Create');
        } else {
            console.log('[!]pem files Exist');
        }

    } catch (e) {
        consoel.log("[X]Except: " + e.message);
        return false;
    }        
    return true;
};

module.exports = _forge;