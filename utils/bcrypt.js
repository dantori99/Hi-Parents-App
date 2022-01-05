const bcryptjs = require('bcryptjs');

const encrypt = plain => {
    try {
        const hash = bcryptjs.hashSync(plain, 10);
        return hash;
    } catch (error) {
        console.log(error, '<<<<<<< ECNRYPT BCRYPTJS');
    }
}

const decrypt = (plain, hash) => {
    try {
        const compare = bcryptjs.compareSync(plain, hash);
        return compare;
    } catch (error) {
        console.log(error, '<<<<<<< DECRYPT BCRYPTJS');
    }
}

module.exports = {
    encrypt,
    decrypt
}