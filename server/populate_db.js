const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./plantdb.sqlite', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  } else {
    console.log('Connected to the SQLite database');
  }
});

// Function to check current data
function checkCurrentData() {
  console.log('\n=== CHECKING CURRENT DATABASE STATE ===');
  
  db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
      console.error('Error fetching tables:', err);
      return;
    }
    console.log('Tables in database:', tables.map(t => t.name));
    
    // Check users table
    db.all("SELECT COUNT(*) as count FROM users", (err, result) => {
      if (err) {
        console.error('Error checking users:', err);
      } else {
        console.log(`Users count: ${result[0].count}`);
      }
    });
    
    // Check employees table
    db.all("SELECT COUNT(*) as count FROM employee", (err, result) => {
      if (err) {
        console.error('Error checking employees:', err);
      } else {
        console.log(`Employees count: ${result[0].count}`);
      }
    });
    
    // Check products table
    db.all("SELECT COUNT(*) as count FROM products", (err, result) => {
      if (err) {
        console.error('Error checking products:', err);
      } else {
        console.log(`Products count: ${result[0].count}`);
      }
    });
    
    // Check orders table
    db.all("SELECT COUNT(*) as count FROM orders", (err, result) => {
      if (err) {
        console.error('Error checking orders:', err);
      } else {
        console.log(`Orders count: ${result[0].count}`);
      }
    });
  });
}

// Function to populate sample data
function populateDatabase() {
  console.log('\n=== POPULATING DATABASE WITH SAMPLE DATA ===');
  
  // Sample users
  const sampleUsers = [
    { email: 'john@example.com', username: 'john_doe', password: 'password123' },
    { email: 'jane@example.com', username: 'jane_smith', password: 'password123' },
    { email: 'admin@plantstore.com', username: 'admin', password: 'admin123' }
  ];
  
  // Sample employees
  const sampleEmployees = [
    { empID: 'EMP001', name: 'Rajesh Kumar', phone: '9876543210', role: 'Manager', salary: 50000 },
    { empID: 'EMP002', name: 'Priya Sharma', phone: '9876543211', role: 'Sales Associate', salary: 25000 },
    { empID: 'EMP003', name: 'Amit Patel', phone: '9876543212', role: 'Plant Specialist', salary: 30000 }
  ];
  
  // Sample products (matching the frontend products)
  const sampleProducts = [
    { id: 1, name: 'Snake Plant', price: 299, description: 'Low maintenance indoor plant', image: 'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1716209064-81SXDZveAL.jpg' },
    { id: 2, name: 'Peace Lily', price: 399, description: 'Beautiful flowering indoor plant', image: 'https://seed2plant.in/cdn/shop/files/SPR-variegated-peace-lily-domino-7097188-hero-A-422d7faa152d42d3a4030ff8a2a33768.jpg' },
    { id: 3, name: 'Money Plant', price: 199, description: 'Lucky indoor plant', image: 'https://rukminim2.flixcart.com/image/850/1000/k2urhjk0/plant-sapling/s/2/h/golden-money-plant-in-imported-plastic-pot-air-purifier-1-dr-original-imafm42nnbdpzrye.jpeg' },
    { id: 4, name: 'Aloe Vera', price: 249, description: 'Medicinal plant with healing properties', image: 'https://m.media-amazon.com/images/I/81XWpVvk5AL._AC_UF1000,1000_QL80_.jpg' },
    { id: 5, name: 'Rose Plant', price: 349, description: 'Beautiful flowering plant', image: 'https://rukminim2.flixcart.com/image/850/1000/kflftzk0/plant-sapling/c/c/m/red-rose-plant-rosa-multiflora-perennial-fragrant-1-m-original-imafwfy47hrnkcku.jpeg' },
    { id: 6, name: 'Cactus', price: 199, description: 'Low maintenance succulent', image: 'https://www.juneflowers.com/wp-content/uploads/2022/08/Cactus-Plant.jpg' },
    { id: 7, name: 'Bamboo Plant', price: 299, description: 'Lucky bamboo plant', image: 'https://himadriaquatics.b-cdn.net/wp-content/uploads/2022/02/Lucky-bamboo-plant-Dracaena-Sanderiana-Olive-Green.jpg' },
    { id: 8, name: 'Plant Food', price: 149, description: 'Nutrient-rich plant fertilizer', image: 'https://m.media-amazon.com/images/I/81G1+Et6aRL._AC_UF1000,1000_QL80_.jpg' }
  ];
  
  // Insert sample users
  console.log('Inserting sample users...');
  sampleUsers.forEach(user => {
    db.run('INSERT OR IGNORE INTO users (email, username, password) VALUES (?, ?, ?)', 
      [user.email, user.username, user.password], 
      function(err) {
        if (err) {
          console.error('Error inserting user:', err);
        } else if (this.changes > 0) {
          console.log(`Inserted user: ${user.username}`);
        }
      }
    );
  });
  
  // Insert sample employees
  console.log('Inserting sample employees...');
  sampleEmployees.forEach(emp => {
    db.run('INSERT OR IGNORE INTO employee (empID, name, phone, role, salary) VALUES (?, ?, ?, ?, ?)', 
      [emp.empID, emp.name, emp.phone, emp.role, emp.salary], 
      function(err) {
        if (err) {
          console.error('Error inserting employee:', err);
        } else if (this.changes > 0) {
          console.log(`Inserted employee: ${emp.name}`);
        }
      }
    );
  });
  
  // Insert sample products
  console.log('Inserting sample products...');
  sampleProducts.forEach(product => {
    db.run('INSERT OR REPLACE INTO products (id, name, price, description, image) VALUES (?, ?, ?, ?, ?)', 
      [product.id, product.name, product.price, product.description, product.image], 
      function(err) {
        if (err) {
          console.error('Error inserting product:', err);
        } else {
          console.log(`Inserted product: ${product.name}`);
        }
      }
    );
  });
  
  console.log('\nDatabase population completed!');
}

// Function to clear all data
function clearDatabase() {
  console.log('\n=== CLEARING ALL DATA ===');
  db.run('DELETE FROM orders', (err) => {
    if (err) console.error('Error clearing orders:', err);
    else console.log('Cleared orders table');
  });
  
  db.run('DELETE FROM users', (err) => {
    if (err) console.error('Error clearing users:', err);
    else console.log('Cleared users table');
  });
  
  db.run('DELETE FROM employee', (err) => {
    if (err) console.error('Error clearing employees:', err);
    else console.log('Cleared employee table');
  });
  
  db.run('DELETE FROM products', (err) => {
    if (err) console.error('Error clearing products:', err);
    else console.log('Cleared products table');
  });
}

// Main execution
const action = process.argv[2] || 'check';

switch(action) {
  case 'check':
    checkCurrentData();
    break;
  case 'populate':
    populateDatabase();
    break;
  case 'clear':
    clearDatabase();
    break;
  case 'reset':
    clearDatabase();
    setTimeout(populateDatabase, 1000); // Wait a bit before populating
    break;
  default:
    console.log('Usage: node populate_db.js [check|populate|clear|reset]');
    console.log('  check    - Check current database state (default)');
    console.log('  populate - Add sample data to database');
    console.log('  clear    - Remove all data from database');
    console.log('  reset    - Clear and then populate with sample data');
}

// Close database connection after 3 seconds
setTimeout(() => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('\nDatabase connection closed.');
    }
  });
}, 3000);
