import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { assignGroup } from '/verificationbot/lib/assignGroup';  // 引入轉換過來的 assignGroup 函數

export default async function handler(req, res) {
  const { school_number, username } = req.body;

  // 打開 SQLite 資料庫連接
  const db = await open({
    filename: './members.db',
    driver: sqlite3.Database
  });

  // 使用 assignGroup 函數來分配組別
  const group = assignGroup(school_number);

  // 如果學號無效，返回 400 錯誤
  if (group === "未知學校") {
    return res.status(400).json({ error: '無效的學號格式或學號範圍' });
  }

  try {
    // 將用戶名、學號、組別寫入資料庫
    await db.run('INSERT INTO members (username, school_number, group_name) VALUES (?, ?, ?)', [username, school_number, group]);
    res.status(200).json({ message: `用戶名 ${username} 的學號 ${school_number} 已分配到 ${group} 組別並記錄到資料庫中。` });
  } catch (error) {
    // 如果學號已經被註冊，返回 400 錯誤
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: `學號 ${school_number} 已經被註冊！` });
    } else {
      // 其他錯誤返回 500 錯誤
      res.status(500).json({ error: '註冊過程中發生錯誤' });
    }
  }
}
