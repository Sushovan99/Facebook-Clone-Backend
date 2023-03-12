exports.validateEmail = (email) =>
  String(email)
    .toLowerCase()
    .match(/^([a-z\d.-_]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/);
