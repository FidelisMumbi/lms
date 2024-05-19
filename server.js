const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { check, validationResult } = require('express-validator');
const app = express();

// ... existing code for session, connection, static files, middleware

// Define a Course representation for clarity
const Course = {
  tableName: 'courses',
  // ... existing course methods (if applicable)
};

// Define a User representation for clarity
const User = {
  tableName: 'users',
  // ... existing user methods
  getSelectedCourses: async function(userId, callback) {
    const sql = 'SELECT c.* FROM courses c JOIN user_course_selections ucs ON c.id = ucs.course_id WHERE ucs.user_id = ?';
    connection.query(sql, [userId], callback);
  }
};

// New table to store user course selections (assuming you don't have one already)
connection.query('CREATE TABLE IF NOT EXISTS user_course_selections (id INT PRIMARY KEY AUTO_INCREMENT, user_id INT NOT NULL, course_id INT NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (course_id) REFERENCES courses(id))', (err, result) => {
  if (err) throw err;
  console.log('user_course_selections table created (if not already existing)');
});

// Route to handle course selection
app.post('/api/select-course', (req, res) => {
  // Assuming user is authenticated and user ID is available in req.user
  const userId = req.user.id;
  const courseId = req.body.courseId;

  // Validate course ID (optional)

  connection.query('INSERT INTO user_course_selections (user_id, course_id) VALUES (?, ?)', [userId, courseId], (err, result) => {
    if (err) {
      console.error('Error selecting course: ' + err.message);
      return res.status(500).json({ error: 'Error selecting course' });
    }
    res.json({ message: 'Course selected successfully!' });
  });
});

// Route to retrieve user's selected courses
app.get('/api/user-courses', (req, res) => {
  // Assuming user is authenticated and user ID is available in req.user
  const userId = req.user.id;

  User.getSelectedCourses(userId, (err, results) => {
    if (err) {
      console.error('Error retrieving selected courses: ' + err.message);
      return res.status(500).json({ error: 'Error retrieving courses' });
    }
    res.json(results);
  });
});

// ... remaining routes (dashboard, course content, etc.)

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

