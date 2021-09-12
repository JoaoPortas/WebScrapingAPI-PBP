const ProductNotFoundError = require('../errors/ProductNotFoundError');

const puppeteer = require('puppeteer');

async function getProductInfo(ref) {

  console.info(`Getting the information for product with the ref. ${ref} in hager.pt ...`);
  console.info(`Connecting to hager.pt ...`);

  const browser = await puppeteer.launch();

  try{

    const page = await browser.newPage();
    await page.goto(`https://www.hager.pt/pesquisar/113907.htm?Suchbegriffe=${ref}&navlang=pt&suchbereich=web&teasersearch=true`);

    if ((await page.$('.prismaproductdetails')) == null) throw new ProductNotFoundError();

    console.info(`Getting product info ...`);
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

    return product;

  }
  finally {

    console.info(`Closing the browser ...`);
    await browser.close();
    console.info(`Search finished\n`);

  }
}

module.exports = {getProductInfo};