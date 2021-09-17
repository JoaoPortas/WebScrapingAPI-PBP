const { CustomError } = require('../custom_errors/CustomError');
const { errorType } = require('../custom_errors/errorTypes');
const logger = require('../middleware/logger');

const puppeteer = require('puppeteer');

async function getProductInfo(ref) {

  logger.info(`Getting the information for product with the ref. ${ref} in hager.pt ...`);
  logger.info(`Connecting to hager.pt ...`);

  const browser = await puppeteer.launch();

  try{

    const page = await browser.newPage();
    await page.goto(`https://www.hager.pt/pesquisar/113907.htm?Suchbegriffe=${ref}&navlang=pt&suchbereich=web&teasersearch=true`);
    if ((await page.$('.prismaproductdetails')) == null) {
      logger.warn('Product not found found.');
      throw new CustomError(errorType.PRODUCT_NOT_FOUND);
    }

    logger.warn(`Product found!`);

    logger.info(`Getting product info ...`);
    const product = await page.evaluate(() => {    
        
        let productInfo = document.getElementById("productdetailstable").getElementsByTagName('table')[0].getElementsByTagName('tr');

        let reference = productInfo[0].getElementsByTagName("td")[1].getElementsByClassName("highlight")[0].innerHTML;

        let name = document.getElementsByClassName("prismaproductdescription")[0].getElementsByClassName("normtextmarked")[0].innerHTML;
        let imageURL = document.getElementsByClassName("prismaproductimage")[0].getElementsByTagName("img")[0].src;

        let price = productInfo[3].getElementsByTagName("td")[1].innerHTML;
        price = price.substring(0, price.indexOf(' '));
        let packageAmmount = productInfo[2].getElementsByTagName("td")[1].innerHTML
        packageAmmount = packageAmmount.substring(0, packageAmmount.indexOf(' '));

        return {
          reference: reference,
          name: name,
          imageURL: imageURL,
          price: price,
          packageAmmount: packageAmmount
        };
    });

    logger.debug(JSON.stringify(product));

    return product;

  }
  finally {

    logger.info(`Closing the browser ...`);
    await browser.close();
    logger.info(`Search finished\n`);

  }
}

module.exports = {getProductInfo};