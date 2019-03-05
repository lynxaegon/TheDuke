var url = 'getRandomVcryp0123456789bfhijklqsuvwxzABCDEFGHIJKLMNOPQSTUWXYZ';

module.exports = function(size) {
    size = size || 6;
    var id = '';
    while (0 < size--) {
        id += url[Math.random() * 62 | 0]
    }
    return id;
};