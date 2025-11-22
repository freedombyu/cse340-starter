const { getNav } = require('../utilities');
const baseController = {}

/* *****************************
 * Building Home view with MVC
 * unit 3, Activities
 * ***************************** */

baseController.buildHome = async function (req, res) {
  const nav = await getNav()
  res.render('index', { 
    title: 'Home', 
    nav 
  })
}

module.exports = baseController