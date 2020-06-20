const puppeteer = require('puppeteer');

// ========================================================================================
// Fill below details before running the script

let email='Email'; //Enter your phone number or email linked with flipkart
let password='Password'; //Enter your flipkart password
const url='product url'; // Enter url of the product you want to buy 

// ==========================================================================================


const order=(page)=>{
    try{
        (async()=>{
            
            // click buy now button
            let buynowBtn='#container > div > div.t-0M7P._3GgMx1._2doH3V > div._3e7xtJ > div._1HmYoV.hCUpcT > div._1HmYoV._35HD7C.col-5-12._3KsTU0 > div:nth-child(2) > div > ul > li:nth-child(2) > form > button';
            await page.waitForSelector(buynowBtn);
            const isDisabled = await page.$eval(buynowBtn, (button) => {
                return button.disabled;
            });
            // check if buttton is disabled
            if(isDisabled){
                console.log('button is disabled');
                await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
                order(page);
                return;
            }
            await page.click(buynowBtn);
            
            // delivery address
            // ########### Uncomment below code if you have multiple addressess linked to your account ############################
            // let addressBtn='#CNTCTA4CAB47D08304FE9BA8651CED > button'
            // await page.waitForSelector(addressBtn);
            // await page.click(addressBtn);
        
            // click continue with quantity button
            let qtyBtn='#to-payment > button';
            await page.waitForSelector(qtyBtn);
            await page.click(qtyBtn);
        
            //Choose Phonepe radio button
            let phonepeRadioBtn='#PHONEPE'
            await page.waitForSelector(phonepeRadioBtn);
            await page.evaluate((phonepeRadioBtn) => document.querySelector(phonepeRadioBtn).click(), phonepeRadioBtn);
            
            //click Continue with phonepe button
            let contiueToPayBtn='div._1Ua1Gl > div > div._3B4tat > div._1GRhLX._38vNoF > div > div > div:nth-child(2) > div > label._8J-bZE._3C6tOa._1syowc._2i24Q8._1Icwrf > div._2o59RR._27CukN > div > div > div._3MGkT3 > button'
            await page.waitForSelector(contiueToPayBtn);
            await page.evaluate((contiueToPayBtn) => document.querySelector(contiueToPayBtn).click(), contiueToPayBtn);
                     
        })()

    } catch (err) {
        console.error(err)
    }
}

const checkForSaleStart=(page)=>{
    (async()=>{
        try{
            // check for notify me btn
            let notifymeBtn='#container > div > div.t-0M7P._3GgMx1._2doH3V > div._3e7xtJ > div._1HmYoV.hCUpcT > div._1HmYoV._35HD7C.col-5-12._3KsTU0 > div:nth-child(2) > div > button'
            const saleNotStarted=await page.waitForSelector(notifymeBtn, { timeout: 5000 });
            if(saleNotStarted){
                console.log('Sale not started yet');
                await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
                checkForSaleStart(page);
            }else{
                order(page);
            }
        }catch(err){
            //  console.log(err);   
             order(page);
        }
    })()
}

try {
    (async () => {

        const browser = await puppeteer.launch({headless: false, defaultViewport: null, args: ['--start-maximized']})
        const page = await browser.newPage();

        await page.goto('https://www.flipkart.com/account/login');

        // input email or phone number
        let emailInput='#container > div > div.uMF2cc > div > div.Km0IJL.col.col-3-5 > div > form > div:nth-child(1) > input'
        await page.focus(emailInput);
        await page.keyboard.type(email);

        // input password
        let passwordInput='#container > div > div.uMF2cc > div > div.Km0IJL.col.col-3-5 > div > form > div:nth-child(2) > input'
        await page.focus(passwordInput);
        await page.keyboard.type(password);

        // click login button
        let loginButton='#container > div > div.uMF2cc > div > div.Km0IJL.col.col-3-5 > div > form > div._1avdGP > button'
        await page.waitForSelector(loginButton);
        await page.click(loginButton);

        // wait for login to complete
        await page.waitForNavigation({
            waitUntil: 'networkidle0',
        });
        
        // go to product page
        await page.goto(url);
        checkForSaleStart(page);
    })()
} catch (err) {
    console.error(err)
}