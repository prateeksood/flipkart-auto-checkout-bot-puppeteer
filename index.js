const puppeteer = require('puppeteer');
require('dotenv').config();
// ========================================================================================
// Fill below details before running the script

let email=process.env.EMAIL; //Enter your phone number or email linked with flipkart
let password=process.env.PASSWORD; //Enter your flipkart password
const url='https://www.flipkart.com/hp-15q-core-i5-8th-gen-8-gb-1-tb-hdd-windows-10-home-15q-ds0010tu-laptop/p/itmf8ccgaqk8mm7g?pid=COMF8CCGYDQVJDD8&lid=LSTCOMF8CCGYDQVJDD8EYEG9M'; // Enter url of the product you want to buy 

// ==========================================================================================


const order=(page)=>{
    try{
        (async()=>{
            
            try{
                // click buy now button
                let buynowBtn='#container > div > div._2c7YLP.UtUXW0._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div._1YokD2._3Mn1Gg.col-5-12._78xt5Y > div:nth-child(2) > div > ul > li:nth-child(2) > form > button';
                await page.waitForSelector(buynowBtn, { timeout: 10000 });
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
            
                //Choose wallet radio button
                // let radioBtn='#WALLETPREFERREDPAYTM'
                let radioBtn='#FLIPKART_FINANCE'
                await page.waitForSelector(radioBtn);
                await page.evaluate((radioBtn) => document.querySelector(radioBtn).click(), radioBtn);
                
                //click Continue with paytm button
                // let contiueToPayBtn='#container > div > div._1eztQ7 > div > div._3efVlV > div._3E8aIl.gGqMBW > div > div > div:nth-child(1) > div > label._2Fn-Ln._30jOKh._2KEUG6._18Z3T6._3L7Pww > div._2jIO64._3Uc2dx > div > div > div._3faTME > form > button'
                //click continue with flipkart pay later
                let contiueToPayBtn='#container > div > div._1eztQ7 > div > div._3efVlV > div._3E8aIl.gGqMBW > div > div > div:nth-child(1) > div > label._2Fn-Ln._30jOKh._2KEUG6._18Z3T6._3L7Pww > div._2jIO64._3Uc2dx > div > div > div._10fRvR._1ggQWf > button'
                await page.waitForSelector(contiueToPayBtn);
                await page.evaluate((contiueToPayBtn) => document.querySelector(contiueToPayBtn).click(), contiueToPayBtn);
            }
            catch(err){
                // reload page if any error occurs
                await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
                checkForSaleStart(page);
            }
                      
        })()
    } catch (err) {
        console.error(err)
    }
}

const checkForSaleStart=(page)=>{
    (async()=>{
        try{
            // check for notify me btn
            let notifymeBtn='#container > div > div._2c7YLP.UtUXW0._6t1WkM._3HqJxg > div._1YokD2._2GoDe3 > div._1YokD2._3Mn1Gg.col-5-12._78xt5Y > div:nth-child(2) > div > button'
            const saleNotStarted=await page.waitForSelector(notifymeBtn, { timeout: 3000 });
            if(saleNotStarted){
                console.log('Sale not started yet');
                await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
                checkForSaleStart(page);
            }else{
                order(page);
            }
        }catch(err){
            console.log(err);   
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
        let emailInput='#container > div > div._2dSUjN > div > div._36HLxm.col.col-3-5 > div > form > div:nth-child(1) > input'
        await page.focus(emailInput);
        await page.keyboard.type(email);

        // input password
        let passwordInput='#container > div > div._2dSUjN > div > div._36HLxm.col.col-3-5 > div > form > div:nth-child(2) > input'
        await page.focus(passwordInput);
        await page.keyboard.type(password);

        // click login button
        let loginButton='#container > div > div._2dSUjN > div > div._36HLxm.col.col-3-5 > div > form > div._1D1L_j > button'
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
