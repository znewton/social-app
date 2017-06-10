
function nameFromEmail(email) {
  return email.match(/^([^@]*)@/)[1];
}

module.exports = {
  nameFromEmail,
}
