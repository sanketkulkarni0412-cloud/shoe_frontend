const url = "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80&w=600";

console.log("Testing:", url);
fetch(url)
    .then(res => console.log('Status:', res.status))
    .catch(err => console.error('Error:', err.message));
