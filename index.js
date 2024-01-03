const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');


app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    key: "userId",
    secret: "matthewsitson000835763",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: new Date(Date.now() + 8 * 3600000),
    }
}));

const db = mysql.createPool({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Capstone'

});

app.post('/createNewUser', (req, res) => {
    
    const Username = req.body.Username;
    const Password = req.body.Password;
    const FirstName = req.body.FirstName;
    const LastName = req.body.LastName;
    const Role = req.body.Role;
    
    
    db.query(
        "INSERT INTO users (Username, Password, FirstName, LastName, Role) VALUES (?, ?, ?, ?, ?)", 
        [Username, Password, FirstName, LastName, Role], 
        (err, result) => {
            if(err){
                console.log(err);
            }    });
});

app.post('/createNewTask', (req, res) => {
    const { TaskName, Description, AssignedTo, StartDate, EndDate, Status } = req.body;
    
    db.query(
        "INSERT INTO tasks (TaskName, Description, AssignedTo, StartDate, EndDate, Status) VALUES (?, ?, ?, ?, ?, ?)", 
        [TaskName, Description, AssignedTo, StartDate, EndDate, Status], 
        (err, result) => {
            if(err){
                console.error(err);
                res.status(500).send('Error occurred while creating the task');
            } else {
                // If no error, send a success response
                res.status(201).send({ message: 'Task created successfully', taskId: result.insertId });
            }
        }
    );
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            console.error("Session destruction error:", err);
            res.status(500).send('Error occurred while logging out');
        } else {
            // Clear the cookie in the client's browser
            res.clearCookie('userId');
            res.send("Logged out successfully");
        }
    });
});



app.post('/login', (req, res) => {
    const Username = req.body.Username;
    const Password = req.body.Password; 
    
    db.query(
        "SELECT UserID, Username, FirstName, LastName, Role FROM users WHERE username = ? AND password = ?", 
        [Username, Password], 
        (err, result) => {
            if(err){
                res.send({err: err});
                
            }
            if(result.length > 0){
                req.session.user = result;
                res.send(result);
                
            }else{
                res.send({message: "Username or password is incorrect."});
                
            }
            
    });
});

app.get("/login", (req, res) => {
    if(req.session.user){
        res.send({loggedIn: true, user: req.session.user});
    }else{
        res.send({loggedIn: false});
    }
});

app.get("/users", (req, res) => {
    db.query("SELECT UserID, FirstName, LastName FROM users WHERE FirstName != 'admin'", (err, result) => {
        if (err) {
            console.error(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/tasks", (req, res) => {
    const query = `
        SELECT t.TaskID,
            t.TaskName,
            t.Description,
            CONCAT(u.FirstName, ' ', u.LastName) AS assignedUser,
            t.StartDate,
            t.EndDate,
            t.Status
        FROM capstone.tasks t
        JOIN capstone.users u ON t.AssignedTo = u.UserID;
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.send('Error occurred while fetching tasks');
        } else {
            res.send(result);
        }
    });
});

app.delete('/tasks/:taskId', (req, res) => {
    const taskId = req.params.taskId; // Extracting TaskID from the URL parameter

    const query = "DELETE FROM capstone.tasks WHERE TaskID = ?";
    db.query(query, [taskId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error occurred while deleting the task');
        } else {
            res.status(200).send('Task deleted successfully');
        }
    });
});

app.get('/tasks/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    const query = "SELECT * FROM tasks WHERE TaskID = ?";
    
    db.query(query, [taskId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error occurred while fetching the task');
        } else {
            res.status(200).json(result[0]); // Assuming result[0] contains the task data
        }
    });
});

app.put('/tasks/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    const { TaskName, Description, AssignedTo, StartDate, EndDate, Status } = req.body;
    
    const query = "UPDATE tasks SET TaskName = ?, Description = ?, AssignedTo = ?, StartDate = ?, EndDate = ?, Status = ? WHERE TaskID = ?";
    
    db.query(query, [TaskName, Description, AssignedTo, StartDate, EndDate, Status, taskId], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error occurred while updating the task');
        } else {
            res.status(200).send('Task updated successfully');
        }
    });
});

app.get('/mytasks', (req, res) => {
    if (req.session.user && req.session.user[0]) {
        const userId = req.session.user[0].UserID;

        const query = `
            SELECT t.TaskID,
                t.TaskName,
                t.Description,
                CONCAT(u.FirstName, ' ', u.LastName) AS assignedUser,
                t.StartDate,
                t.EndDate,
                t.Status
            FROM capstone.tasks t
            JOIN capstone.users u ON t.AssignedTo = u.UserID
            WHERE t.AssignedTo = ?;
        `;

        db.query(query, [userId], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error occurred while fetching tasks');
            } else {
                res.send(result);
            }
        });
    } else {
        res.status(403).send('Not logged in');
    }
});

app.post('/createDiscussionPost', (req, res) => {
    const { title, content } = req.body;
    const datePosted = new Date(); // Or format the date as needed

    if (req.session.user) {
        const userID = req.session.user[0].UserID; // Adjust based on how you store user data in session

        // Your query to insert the post into the database
        db.query("INSERT INTO discussion_posts (Title, Content, DatePosted, Author) VALUES (?, ?, ?, ?)", 
                 [title, content, datePosted, userID], 
                 (err, result) => {
                     if (err) {
                         res.status(500).send('Error creating post');
                     } else {
                         res.status(201).send('Post created successfully');
                     }
                 });
    } else {
        res.status(401).send('User not logged in');
    }
});

app.get('/discussionPosts', (req, res) => {
    let query = "SELECT * FROM discussion_posts";
    const queryParams = [];

    // Search filter
    if (req.query.search) {
        query += " WHERE Title LIKE ?";
        queryParams.push(`%${req.query.search}%`);
    }

    // Sort by DatePosted
    query += " ORDER BY DatePosted ";
    query += req.query.sort === 'asc' ? 'ASC' : 'DESC';

    db.query(query, queryParams, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error occurred while fetching discussion posts');
        } else {
            res.status(200).json(result);
        }
    });
});

app.get('/discussionPost/:postId', (req, res) => {
    const postId = req.params.postId;

    // Query to get the discussion post
    const postQuery = "SELECT p.*, u.Username AS Author, u.UserID FROM discussion_posts p JOIN users u ON p.Author = u.UserID WHERE p.PostID = ?";
    const commentsQuery = "SELECT c.*, u.Username AS Author FROM discussion_comments c JOIN users u ON c.Author = u.UserID WHERE c.ParentPost = ? ORDER BY c.DatePosted ASC";

    db.query(postQuery, [postId], (err, postResult) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error occurred while fetching the discussion post');
        }

        db.query(commentsQuery, [postId], (err, commentsResult) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error occurred while fetching comments');
            }

            res.status(200).json({ post: postResult[0], comments: commentsResult });
        });
    });
});

app.post('/addComment/:postId', (req, res) => {
    const postId = req.params.postId;
    const { reply } = req.body; // The content of the reply
    const datePosted = new Date(); // Current date

    if (req.session.user) {
        const userID = req.session.user[0].UserID; // Adjust based on your session structure

        db.query("INSERT INTO discussion_comments (Content, DatePosted, ParentPost, Author) VALUES (?, ?, ?, ?)", 
                 [reply, datePosted, postId, userID], 
                 (err, result) => {
                     if (err) {
                         console.error(err);
                         res.status(500).send('Error occurred while adding the comment');
                     } else {
                         res.status(201).send({ message: 'Comment added successfully' });
                     }
                 });
    } else {
        res.status(401).send('User not logged in');
    }
});




app.listen(3001, () => {
    console.log("running on port 3001")
});