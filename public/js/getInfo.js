async function getData(a, b, c, t) {
    
    const options = {
        method: 'GET',
        headers: {
            'Content-Type':'application/json',
            'authorization':`Bearer ${t}`
        }
    }
    
    const req = await fetch('/user/publis', options);
    const res = await req.json();
    
    function urlify(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g
        return text.replace(urlRegex, function(url) {
          return '<a class="link" target="_blank" href="' + url + '">' + url + '</a>'
        })
    }

    function retornaEmbeds(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        var matches_array = text.match(urlRegex);
        let novos = [];
        if (matches_array !== null) {
            for (e of matches_array) {
                if (e.slice(0, 25) === 'https://www.youtube.com/w') {
                    novos.push(`<iframe width="560" height="315" src="${e.slice(0, 24) + 'embed/' + e.slice(32, 43)}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`);
                }
            }
            return novos;
        }
    }
    
    for (item of res) {

        //Criando elementos

        const ifo4 = document.querySelector('.caixa-publi');
        const ifo5 = document.createElement('div');
        const local = document.createElement('a');
        const date = document.createElement('p');
        const nome = document.createElement('a');
        const titulo = document.createElement('h3');
        const img = document.createElement('img');
        const pct = document.createElement('img');
        const infp = document.createElement('div');
        const ic = document.createElement('div');
        const im = document.createElement('div');
        const ip = document.createElement('div');
        const tp = document.createElement('div');
        const mood = document.createElement('h3');
        const likcom = document.createElement('div');
        const or = document.createElement('div');
        let come = document.createElement('div');
        const divLixo = document.createElement('div');
        const lixo = document.createElement('a');
        const divEmbed = document.createElement('div');

        //Atribuindo atributos

        local.setAttribute('id', 'local');
        date.setAttribute('id', 'date');
        nome.setAttribute('id','nome');
        titulo.setAttribute('id','titulo');
        img.setAttribute('class','pic');
        ic.setAttribute('class','informações-cima ic-home');
        im.setAttribute('class','informações-meio');
        ip.setAttribute('class','imagem-principal');
        tp.setAttribute('class','titulo-publi');
        mood.setAttribute('class', 'humor');
        infp.setAttribute('class','info-pequenas');
        ifo5.setAttribute('class',`publi ${item._id}`);
        likcom.setAttribute('class', 'cxintera');
        or.setAttribute('class', 'orCima'); 
        come.setAttribute('class', 'comeT');
        divLixo.setAttribute('class', 'divLixo');
        divEmbed.setAttribute('class', 'embed');
        
        //Atribuindo valores

        local.textContent = a;
        nome.textContent = b;
        pct.src = `${c}`;
        lixo.innerHTML = `<ion-icon class="apagaPubli" name="trash-outline"></ion-icon>`;
        titulo.innerHTML = urlify(item.titulo).replace(/(\r\n|\n|\r)/gm, "<br>");
        mood.textContent = item.humor;
        date.textContent = item.date;
        if (item.pic !== null) {
            img.src = `${item.pic}`;
        } else {
            img.src = '';
            img.style.height = 0;
        }
        likcom.innerHTML = `<div class="cxbt"><ion-icon class="like gostei" name="thumbs-up-outline"></ion-icon><a class="nLikes">${item.like}</a><ion-icon class="comment" name="chatbubble-ellipses-outline"></ion-icon><a class="nLikes">${item.qtd_cm}</a></div><span class="escreveComentario">
        <textarea name="" placeholder="Seu comentário" id="textComentario" cols="30" rows="3"></textarea>
        <button id="enviarComentario" class="buttCom">></button>
        </span>`

        //Arrumando a hierarquia das tags

        divLixo.appendChild(lixo);
        or.appendChild(pct);
        or.appendChild(infp);
        ic.appendChild(or);
        ic.appendChild(divLixo);
        tp.appendChild(titulo);
        tp.appendChild(mood);
        im.appendChild(tp);
        ip.appendChild(img);

        if (retornaEmbeds(item.titulo) !== undefined) {
            for (z of retornaEmbeds(item.titulo)) {
                ip.innerHTML += z;
            }
        }
        if (item.embed !== undefined) {
            divEmbed.innerHTML = item.embed;
            ip.appendChild(divEmbed);
        }
        
        ifo5.appendChild(ic);
        ifo5.appendChild(im);
        ifo5.appendChild(tp);
        ifo5.appendChild(ip);
        ifo5.appendChild(likcom);
        ifo5.appendChild(come);



        const token = sessionStorage.getItem('token');
        const options = {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'authorization':`Bearer ${token}`
            },
            body: JSON.stringify({idP: item._id})
        }
        
        const req = await fetch('/get/comment', options);
        const res = await req.json();


        for (o of res.comentarios) {
            let div = document.createElement('div');
            div.setAttribute('class', 'osComentarios');
            div.innerHTML = `<a class="nomeComentador" href="/Profile/${o.idPessoa}">${o.name}</a> ~ ${o.comentario}`;
            come.appendChild(div);
        }

        ifo4.appendChild(ifo5);
        infp.appendChild(nome);
        infp.appendChild(date);
        infp.appendChild(local);
    }
}


async function getUserInfo() {
    const token = sessionStorage.getItem('token');
    const options = {
        method: 'GET',
        headers: {
            'Content-Type':'application/json',
            'authorization':`Bearer ${token}`
        }
    }
    
    const req = await fetch('/user/info', options);
    const res = await req.json();

    const foto = document.querySelector('.foto');
    const fotoCapa = document.querySelector('.apresentacao');
    const name = document.querySelector('.nome');
    const apre = document.querySelector('.info');
    const genero = document.querySelector('.sexo');
    const nasc = document.querySelector('.nascimento');
    
    foto.style.backgroundImage = `url(${res.user.avatar})`;
    fotoCapa.style.backgroundImage = `url(${res.user.capa})`;
    name.textContent = res.user.name;
    apre.textContent = res.user.apresentacao;
    genero.textContent = res.user.sexo;
    nasc.textContent = res.user.nascimento;

    getData(res.user.local, res.user.name, res.user.avatar, token);
}

getUserInfo();

async function getFollow() {
    const token = sessionStorage.getItem('token');
    const options = {
        method: 'GET',
        headers: {
            'Content-Type':'application/json',
            'authorization':`Bearer ${token}`
        }
    }
    
    const req = await fetch('/following/list', options);
    const res = await req.json();

    const amigos = document.querySelector('.friends');
    for (el of res.data) {
        amigos.innerHTML += `<div class="amigo"><img class="picFriends" src="${el.avatar}"><a href="/profile/${el.idfollow}">${el.name}</a></div>`;
    }
}

getFollow();