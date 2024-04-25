const preview = document.getElementById('preview');

if (preview.src === 'http://localhost:4000/html/mandar.html') {
    preview.style.display = 'none';
}

// function verificaSeEstaLogado() {
//     if (sessionStorage.getItem('id') === null) {
//         location.reload();
//         window.location.href = "index.html";
//     } else {
//         return;
//     }
// }


const button = document.getElementById('submit');
const foto = document.getElementById('aFoto');

function previewFOTO() {
    const FotoPerfil = document.getElementById('preview').getAttribute('src');
    return FotoPerfil;
}

foto.addEventListener("change", (e) => {
    if(foto.files[0].size > (1048576 * 5)) {  
    alert('Apenas arquivos abaixo de 5 megabytes');
    foto.value = "";
    }
    e.preventDefault();
    const fr = new FileReader();
    if (foto.value !== '') {
        fr.readAsDataURL(foto.files[0]);
    };

    fr.addEventListener('load', () => {
        const url = fr.result;
        const preview = document.getElementById('preview');
        preview.src = url;
        preview.style.display = 'flex';
    });
})

button.addEventListener('click', async event => {
    const dateForm = new Date();
    let dia, mes, ano, hora;
    dia = dateForm.getDate();
    mes = (dateForm.getMonth() + 1);
    ano = dateForm.getFullYear();
    hora = dateForm.getHours();
    minutos = dateForm.getMinutes();
    
    if (mes < 10) {
        mes = `0${dateForm.getMonth() + 1}`;
    }
    if (dia < 10) {
        dia = `0${dateForm.getDate()}`;
    }
    if (hora < 10) {
        hora = `0${dateForm.getHours()}`;
    }
    if (minutos < 10) {
        minutos = `0${dateForm.getMinutes()}`;
    }
    const date = `${dia}/${mes}/${ano} às ${hora}:${minutos}`;
    const titulo = document.getElementById('titulo').value;
    const embed = document.getElementById('embed').value;
    const humor = document.getElementById('humor').value;
    const pic = previewFOTO();
    const like = 0;
    const date_now = Date.now();
    const comentarios = new Array();
    const qtd_cm = 0;
    
    if (pic === null && titulo === '') {
        alert('Preencha ao menos um dos campos');
        return;
    }

    const token = sessionStorage.getItem('token');
    const data = { date, titulo, embed, pic, humor, like, date_now, comentarios, qtd_cm };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization':`Bearer ${token}`
        },
        body: JSON.stringify(data)
    };

    const res = await fetch('/user/publication', options);
    const req = await res.json();
    sessionStorage.removeItem("img");
    window.location.href = "./HOME.html";
});
