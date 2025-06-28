const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

const supabase = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Méthode non autorisée' };
  }

  try {
    const { email, newPassword } = JSON.parse(event.body);

    if (!email || !newPassword) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email et nouveau mot de passe requis' }) };
    }

    // Chercher l'utilisateur via son email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Utilisateur introuvable' })
      };
    }

    // Mettre à jour le mot de passe via l'admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(userData.id, {
      password: newPassword
    });

    if (updateError) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Erreur mise à jour : ' + updateError.message })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Mot de passe mis à jour avec succès' })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur serveur : ' + err.message })
    };
  }
};
