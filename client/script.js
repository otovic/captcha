import CryptoJS from 'crypto-js';

const algorithm = 'aes-256-cbc';
const key = CryptoJS.enc.Hex.parse('example'); // Same key used in the server
const iv = CryptoJS.lib.WordArray.random(16); // Random IV

const jsonObject = { token: "MORSKA SASA" };

async function sendData() {
    console.log('Sending data to server:', jsonObject);
    const jsonString = JSON.stringify(jsonObject.token);
    const encrypted = CryptoJS.AES.encrypt(jsonString, key, { iv });

    const response = await fetch('http://localhost:3000/your-endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: encrypted.toString() })
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Response from server:', data);
    } else {
        console.error('Failed to send encrypted token:', response.statusText);
    }
}