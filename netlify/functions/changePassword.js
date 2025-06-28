const supabase = require('./supabaseClient');

exports.handler = async (event) => {
  const { oldPassword, newPassword } = JSON.parse(event.body);

  const { data: user, error } = await supabase
    .from('users')
    .select('id')
    .eq('password', oldPassword)
    .single();

  if (error || !user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Ancien mot de passe incorrect' }),
    };
  }

  const { error: updateError } = await supabase
    .from('users')
    .update({ password: newPassword })
    .eq('id', user.id);

  if (updateError) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur lors de la mise à jour' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Mot de passe changé' }),
  };
};
