alert("huhuhu");

var ciphertext = CryptoJS.AES.encrypt('my message', 'manav');
 
console.log("->", ciphertext)
console.log("------------")
console.log(ciphertext.toString())
// Decrypt
var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'manav');

var plaintext = bytes.toString(CryptoJS.enc.Utf8);
 
console.log(plaintext);