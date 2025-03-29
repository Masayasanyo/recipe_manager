const backenUrl = 'https://recipe-manager-backend-krsk.onrender.com';
// const backenUrl = 'http://localhost:4000';

async function fetchRecipes() {
    try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${backenUrl}/recipes/all`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            }, 
        });
        const data = await response.json();

        const recipeList = data.data;

        document.getElementById("recipe-list").innerHTML = recipeList
            .map(recipe => {
                const id = recipe.id;
                let url = '';
                if (recipe.image_url !== '') {
                    url = recipe.image_url;
                } else {
                    url = 'assets/no_image.png';
                }
                
                const title = recipe.name;

                const ingredientsHtml = recipe.ingredients
                    .map(ingredient => {
                        return ` <li class="ingredient">${ingredient.name}, </li>`;
                    })
                    .join("");

                return `<li class="recipe" onclick="seeRecipe(${id})">
                            <img src="${url}" class="recipe-image" alt="recipe image">
                            <p class="recipe-title">${title}</p>
                        </li>`;
            })
            .join("");
    } catch (error) {
        console.error(`Internal server error.`, error);
        window.location.href = 'pages/login.html';
    }
}

function seeRecipe(id) {
    const params = new URLSearchParams({ id, id });
    window.location.href = `./pages/recipe.html?${params.toString()}`;
}

async function searchByName(keyword) {
    try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${backenUrl}/recipes/search/name`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            }, 
            body: JSON.stringify({ keyword: keyword }), 
        });
        const data = await response.json();
        const recipeList = data.data;

        document.getElementById("recipe-list").innerHTML = recipeList
            .map(recipe => {
                const id = recipe.id;
                let url = '';
                if (recipe.image_url !== '') {
                    url = recipe.image_url;
                } else {
                    url = 'assets/no_image.png';
                }
                
                const title = recipe.name;

                const ingredientsHtml = recipe.ingredients
                    .map(ingredient => {
                        return ` <li class="ingredient">${ingredient.name}, </li>`;
                    })
                    .join("");

                return `<li class="recipe" onclick="seeRecipe(${id})">
                            <img src="${url}" class="recipe-image" alt="recipe image">
                            <p class="recipe-title">${title}</p>
                        </li>`;
            })
            .join("");
    } catch (error) {
        console.error(`Internal server error.`, error);
    }
}

async function searchByIng(keyword) {
    try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${backenUrl}/recipes/search/ingredient`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            }, 
            body: JSON.stringify({ keyword: keyword }), 
        });
        const data = await response.json();
        const recipeList = data.data;

        document.getElementById("recipe-list").innerHTML = recipeList
            .map(recipe => {
                const id = recipe.id;
                let url = '';
                if (recipe.image_url !== '') {
                    url = recipe.image_url;
                } else {
                    url = 'assets/no_image.png';
                }
                
                const title = recipe.name;

                const ingredientsHtml = recipe.ingredients
                    .map(ingredient => {
                        return ` <li class="ingredient">${ingredient.name}, </li>`;
                    })
                    .join("");

                return `<li class="recipe" onclick="seeRecipe(${id})">
                            <img src="${url}" class="recipe-image" alt="recipe image">
                            <p class="recipe-title">${title}</p>
                        </li>`;
            })
            .join("");
    } catch (error) {
        console.error(`Internal server error.`, error);
    }
}

async function logout() {
    localStorage.removeItem('jwt');
    window.location.href = 'index.html';
}

document.getElementById("search-input").addEventListener("keypress", async function(e) {
    if (e.key === 'Enter') {
        const searchType = document.getElementById("search-select").value;
        const keyword = document.getElementById("search-input").value;

        if (searchType === 'name') {
            searchByName(keyword);
        } else {
            searchByIng(keyword);
        }
    }
});

fetchRecipes();

const currentYear = new Date().getFullYear();
document.querySelector("#year").innerHTML = currentYear;