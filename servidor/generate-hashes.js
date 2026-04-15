/**
 * generate-hashes.js
 *
 * Run once to produce real bcrypt hashes for the seed users in users.js.
 *
 *   node generate-hashes.js
 *
 * Then copy the output into users.js replacing the placeholder hashes.
 * Delete this file before deploying to production.
 */

import bcrypt from 'bcrypt';
const ROUNDS = 10;

const credentials = [
  { username: 'admin',   password: 'admin123' },
  { username: 'manager', password: 'manager1' },
  { username: 'ana',     password: 'worker1'  },
  { username: 'carlos',  password: 'worker2'  },
];

(async () => {
  console.log('Generating bcrypt hashes...\n');
  for (const c of credentials) {
    const hash = await bcrypt.hash(c.password, ROUNDS);
    console.log(`username: ${c.username}`);
    console.log(`password: ${c.password}`);
    console.log(`hash:     ${hash}\n`);
  }
})();
