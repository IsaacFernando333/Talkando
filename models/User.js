const mongoose = require('mongoose');

const User = mongoose.model('User', {
    name: String,
    email: String,
    password: String,
    apresentacao: String,
    nascimento: String,
    sexo: String,
    local: String,
    avatar: String,
    capa: String,
    friends: Array
});

module.exports = User;
