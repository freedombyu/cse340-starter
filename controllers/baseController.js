const { getNav } = require('../utilities');

const buildHome = async (req, res) => {
  const nav = await getNav();
  res.render('index', { title: 'Home', nav, errors: null });
};

module.exports = { buildHome,
};