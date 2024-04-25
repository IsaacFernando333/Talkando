document.addEventListener('click', (e) => {
    const cc = document.querySelector('.caixa-corpo');
    if (cc.offsetWidth > 1100) {
        const f = document.querySelectorAll('.pic');
        for (ele of f) {
            const k = ele.parentElement;
            const p = k.parentElement;
            if (e.target === ele) {
                p.style.zIndex = '999';
                p.style.boxShadow = '0 0 200px 20px black';
                p.style.transform = 'scale(1.2)';
            } else {
                p.style.zIndex = '998';
                p.style.boxShadow = 'none';
                p.style.transform = 'scale(1)';
            }
        }
    } else {
        return;
    }
});

document.addEventListener('click', async (e) => { 
    const elemento = document.querySelectorAll('.apagaPubli');
    const cx = document.querySelector('.caixa-publi');
    for (lx of elemento) {
        if (e.target === lx) {
            const checa = confirm('tem certeza que deseja excluir essa publicação?');
            if (checa === true) {
                const idp = lx.closest('.publi').getAttribute('class').split(' ')[1];;
                const token = sessionStorage.getItem('token');
                const data = { idp };
                const options = {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization':`Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                };
                const req = await fetch('/user/delete', options);
                const res = await req.json();
                cx.removeChild(lx.parentElement.parentElement.parentElement.parentElement);
            } else {
                return;
            }
        }
    }
});

document.addEventListener('click', async (e) => {
    const comentar = document.querySelectorAll('.comment');
    for (c of comentar) {
        if (e.target === c) {
            let cxbt = c.parentElement.nextSibling;
            if (cxbt.style.display !== 'flex') {
                cxbt.style.display = 'flex';
                return;
            }
            if (cxbt.style.display === 'flex') {
                cxbt.style.display = 'none';
            }
        }
    }
});

document.addEventListener('click', async (e) => {
    const like = document.querySelectorAll('.like');
    for (li of like) {
        if (e.target === li) {
            if (li.style.color === 'purple') {
            
                alert('Só se pode curtir uma vez por sessão.');
                return;
            }
            const qtlk = parseInt(li.nextSibling.innerText);
            const newqtlk = qtlk + 1;
            li.nextSibling.innerText = newqtlk;
            li.style.color = 'purple';
            const idp = li.closest('.publi').getAttribute('class').split(' ')[1];
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({idp})
            };
            const response = await fetch('/give/like', options);
            const json = await response.json();
            return;
        }
    }
});

document.addEventListener('click', async (e) => {
    const btcm = document.querySelectorAll('#enviarComentario');
    for (b of btcm) {
        if (e.target === b) {
            const idp = b.closest('.publi').getAttribute('class').split(' ')[1];
            let comentario = b.parentElement.childNodes[1].value;
            let cxpr = b.parentElement;
            if (comentario === '') {
                return;
            }
            let cf = b.parentElement.childNodes[1];
            cxpr.style.display = 'none';
            const token = (sessionStorage.getItem('token'));
            
            const data = {token, idp, comentario};
            cf.value = '';
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            };
            const response = await fetch('/give/comment', options);
            const json = await response.json();
            cxpr.style.display = 'none';
            return;
        }
    }
});

const olha = function() {
    const neutro = ["normal", "calmo", "indiferente", "cético", "curioso"];
    const positivo = ["feliz", "animado", "empolgado", "grato", "surpreso", "motivado", "esperancoso", "otimista", "agradecido", "euforico", "encantado"];
    const negativo = ["triste", "depressivo", "irritado", "ansioso", "nostalgico", "confuso", "desanimado", "melancolico", "desapontado"];
    // let contador = 0;
    let intervalo = setInterval(() => {
        const md = document.querySelectorAll('.humor');
        if (md.length > 0) {
            for (mood of md) {
                if (mood.innerHTML === '') {
                    mood.style.display = 'none';
                } else if (neutro.includes(mood.innerHTML)) {
                    mood.style.color = 'tan';
                } else if (positivo.includes(mood.innerHTML)) {
                    mood.style.color = 'cornflowerblue';
                } else if (negativo.includes(mood.innerHTML)) {
                    mood.style.color = 'tomato';
                }
            }
            // clearInterval(intervalo);
        }
        // contador += 1;
        // if (contador === 200) {
        //     clearInterval(intervalo);
        // }
    }, 100);
}

olha();

function verificaSeEstaLogado() {
    if (sessionStorage.getItem('token') === null) {
        window.location.href = "index.html";
    }
}

setInterval(verificaSeEstaLogado, 100);