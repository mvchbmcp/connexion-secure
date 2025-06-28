const supabase = require('./supabaseClient');

exports.handler = async (event) => {
  const { email, password } = JSON.parse(event.body);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { statusCode: 401, body: JSON.stringify({ success: false }) };
  }

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
