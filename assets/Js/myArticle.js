let tbody = document.getElementById("tbody");
let isID = null;

const getArticle=()=>{
    fetch(`${URL}/articles/own?search=&_page=1&_per_page=100&sortBy=createdAt&sortDir=asc`, {
            headers: {Authorization:`Bearer ${getToken()}`}
        })
    .then(res => res.json())
    .then(articles =>{
        console.log(articles)
        let data = articles.data;
        console.log(data)
        let items = data.items;
        console.log(items)
        tbody.innerHTML = "";
        items.forEach(item => {
            let categoryName = item.category?.name || "No category"
            console.log(categoryName)
            let row = `
                    <tr class="border-2 border-primary">
                        <td class="align-middle" >${item.title}</td>
                        <td class="align-middle">${categoryName}</td>
                        <td class="align-middle">${item.content}</td>
                        <td style="padding: 5px"><img style="width: 120px; height: 70px;" class="rounded-3 img-fluid object-fit-fill" src="${item.thumbnail}" alt="No image"></td>
                        <td class="align-middle" style="width: 130px;">
                            <button class="btn btn-sm btn-warning p-1" onclick="editArticle(${item.id})">Edit</button>
                            <button class="btn btn-sm btn-danger p-1" onclick="deleteArticle(${item.id})">Delete</button>
                        </td>
                    </tr>
                `;
            tbody.innerHTML+=row;
        });
    })
}

//**....edit article */
function editArticle(id){
    window.location.href = `create-article.html?id=${id}`;  
}
const updateItem = ()=>{
    let article = {
        "title": title.value,
        "content": content.value,
        "categoryId": Number(category.value)
    }
    fetch(URL+isID, {
        method: "put",
        headers: {Authorization:`Bearer ${getToken()}`,
                    "Content-Type": "application/json"
                },
        body: JSON.stringify(article)
    })
    .then(res =>res.json())
    .then(data =>{
        articleForm.reset();
    })
}

//**....delet article */
function deleteArticle(id){
    alert("Are you sure you want to delete this article?");
    fetch(`${URL}/articles/${id}`, {
        method: "delete",
        headers: {Authorization:`Bearer ${getToken()}`}
    })
    .then(res =>res.json())
    .then(data =>{
        getArticle();
    })
}

getArticle();