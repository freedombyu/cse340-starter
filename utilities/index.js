const navTemplate = () =>
  `<ul><li><a href="/" title="Home page">Home</a></li></ul>`;

const getNav = async (req, res, next) => {
  return navTemplate();
};

module.exports = {
  getNav,
};