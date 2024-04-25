sessionStorage.removeItem("token");
const button = document.getElementById('submit-l');
button.addEventListener('click', async event => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('senha').value;
    if (password === '' || email === '') {
        alert('Preecha todos os campos.');
        return;
    }

    const data = {email, password};
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)    
    };
    
    const req = await fetch('/auth/login', options);
    const res = await req.json();
    if (res.token === undefined) {
        alert('Usuário inexistente');
        return;
    }
    sessionStorage.setItem('token', res.token);
    window.location.href = "./HOME.html";
});

const email = document.getElementById('email');
const password = document.getElementById('senha');

document.addEventListener('keydown', (e) => {
    if (e.target === email) {
        if (e.key === 'Enter') {
            password.focus();
        }
    } else if (e.target === password) {
        if (e.key === 'Enter') {
            button.click();
        }
    }
})