const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '',
  database: 'plantdb'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1); 
  } else {
    console.log('Connected to the MySQL database');
  }
});

app.listen(3003, () => {
  console.log("Server is running on port 3003");
});

app.post('/register', (req, res) => {
  const { Email, UserName, Password } = req.body;
  const SQL = 'INSERT INTO users(email, username, password) VALUES (?, ?, ?)';
  const values = [Email, UserName, Password];
  
  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({ error: 'Database query error' });
    } else {
      console.log('User inserted successfully!');
      res.send({ message: 'User added!' });
    }
  });
});

app.post('/addEmployee', (req, res) => {
  const { empID, name, phone,role , salary } = req.body;
  const SQL = 'INSERT INTO employee VALUES (?, ?, ?, ?, ?)';
  const values = [empID, name, phone,role , salary];
  
  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({ error: 'Database query error' });
    } else {
      console.log('Employee inserted successfully!');
      res.send({ message: 'Employee added!' });
    }
  })
})


app.post('/login', (req, res)=>{
  const sentloginUserName = req.body.LoginUserName
  const sentLoginPassword = req.body.LoginPassword

  const SQL = 'SELECT * FROM users WHERE username = ? AND password = ?'
  const values = [sentloginUserName, sentLoginPassword]

  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({ error: 'Database query error' });
    }
    if(results.length > 0){
      res.send({message: `Login Successfull`})
    }
    else{
      res.send({message: `Credentials do not match!`})
    }
  })
})

app.get('/employees', (req, res) => {
  const SQL = 'SELECT empID, name, phone, role, salary FROM employee';

  db.query(SQL, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      res.status(500).send({ error: 'Database query error' });
    } else {
      res.send(results);
    }
  });
});

app.get('/employees/salarySum', (req, res) => {
  const SQL = 'SELECT SUM(salary) AS totalSalary FROM employee';

  db.query(SQL, (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      res.status(500).send({ error: 'Database query error' });
    } else {
      res.send({ totalSalary: results[0].totalSalary });
    }
  });
});

app.get('/employees/employeeCount', (req, res) => {
  const SQL = 'SELECT count(*) AS employeeSum FROM employee';

  db.query(SQL, (err, results) => {
    if (err) {
      console.error('Error fetching employee count:', err);
      res.status(500).send({ error: 'Database query error' });
    } else {
      res.send({ employeeSum: results[0].employeeSum });
    }
  });
});

app.get('/employees/userCount', (req, res) => {
  const SQL = 'SELECT count(*) AS userCount FROM users';

  db.query(SQL, (err, results) => {
    if (err) {
      console.error('Error fetching employee count:', err);
      res.status(500).send({ error: 'Database query error' });
    } else {
      res.send({ userCount: results[0].userCount });
    }
  });
});



// Backend endpoint
app.delete('/employees/:empID', async (req, res) => {
  const empID = req.params.empID;
  
  // Validate empID
  if (!empID) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }

  const SQL = 'DELETE FROM employee WHERE empID = ?';
  
  try {
    // Using promise-based query for better error handling
    const result = await new Promise((resolve, reject) => {
      db.query(SQL, [empID], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    // Check if any row was actually deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Employee deleted successfully',
      deletedEmpID: empID 
    });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete employee',
      details: err.message 
    });
  }
});



app.get('/employees/sales', (req, res) => {
  const SQL = 'SELECT SUM(price) from orders';

  db.query(SQL, (err, results) => {
    if (err) {
      console.error('Error fetching sales:', err);
      res.status(500).send({ error: 'Database query error' });
    } else {
      res.send({ sales: results[0]['SUM(price)'] });  // Adjust to match your result structure
    }
  });
});

// app.post('/cart', (req, res) => {

//   const { pid, quantity } = req.body;
//   const SQL = 'INSERT INTO orders(quantity, pid) VALUES ( ?, ?)';
//   const values = [quantity, pid];
  
//   db.query(SQL, values, (err, results) => {
//     if (err) {
//       console.error('Error executing query:', err);
//       res.status(500).send({ error: 'Database query error' });
//     } else {
//       console.log('!!');
//       res.send({ message: 'cart added!' });
//     }
//   });
// });

app.post('/cart', (req, res) => {
  const {  quantity,pid, username } = req.body;

  // Query to insert the order and get the username with the highest id in one go
  const SQL = `
    INSERT INTO orders (quantity, pid, username) values (?, ?, ?)`;

  const values = [quantity, pid,username];

  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send({ error: 'Database query error' });
    } else {
      console.log('Order added to cart!');
      res.send({ message: 'Cart added!' });
    }
  });
});


app.get('/getcart', (req, res) => {
  const SQL = 'SELECT quantity, pname, price FROM orders';

  db.query(SQL, (err, results) => {
    if (err) {
      console.error('Error fetching cart:', err);
      res.status(500).send({ error: 'Database query error' });
    } else {
      res.send(results);
    }
  });
});


app.get('/username', (req, res) => {
  const SQL = 'SELECT username, id FROM users ORDER BY id DESC LIMIT 1; ';

  db.query(SQL, (err, results) => {
    if (err) {
      console.error('Error fetching cart:', err);
      res.status(500).send({ error: 'Database query error' });
    } else {
      res.send(results);
    }
  });
});


app.get('/orders/invoices', (req, res) => {
  const SQL = 'SELECT o.oid,o.username,SUM(o.price) as total_amount FROM orders o GROUP BY o.username, o.oid ORDER BY o.oid DESC;';

  db.query(SQL, (err, results) => {
    if (err) {
      console.error('Error fetching invoice:', err);
      res.status(500).send({ error: 'Database query error' });
    } else {
      res.send(results);
    }
  });
});

app.get('/orderdata', (req, res) => {
  const SQL = 'SELECT MAX(pid) AS pid, SUM(quantity) AS quantity, pname, SUM(price) as price, stock FROM orders GROUP BY pname';

  db.query(SQL, (err, results) => {
    if (err) {
      console.error('Error fetching order:', err);
      res.status(500).send({ error: 'Database query error' });
    } else {
      res.send(results);
    }
  });
});

