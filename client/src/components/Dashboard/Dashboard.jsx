import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import er from '../../LoginAssets/er.png';

import { 
  LayoutDashboard, 
  FileText, 
  TrendingUp, 
  Users, 
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js';


import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer 
} from 'recharts';


ChartJS.register(ArcElement, CategoryScale, Tooltip, Legend);


const Dashboard = () => {
  const [analyticsData, setAnalyticsData] = useState([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [employees, setEmployees] = useState([]);
  const [totalSalary, setTotalSalary] = useState(null);
  const [totalEmployees, setEmployeeCount] = useState(null);
  const [totalSales, setSales] = useState(null);
  const [totalUsers, setUserCount] = useState(null);
  // Add Employee form states
  const [empID, setEmpId] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);


  
  const navigateTo = useNavigate();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      label: 'Employee Roles'
    }]
  });

  useEffect(() => {

    Axios.get('http://localhost:3003/employees/sales')
      .then((response) => {
        setSales(response.data.sales);
      })
      .catch((error) => console.error('Error fetching sales:', error));

    // Fetch employee count
    Axios.get('http://localhost:3003/employees/employeeCount')
      .then((response) => {
        setEmployeeCount(response.data.employeeSum);
      })
      .catch((error) => console.error('Error fetching employee count:', error));

    // Fetch user count
    Axios.get('http://localhost:3003/employees/userCount')
      .then((response) => {
        setUserCount(response.data.userCount);
      })
      .catch((error) => console.error('Error fetching user count:', error));
  }, []);
  //sales

  

  useEffect(() => {
    if (activeTab === 'employees') {
      fetchEmployeeData();
    }
    if (activeTab === 'invoice') {
      Axios.get('http://localhost:3003/orders/invoices')
        .then((response) => {
          setInvoices(response.data);
        })
        .catch((error) => console.error('Error fetching invoices:', error));
    }
    if (activeTab === 'sales') {//idhar
      Axios.get('http://localhost:3003/orderdata')
        .then((response) => {
          setOrders(response.data);
        })
        .catch((error) => console.error('Error fetching orders:', error));
    }
    if (activeTab === 'analytics') {
      Axios.get('http://localhost:3003/orderdata')
        .then((response) => {
          setAnalyticsData(response.data);
        })
        .catch((error) => console.error('Error fetching analytics data:', error));
    }
   
  }, [activeTab]);

  const fetchEmployeeData = () => {
    // Fetch employees
    Axios.get('http://localhost:3003/employees')
      .then((response) => {
        setEmployees(response.data);
        processRoleData(response.data);
      })
      .catch((error) => console.error(error));

    // Fetch salary sum
    Axios.get('http://localhost:3003/employees/salarySum')
      .then((response) => {
        setTotalSalary(response.data.totalSalary);
      })
      .catch((error) => console.error('Error fetching salary sum:', error));
  };

  const AnalyticsContent = () => (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2>Product Quantity Analysis</h2>
      <div style={{ width: '100%', height: '400px' }}>
        <ResponsiveContainer>
          <BarChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="pname" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
  

  const createEmployee = (e) => {
    e.preventDefault();
    Axios.post('http://localhost:3003/addEmployee', {
      empID,
      name,
      phone,
      role,
      salary
    })
    .then((response) => {
      console.log(response.data.message);
      // Clear form
      setEmpId('');
      setName('');
      setPhone('');
      setRole('');
      setSalary('');
      // Refresh employee data
      fetchEmployeeData();
    })
    .catch((error) => {
      console.error('Error adding employee:', error);
      alert('Failed to add employee');
    });
  };

  useEffect(() => {
    if (activeTab === 'employees') {
      // Fetch employees
      Axios.get('http://localhost:3003/employees')
        .then((response) => {
          setEmployees(response.data);
          processRoleData(response.data);
        })
        .catch((error) => console.error(error));
  
      // Fetch salary sum
      Axios.get('http://localhost:3003/employees/salarySum')
        .then((response) => {
          setTotalSalary(response.data.totalSalary);
        })
        .catch((error) => console.error('Error fetching salary sum:', error));
    }
  }, [activeTab]);
  



  const processRoleData = (data) => {
    const roleCount = {};
    data.forEach((employee) => {
      roleCount[employee.role] = (roleCount[employee.role] || 0) + 1;
    });


    setChartData({
      labels: Object.keys(roleCount),
      datasets: [{
        data: Object.values(roleCount),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#A5D8FF'],
        label: 'Employee Roles'
      }]
    });
  };

  const deleteEmployee = (empID) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }
  
    Axios.delete(`http://localhost:3003/employees/${empID}`)
      .then((response) => {
        if (response.data.success) {
          // Update local state only after successful deletion
          const updatedEmployees = employees.filter(emp => emp.empID !== empID);
          setEmployees(updatedEmployees);
          processRoleData(updatedEmployees); // Update pie chart
        } else {
          // Handle case where backend returns success: false
          alert(response.data.error || 'Failed to delete employee');
        }
      })
      .catch((error) => {
        console.error('Error deleting employee:', error);
        const errorMessage = error.response?.data?.error || 'Failed to delete employee';
        alert(errorMessage);
      });
  };


  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
    },
    sidebar: {
      width: '250px',
      backgroundColor: '#f8f9fa',
      borderRight: '1px solid #dee2e6',
      position: 'fixed',
      height: '100vh',
      left: isSidebarOpen ? '0' : '-250px',
      transition: 'left 0.3s',
    },
    sidebarHeader: {
      padding: '20px',
      borderBottom: '1px solid #dee2e6',
    },
    menuItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px 20px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      border: 'none',
      backgroundColor: 'transparent',
      width: '100%',
      textAlign: 'left',
    },
    activeMenuItem: {
      backgroundColor: '#e9ecef',
    },
    menuIcon: {
      marginRight: '10px',
    },
    content: {
      flex: 1,
      marginLeft: isSidebarOpen ? '250px' : '0',
      padding: '20px',
      transition: 'margin-left 0.3s',
    },
    toggleButton: {
      position: 'fixed',
      top: '20px',
      left: '20px',
      zIndex: 1000,
      display: 'none',
      padding: '10px',
      backgroundColor: 'white',
      border: '1px solid #dee2e6',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '20px',
    },
    statsCard: {
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderRadius: '8px',
    },
    th: {
      textAlign: 'left',
      padding: '12px',
      borderBottom: '1px solid #dee2e6',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #dee2e6',
    },
    chartContainer: {
      marginTop: '20px',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      maxWidth: '500px'
    },
    '@media (max-width: 768px)': {
      toggleButton: {
        display: 'block',
      },
      content: {
        marginLeft: '0',
      },
    },
  };

  // Dashboard Content Component
  const DashboardContent = () => (
  <div>
    <div style={styles.statsContainer}>
      <div style={styles.statsCard}>
        <h3>Total Revenue</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>₹{totalSales}</p>
        <p style={{ color: 'green' }}>+12% from last month</p>
      </div>
      <div style={styles.statsCard}>
        <h3>Total Employees</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalEmployees}</p>
        <p style={{ color: 'green' }}>+8% from last month</p>
      </div>
      <div style={styles.statsCard}>
        <h3>Total Users</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalUsers}</p>
        <p style={{ color: 'green' }}>Same as last month</p>
      </div>
    </div>
    <div style={{display: 'flex', flexDirection: 'column'}}>
        <h2>Database Tables</h2>
        <img src={er}></img>
      </div>
    </div>
    
  );

  // Invoice Content Component
  const InvoiceContent = () => (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Invoice #</th>
          <th style={styles.th}>Client</th>
          <th style={styles.th}>Amount</th>
          <th style={styles.th}>Status</th>
        </tr>
      </thead>
      <tbody>
        {invoices.map((invoice) => (
          <tr key={invoice.oid}>
            <td style={styles.td}>ORD-{invoice.oid}</td>
            <td style={styles.td}>{invoice.username}</td>
            <td style={styles.td}>₹{invoice.total_amount}</td>
            <td style={styles.td}>
              <span style={{ 
                backgroundColor: invoice.status === 'Paid' ? '#d4edda' : '#fff3cd', 
                color: invoice.status === 'Paid' ? '#155724' : '#856404', 
                padding: '4px 8px', 
                borderRadius: '4px' 
              }}>
                Paid
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
  //voyage

  const SalesContent = () => (
    <table style={styles.table}>
      <thead>
        <tr>
        <th style={styles.th}>Product ID</th>
          <th style={styles.th}>Product Name</th>
          
          <th style={styles.th}>Quantity</th>
          <th style={styles.th}>Total Price</th>
          <th style={styles.th}>Stock Left</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((orders) => (
          <tr key={orders.oid}>
            <td style={styles.td}>{orders.pid}</td>
            <td style={styles.td}>{orders.pname}</td>
            
            <td style={styles.td}>{orders.quantity}</td>
            <td style={styles.td}>₹{orders.price}</td>
            <td style={styles.td}>{orders.stock}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );


  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'invoice', label: 'Invoice', icon: FileText },
    { id: 'sales', label: 'Sales', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'employees', label: 'Employees', icon: Users },
  ];

  const EmployeeContent = () => (
    <div>
      <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h3>Add New Employee</h3>
        <form onSubmit={createEmployee} style={{ display: 'grid', gap: '10px', maxWidth: '500px' }}>
          <input
            type="text"
            placeholder="Employee ID"
            value={empID}
            onChange={(e) => setEmpId(e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            style={inputStyle}
          />
          <button
            type="submit"
            style={{
              
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add Employee
          </button>
        </form>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
        <thead>
            <tr>
              <th style={styles.th}>Emp ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Salary</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.empID}>
                <td style={styles.td}>{employee.empID}</td>
                <td style={styles.td}>{employee.name}</td>
                <td style={styles.td}>{employee.phone}</td>
                <td style={styles.td}>{employee.role}</td>
                <td style={styles.td}>{employee.salary}</td>
                <td style={styles.td}>
                 
               <button onClick={() => deleteEmployee(employee.empID)} 
                style={{ 
                  color: 'red', 
                  border: 'none', 
                  background: 'white',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#ffebee'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'white'}>
                Delete
                </button>
                </td>
              </tr>
            ))}
          </tbody>
          {totalSalary !== null && (
            <tr>
              <td colSpan="4" style={styles.td}><strong>Total Salary</strong></td>
              <td style={styles.td}><strong>{totalSalary}</strong></td>
              <td style={styles.td}></td>
            </tr>
          )}
                  </table>
      </div>
      
      <div>
      <div style={styles.chartContainer}>
        <h2>Employee Role Distribution</h2>
        <Pie 
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }}
        />
        
      </div>
    </div>
      
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'invoice':
        return <InvoiceContent />;
      case 'sales':
        return <div><SalesContent/></div>;
      case 'analytics':
        return <div><AnalyticsContent /></div>;
      case 'employees':
        return <EmployeeContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div style={styles.container}>
      <button 
        style={styles.toggleButton}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h1 style={{ margin: 0 , fontSize: '24px', fontWeight: 'bold' }}>VYAPARI</h1>
              <h3 style={{ margin: 0}}>Admin</h3>
          <button style={{ 
                  color: 'red', 
                  border: 'none', 
                  background: 'white',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'background-color 0.3s'
                }} onClick={() => navigateTo('/register')}>Logout</button>
        </div>
        <nav>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  ...styles.menuItem,
                  ...(activeTab === item.id ? styles.activeMenuItem : {})
                }}
              >
                <Icon style={styles.menuIcon} size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <main style={styles.content}>
        {renderContent()}
      </main>
    </div>
  );
};

const inputStyle = {
  padding: '8px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px',
  width: '100%'
};

export default Dashboard;