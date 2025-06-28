const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;        // à définir dans les variables d'environnement Netlify
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; // idem, clé "service_role" pour droits modifs
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { username, oldPassword, newPassword } = JSON.parse(event.body);

    if (!username || !oldPassword || !newPassword) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Paramètres manquants' }),
      };
    }

    // Récupérer utilisateur dans Supabase
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('password')
      .eq('username', username)
      .single();

    if (fetchError || !user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Utilisateur non trouvé' }),
      };
    }

    if (user.password !== oldPassword) {  // Attention : en prod, comparer hash !
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Ancien mot de passe incorrect' }),
      };
    }

    // Mettre à jour le mot de passe dans Supabase
    const { error: updateError } = await supabase
      .from('users')
      .update({ password: newPassword })
      .eq('username', username);

    if (updateError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erreur lors de la mise à jour du mot de passe' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Mot de passe modifié avec succès' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur serveur' }),
    };
  }
};
