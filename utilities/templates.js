const accountGridTemplate = (accountData) => {
  if (!accountData) {
    return '<p>Please <a href="/account/login">log in</a> to view this page.</p>';
  }
  return `
    <div class="account-welcome">
      <p class="welcome-message">You're logged in as <strong>${accountData.account_firstname} ${accountData.account_lastname}</strong></p>
      <p class="account-email">Email: <strong>${accountData.account_email}</strong></p>
    </div>
    
    ${accountData.account_type === 'Employee' || accountData.account_type === 'Admin' ? `
    <section class="account-section">
      <h2>Inventory Management</h2>
      <p><a href="/inv/" class="account-link">Manage Inventory</a></p>
    </section>
    ` : ''}
    
    <section class="account-section">
      <h2>Account Management</h2>
      <p><a href="/account/edit" class="account-link">Edit Account Information</a></p>
    </section>
    <section class="account-section">
      <h2>Account Actions</h2>
      <p><a href="/account/logout" class="account-link logout-link">Logout</a></p>
    </section>
  `;
};