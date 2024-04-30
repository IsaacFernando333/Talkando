require('dotenv').config(); 
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`listening at ${port}`));
app.use(express.static('./public'));
app.use(express.json({ limit: '20mb' }));
app.set("view engine", "ejs");

const dbLink = process.env.LINK;

const User = require('./models/User'); 
const Publication = require('./models/Publis');

//PUBLICAÇÕES

app.post('/user/publication', checkToken, async(req, res) => {
  const id = returnId(req);
  const user = await User.find({_id: id});
  
  const { date, titulo, embed, pic, humor, like, date_now, comentarios, qtd_cm } = req.body;
  const publication = new Publication({ date, titulo, embed, pic, humor, like, date_now, comentarios, qtd_cm, idPessoa: id, local: user[0].local});
  try {
    await publication.save();
    res.status(201).json({msg: "Publicação feita com sucesso"});
} catch(error) {
    console.log(error);
    res.status(500).json({msg: "Aconteceu um erro no servidor"});
}
});

app.delete('/user/delete', checkToken, async(req, res) => {
  const id = returnId(req);
  const idp = req.body.idp;
  const public = await Publication.findById(idp, "-pic -local -qtd_cm -comentarios -date_now -like -humor -embed -titulo -date");
  if (public.idPessoa === id) {
    try {
      const publi = await Publication.findByIdAndDelete(idp);
      res.status(201).json({msg: 'Deletado com sucesso'});
    } catch (error) {
      console.log(error);
    }
  }
});

app.get('/user/publis', checkToken, async(req, res) => {
  const id = returnId(req);

  try {
    const publis = await Publication.find({idPessoa: id}).sort({date_now: 'desc'});
    res.status(201).json(publis);
} catch(error) {
    console.log(error);
    res.status(500).json({msg: "Aconteceu um erro no servidor"});
}
});

app.post('/info/profiles', async(req, res) => {
  const id = req.body.idP;
  const users = await User.findById(id, "-password -capa -email -sexo -local -friends -apresentacao -nascimento");
  res.json({name: users.name, pic: users.avatar, id: users._id});
})

app.get('/user/global', checkToken, async(req, res) => {

  const publis = await Publication.find({}).sort({date_now: 'desc'});

  try {
    res.status(201).json(publis);
} catch(error) {
    console.log(error);
    res.status(500).json({msg: "Aconteceu um erro no servidor"});
}
});

app.post('/give/like', async(req, res) => {
  const idPubli = req.body.idp;
  const p = await Publication.findById(idPubli, "-pic -local -qtd_cm -comentarios -date_now -humor -embed -titulo -date");
  const numeroLikes = parseInt(p.like) + 1;
  await Publication.updateOne(
    { _id: idPubli}, 
    { $set: {like: numeroLikes} },
    {},
    );
  res.json({msg: 'like in ' + idPubli});
});

app.post('/give/comment', async(req, res) => {
  const idPubli = req.body.idp;
  const idPessoa = (jwt.decode(req.body.token)).id;
  const comentario = req.body.comentario;

  const objcoment = {idPessoa, comentario, idPubli};
  const p = await Publication.findById(idPubli);
  let comentarios = p.comentarios;
  comentarios.unshift(objcoment);
  var size = Object.keys(comentarios).length;

  await Publication.updateOne(
    { _id: idPubli}, 
    { $set: {comentarios: comentarios, qtd_cm: size} },
    {},
  );
  res.json({status: 'OK'});
});

app.post('/get/comment', async(req, res) => {
  const idP = req.body.idP;
  const coments = await Publication.findById(idP);
  for (u of coments.comentarios) {
    const user = await User.findById(u.idPessoa, "-password -avatar -capa -email -sexo -local -friends -apresentacao -nascimento");
    u["name"] = user.name;
  }
  res.json({comentarios: coments.comentarios});
});

app.get('/search', (req, res) => {
  res.render('D:/VSCODE/Talkando/view/search.ejs');
})

app.post('/search/profiles', async(req, res) => {
  const name = req.body.name;
  const users = await User.find({name: name}, "-capa -password -nascimento -sexo -email -local -friends");
  let lista = new Array();
  for (p of users) {
    lista.push({name: p.name, pic: p.avatar, apresentacao: p.apresentacao, id: p._id});
  }

  res.json({lista});
})

app.post('/follow/request', checkToken , async(req, res) => {
  const idfollow = req.body.id;

  const id = returnId(req);
  const user = await User.findById(id,  "-avatar -name -apresentacao -capa -password -nascimento -sexo -email -local");
  const lista = user.friends;
  if (id === idfollow) {
    res.json({status: 'Não pode seguir você mesmo'});
    return;
  }

  for (f of user.friends) {
    if (f.idfollow === idfollow) {
      res.json({status: 'Já segue'});
      return;
    }
  }
  lista.unshift({idfollow});

  await User.updateOne(
    { _id: id}, 
    { $set: {friends: lista} },
    {},
  );
  res.json({status: 'ok'});
});

app.post('/following', checkToken, async(req, res) => {
  const id = returnId(req);
  const idP = req.body.id;
  let obj;
  if (idP === id) {
    obj = {msg: 'Você'};
    res.json({obj});
    return;
  }

  const user = await User.findById(id, "-avatar -name -apresentacao -capa -password -nascimento -sexo -email -local");
  obj = {msg: 'Seguir'};

  for (e of user.friends) {
    if (e.idfollow === idP) {
      obj = {msg: 'Seguindo'};
    }
  }

  res.json({obj});
})

app.get('/following/list', checkToken, async(req, res) => {

  const id = returnId(req);
  const user = await User.findById(id, "-password -capa -email -sexo -local -apresentacao -nascimento");
  const allObj = [];
  for (f of user.friends) {
    const us = await User.findById(f.idfollow);
    if (us === null) {
      continue;
    } else {
      allObj.unshift({avatar: us.avatar, name: us.name, idfollow: us._id});
    }
  }
  res.json({data: allObj});
})

app.get('/configuration', async(req, res) => {
  res.render('D:/VSCODE/Talkando/view/configuration.ejs');
})

app.post('/configs', checkToken, async(req, res) => {
  const id = returnId(req);
  const b = new Object();
  for (const chave in req.body) {
    if (req.body.hasOwnProperty(chave)) {
      if (req.body[chave] !== '' && req.body[chave] !== null && req.body[chave] !== '//') {
        b[chave] = req.body[chave];
      }
    }
  }
  
  await User.updateMany(
    { _id: id}, 
    { $set: b},
    {},
  );
  res.json({status: 'ok'});
});


// Private Route
app.get("/profile/:id", async (req, res) => {

  const id = req.params.id
  //check if user exists

  const user = await User.findById(id, '-password');
  const publis = await Publication.find({idPessoa: id}).sort({date_now: 'desc'});

  if (!user) {
      return res.status(404).json({msg: 'Usuário não encontrado'});
  }

  function urlify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return text.replace(urlRegex, function(url) {
    return '<a class="link" target="_blank" href="' + url + '">' + url + '</a>'
    })
  }


  for (e of publis) {
    e.titulo = urlify(e.titulo).replace(/(\r\n|\n|\r)/gm, "<br>");
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

  for (t of publis) {
    if (retornaEmbeds(t.titulo) !== undefined) {
      for (z of retornaEmbeds(t.titulo)) {
        t.embed += z;
      }
    }
  }

  res.render('D:/VSCODE/Talkando/view/template.ejs', {user: user, publis: publis});
});

// CADASTRO / LOGIN

app.get('/', (req, res) => {
  res.send({msg: 'Bem vindo'});
});

app.post('/auth/register', async(req, res) => {
  const {name, email, password, apresentacao, nascimento, sexo, local, avatar, capa} = req.body;
  if (!(name && email && password)) {
    return res.status(422).json({msg: 'Preencha todos os campos'});
  }

  const ifUserExists = await User.findOne({email: email});
  if (ifUserExists) {
    return res.status(422).json({msg: 'Este email já está cadastrado'});
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);
  
  const user = new User({name, email, password: passwordHash, apresentacao, nascimento, sexo, local, avatar, capa});

  try {
      await user.save();
      res.status(201).json({msg: "Usuário criado com sucesso"});
  } catch(error) {
      console.log(error);
      res.status(500).json({msg: "Aconteceu um erro no servidor"});
  }
});

app.post('/auth/login', async(req, res) => {
  const {email, password} = req.body;

  if (!(email && password)) {
    return res.status(422).json({msg: 'As informações são necessárias'});
  }

  const user = await User.findOne({email:email});

  if (!user) {
    return res.status(404).json({msg: 'Usuário não encontrado'});
  }

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    return res.status(404).json({msg: 'Senha inválida'});
  }

  try {
    const secret = process.env.SECRET;
    const token = jwt.sign({id: user._id, name: user.name}, secret, {expiresIn: '5h'});
    res.status(200).json({msg: 'Login feito com sucesso', token});
  } catch(erro) {
    console.log(erro);
    res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!'});
  }
});

app.get("/user/info", checkToken, async(req, res) => {

  const id = returnId(req);

  const user = await User.findById(id, '-password');

  if (!user) {
    return res.status(404).json({msg: 'Usuário não encontrado'});
  }

  res.status(201).json({user});
});


function checkToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(" ")[1];

  if(!token) {
    return res.status(401).json({msg: "Acesso negado"});
  }

  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch(error) {
    res.status(400).json({msg: 'Token inválido'});
  }
}

function returnId(req) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(" ")[1];
  return jwt.decode(token).id;
}

//Conectando na DB

mongoose.connect(dbLink).then(() => {
    console.log('Conectado a DB');
}).catch();
