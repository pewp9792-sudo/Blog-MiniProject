let articleForm = document.getElementById("createArticleForm");
let title = document.getElementById("title");
let category = document.getElementById("category");
let content = document.getElementById("content");
let image = document.getElementById("image");

////id for message error
let errorTitle = document.getElementById("errorTitle");
let errorCotent = document.getElementById("errorCotent");
let errorCategory = document.getElementById("errorCategory");
let errorimage = document.getElementById("errorimage");
let isvalid = true;

//**....validation */
function validation(){
    if(!title.value.trim()){
        isvalid = false;
        errorTitle.innerHTML = "Title is required!"
    }else{
        isvalid = true;
        errorTitle.innerHTML = '';
    }

    if(!category.value || category.value == "Select Category"){
        isvalid = false;
        errorCategory.innerHTML = "Category is required!"
    }else{
        isvalid = true;
        errorCategory.innerHTML = '';
    }

    if(content.value.trim().length < 10){
        isvalid = false;
        errorCotent.innerHTML = "Content must be at least 10 characters long."
    }else{
        isvalid = true;
        errorCotent.innerHTML = ""
    }

    return isvalid;
}

//**....get category */
const getCategory=()=>{
    fetch(URL+"/categories?_page=1&_per_page=100&sortBy=name&sortDir=ASC")
    .then(res =>res.json())
    .then(categories=>{
        categories = categories.data
        categories = categories.items
        for(let e of categories){
            category.innerHTML += `<option value="${e.id}">${e.name}</option>`;
        }
    })
}
// getCategory();
//**....Create own article */
const createArticle=()=>{
    if(validation()){
        let article={
            "title": title.value.trim(),
            "content": content.value.trim(),
            "categoryId": Number(category.value)
        }
        console.log(article)
        fetch(URL+"/articles", {
                method: "post",
                headers: {Authorization:`Bearer ${getToken()}`,
                            "Content-Type": "application/json"
                        },
                body: JSON.stringify(article)
            })
        .then(res => res.json())
        .then(data=>{
            thumbnail(data.data.id);
            articleForm.reset();
            document.querySelector(".previewImage").innerHTML=""
        })
    }
    else{
        return;
    }
}

//**....article ID from URL */ 
const params = new URLSearchParams(window.location.search);
let isID = params.get("id"); 
let isId = Number(isID)
//**....edit article */
function editArticle(isID){
    fetch(`${URL}/articles/own?search=&_page=1&_per_page=100&sortBy=createdAt&sortDir=asc`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    })
    .then(res => res.json())
    .then(article => {
        article = article.data
        // console.log(article)
        article = article.items
        // console.log(article)
        article.forEach(item => {
            if(item.id == isId){
                title.value = item.title;
                content.value = item.content;
                let categoryId = item.category?item.category.id:"No category"
                category.value = categoryId;
                // alert(item.thumbnail)
                document.querySelector(".previewImage").innerHTML = `<img src="${item.thumbnail}" class="object-fit-cover" style="width: 200px; height: 200px;">`
            }
        });   
    })
    .catch(err => console.log({success:false,error:err.message}));
}
editArticle();

//**....update article */
const updateArticle = ()=>{
    let article = {
        "title": title.value,
        "content": content.value,
        "categoryId": Number(category.value)
    }
    fetch(`${URL}/articles/${isID}`, {
        method: "put",
        headers: {Authorization:`Bearer ${getToken()}`,
                    "Content-Type": "application/json"
                },
        body: JSON.stringify(article)
    })
    .then(res =>res.json())
    .then(data =>{
        thumbnail(data.data.id);
        articleForm.reset();
        document.querySelector(".previewImage").innerHTML=""
    })
}

//**....THUMBNAIL */
const thumbnail=(id)=>{
    const file = image.files[0];
    const formData = new FormData();
    formData.append("thumbnail", file);
    fetch(URL+`/articles/${id}/thumbnail`, {
        method: "post",
        headers: {Authorization:`Bearer ${getToken()}`},
        body: formData
    })
    .then(res => res.json())
    .then(thumbnail=>{
        if(thumbnail.result == false){
            errorimage.innerHTML=thumbnail.details; 
        }
    })
}
//**....set image */
function setupImagePreview() {
    image.addEventListener("change", e => {
        const file = e.target.files[0];
        document.querySelector(".previewImage").innerHTML = `<img src="${window.URL.createObjectURL(file)}" class="object-fit-cover" style="width: 200px; height: 200px;">`
    });
}
setupImagePreview();

function publishArticle(){
    event.preventDefault();
    if(!isID){
        createArticle();
    }else{
        if(validation()){
            updateArticle()
        }else{
            return;
        }
    }
}

getCategory();