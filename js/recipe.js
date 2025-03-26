const backenUrl = 'https://recipe-manager-backend-zsgm.onrender.com';
// const backenUrl = 'http://localhost:4000';

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
checkSession();

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

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
            document.getElementById("recipe-image").src = recipeData.image_url;
        } else {
            document.getElementById("recipe-image").src = `../assets/no_image.png`;
        }

        document.getElementById("recipe-title").innerHTML = recipeData.name;

        document.getElementById("ingredients-list").innerHTML = recipeData.ingredients
            .map(ingredient => {
                return `<li class="ingredient">
                            <span class="ingredient-name">${ingredient.name}</span>...
                            <span class="ingredient-amount">${ingredient.amount}</span>
                        </li>`;
            })
            .join("");

        document.getElementById("step-list").innerHTML = recipeData.steps
            .map(step => {
                return `<li class="step">${step.name}</li>`;
            })
            .join("");

        document.getElementById("edit-btn").addEventListener("click", function() {
            const params = new URLSearchParams({ id, id });
            window.location.href = `./edit.html?${params.toString()}`;
        });

    } catch (error) {
        console.error(`Internal server error.`, error);
    }
}

fetchRecipe();

const currentYear = new Date().getFullYear();
document.querySelector("#year").innerHTML = currentYear;