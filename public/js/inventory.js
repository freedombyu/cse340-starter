'use strict';

const noVehiclesTemplate = `
  <p class="notice">
    Sorry, no matching vehicles could be found in this category.
  </p>
`;

const tableRowItem = ({ inv_id, inv_make, inv_model }) => `
<tr>
  <td>
    ${inv_make} ${inv_model}
  </td>
  <td class="action"><a href="/inv/edit/${inv_id}" title="Click to update">Modify</a></td>
  <td class="action"><a href="/inv/delete/${inv_id}" title="Click to delete">Delete</a></td>
</tr>
`;

const getDataTable = (list) => `
<thead>
  <tr>
    <th>Vehicle Name</th>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
  </tr>
</thead>
<tbody>
  ${list.map(tableRowItem).join('')}
</tbody>
`;

const renderInventoryList = (list) => {
  const container = document.getElementById('inventoryDisplay');
  if (list.length > 0) {
    container.innerHTML = getDataTable(list);
  } else {
    container.innerHTML = noVehiclesTemplate;
  }
};

const classificationDropdown = document.getElementById('clasId');
classificationDropdown?.addEventListener('change', async () => {
  const clasId = classificationDropdown.value;
  console.log(clasId);
  try {
    const data = await fetch(`/inv/getInventory/${clasId}`);
    const inventory = await data.json();
    console.log(inventory);
    renderInventoryList(inventory);
  } catch (error) {
    console.error('Network response error: ', error.message);
  }
});
