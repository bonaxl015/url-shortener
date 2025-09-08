// API URLs
const TOTAL_COUNT_API = '/api/v1/short-url/total-count';
const GET_LIST_DATA_API = '/api/v1/short-url/get-all';
const UPDATE_API = '/api/v1/short-url/update'
const DELETE_API = '/api/v1/short-url/delete'

const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
}

// Fetch data from server
async function fetchDBRequest(url, method, body = null) {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

// Render table rows
function createTableRows(rowData, isUpdate) {
  const tableBodyRowData = document.getElementById('table-body-data');

  if (isUpdate) {
    tableBodyRowData.innerHTML = '';
  }

  rowData.forEach((item, index) => {
    const tableRow = document.createElement('tr');
    tableRow.className = 'table-row';
    tableRow.id = `table-row-${index + 1}`;

    tableRow.innerHTML = `
      <td class="table-cell">
        <div class="index-badge">
          <span>${index + 1}</span>
        </div>
      </td>
      <td class="table-cell">
        <div class="url-info">
          <div class="url-details">
            <div class="short-url">
              <code>${item.code}</code>
            </div>
            <button onclick="copyToClipboard('${item.code}')" class="copy-btn">
              <i class="fas fa-copy me-1"></i>
              Copy
            </button>
          </div>
        </div>
      </td>
      <td class="table-cell">
        <div class="original-url">
          <a href="${item.originalUrl}" target="_blank" 
              class="url-link" 
              title="${item.originalUrl}">
            <span class="url-text">${item.originalUrl}</span>
          </a>
        </div>
      </td>
      <td class="table-cell">
        <div class="click-count">
          <p>${item.clicks}</p>
        </div>
      </td>
      <td class="table-cell">
        <div class="date-info">
          <div class="date-details">
            <div class="date-primary">${new Date(item.createdAt).toLocaleDateString()}</div>
            <div class="date-secondary">${new Date(item.createdAt).toLocaleTimeString()}</div>
          </div>
        </div>
      </td>
      <td class="table-cell">
        <div class="date-info">
          <div class="date-details">
            <div class="date-primary">${new Date(item.updatedAt).toLocaleDateString()}</div>
            <div class="date-secondary">${new Date(item.updatedAt).toLocaleTimeString()}</div>
          </div>
        </div>
      </td>
      <td class="table-cell">
        <div class="action-buttons">
          <button onclick="editUrl('${item.id}', '${item.originalUrl}')" 
              class="btn btn-sm btn-action btn-edit">
            <i class="fas fa-edit"></i>
            <span>Edit</span>
          </button>
          <button onclick="deleteUrl('${item.id}')" 
              class="btn btn-sm btn-action btn-delete">
            <i class="fas fa-trash"></i>
            <span>Delete</span>
          </button>
        </div>
      </td>
    `;
    
    tableBodyRowData.appendChild(tableRow);
  });

}

// Initialize data
async function initialize(isUpdate = false) {
  const statBadgeContainer = document.getElementById('stat-badge-count');
  const statNumberContainer = document.getElementById('stat-number');

  const queryParams = {
    pageNumber: 1,
    pageSize: 10
  }
  const queryString = new URLSearchParams(queryParams);

  // Get table list
  const getListData = await fetchDBRequest(
    `${GET_LIST_DATA_API}?${queryString}`,
    HTTP_METHODS.GET
  );

  // Get total count
  const countData = await fetchDBRequest(TOTAL_COUNT_API, HTTP_METHODS.GET);

  // Display total count
  statBadgeContainer.innerText = countData.total;
  statNumberContainer.innerText = countData.total;

  // Display table data
  createTableRows(getListData, isUpdate);
}

// Copy to clipboard functionality
function copyToClipboard(text) {
  const fullUrl = `${window.location.origin}/${text}`;
  navigator.clipboard.writeText(fullUrl).then(() => {
    showToast('Short URL copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Failed to copy URL', 'error');
  });
}

// Attach events to edit form
function editFormEventSetup(id, editModal) {
  if (!id) return;

  const editForm = document.getElementById('editForm');

  editForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    try {
      const updateData = await fetchDBRequest(
        UPDATE_API,
        HTTP_METHODS.PATCH,
        { id, url: editUrlInput.value }
      );

      if (updateData) {
        initialize(true);
        editModal.hide();
      }
    } catch (error) {
      console.log(error);
      showToast(error.message, 'error');
    }

    // Attach listener again
    editFormEventSetup();
  }, { once: true });
}

// Edit URL functionality
function editUrl(id, currentUrl) {
  const editUrlInput = document.getElementById('editUrlInput');
  const editModal = new bootstrap.Modal(document.getElementById('editModal'));

  editUrlInput.value = currentUrl;

  editFormEventSetup(id, editModal);

  editModal.show();
}

// Delete URL functionality
async function deleteUrl(id) {
  // Show confirmation with custom styling
  if (confirm('⚠️ Are you sure you want to delete this URL?\n\nThis action cannot be undone and all analytics data will be lost.')) {
    try {
      const deleteData = await fetchDBRequest(
        DELETE_API,
        HTTP_METHODS.DELETE,
        { id }
      );

      if (deleteData) {
        initialize(true);
      }
    } catch (error) {
      console.log(error);
      showToast(error.message, 'error');
    }
  }
}

// Toast notification
function showToast(message, type = 'success') {
  const toastElement = document.getElementById('toast');
  const toastIcon = document.getElementById('toastIcon');
  const toastMessage = document.getElementById('toastMessage');
  
  toastMessage.textContent = message;
  
  // Update icon based on type
  if (type === 'error') {
    toastIcon.className = 'fas fa-exclamation-circle text-danger me-2';
    toastElement.classList.remove('toast-success');
    toastElement.classList.add('toast-error');
  } else {
    toastIcon.className = 'fas fa-check-circle text-success me-2';
    toastElement.classList.remove('toast-error');
    toastElement.classList.add('toast-success');
  }
  
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

// Fetch data upon render
document.addEventListener('DOMContentLoaded', async function() {
  await initialize();
});
