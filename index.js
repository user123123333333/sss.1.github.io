const axios = require('axios');

const OWNER = 'chifuyu1337';
const REPO = 'chifuyu1337';
const TOKEN = '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';

const api = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `token ${TOKEN}`,
    'User-Agent': OWNER
  }
});

async function getRepoContents(path = '') {
  const response = await api.get(`/repos/${OWNER}/${REPO}/contents/${path}`);
  return response.data;
}

async function deleteFile(filePath, sha) {
  await api.delete(`/repos/${OWNER}/${REPO}/contents/${filePath}`, {
    data: {
      message: 'Автоматическое удаление файла',
      sha: sha
    }
  });
  console.log(`Удалён файл: ${filePath}`);
}

async function deleteAllFiles(path = '') {
  const items = await getRepoContents(path);
  for (const item of items) {
    if (item.type === 'file') {
      await deleteFile(item.path, item.sha);
    } else if (item.type === 'dir') {
      await deleteAllFiles(item.path);
    }
  }
}

async function run() {
  try {
    await deleteAllFiles();
    console.log('Все файлы удалены.');
  } catch (err) {
    console.error('Ошибка:', err);
  }
}

setInterval(run, 1000);
