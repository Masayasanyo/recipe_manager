const backenUrl = 'https://recipe-manager-backend-krsk.onrender.com';
// const backenUrl = 'http://localhost:4000';

async function login(userData) {
    try {
        const response = await fetch(`${backenUrl}/accounts/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(userData), 
        });
        const data = await response.json();
        localStorage.setItem('jwt', data.token);
        location.href = '../index.html';
    } catch (error) {
        console.error(`Internal server error.`, error);
    }
}

async function signUp() {
    const form = document.getElementById("signup-form");
    const formData = new FormData(form);
    
    let password = '';
    if (formData.get("password") !== formData.get("confirmed-password")) {
        alert('確認用パスワードが一致していません。');
        return;
    } else {
        password = formData.get("password");
    }

    const userData = {
        email: formData.get("email"), 
        password: password, 
    }

    try {
        await fetch(`${backenUrl}/accounts/signup`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify(userData), 
        });
        await login(userData);
    } catch (error) {
        console.error(`Internal server error.`, error);
    }
}