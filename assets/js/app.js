const cl = console.log;

const postForm = document.getElementById("postForm");
const postContainer = document.getElementById("postContainer");
const titleControl = document.getElementById("title");
const bodyControl = document.getElementById("body");
const userIdControl = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const loader = document.getElementById("loader");


let baseUrl = `http://localhost:3000`;

let postsUrl = `${baseUrl}/posts`;


const templatingOfPost = (arr) => {
    let result = ``;
    arr.forEach(post => {
        result += `<div class="card mb-4 bgCard2" id="${post.id}">
                     <div class="card-header">
                         <h2>${post.title}</h2>
                     </div>
                     <div class="card-body">
                         <p>${post.body}</p>
                     </div>
                     <div class="card-footer d-flex justify-content-between">
                         <button class="btn btn-outline-primary" onclick="onEdit(this)">Edit</button>
                         <button class="btn btn-outline-danger" onclick="onDelete(this)">Delete</button>
                     </div>
                    </div> `
    });
    postContainer.innerHTML = result;
}

const onEdit = (ele) => {
    let editId = ele.closest(".card").id;
    localStorage.setItem("editId", editId);
    let editUrl = `${baseUrl}/posts/${editId}`
    
    
      makeApiCall("GET", editUrl)
         .then(res => {
            let resObj = JSON.parse(res)

            titleControl.value = resObj.title;
            bodyControl.value = resObj.body;
            userIdControl.value = resObj.userId;
            
            submitBtn.classList.add("d-none");
            updateBtn.classList.remove("d-none");

            function scroll() {                 
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth',
                      timer:100
                    });
                  }
                  scroll()
         })
         .catch(err => {
            cl(err)
         })
    
}

const onUpdatePost = () => {
    let updateId = localStorage.getItem("editId")
    let updateUrl = `${baseUrl}/posts/${updateId}`
    let updateObj = {
        title : titleControl.value,
        body : bodyControl.value,
        userId : userIdControl.value,
        id : updateId
    }
    cl(updateObj)

    Swal.fire({
         position: "center",
         icon: "success",
         title: "Your work has been saved",
         timer: 1500
       });

    makeApiCall("PUT", updateUrl, updateObj)
         .then(res => {
            cl(res)
            
         })
         
         .catch(err =>{
            cl(err)
         })
         .finally(() => {
            updateBtn.classList.add("d-none");
            submitBtn.classList.remove("d-none");
         })
}

updateBtn.addEventListener("click", onUpdatePost)

const onDelete = (ele) => {
    let deleteId = ele.closest(".card").id;
    let deleteUrl = `${baseUrl}/posts/${deleteId}`;
   
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
        makeApiCall("DELETE", deleteUrl)
             .then(res => cl(res))
             .catch(err => cl(err))
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });        
        }
      });
    
}


const makeApiCall = (methodName, apiUrl, body = null) => {
    loader.classList.remove("d-none")
    return apiCall = new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(methodName, apiUrl);
    xhr.setRequestHeader("Content-type", "application/json")
    if(body){
        xhr.send(JSON.stringify(body))

    }else{
        xhr.send()
    }
    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            // API call is success >> promise must be resolve
            resolve(xhr.response)
            loader.classList.add("d-none")
        } else {
            reject(`API call is failed with status : ${xhr.status}`)
        }
    }
})
}

makeApiCall("GET", postsUrl)
    .then(res => {
        // cl(res)
        templatingOfPost(JSON.parse(res))
    })
    .catch(err => {
        cl(err)
    })
    
const onCreatePost = (eve) => {
    eve.preventDefault();
    let postObj = {
        title : titleControl.value,
        body : bodyControl.value,
        userId : userIdControl.value
    }
    cl(postObj)

    makeApiCall("POST", postsUrl, postObj)
        .then(res => {
            cl(res)
            Swal.fire({
                title: "Created",
                text: "New post created successfully",
                icon: "success"
              }); 
        })
        .catch(err => cl(err))
        .finally(() => {
            eve.target.reset()
        })
}

postForm.addEventListener("submit", onCreatePost)