const backenUrl = 'https://recipe-manager-backend-wnjt.onrender.com';
// const backenUrl = 'http://localhost:4000';

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

let recipeImgUrl = '';

async function checkSession() {
    try {
        const response = await fetch(`${backenUrl}/accounts/session`, {
            method: "GET",
        });
        const data = await response.json();

        if (data.isLoggedIn === false) {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error(`Internal server error.`, error);
    }
}

async function fetchRecipe() {
    try {
        const response = await fetch(`${backenUrl}/recipes/detail`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({ recipeId: id }), 
        });
        const data = await response.json();
        const recipeData = data.data[0];

        if (recipeData.image_url !== '') {
            recipeImgUrl = recipeData.image_url;
            document.getElementById("edit-recipe-img").src = recipeData.image_url;
        } else {
            recipeImgUrl = `../assets/no_image.png`;
            document.getElementById("edit-recipe-img").src = `../assets/no_image.png`;
        }

        document.getElementById("title-label").innerHTML = `タイトル<input type="text" name="title" value="${recipeData.name}" required>`;

        let iCount = -1;
        const ingredientsHtml = recipeData.ingredients
            .map(ingredient => {
                iCount += 1;
                return `<div class="ingredient-input" id="i-id-${iCount}">
                            <input type="text" name="ingredientName" placeholder="名前" value="${ingredient.name}">
                            <input type="text" name="ingredientAmount" placeholder="量" value="${ingredient.amount}">
                            <svg onclick="cancelIngredient(${iCount})" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-x-circle cancel-btn" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg>
                        </div>
                        `
            })
            .join("");
        document.getElementById("ingredient-inputs").innerHTML = ingredientsHtml;

        let sCount = -1;
        const stepsHtml = recipeData.steps
            .map(step => {
                sCount += 1;
                return ` <div class="step-input" id="s-id-${sCount}">
                            <textarea type="text" name="step">${step.name}</textarea>            
                            <svg onclick="cancelStep(${sCount})" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-x-circle cancel-btn" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg>
                        </div>
                        `
            })
            .join("");
        document.getElementById("step-inputs").innerHTML = stepsHtml;

    } catch (error) {
        console.error(`Internal server error.`, error);
    }
}

async function applyEdit() {
    const form = document.getElementById("recipe-add-form");
    const formData = new FormData(form);

    if (formData.get("uploadedImg").name !== '') {
        const recipeImgRaw = formData.get("uploadedImg");
        let formImgData = new FormData();
        formImgData.append('file', recipeImgRaw);
        formImgData.append('recipeId', id);
        if (recipeImgUrl === `../assets/no_image.png`) {
            formImgData.append('previousUrl', '');
        } else {
            formImgData.append('previousUrl', recipeImgUrl);
        }

        try {
            const response = await fetch(`${backenUrl}/recipes/edit/upload`, {
                method: "POST", 
                body: formImgData, 
            });
            const data = await response.json();
            recipeImgUrl = data.url;
        } catch (error) {
            console.error(`Internal server error.`, error);
        }
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
        recipeId: id, 
        imageUrl: recipeImgUrl, 
        title: formData.get("title"), 
        ingredient: ingredientList, 
        step: stepList
    }

    try {
        const response = await fetch(`${backenUrl}/recipes/edit`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
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

function cancelEdit() {
    window.location.href = ("../index.html");
}

async function deleteRecipe() {
    let deleteImgUrl = '';
    if (recipeImgUrl === `../assets/no_image.png`) {
        deleteImgUrl = '';
    } else {
        deleteImgUrl = recipeImgUrl;
    }

    try {
        const response = await fetch(`${backenUrl}/recipes/delete`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({ recipeId: id, recipeUrl: deleteImgUrl }), 
        });
        location.href = '../index.html';
    } catch (error) {
        console.error(`Internal server error.`, error);
    }
}

document.getElementById("recipe-img-input").addEventListener("change", function(event) {
    const file = event.target.files[0];
    document.getElementById("edit-recipe-img").src = URL.createObjectURL(file);
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

checkSession();

fetchRecipe();

const currentYear = new Date().getFullYear();
document.querySelector("#year").innerHTML = currentYear;