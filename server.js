const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('.')); // Serve HTML, CSS, JS files

// In-memory storage (replace with database later)
let queries = [];
let queryId = 1;

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API: Submit query
app.post('/api/queries', (req, res) => {
    const { name, email, product, category, details } = req.body;
    
    const newQuery = {
        id: queryId++,
        name,
        email,
        product,
        category,
        details,
        timestamp: new Date().toISOString(),
        status: 'new'
    };
    
    queries.push(newQuery);
    console.log('New query received:', newQuery);
    
    res.json({ 
        success: true, 
        message: 'Query submitted successfully! We\'ll respond within 24h.',
        queryId: newQuery.id 
    });
});

// API: Get all queries (admin dashboard later)
app.get('/api/queries', (req, res) => {
    res.json(queries);
});

// API: Mark query as read
app.patch('/api/queries/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const query = queries.find(q => q.id === id);
    if (query) {
        query.status = 'read';
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Query not found' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📋 Queries will appear in terminal`);
});
