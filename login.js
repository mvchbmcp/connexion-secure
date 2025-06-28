const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

exports.handler = async function(event) {
  const { username, password } = JSON.parse(event.body || "{}");

  const usersPath = path.join(__dirname, "users.json");
  const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));

  const user = users.find(u => u.username === username);
  if (user && bcrypt.compareSync(password, user.password)) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, redirect: user.redirect })
    };
  }

  return {
    statusCode: 401,
    body: JSON.stringify({ success: false })
  };
};
