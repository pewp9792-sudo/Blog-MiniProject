let loadMore = document.querySelector("#loadMore");
if (!token) location.href = "../index.html";
let page = 1;

function showDashboard() {
  fetch(
    baseUrl +
      `/articles?_page=${page}&_per_page=12&sortBy=createdAt&sortDir=desc`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((res) => res.json())
    .then((res) => {
      let rows = "";

      res.data.items.forEach((item) => {
        const plainText = quillToPlainText(item.content);
        rows += `
             <div class="col-12 col-md-6 col-lg-4">
                <div class="article-card" onclick="detail(${item.id})">
                    <img src="${item.thumbnail}" alt="${item.title}">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${plainText}</p>
                        <div class="card-footer">
                            <img src="${item.creator.avatar}" alt="${item.creator.firstName}" class="author-avatar">
                            <span class="author-name">${item.creator.firstName} ${item.creator.lastName}</span>
                        </div>
                    </div>
                </div>
            </div>
          `;
      });

      let dashboardContainer = document.querySelector(".dashboard-container");
      dashboardContainer.innerHTML += rows;
      if (loadMore) {
        loadMore.style.display = res.data.meta.hasNextPage ? "block" : "none";
      }
    });
}

showDashboard();

function detail(id) {
  sessionStorage.setItem("idArticle", id);
  location.href = "article-detail.html";
}

if (loadMore) {
  loadMore.addEventListener("click", () => {
    page++;
    showDashboard();
  });
}

function quillToPlainText(content) {
  if (!content) {
    return "";
  } else if (
    typeof content === "string" &&
    !content.startsWith("<") &&
    !content.startsWith("{")
  ) {
    // Plain text
    return content.trim();
  } else if (typeof content === "string" && content.startsWith("<")) {
    // HTML
    const div = document.createElement("div");
    div.innerHTML = content;
    return div.innerText.trim();
  } else {
    // Delta JSON (fallback)
    try {
      const delta = typeof content === "string" ? JSON.parse(content) : content;
      const temp = new Quill(document.createElement("div"));
      temp.setContents(delta);
      return temp.getText().trim();
    } catch {
      return content.toString().trim();
    }
  }
}

function previewText(text, limit = 20) {
  if (!text) return "";
  return text.length > limit ? text.slice(0, limit) + "..." : text;
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function showToast(msg) {

  const toastSuccess = document.querySelector(".my-toast-success");
  let isLogin = sessionStorage.getItem("isLogin");
  if (isLogin) {
    toastSuccess.innerHTML = `<i class="bi bi-check-circle-fill me-2 fs-5"></i> ${msg}`;
    setTimeout(() => toastSuccess.classList.add("show"), 800);
    sessionStorage.removeItem("isLogin");
  }

  setTimeout(() => toastSuccess.classList.remove("show"), 4000);
}

document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("isLogin")) {
    showToast("You’re logged in successfully."); 
  }
});
// Search functionality
const searchInput = document.getElementById("searchArticles");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const articles = document.querySelectorAll(".article-card");
    
    articles.forEach(article => {
      const title = article.querySelector(".card-title")?.textContent.toLowerCase() || "";
      const text = article.querySelector(".card-text")?.textContent.toLowerCase() || "";
      
      if (title.includes(searchTerm) || text.includes(searchTerm)) {
        article.closest(".col-12").style.display = "block";
      } else {
        article.closest(".col-12").style.display = "none";
      }
    });
  });
}