import { verifyKey } from 'discord-interactions';
import { Client, GatewayIntentBits } from 'discord.js';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// 數據庫連接
let db;
(async () => {
  db = await open({
    filename: './members.db',
    driver: sqlite3.Database
  });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      school_number TEXT NOT NULL UNIQUE,
      group_name TEXT NOT NULL
    )
  `);
})();

// 分配身份組函數
function assignGroup(schoolNumber) {
  // ... [與原 Python 代碼相同的邏輯]
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const rawBody = await getRawBody(req);
  const signature = req.headers['x-signature-ed25519'];
  const timestamp = req.headers['x-signature-timestamp'];

  const isValidRequest = verifyKey(
    rawBody,
    signature,
    timestamp,
    process.env.DISCORD_PUBLIC_KEY
  );

  if (!isValidRequest) {
    return res.status(401).end('invalid request signature');
  }

  const interaction = JSON.parse(rawBody);

  if (interaction.type === 1) {
    return res.status(200).json({ type: 1 });
  }

  if (interaction.type === 2) {
    const { name } = interaction.data;

    if (name === 'register') {
      const schoolNumber = interaction.data.options[0].value;
      // 實現註冊邏輯
      // ...
    } else if (name === 'check') {
      const schoolNumber = interaction.data.options[0].value;
      // 實現檢查邏輯
      // ...
    }
  }

  res.status(400).end('Unknown Type');
}

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      resolve(Buffer.from(data));
    });
    req.on('error', reject);
  });
}