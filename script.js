// script.js

const apiBaseUrl = 'https://qa2.sunbasedata.com/sunbase/portal/api/';
let authToken = '';

// Helper function to make authenticated API calls
async function makeAuthenticatedApiCall(method, url, data = null) {
  try {
    const headers = {
      Authorization: `Bearer ${authToken}`,
    };

    const response = await axios({
      method,
      url,
      headers,
      data,
    });

    return response.data;
  } catch (error) {
    console.error('Error making authenticated API call:', error.message);
    throw error;
  }
}





// Function to handle login
async function login() {
  try {
    const loginId = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (loginId === 'test@sunbasedata.com' && password === 'Test@123') {
      const authEndpoint = `${apiBaseUrl}assignment_auth.jsp`;
      const requestBody = {
        login_id: loginId,
        password: password,
      };

      const response = await axios.post(authEndpoint, requestBody);

      authToken = response.data.token;

      // Hide login form and show customer list
      document.getElementById('loginContainer').style.display = 'none';
      document.getElementById('customerListContainer').style.display = 'block';

      // Load and display customer list
      await loadCustomerList();
    } else {
      console.error('Invalid login credentials');
    }
  } catch (error) {
    console.error('Error during login:', error.message);
  }
}

// Function to load and display the customer list
async function loadCustomerList() {
  try {
    const apiEndpoint = `${apiBaseUrl}assignment.jsp?cmd=get_customer_list`;

    const customers = await makeAuthenticatedApiCall('GET', apiEndpoint);

    const customerListTableBody = document.getElementById('customerListTableBody');
    customerListTableBody.innerHTML = '';

    customers.forEach((customer) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${customer.first_name}</td>
        <td>${customer.last_name}</td>
        <td>${customer.street}</td>
        <td>${customer.address}</td>
        <td>${customer.city}</td>
        <td>${customer.state}</td>
        <td>${customer.email}</td>
        <td>${customer.phone}</td>
        <td>
          <button onclick="editCustomer('${customer.uuid}')">Edit</button>
          <button onclick="deleteCustomer('${customer.uuid}')">Delete</button>
        </td>
      `;
      customerListTableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error loading customer list:', error.message);
  }
}

// Function to create a new customer
async function createCustomer() {
    try {
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const street = document.getElementById('street').value;
      const address = document.getElementById('address').value;
      const city = document.getElementById('city').value;
      const state = document.getElementById('state').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
  
      const apiEndpoint = `${apiBaseUrl}assignment.jsp?cmd=create`;
      const customerData = {
        first_name: firstName,
        last_name: lastName,
        street: street,
        address: address,
        city: city,
        state: state,
        email: email,
        phone: phone,
      };
  
      await makeAuthenticatedApiCall('POST', apiEndpoint, customerData);
  
      // Clear input fields and reload customer list
      document.getElementById('createCustomerForm').reset();
      await loadCustomerList();
    } catch (error) {
      console.error('Error creating customer:', error.message);
    }
  }
  
  // Function to delete a customer
  async function deleteCustomer(uuid) {
    try {
      if (confirm('Are you sure you want to delete this customer?')) {
        const apiEndpoint = `${apiBaseUrl}assignment.jsp?cmd=delete&uuid=${uuid}`;
        await makeAuthenticatedApiCall('POST', apiEndpoint);
  
        // Reload customer list after successful deletion
        await loadCustomerList();
      }
    } catch (error) {
      console.error('Error deleting customer:', error.message);
    }
  }
  
  // Function to edit a customer
  async function editCustomer(uuid) {
    try {
      // Retrieve customer data by uuid
      const apiEndpoint = `${apiBaseUrl}assignment.jsp?cmd=get_customer&uuid=${uuid}`;
      const customerData = await makeAuthenticatedApiCall('GET', apiEndpoint);
  
      // Display customer data in update form
      document.getElementById('updateFirstName').value = customerData.first_name;
      document.getElementById('updateLastName').value = customerData.last_name;
      document.getElementById('updateStreet').value = customerData.street;
      document.getElementById('updateAddress').value = customerData.address;
      document.getElementById('updateCity').value = customerData.city;
      document.getElementById('updateState').value = customerData.state;
      document.getElementById('updateEmail').value = customerData.email;
      document.getElementById('updatePhone').value = customerData.phone;
  
      // Hide customer list and show update form
      document.getElementById('customerListContainer').style.display = 'none';
      document.getElementById('updateCustomerContainer').style.display = 'block';
  
      // Save uuid of the customer being updated
      document.getElementById('updateCustomerForm').dataset.uuid = uuid;
    } catch (error) {
      console.error('Error editing customer:', error.message);
    }
  }
  
  // Function to update a customer
  async function updateCustomer() {
    try {
      const uuid = document.getElementById('updateCustomerForm').dataset.uuid;
      const firstName = document.getElementById('updateFirstName').value;
      const lastName = document.getElementById('updateLastName').value;
      const street = document.getElementById('updateStreet').value;
      const address = document.getElementById('updateAddress').value;
      const city = document.getElementById('updateCity').value;
      const state = document.getElementById('updateState').value;
      const email = document.getElementById('updateEmail').value;
      const phone = document.getElementById('updatePhone').value;
  
      const apiEndpoint = `${apiBaseUrl}assignment.jsp?cmd=update&uuid=${uuid}`;
      const updatedCustomerData = {
        first_name: firstName,
        last_name: lastName,
        street: street,
        address: address,
        city: city,
        state: state,
        email: email,
        phone: phone,
      };
  
      await makeAuthenticatedApiCall('POST', apiEndpoint, updatedCustomerData);
  
      // Hide update form and show customer list
      document.getElementById('updateCustomerContainer').style.display = 'none';
      document.getElementById('customerListContainer').style.display = 'block';
  
      // Clear input fields and reload customer list
      document.getElementById('updateCustomerForm').reset();
      await loadCustomerList();
    } catch (error) {
      console.error('Error updating customer:', error.message);
    }
  }
  
  // Function to cancel creating a new customer
  function cancelCreateCustomer() {
    document.getElementById('createCustomerForm').reset();
  }
  
  // Function to cancel updating a customer
  function cancelUpdateCustomer() {
    document.getElementById('updateCustomerContainer').style.display = 'none';
    document.getElementById('customerListContainer').style.display = 'block';
  }
  
  // Event listener for form submission (Create Customer)
  document.getElementById('createCustomerForm').addEventListener('submit', (event) => {
    event.preventDefault();
    createCustomer();
  });
  
  // Event listener for form submission (Update Customer)
  document.getElementById('updateCustomerForm').addEventListener('submit', (event) => {
    event.preventDefault();
    updateCustomer();
  });
  
