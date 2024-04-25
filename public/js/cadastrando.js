sessionStorage.removeItem("token");

window.onload = function () {sessionStorage.removeItem("img");sessionStorage.removeItem("imgCapa");};

const foto = document.getElementById('aFoto');
const fotoCapa = document.getElementById('aFotoCapa');

foto.addEventListener("change", (e) => {
    let size = foto.files[0].size;
    if(size > (1048576 * 5)) {
        alert('Apenas arquivos abaixo de 5 megabytes');
        foto.value = "";
        sessionStorage.removeItem("img");
    }
    e.preventDefault();
    const fr = new FileReader();
    if (foto.value !== '') {
        fr.readAsDataURL(foto.files[0]);
    };
    fr.addEventListener('load', () => {
        const url = fr.result;
        sessionStorage.setItem('img', url);
    });
})

fotoCapa.addEventListener("change", (e) => {
    let size = fotoCapa.files[0].size;
    if(size > (1048576 * 5)) {
        alert('Apenas arquivos abaixo de 5 megabytes');
        fotoCapa.value = "";
        sessionStorage.removeItem("imgCapa");
    }
    e.preventDefault();
    const fr = new FileReader();
    if (fotoCapa.value !== '') {
        fr.readAsDataURL(fotoCapa.files[0]);
    };
    fr.addEventListener('load', () => {
        const url = fr.result;
        sessionStorage.setItem('imgCapa', url);
    });
})


const button = document.getElementById('submit');
button.addEventListener('click', async event => { 

    const name = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('senha').value;
    const sexo = document.getElementById('sexos').value;
    const local = document.getElementById('local').value;
    const apresentacao = document.getElementById('textoApresenta').value;
    const nascBruto = document.getElementById('date').value;
    const nascimento = `${nascBruto.slice(8, 10)}/${nascBruto.slice(5, 7)}/${nascBruto.slice(0, 4)}`;
    const avatar = sessionStorage.getItem('img');
    const capa = sessionStorage.getItem('imgCapa');
    const friends = new Array();
    
    if (name === null || password === null || email === null) {
        alert('Preencha nome, senha e email');
        return;
    }

    const data = { name, email, password, apresentacao, nascimento, sexo, local, avatar, capa, friends };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)    
    };

    const req = await fetch('/auth/register', options);
    const res = await req.json();
    window.location.href = "./index.html";
});