const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Create directory endpoint
app.post('/api/create', (req, res) => {
    const { dirName } = req.body;
    
    if (!dirName) {
        return res.status(400).json({ error: 'Directory name required' });
    }

    const safeDirName = dirName.replace(/[^a-z0-9-_]/gi, '');
    const dirPath = path.join(__dirname, 'storage', safeDirName);

    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            fs.writeFileSync(path.join(dirPath, 'index.html'), `<h1>${safeDirName}</h1><p>Directory created successfully</p>`);
            return res.json({ 
                url: `https://${req.headers.host}/storage/${safeDirName}`
            });
        }
        return res.status(400).json({ error: 'Directory exists' });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
});

// Serve static files
app.use('/storage', express.static(path.join(__dirname, 'storage')));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
