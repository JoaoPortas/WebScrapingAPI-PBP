const ProductNotFoundError = require('./errors/ProductNotFoundError');

const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 9000;

//Scraping Sources Imports
const legrand = require('./web_scraping_sources/legrand');
const hager = require('./web_scraping_sources/hager');
/*const jsl = require('./web_scraping_sources/jsl');*/

app.get('/:source/:ref', async (req, res) => {
  var source = req.params.source;
  var ref = req.params.ref;
  var product;

  try {

    if (source.toString() == 'legrand') {
      product = await legrand.getProductInfo(ref);
    }
    else if (source.toString() == 'hager') {
      product = await hager.getProductInfo(ref);
    }/*
    else if (source.toString() == 'jsl') {
      //product = await getJSLProductInfo(ref);
      product = await jsl.getProductInfo(ref);
    }*/
    else {
      product = 'error';
    }

    console.log(product);
    
    res.status(200).json(product);
        
  } catch (e) {
      if (e instanceof puppeteer.errors.TimeoutError) {
          console.error('Timeout error: The page takes to long to respond.\n');
          res.status(408).json({
            message: 'Request timeout'
          });
      }
      else if (e instanceof ProductNotFoundError) {
          console.warn('Product not found: The product to search was not found.\n');
          res.status(404).json({
            message: 'Product not found'
          });
      }
      else if (!e.response) {
          console.error('A problem during the connection was occurred or the URL does not exists.\n');
          res.status(404).json({
            message: 'URL not found or a connection problem was occurred'
          });
      }
      else {
          console.error('Unknown error:\n' + e.message);
      }
  }
});

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});

(async () => {

})();

/*const getJSLProductInfo = async (ref) => {
  console.log(`Getting the information for product with the ref. ${ref} in jsl-online.com ...`);

  //var ref = '294 - ATE2';

  try {
    console.log(`Connecting ...`);
    //const browser = await puppeteer.launch({ headless: false });
    const browser = await puppeteer.launch();
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

      console.log(`Searching ...`);

      await openJSLCategories();
      await selectJSLCategory(96, 278);
      
      // Write ref in search bar 
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

      for (let i = 0; i < 9; i++) {        
        await openJSLCategories();
        await selectJSLCategory(90, 425);

        if ((await page.$('#table_1 tbody tr td.column-familia')) !== null) return true;
      }

      await openJSLCategories();
      await selectJSLCategory(90, 465);

      if ((await page.$('#table_1 tbody tr td.column-familia')) !== null) return true;

      return false;
    }

    var productFound;
    productFound = await searchJSLProductInCategories(ref);

    if (productFound) {
      console.log('Product found!');

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

      console.log('Product:', product);

      await browser.close();

      return product; 
    }
    else {
      console.log('Product not found :(');
      console.log('Product:', null);
    }

    await browser.close();

    return 'null'; 

  } catch (error) {
    console.log(error);
  }
}*/

/*const getHagerProductInfo = async (ref) => {
    console.log(`Getting the information for product with the ref. ${ref} in hager.pt ...`);
    //const browser = await puppeteer.launch({ headless: false, args: [ "--disable-web-security" ] });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.hager.pt/pesquisar/113907.htm?Suchbegriffe=${ref}&navlang=pt&suchbereich=web&teasersearch=true`);
  
    // Get the "viewport" of the page, as reported by the page.
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
  
    console.log('Product:', product);
  
    await browser.close();

    return product; 
}*/

/*const getLegrandProductInfo = async (ref) => {
  try {
    
    console.log(`Getting the information for product with the ref. ${ref} in legrand.pt ...`);
    //const browser = await puppeteer.launch({ headless: false, args: [ "--disable-web-security" ] });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.legrand.pt/e-catalogo/catalogsearch/result/?q=${ref}`);

    await page.waitForSelector('.fotorama img');
  
    // Get the "viewport" of the page, as reported by the page.
    const product = await page.evaluate(() => {
      try {
    
        let productInfo = document.getElementsByClassName('product-info-main')[0];

        let reference = document.getElementsByClassName("product-title")[0].getElementsByClassName("value")[0].innerText;
        let name = document.getElementsByClassName("product-title")[0].getElementsByClassName("page-title")[0].getElementsByClassName("base")[0].innerText;
        let price = productInfo.getElementsByClassName('price')[0].innerHTML;
        price = price.substring(0, price.indexOf('&'));
        let imageURL = document.getElementsByClassName('fotorama')[0].getElementsByTagName('img')[0].src;
        
        let package = document.getElementsByClassName('product-info-main-details')[0].getElementsByTagName('table')[0].getElementsByTagName('tr');

        let packageAmmount = package[1].getElementsByTagName('td')[0].innerHTML;
        let dimension = package[2].getElementsByTagName('td')[0].innerHTML;
        let weight = package[3].getElementsByTagName('td')[0].innerHTML;

        return {
          reference: reference,
          name: name,
          imageURL: imageURL,
          price: price,
          packageAmmount: packageAmmount,
          dimension: dimension,
          weight: weight
        };
      } catch (error) {
        return {
          error: "Can´t load page and get information about products" + error
        }   
      }
    });
  
    console.log('Product:', product);
  
    await browser.close();

    return product;
  } catch (error) {
    return {
      error: "Can´t use bot to use browser " + error
    }     
  } 
}*/