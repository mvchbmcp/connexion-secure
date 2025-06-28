const supabase = require('./supabaseClient');

exports.handler = async (event) => {
  const { password } = JSON.parse(event.body);

  const { data, error } = await supabase
    .from('users')
    .select('url')
    .eq('password', password)
    .single();

  if (error || !data) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Mot de passe incorrect' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ url: data.url }),
  };
};
