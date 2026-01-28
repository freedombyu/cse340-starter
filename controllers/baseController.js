const { getNav } = require('../utilities');

const buildHome = async (req, res) => {
  const nav = await getNav();
  req.flash("notice", "This is a flash message.")
  res.render('index', { title: 'Home', nav, errors: null });
};

module.exports = {
  buildHome,
};
