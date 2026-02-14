const url = 'http://127.0.0.1:5000/';

console.log('Testing connection to:', url);

// Using global fetch (Node 18+)
fetch(url)
    .then(res => {
        console.log('Status:', res.status);
        return res.text();
    })
    .then(text => console.log('Response:', text))
    .catch(err => {
        console.error('Connection Failed:', err.cause || err.message);
    });
