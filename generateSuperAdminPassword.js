const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter the superadmin password: ', (password) => {
    // Generate a salt
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;

        // Hash the password with the generated salt
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;

            console.log('Hashed superadmin password (copy and paste into your database):');
            console.log(hash);

            rl.close();
        });
    });
});

