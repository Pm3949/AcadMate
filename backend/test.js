import bcrypt from 'bcryptjs';

const inputPassword = '39496759'; // The password you entered at login
const hashedPassword = '$2b$10$8PMLHaacEkzY/t8yVWEXJeYoE4x8LKa9J6ZCjwfOEJQ12jN7bHiBK'; // DB hash

bcrypt.compare(inputPassword, hashedPassword, (err, res) => {
  if (err) throw err;
  console.log('Password match?', res);  // true or false
});
