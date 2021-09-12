const ProductNotFoundError = require('../errors/ProductNotFoundError');

const puppeteer = require('puppeteer');

async function getProductInfo(ref) {
    //const browser = await puppeteer.launch({ headless: false, args: [ "--disable-web-security" ] });

    console.info(`Getting the information for product with the ref. ${ref} in legrand.pt ...`);
    console.info(`Connecting to legrand.pt ...`);

    const browser = await puppeteer.launch();

    try {
        
        const page = await browser.newPage();

        await page.goto(`https://www.legrand.pt/e-catalogo/catalogsearch/result/?q=${ref}`);
    
        if ((await page.$('.product-info-main')) == null) throw new ProductNotFoundError();
    
        await page.waitForSelector('.fotorama img');
    
        console.info(`Getting product info ...`);
    
        const product = await page.evaluate(() => {    
            let productInfo = document.getElementsByClassName('product-info-main')[0];
    
            let reference = document.getElementsByClassName("product-title")[0].getElementsByClassName("value")[0].innerText;
            let name = document.getElementsByClassName("product-title")[0].getElementsByClassName("page-title")[0].getElementsByClassName("base")[0].innerText;
            let price = productInfo.getElementsByClassName('price')[0].innerHTML;
            price = price.substring(0, price.indexOf('&'));
            let imageURL = document.getElementsByClassName('fotorama')[0].getElementsByTagName('img')[0].src;
            
            let package = document.getElementsByClassName('product-info-main-details')[0].getElementsByTagName('table')[0].getElementsByTagName('tr');
    
            let packageAmmount = package[1].getElementsByTagName('td')[0].innerHTML;
            /*let dimension = package[2].getElementsByTagName('td')[0].innerHTML;
            let weight = package[3].getElementsByTagName('td')[0].innerHTML;*/
    
            return {
              reference: reference,
              name: name,
              imageURL: imageURL,
              price: price,
              packageAmmount: packageAmmount,
              /*dimension: dimension,
              weight: weight*/
            };
        });

        return product;

    }
    finally {

        console.info(`Closing the browser ...`);
        await browser.close();
        console.info(`Search finished`);

    }
}

module.exports = {getProductInfo};