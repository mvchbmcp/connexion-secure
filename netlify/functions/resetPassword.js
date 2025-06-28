const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://dwrropzvxdykvdiuvlnp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3cnJvcHp2eGR5a3ZkaXV2bG5wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTExNTM4MywiZXhwIjoyMDY2NjkxMzgzfQ.Cd5GKM9P6Q9oAJiyTUz0XmVAADzO7256Uiy_x3KOhcI' // À remplacer
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Méthode non autorisée' };
  }

  const { email, newPassword } = JSON.parse(event.body);

  const { data, error } = await supabase.auth.admin.updateUserByEmail(email, {
    password: newPassword,
  });

  if (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Mot de passe mis à jour avec succès.' }),
  };
};
