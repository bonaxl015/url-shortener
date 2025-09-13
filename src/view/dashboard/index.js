// API URLs
const TOTAL_COUNT_API = '/api/v1/short-url/total-count';
const GET_LIST_DATA_API = '/api/v1/short-url/get-all';
const UPDATE_API = '/api/v1/short-url/update';
const DELETE_API = '/api/v1/short-url/delete';

const HTTP_METHODS = {
	GET: 'GET',
	POST: 'POST',
	PATCH: 'PATCH',
	DELETE: 'DELETE'
};

// Pagination Configuration
const paginationConfig = {
	currentPage: 1,
	itemsPerPage: 10,
	totalItems: 0,
	totalPages: 0,
	maxVisiblePages: 5
};

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

// Get table list data
async function getTableData(
	pageNumber = paginationConfig.currentPage,
	pageSize = paginationConfig.itemsPerPage
) {
	const queryParams = { pageNumber, pageSize };
	const queryString = new URLSearchParams(queryParams);

	const getTableDataList = await fetchDBRequest(
		`${GET_LIST_DATA_API}?${queryString}`,
		HTTP_METHODS.GET
	);

	return getTableDataList;
}

// Initialize table data
async function initializeTable({ isUpdate, isPageUpdate }) {
	const statBadgeContainer = document.getElementById('stat-badge-count');
	const statNumberContainer = document.getElementById('stat-number');

	// Get table list
	const getListData = await getTableData(
		isUpdate ? paginationConfig.currentPage : 1,
		paginationConfig.itemsPerPage
	);

	if (!isPageUpdate) {
		// Get total count
		const countData = await fetchDBRequest(TOTAL_COUNT_API, HTTP_METHODS.GET);

		// Display total count
		statBadgeContainer.innerText = countData.total;
		statNumberContainer.innerText = countData.total;

		// Set total page count in config
		paginationConfig.totalItems = countData.total;
	}

	// Display table data
	createTableRows(getListData, isUpdate);
}

// Copy to clipboard functionality (function injected to HTML)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function copyToClipboard(text) {
	const fullUrl = `${window.location.origin}/${text}`;
	navigator.clipboard
		.writeText(fullUrl)
		.then(() => {
			showToast('Short URL copied to clipboard!', 'success');
		})
		.catch(() => {
			showToast('Failed to copy URL', 'error');
		});
}

// Attach events to edit form
function editFormEventSetup(id, editModal, editUrlInput) {
	if (!id) return;

	const editForm = document.getElementById('editForm');

	editForm.addEventListener(
		'submit',
		async function (e) {
			e.preventDefault();

			try {
				const updateData = await fetchDBRequest(UPDATE_API, HTTP_METHODS.PATCH, {
					id,
					url: editUrlInput.value
				});

				if (updateData) {
					initializeTable({ isUpdate: true, isPageUpdate: true });
					editModal.hide();
				}
			} catch (error) {
				console.log(error);
				showToast(error.message, 'error');
			}

			// Attach listener again
			editFormEventSetup();
		},
		{ once: true }
	);
}

// Edit URL functionality (function injected to HTML)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function editUrl(id, currentUrl) {
	const editUrlInput = document.getElementById('editUrlInput');
	// eslint-disable-next-line no-undef
	const editModal = new bootstrap.Modal(document.getElementById('editModal'));

	editUrlInput.value = currentUrl;

	editFormEventSetup(id, editModal, editUrlInput);

	editModal.show();
}

// Delete URL functionality (function injected to HTML)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function deleteUrl(id) {
	// Show confirmation with custom styling
	if (
		confirm(
			'⚠️ Are you sure you want to delete this URL?\n\nThis action cannot be undone and all analytics data will be lost.'
		)
	) {
		try {
			const deleteData = await fetchDBRequest(DELETE_API, HTTP_METHODS.DELETE, { id });

			if (deleteData) {
				initializeTable({ isUpdate: true, isPageUpdate: false });
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

	// eslint-disable-next-line no-undef
	const toast = new bootstrap.Toast(toastElement);
	toast.show();
}

// Fetch data upon render
document.addEventListener('DOMContentLoaded', async function () {
	await initializeTable({ isUpdate: true, isPageUpdate: false });
	initializePagination();
});

function initializePagination() {
	paginationConfig.totalPages = Math.ceil(
		paginationConfig.totalItems / paginationConfig.itemsPerPage
	);

	// Set up event listeners
	setupPaginationEventListeners();

	// Initial render
	updatePagination();
	showCurrentPage();
}

function setupPaginationEventListeners() {
	// Navigation buttons
	document
		.getElementById('prevPage')
		.addEventListener('click', () => goToPage(paginationConfig.currentPage - 1));
	document
		.getElementById('nextPage')
		.addEventListener('click', () => goToPage(paginationConfig.currentPage + 1));

	// Mobile pagination
	document
		.getElementById('mobilePrev')
		.addEventListener('click', () => goToPage(paginationConfig.currentPage - 1));
	document
		.getElementById('mobileNext')
		.addEventListener('click', () => goToPage(paginationConfig.currentPage + 1));
}

function updatePagination() {
	updatePaginationButtons();
	updatePageNumbers();
	updateMobilePagination();
}

function updatePaginationButtons() {
	const isFirstPage = paginationConfig.currentPage === 1;
	const isLastPage = paginationConfig.currentPage === paginationConfig.totalPages;

	// Navigation buttons
	document.getElementById('prevPage').disabled = isFirstPage;
	document.getElementById('nextPage').disabled = isLastPage;

	// Update button styles
	updateButtonStates();
}

function updateButtonStates() {
	const buttons = ['prevPage', 'nextPage'];

	buttons.forEach((buttonId) => {
		const button = document.getElementById(buttonId);
		const listItem = button.closest('.page-item');

		if (button.disabled) {
			listItem.classList.add('disabled');
			button.setAttribute('aria-disabled', 'true');
		} else {
			listItem.classList.remove('disabled');
			button.removeAttribute('aria-disabled');
		}
	});
}

function updatePageNumbers() {
	const pageNumbersContainer = document.getElementById('pageNumbers');
	pageNumbersContainer.innerHTML = '';

	if (paginationConfig.totalPages <= 1) {
		return;
	}

	const pages = generatePageNumbers();

	pages.forEach((page) => {
		if (page === '...') {
			const ellipsis = document.createElement('div');
			ellipsis.className = 'page-ellipsis';
			ellipsis.textContent = '...';
			pageNumbersContainer.appendChild(ellipsis);
		} else {
			const pageButton = document.createElement('button');
			pageButton.className = `page-number ${page === paginationConfig.currentPage ? 'active' : ''}`;
			pageButton.textContent = page;
			pageButton.setAttribute('aria-label', `Go to page ${page}`);
			pageButton.setAttribute(
				'aria-current',
				page === paginationConfig.currentPage ? 'page' : 'false'
			);

			pageButton.addEventListener('click', () => goToPage(page));
			pageNumbersContainer.appendChild(pageButton);
		}
	});
}

function generatePageNumbers() {
	const pages = [];
	const { currentPage, totalPages, maxVisiblePages } = paginationConfig;

	if (totalPages <= maxVisiblePages) {
		// Show all pages if total pages is less than or equal to max visible
		for (let i = 1; i <= totalPages; i++) {
			pages.push(i);
		}
	} else {
		// Complex pagination logic
		const halfVisible = Math.floor(maxVisiblePages / 2);
		let startPage = Math.max(1, currentPage - halfVisible);
		let endPage = Math.min(totalPages, currentPage + halfVisible);

		// Adjust if we're near the beginning or end
		if (currentPage <= halfVisible) {
			endPage = Math.min(totalPages, maxVisiblePages);
		}
		if (currentPage >= totalPages - halfVisible) {
			startPage = Math.max(1, totalPages - maxVisiblePages + 1);
		}

		// Add first page and ellipsis if needed
		if (startPage > 1) {
			pages.push(1);
			if (startPage > 2) {
				pages.push('...');
			}
		}

		// Add visible page numbers
		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		// Add ellipsis and last page if needed
		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				pages.push('...');
			}
			pages.push(totalPages);
		}
	}

	return pages;
}

function updateMobilePagination() {
	document.getElementById('currentPageMobile').textContent = paginationConfig.currentPage;
	document.getElementById('totalPagesMobile').textContent = paginationConfig.totalPages;

	document.getElementById('mobilePrev').disabled = paginationConfig.currentPage === 1;
	document.getElementById('mobileNext').disabled =
		paginationConfig.currentPage === paginationConfig.totalPages;
}

async function goToPage(page) {
	if (page < 1 || page > paginationConfig.totalPages || page === paginationConfig.currentPage) {
		return;
	}

	paginationConfig.currentPage = page;
	updatePagination();
	await showCurrentPage(page);

	// Add loading effect
	const paginationContainer = document.querySelector('.pagination-container');
	paginationContainer.classList.add('pagination-loading');
	setTimeout(() => {
		paginationContainer.classList.remove('pagination-loading');
	}, 300);

	// Smooth scroll to top of table
	document.querySelector('.table-container').scrollIntoView({
		behavior: 'smooth',
		block: 'start'
	});
}

async function showCurrentPage() {
	await initializeTable({ isUpdate: true, isPageUpdate: true });
}

// Helper function to refresh pagination (useful when URLs are added/deleted)
function refreshPagination() {
	const tableRows = document.querySelectorAll('.table-row');
	paginationConfig.totalItems = tableRows.length;
	paginationConfig.totalPages = Math.ceil(
		paginationConfig.totalItems / paginationConfig.itemsPerPage
	);

	// Adjust current page if needed
	if (
		paginationConfig.currentPage > paginationConfig.totalPages &&
		paginationConfig.totalPages > 0
	) {
		paginationConfig.currentPage = paginationConfig.totalPages;
	}

	updatePagination();
	showCurrentPage();
}

// Export functions for use in other parts of the application
window.paginationUtils = {
	refreshPagination,
	goToPage,
	getCurrentPage: () => paginationConfig.currentPage,
	getTotalPages: () => paginationConfig.totalPages
};
