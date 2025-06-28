const supabase = require('./supabaseClient');

exports.handler = async (event) => {
  const { email, newPassword } = JSON.parse(event.body);

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (userError || !userData) {
    return { statusCode: 400, body: JSON.stringify({ success: false, error: "Utilisateur introuvable" }) };
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(userData.id, {
    password: newPassword
  });

  if (updateError) {
    return { statusCode: 400, body: JSON.stringify({ success: false, error: updateError.message }) };
  }

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};
