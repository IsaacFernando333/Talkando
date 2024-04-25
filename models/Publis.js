const mongoose = require('mongoose');

const Publications = mongoose.model('Publications', {
    date: String,
    titulo: String,
    embed: String,
    pic: String,
    humor: String,
    like: String,
    date_now: String,
    comentarios: Array,
    qtd_cm: String,
    idPessoa: String,
    local: String,
});

module.exports = Publications;