const forge = require('./lib/index.js');
const fs = require('fs');
const crypto = require("crypto");

function _forge(){};

let cert_pem = __dirname + '\\cert\\cert.pem';
let privateKey_pem = __dirname + '\\cert\\privateKey.pem';
let publicKey_pem = __dirname + '\\cert\\publicKey.pem';
let path = "./cert";

_forge.prototype.CreatePem = function() {    
    
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
            const publicKey = forge.pki.publicKeyToPem(keys.publicKey);
            const pem = forge.pki.certificateToPem(cert);

            fs.writeFileSync(cert_pem, pem, '', function (err) {
                if (err) {
                    console.log("[X]Create cert File Error:" + err);
                    return false;
                }                
            });

            fs.writeFileSync(publicKey_pem, publicKey, '', function (err) {
                if (err) {
                    console.log("[X]Create publicKey File Error:" + err);
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
        console.log("[X]Except: " + e.message);
        return false;
    }        
    return true;
};

_forge.prototype.RsaEnc = function (plainText) {
    let Result_Enc = "";
    const isExists = fs.existsSync(path);
    if (!isExists) {
        console.log("[X]No Exists Cert Path");
        console.log("[X]First, try CreatePem function");
        return Result_Enc;
    }
    try {
        let publicKey = forge.pki.publicKeyFromPem(fs.readFileSync(publicKey_pem, 'utf8'));
        Result_Enc = publicKey.encrypt(forge.util.encodeUtf8(plainText));
        return Result_Enc;

    } catch (e) {
        console.log("[X]Except: " + e.message);
        return Result_Enc;
    }
}

_forge.prototype.RsaDec = function (CyperText) {
    let Result_Dec = "";
    const isExists = fs.existsSync(path);
    if (!isExists) {
        console.log("[X]No Exists Cert Path");
        console.log("[X]First, try CreatePem function");
        return Result_Dec;
    }
    try {
        let privateKey = forge.pki.privateKeyFromPem(fs.readFileSync(privateKey_pem, 'utf8'));
        Result_Dec = forge.util.decodeUtf8(privateKey.decrypt(CyperText));
        return Result_Dec;

    } catch (e) {
        console.log("[X]Except: " + e.message);
        return Result_Dec;
    }
}

module.exports = _forge;
