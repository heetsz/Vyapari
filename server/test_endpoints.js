const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./plantdb.sqlite', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  } else {
    console.log('🔍 Testing frontend endpoints data...\n');
  }
});

// Test /getcart endpoint query
console.log('📦 Testing /getcart endpoint:');
db.all('SELECT quantity, pname, price FROM orders ORDER BY oid DESC LIMIT 5', (err, results) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Recent cart items:');
    results.forEach(r => {
      console.log(`  ${r.quantity}x ${r.pname} - ₹${r.price}`);
    });
  }
});

// Test /orderdata endpoint query
setTimeout(() => {
  console.log('\n📊 Testing /orderdata endpoint:');
  db.all('SELECT MAX(pid) AS pid, SUM(quantity) AS quantity, pname, SUM(price) as price, stock FROM orders GROUP BY pname', (err, results) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Aggregated order data:');
      results.forEach(r => {
        console.log(`  ${r.pname}: ${r.quantity} units, ₹${r.price} total revenue`);
      });
    }
  });
}, 500);

// Test /orders/invoices endpoint query
setTimeout(() => {
  console.log('\n🧾 Testing /orders/invoices endpoint:');
  db.all('SELECT o.oid, o.username, SUM(o.price) as total_amount FROM orders o GROUP BY o.username, o.oid ORDER BY o.oid DESC LIMIT 5', (err, results) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Recent invoices:');
      results.forEach(r => {
        console.log(`  Invoice #${r.oid}: ${r.username} - ₹${r.total_amount}`);
      });
    }
  });
}, 1000);

// Test sales data
setTimeout(() => {
  console.log('\n💰 Testing sales data:');
  db.get('SELECT SUM(price) AS totalSales FROM orders', (err, result) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log(`Total sales: ₹${result.totalSales || 0}`);
    }
  });
}, 1500);

setTimeout(() => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('\n✅ Database test completed successfully!');
      console.log('🚀 Your data is ready for the frontend!');
    }
  });
}, 2000);
