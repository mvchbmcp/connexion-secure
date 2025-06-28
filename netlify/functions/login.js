const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Récupération des données POST (json)
  const { oldPassword, newPassword } = JSON.parse(event.body);

  // Chemin vers user.json
  const userFilePath = path.resolve(__dirname, '../../user.json');

  // Lecture fichier user.json
  let users = {};
  try {
    users = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
  } catch (error) {
    return { statusCode: 500, body: 'Erreur lecture données utilisateurs' };
  }

  // Si newPassword est absent => connexion normale
  if (!newPassword) {
    // Vérifie si oldPassword est un mot de passe existant
    if (users.hasOwnProperty(oldPassword)) {
      // Connexion OK, retourne URL
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, redirectUrl: users[oldPassword] })
      };
    } else {
      // Mot de passe invalide
      return { statusCode: 401, body: JSON.stringify({ success: false, message: 'Mot de passe incorrect' }) };
    }
  }

  // Sinon, c’est une demande de changement de mot de passe
  // oldPassword = ancien mot de passe, newPassword = nouveau mot de passe
  if (!users.hasOwnProperty(oldPassword)) {
    return { statusCode: 401, body: JSON.stringify({ success: false, message: 'Ancien mot de passe incorrect' }) };
  }

  // Vérifie que le nouveau mot de passe n'existe pas déjà
  if (users.hasOwnProperty(newPassword)) {
    return { statusCode: 409, body: JSON.stringify({ success: false, message: 'Nouveau mot de passe déjà utilisé' }) };
  }

  // Change le mot de passe en gardant la même URL
  users[newPassword] = users[oldPassword];
  delete users[oldPassword];

  try {
    fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ success: false, message: 'Erreur sauvegarde nouveau mot de passe' }) };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, message: 'Mot de passe changé avec succès' })
  };
};
