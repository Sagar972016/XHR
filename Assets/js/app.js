const cl =console.log;

const postContainerId = document.getElementById("postContainer");
const postForm = document.getElementById("postForm");
const titleControl = document.getElementById("title");
const contentControl = document.getElementById("content");
const userIdControl = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const loader = document.getElementById("loader");

let postArr = [];

let sweetAleart = (x, y) => {
    swal.fire({
        title : x,
        timer : 4000,
        icon : y
    })
}

const templating = (arr) => {
    let result = ``
    arr.forEach(post => {
        result += `
                    <div class="col-md-4 mb-4">
                        <div class="card postCard h-100" id='${post.id}'>
                            <div class="card-header">
                                <h2>${post.title}</h2>
                            </div>
                            <div class="card-body">
                                <p>${post.body}</p>
                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <button onclick = "onEdit(this)" class="btn btn-outline-primary">EDIT</button>
                                <button onclick = "onRemove(this)" class="btn btn-outline-danger">REMOVE</button>
                            </div>
                        </div>
                    </div>
                `
    })
    postContainerId.innerHTML = result
}

const BASE_URL = `https://jsonplaceholder.typicode.com/`
const POST_URL = `${BASE_URL}/posts`

let xhr = new XMLHttpRequest();
xhr.open("GET", POST_URL);
xhr.onload = function(){
    if(xhr.status >= 200 && xhr.status < 300){
        let postArr = JSON.parse(xhr.response);
        cl(postArr);
        templating(postArr);
    }
};
xhr.send();

const onEdit = (eve) => {
    let editId = eve.closest(".card").id;
    localStorage.setItem("editId", editId);

    let EDIT_URL = `${BASE_URL}/posts/${editId}`
    let xhr = new XMLHttpRequest();
    loader.classList.remove("d-none")
    xhr.open("GET", EDIT_URL);
    xhr.onload = function (){
        setTimeout(() => {
            if(xhr.status >= 200 && xhr.status < 300) {
                let post = JSON.parse(xhr.response);
                titleControl.value = post.title;
                contentControl.value = post.body;
                userIdControl.value = post.userId;
    
                submitBtn.classList.add("d-none");
                updateBtn.classList.remove("d-none");
    
                loader.classList.add("d-none");
                }
        },2000)
        }
    xhr.send()

    window.scrollTo({
        top : 0,
        left : 0,
        behavior : "smooth"
    })
}

const onRemove = (ele) => {
    loader.classList.remove("d-none");
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {

            let deleteId = ele.closest(".card").id;
            let REMOVE_URL = `${BASE_URL}/posts/${deleteId}`
            let xhr = new XMLHttpRequest();
            xhr.open("DELETE", REMOVE_URL);
            xhr.onload = function (){
                if(xhr.status >= 200 && xhr.status < 300){
                    ele.closest(".col-md-4").remove()
                }
            }
            xhr.send()

            sweetAleart("Your file has been Deleted!", "success");
            loader.classList.add("d-none");

        }
      });
}

const onUpdateBtn = () => {
    let updatedObj = {
        title : titleControl.value,
        body : contentControl.value,
        userId : userIdControl.value,
    }
    cl(updatedObj)
    let updatedId = localStorage.getItem("editId");

    let UPDATED_URL = `${BASE_URL}/posts/${updatedId}`;
    let xhr = new XMLHttpRequest();
    loader.classList.remove("d-none");
    xhr.open("PATCH", UPDATED_URL);
    xhr.onload = function (){
        setTimeout(() => {
            if(xhr.status >= 200 && xhr.status < 300 ){
                let card = [...document.getElementById(updatedId).children];
                card[0].innerHTML = `<h2>${updatedObj.title}</h2>`;
                card[1].innerHTML = `<p>${updatedObj.body}</p>`
    
                postForm.reset();
    
                submitBtn.classList.remove("d-none");
                updateBtn.classList.add('d-none');
                loader.classList.add("d-none");
                sweetAleart("POST updated successfully !!!", "success");
            }
        },2000)
    }
    xhr.send(JSON.stringify(updatedObj))

    
}

const onAddPost = (eve) => {
    eve.preventDefault()
    let newPost = {
        title : titleControl.value,
        body : contentControl.value,
        userId : userIdControl.value
    }
    postForm.reset();

    let xhr = new XMLHttpRequest();
    loader.classList.remove("d-none");
    xhr.open("POST", POST_URL);
    xhr.onload = function () {
        setTimeout(() => {
            if(xhr.status >= 200 && xhr.status < 300){
                newPost.id = JSON.parse(xhr.response).id;
                postArr.unshift(newPost)
    
                let newCard = document.createElement("div");
                newCard.className = "col-md-4 mb-4";
                newCard.innerHTML = `
                            <div class="card postCard h-100" id='${newPost.id}'>
                                <div class="card-header">
                                    <h2>${newPost.title}</h2>
                                </div>
                                <div class="card-body">
                                    <p>${newPost.body}</p>
                                </div>
                                <div class="card-footer d-flex justify-content-between">
                                    <button onclick = "onEdit(this)" class="btn btn-outline-primary">EDIT</button>
                                    <button onclick = "onRemove(this)" class="btn btn-outline-danger">REMOVE</button>
                                </div>
                            </div>
                                 `
                postContainerId.prepend(newCard);
                loader.classList.add("d-none");
                sweetAleart("New POST Added successfully !!!", "success");
                
            }
        },1000)
        
    }
    

    xhr.send(JSON.stringify(newPost));

    
}


updateBtn.addEventListener("click", onUpdateBtn)
postForm.addEventListener("submit", onAddPost)