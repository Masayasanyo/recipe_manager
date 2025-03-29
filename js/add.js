const backenUrl = 'https://recipe-manager-backend-krsk.onrender.com';
// const backenUrl = 'http://localhost:4000';

async function applyAdd() {
    const form = document.getElementById("recipe-add-form");
    const formData = new FormData(form);

    const recipeImgRaw = formData.get("uploadedImg");
    let formImgData = new FormData();
    formImgData.append('file', recipeImgRaw);
    let url = "";

    try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${backenUrl}/recipes/add/upload`, {
            method: "POST", 
            headers: {
                'Authorization': `Bearer ${token}`
            }, 
            body: formImgData, 
        });
        const data = await response.json();
        url = data.url;
    } catch (error) {
        console.error(`Internal server error.`, error);
        return;
    }

    const ingredientNames = Array.from(document.querySelectorAll('[name="ingredientName"]'))
        .map(input => input.value);
    const ingredientAmounts = Array.from(document.querySelectorAll('[name="ingredientAmount"]'))
        .map(input => input.value);
    let ingredientList = [];
    for (let i = 0; i < ingredientNames.length; i++) {
        ingredientList.push({name: ingredientNames[i], amount: ingredientAmounts[i]});
    }

    const stepNames = Array.from(document.querySelectorAll('[name="step"]'))
        .map(input => input.value);
    let stepList = [];
    for (let i = 0; i < stepNames.length; i++) {
        stepList.push({name: stepNames[i], order: i + 1});
    }

    const recipeData = {
        imageUrl: url, 
        title: formData.get("title"), 
        ingredient: ingredientList, 
        step: stepList
    }

    try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${backenUrl}/recipes/add`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            }, 
            body: JSON.stringify(recipeData), 
        });
        const data = await response.json();

        location.href = '../index.html';
    } catch (error) {
        console.error(`Internal server error.`, error);
    }
}

function cancelAdd() {
    window.location.href = ("../index.html");
}

function cancelIngredient(id) {
    const targetId = `i-id-${id}`;

    let currrentHtml = document.querySelectorAll(".ingredient-input");

    currrentHtml.forEach(html => {
        if (html.id === targetId) {
            html.remove();
        }
    });
}

function cancelStep(id) {
    const targetId = `s-id-${id}`;

    let currrentHtml = document.querySelectorAll(".step-input");

    currrentHtml.forEach(html => {
        if (html.id === targetId) {
            html.remove();
        }
    });
}

document.getElementById("recipe-img-input").addEventListener("change", function(event) {
    const file = event.target.files[0];
    document.getElementById("recipe-img").src = URL.createObjectURL(file);
});

document.getElementById("new-ingredient").addEventListener("click", function() {
    const currrentHtml = document.querySelectorAll(".ingredient-input");

    let lastId = 0;
    let newId = 0;
    if (currrentHtml.length > 0) {
        lastId = Number(String(currrentHtml[currrentHtml.length - 1].id).split("-")[2]);
        newId = lastId + 1;
    } 
   
    const newHtml = `
                    <input type="text" name="ingredientName" placeholder="名前">
                    <input type="text" name="ingredientAmount" placeholder="量">
                    <svg onclick="cancelIngredient(${newId})" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-x-circle cancel-btn" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                    `;

    const newNode = document.createElement('div');
    newNode.classList.add('ingredient-input');
    newNode.id = `i-id-${newId}`;
    newNode.innerHTML = newHtml;

    document.getElementById("ingredient-inputs").appendChild(newNode);
});

document.getElementById("new-step").addEventListener("click", function() {
    const currrentHtml = document.querySelectorAll(".step-input");

    let lastId = 0;
    let newId = 0;
    if (currrentHtml.length > 0) {
        lastId = Number(String(currrentHtml[currrentHtml.length - 1].id).split("-")[2]);
        newId = lastId + 1;
    } 
   
    const newHtml = `
                    <textarea type="text" name="step"></textarea>
                    <svg onclick="cancelStep(${newId})" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-x-circle cancel-btn" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                    `;

    const newNode = document.createElement('div');
    newNode.classList.add('step-input');
    newNode.id = `s-id-${newId}`;
    newNode.innerHTML = newHtml;

    document.getElementById("step-inputs").appendChild(newNode);
});

const currentYear = new Date().getFullYear();
document.querySelector("#year").innerHTML = currentYear;