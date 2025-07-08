// Módulo para backup automático do arquivo/banco de erros para o Google Drive
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
const GOOGLE_SERVICE_ACCOUNT = process.env.GOOGLE_SERVICE_ACCOUNT || './service-account.json';

async function uploadBackup(filePath, fileName) {
  const auth = new google.auth.GoogleAuth({
    keyFile: GOOGLE_SERVICE_ACCOUNT,
    scopes: ['https://www.googleapis.com/auth/drive.file']
  });
  const drive = google.drive({ version: 'v3', auth });
  const fileMetadata = {
    name: fileName,
    parents: GOOGLE_DRIVE_FOLDER_ID ? [GOOGLE_DRIVE_FOLDER_ID] : undefined
  };
  const media = {
    mimeType: 'application/octet-stream',
    body: fs.createReadStream(filePath)
  };
  const res = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: 'id'
  });
  return res.data.id;
}

module.exports = { uploadBackup };
