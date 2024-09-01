import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const commands = [
  {
    name: 'register',
    description: '登記學號',
    options: [
      {
        name: 'school_number',
        description: '你的學號',
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: 'check',
    description: '檢查學號組別',
    options: [
      {
        name: 'school_number',
        description: '要檢查的學號',
        type: 3,
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_BOT_TOKEN);

async function registerCommands() {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

// 如果直接運行此文件，則執行註冊命令
if (require.main === module) {
  registerCommands();
}

// 為 API 路由導出處理函數
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    await registerCommands();
    res.status(200).json({ message: 'Successfully registered application commands.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'There was an error registering application commands.' });
  }
}