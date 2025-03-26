const backenUrl = 'https://recipe-manager-backend-zsgm.onrender.com';
// const backenUrl = 'http://localhost:4000';

async function checkSession() {
    try {
        const response = await fetch(`${backenUrl}/accounts/session`, {
            method: "GET",
        });
        const data = await response.json();

        console.log(data);

        if (data.isLoggedIn === false) {
            window.location.href = 'pages/login.html';
            return false;
        }
        return true;
    } catch (error) {
        console.error(`Internal server error.`, error);
        return false;
    }
}

async function fetchRecipes() {
    try {
        const response = await fetch(`${backenUrl}/recipes/all`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
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
                            <ul class="ingredients-list">
                                ${ingredientsHtml}
                            </ul>
                        </li>`;
            })
            .join("");
    } catch (error) {
        console.error(`Internal server error.`, error);
    }
}

function seeRecipe(id) {
    const params = new URLSearchParams({ id, id });
    window.location.href = `./pages/recipe.html?${params.toString()}`;
}

async function searchByName(keyword) {
    try {
        const response = await fetch(`${backenUrl}/recipes/search/name`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
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
                            <ul class="ingredients-list">
                                ${ingredientsHtml}
                            </ul>
                        </li>`;
            })
            .join("");
    } catch (error) {
        console.error(`Internal server error.`, error);
    }
}

async function searchByIng(keyword) {
    try {
        const response = await fetch(`${backenUrl}/recipes/search/ingredient`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
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
                            <ul class="ingredients-list">
                                ${ingredientsHtml}
                            </ul>
                        </li>`;
            })
            .join("");
    } catch (error) {
        console.error(`Internal server error.`, error);
    }
}

async function logout() {
    try {
        const response = await fetch(`${backenUrl}/accounts/signout`, {
            method: "POST",
        });
        const data = await response.json();
        window.location.href = 'index.html';
    } catch (error) {
        console.error(`Internal server error.`, error);
    }    
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

async function initializePage() {
    try {
        await checkSession();

        const isSessionValid = await checkSession();

        if (!isSessionValid) {
            return;
        }

        await fetchRecipes();
    } catch (error) {
        console.error("Internal server error:", error);
    }
}


initializePage();
// checkSession();

// fetchRecipes();

const currentYear = new Date().getFullYear();
document.querySelector("#year").innerHTML = currentYear;