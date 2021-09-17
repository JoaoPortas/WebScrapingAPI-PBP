const { CustomError } = require('../custom_errors/CustomError');
const { errorType } = require('../custom_errors/errorTypes');

const puppeteer = require('puppeteer');

async function getProductInfo(ref) {

  console.info(`Getting the information for product with the ref. ${ref} in jsl-online.com ...`);
  console.info(`Connecting to jsl-online.com ...`);

  const browser = await puppeteer.launch();

  try {

    const page = await browser.newPage();
    await page.goto(`https://jsl-online.com/lista-precos-pt/`, {
      waitUntil: 'networkidle0',
    });

    const searchJSLProductInCategories = async (ref) => {
      const openJSLCategories = async (ref) => {
        if ((await page.$('button.mfp-close')) !== null)
        await page.click('button.mfp-close');
        await page.mouse.click(54, 217, { delay: 50 });
      }
  
      const selectJSLCategory = async (x, y) => {
        if ((await page.$('button.mfp-close')) !== null)
        await page.click('button.mfp-close');
        await page.mouse.click(x, y, { delay: 50 });
      }

      console.info(`Searching in each category ...`);

      const categoriesQtn = await page.evaluate(() => {
        let qtn = (document.getElementsByClassName("dropdown-menu")[0].getElementsByTagName("ul")[0].childElementCount) - 6;
  
        return qtn;
      });      

      await openJSLCategories();
      await selectJSLCategory(96, 278);
      
      /* Write ref in search bar */
      await page.focus('#table_1_filter input');
      await page.keyboard.type(`${ref}`, { delay: 10 });
      if ((await page.$('button.mfp-close')) !== null)
      await page.click('button.mfp-close');

      if ((await page.$('#table_1 tbody tr td.column-familia')) !== null) return true;

      await openJSLCategories();
      await selectJSLCategory(90, 325);

      if ((await page.$('#table_1 tbody tr td.column-familia')) !== null) return true;

      await openJSLCategories();
      await selectJSLCategory(90, 375);

      if ((await page.$('#table_1 tbody tr td.column-familia')) !== null) return true;

      for (let i = 0; i < categoriesQtn; i++) {        
        await openJSLCategories();
        await selectJSLCategory(90, 425);

        if ((await page.$('#table_1 tbody tr td.column-familia')) !== null) return true;
      }

      await openJSLCategories();
      await selectJSLCategory(90, 465);

      if ((await page.$('#table_1 tbody tr td.column-familia')) !== null) return true;

      await openJSLCategories();
      await selectJSLCategory(90, 515);

      if ((await page.$('#table_1 tbody tr td.column-familia')) !== null) return true;

      return false;
    }

    var productFound;
    await page.click('a.cookie_action_close_header');
    productFound = await searchJSLProductInCategories(ref);

    if (productFound) {
      console.info('Product found!');
      console.info(`Getting product info ...`);

      const product = await page.evaluate(() => {    
        
          let productInfo = document.getElementById("table_1").getElementsByTagName('tbody')[0].getElementsByTagName('tr')[0];

          let reference = productInfo.getElementsByClassName("column-ref-catlogo")[0].innerText;
          let name = productInfo.getElementsByClassName("column-designao")[0].innerText;
          let imageURL = "none"
          let price = productInfo.getElementsByClassName("numdata float")[0].innerText;
          let packageAmmount = productInfo.getElementsByClassName("column-qt-min-forn")[0].innerText;

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
    else {
      throw new CustomError(errorType.PRODUCT_NOT_FOUND);
    }

  }
  finally {

    console.info(`Closing the browser ...`);
    await browser.close();
    console.info(`Search finished\n`);

  }
}

module.exports = {getProductInfo};