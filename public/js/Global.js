getUserInfo();
async function getUserInfo() {
    const token = sessionStorage.getItem('token');
    const options = {
        method: 'GET',
        headers: {
            'Content-Type':'application/json',
            'authorization':`Bearer ${token}`
        }
    }
    
    const req = await fetch('/user/global', options);
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

    // let infos = [];

    for (item of res) {
        
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
        const tp = document.createElement('titulo-publi');
        const mood = document.createElement('h3');
        const likcom = document.createElement('div');
        let come = document.createElement('div');
        const divEmbed = document.createElement('div');
        
        local.setAttribute('id', 'local');
        date.setAttribute('id', 'date');
        nome.setAttribute('id','nome');
        titulo.setAttribute('id','titulo');
        img.setAttribute('class','pic');
        ic.setAttribute('class','informações-cima');
        im.setAttribute('class','informações-meio');
        ip.setAttribute('class','imagem-principal');
        tp.setAttribute('class','titulo-publi');
        infp.setAttribute('class','info-pequenas');
        ifo5.setAttribute('class',`publi ${item._id}`);
        mood.setAttribute('class', 'humor');
        likcom.setAttribute('class', 'cxintera');
        come.setAttribute('class', 'comeT');
        divEmbed.setAttribute('class', 'embed');

        
        async function getAVNA(a) {
            const idP = a;
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({idP})
            }
            
            const req = await fetch('/info/profiles', options);
            const res = req.json();
            return res;
        }
        const dataUser = await getAVNA(item.idPessoa);
        nome.textContent = dataUser.name;
        nome.href = `/profile/${dataUser.id}`;
        pct.src = `${dataUser.pic}`;
    
    
        titulo.innerHTML = urlify(item.titulo).replace(/(\r\n|\n|\r)/gm, "<br>"); 
        local.textContent = item.local;
        date.textContent = item.date;
        mood.textContent = item.humor;
        if (item.pic !== null) {
            img.src = `${item.pic}`;
        } else {
            img.src = '';
            img.style.height = 0;
        }
        likcom.innerHTML = `<div class="cxbt"><ion-icon class="like gostei" name="thumbs-up-outline"></ion-icon><a class="nLikes">${item.like}</a><ion-icon class="comment" name="chatbubble-ellipses-outline"></ion-icon><a class="nLikes">${item.qtd_cm}</a></div><span class="escreveComentario">
        <textarea name="" placeholder="Seu comentário" id="textComentario" cols="30" rows="3"></textarea>
        <button id="enviarComentario" class="buttCom">></button>
        </span>`;
    
        ic.appendChild(pct);
        ic.appendChild(infp);
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
        ifo4.appendChild(ifo5);
        infp.appendChild(nome);
        infp.appendChild(date);
        infp.appendChild(local);
        // infos.push([item._id, item.idPessoa]);

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

        // async function getAVNA(a) {
        //     const idP = a;
        //     const options = {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type':'application/json',
        //         },
        //         body: JSON.stringify({idP})
        //     }
            
        //     const req = await fetch('/info/profiles', options);
        //     const res = req.json();
        //     return res;
        // }
        
        // const dataUser = await getAVNA(item.idPessoa);

        // nome.textContent = dataUser.name;
        // nome.href = `/profile/${dataUser.id}`;
        // pct.src = `${dataUser.pic}`;
    }

    //se eu quiser colocar os comentários em uma versão expandida

    // let index = 0;
    // for (j of infos) {
    //     const token = sessionStorage.getItem('token');
    //     const options = {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type':'application/json',
    //             'authorization':`Bearer ${token}`
    //         },
    //         body: JSON.stringify({idP: j[0]})
    //     }
        
    //     const req = await fetch('/get/comment', options);
    //     const res = await req.json();

    //     let come = publis[index].childNodes[5];

    //     for (o of res.comentarios) {
    //         let div = document.createElement('div');
    //         div.setAttribute('class', 'osComentarios');
    //         div.innerHTML = `<a class="nomeComentador" href="/Profile/${o.idPessoa}">${o.name}</a> ~ ${o.comentario}`;
    //         come.appendChild(div);
    //     }
    //     index += 1;
    // }
}
