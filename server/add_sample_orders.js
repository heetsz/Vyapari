const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./plantdb.sqlite', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  } else {
    console.log('Connected to the SQLite database');
  }
});

// Sample orders with proper data structure
const sampleOrders = [
  // John's orders
  { quantity: 2, pid: 1, username: 'john_doe', pname: 'Snake Plant', price: 299, stock: 10 },
  { quantity: 1, pid: 4, username: 'john_doe', pname: 'Aloe Vera', price: 249, stock: 15 },
  
  // Jane's orders
  { quantity: 3, pid: 3, username: 'jane_smith', pname: 'Money Plant', price: 199, stock: 20 },
  { quantity: 1, pid: 5, username: 'jane_smith', pname: 'Rose Plant', price: 349, stock: 8 },
  { quantity: 2, pid: 8, username: 'jane_smith', pname: 'Plant Food', price: 149, stock: 25 },
  
  // Admin's orders (for testing)
  { quantity: 1, pid: 2, username: 'admin', pname: 'Peace Lily', price: 399, stock: 12 },
  { quantity: 4, pid: 6, username: 'admin', pname: 'Cactus', price: 199, stock: 18 },
  
  // Additional orders for better data
  { quantity: 2, pid: 7, username: 'john_doe', pname: 'Bamboo Plant', price: 299, stock: 14 },
  { quantity: 1, pid: 1, username: 'jane_smith', pname: 'Snake Plant', price: 299, stock: 10 },
  { quantity: 3, pid: 4, username: 'admin', pname: 'Aloe Vera', price: 249, stock: 15 },
  
  // More diverse orders
  { quantity: 1, pid: 2, username: 'john_doe', pname: 'Peace Lily', price: 399, stock: 12 },
  { quantity: 2, pid: 5, username: 'admin', pname: 'Rose Plant', price: 349, stock: 8 },
  { quantity: 1, pid: 3, username: 'admin', pname: 'Money Plant', price: 199, stock: 20 },
  { quantity: 2, pid: 8, username: 'john_doe', pname: 'Plant Food', price: 149, stock: 25 },
  { quantity: 1, pid: 7, username: 'jane_smith', pname: 'Bamboo Plant', price: 299, stock: 14 }
];

function insertSampleOrders() {
  console.log('Inserting sample orders...');
  
  const insertPromises = sampleOrders.map((order, index) => {
    return new Promise((resolve, reject) => {
      const SQL = 'INSERT INTO orders (quantity, pid, username, pname, price, stock) VALUES (?, ?, ?, ?, ?, ?)';
      const values = [order.quantity, order.pid, order.username, order.pname, order.price, order.stock];
      
      db.run(SQL, values, function(err) {
        if (err) {
          console.error(`Error inserting order ${index + 1}:`, err);
          reject(err);
        } else {
          console.log(`✓ Inserted order ${index + 1}: ${order.quantity}x ${order.pname} for ${order.username}`);
          resolve(this.lastID);
        }
      });
    });
  });
  
  Promise.all(insertPromises)
    .then(() => {
      console.log('\n✅ All sample orders inserted successfully!');
      
      // Verify the data
      console.log('\n=== Verification ===');
      
      // Check total orders
      db.get('SELECT COUNT(*) as count FROM orders', (err, result) => {
        if (err) {
          console.error('Error checking orders count:', err);
        } else {
          console.log(`Total orders in database: ${result.count}`);
        }
      });
      
      // Check orders by user
      db.all('SELECT username, COUNT(*) as order_count, SUM(price * quantity) as total_spent FROM orders GROUP BY username', (err, results) => {
        if (err) {
          console.error('Error checking user orders:', err);
        } else {
          console.log('\nOrders by user:');
          results.forEach(user => {
            console.log(`  ${user.username}: ${user.order_count} orders, ₹${user.total_spent} total`);
          });
        }
      });
      
      // Check product sales
      db.all('SELECT pname, SUM(quantity) as total_sold, SUM(price * quantity) as revenue FROM orders GROUP BY pname ORDER BY revenue DESC', (err, results) => {
        if (err) {
          console.error('Error checking product sales:', err);
        } else {
          console.log('\nTop selling products:');
          results.forEach(product => {
            console.log(`  ${product.pname}: ${product.total_sold} units, ₹${product.revenue} revenue`);
          });
        }
      });
      
      // Check recent orders for dashboard
      db.all('SELECT oid, username, pname, quantity, price, (price * quantity) as total FROM orders ORDER BY oid DESC LIMIT 5', (err, results) => {
        if (err) {
          console.error('Error checking recent orders:', err);
        } else {
          console.log('\nRecent orders (for dashboard):');
          results.forEach(order => {
            console.log(`  Order #${order.oid}: ${order.username} - ${order.quantity}x ${order.pname} = ₹${order.total}`);
          });
        }
      });
      
      setTimeout(() => {
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
          } else {
            console.log('\n🔒 Database connection closed.');
            console.log('\n🎉 Ready to test! Start your server and check the dashboard.');
          }
        });
      }, 2000);
    })
    .catch(err => {
      console.error('Error inserting orders:', err);
      db.close();
    });
}

// Execute the function
insertSampleOrders();
