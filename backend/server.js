const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// === SQL Server Configuration ===
const dbConfig = {
    user: 'sa',
    password: 'skylz256',
    server: 'DYLAN256\\JENNY', // Note the double backslash
    database: 'CaltechDB',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

// === Connect to SQL Server ===
sql.connect(dbConfig).then(pool => {
    if(pool.connected) console.log("Connected to SQL Server");

    // ===== Blog Posts =====
    app.get('/api/posts', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT * FROM BlogPosts ORDER BY DateCreated DESC');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // ===== Testimonials =====
    app.get('/api/testimonials', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT * FROM Testimonials ORDER BY DateCreated DESC');
            res.json(result.recordset);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // ===== Contact Form =====
    app.post('/api/contact', async (req, res) => {
        try {
            const { name, email, subject, message } = req.body;
            await pool.request()
                .input('name', sql.NVarChar, name)
                .input('email', sql.NVarChar, email)
                .input('subject', sql.NVarChar, subject)
                .input('message', sql.NVarChar, message)
                .query(`INSERT INTO Contacts (Name, Email, Subject, Message)
                        VALUES (@name, @email, @subject, @message)`);
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    });

}).catch(err => console.log('DB Connection Failed:', err));

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
