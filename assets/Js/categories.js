// Redirect to login if no token
if (!token) {
  location.href = "../index.html";
}

const categoriesTable = document.getElementById("categoriesTable");
const categoryForm = document.getElementById("categoryForm");
const categoryIdInput = document.getElementById("categoryId");
const nameInput = document.getElementById("categoryName");
const nameMsgs = document.getElementById("err_name");
const saveBtn = document.getElementById("saveCategoryBtn");
const searchInput = document.getElementById("searchInput");

let categories = [];
let debounceTimeout;

/* ------------------- Fetch categories ------------------- */
const getItems = () => {
  categoriesTable.innerHTML = `
    <tr>
      <td colspan="2" class="text-center">
        <div class="spinner-border text-primary"></div>
      </td>
    </tr>
  `;

  fetch(`${baseUrl}/categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then((data) => {
      categories = data.data.items || [];
      renderTable(categories);
    })
    .catch(() => {
      categoriesTable.innerHTML = `
        <tr>
          <td colspan="2" class="text-center text-danger">
            Failed to load categories
          </td>
        </tr>
      `;
    });
};

/* ------------------- Render table ------------------- */
const renderTable = (list) => {
  if (!list.length) {
    categoriesTable.innerHTML += `
      <tr>
        <td colspan="2" class="text-center">No categories found</td>
      </tr>
    `;
    return;
  }

  categoriesTable.innerHTML = list
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary"
            onclick="editCategory(${item.id})">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger"
            onclick="deleteCategory(${item.id})">
            <i class="bi bi-trash" text-end></i>
          </button>
        </td>
      </tr>
    `,
    )
    .join("");
};

/* ------------------- Validation ------------------- */
const validationForm = () => {
  if (!nameInput.value.trim()) {
    nameMsgs.innerText = "Please enter name";
    return false;
  }
  nameMsgs.innerText = "";
  return true;
};

/* ------------------- Save category ------------------- */
saveBtn.addEventListener("click", (event) => {
  event.preventDefault();
  if (!validationForm()) return;

  const id = categoryIdInput.value;
  const url = id ? `${baseUrl}/categories/${id}` : `${baseUrl}/categories`;

  const method = id ? "PUT" : "POST";

  fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: nameInput.value.trim(),
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then(() => {
      getItems();
      categoryForm.reset();
      categoryIdInput.value = "";

      const modal = bootstrap.Modal.getInstance(
        document.getElementById("categoryModal"),
      );
      modal?.hide();
    })
    .catch((err) => console.error("Save error:", err));
});

/* ------------------- Edit category ------------------- */
window.editCategory = (id) => {
  const cat = categories.find((c) => c.id === id);
  if (!cat) return;

  categoryIdInput.value = cat.id;
  nameInput.value = cat.name;
  document.getElementById("modalTitle").innerText = "Edit Category";

  new bootstrap.Modal(document.getElementById("categoryModal")).show();
};

/* ------------------- Delete category ------------------- */
window.deleteCategory = (id) => {
  if (!confirm("Are you sure you want to delete?")) return;

  fetch(`${baseUrl}/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(() => getItems())
    .catch((err) => console.error("Delete error:", err));
};

/* ------------------- Search ------------------- */
searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    const term = searchInput.value.toLowerCase();
    renderTable(categories.filter((c) => c.name.toLowerCase().includes(term)));
  }, 300);
});

/* ------------------- Initial load ------------------- */
getItems();