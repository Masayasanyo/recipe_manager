const backenUrl = 'https://recipe-manager-backend-zsgm.onrender.com';
// const backenUrl = 'http://localhost:4000';

async function login() {
    const form = document.getElementById("login-form");
    const formData = new FormData(form);

    const userData = {
        email: formData.get("email"), 
        password: formData.get("password"), 
    }

    try {
        const response = await fetch(`${backenUrl}/accounts/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(userData), 
        });
        const data = await response.json();

        location.href = '../index.html';
    } catch (error) {
        console.error(`Internal server error.`, error);
    }
}