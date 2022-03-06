//npm init
//npm install minimist
//npm install puppeter
//node hackerrank.js --url=https://www.hackerrank.com --config=camp.json
let minimist = require("minimist")
let puppeteer = require("puppeteer")
let fs = require("fs");


let args = minimist(process.argv)
    //console.log(args.url)
    //console.log(args.config)

let configjson = fs.readFileSync(args.config, "utf-8");
let configJso = JSON.parse(configjson);

//console.log(configJso.userId);
//console.log(configJso.pass);
//console.log(configJso.moderator);

async function run() {

    let browser = await puppeteer.launch({
        headless: false,
        args: ['--start-maximized'],
        defaultViewport: null
    });
    let page = await browser.newPage();
    let Page = page[0];



    // if (fs.existsSync('cookies.json')) {
    //       await page.goto(args.url);
    //       (async() => {

    //          const cookies = fs.readFileSync('cookies.json', 'utf8')

    //          const deserializedCookies = JSON.parse(cookies)
    //           await page.setCookie(deserializedCookies)


    //           await page.waitForSelector("a[data-analytics='SkillsTestCardGetCertified']");
    //         await page.click("a[data-analytics='SkillsTestCardGetCertified']");

    //  })
    // } else {

    await page.goto(args.url);

    await page.waitFor(4000);
    await page.waitForSelector("a[aria-label='allow cookies']");
    await page.click("a[aria-label='allow cookies']");


    await page.waitForSelector("a[data-event-action='Login']");
    await page.click("a[data-event-action='Login']");

    await page.waitForSelector("a[href ='https://www.hackerrank.com/login']");
    await page.click("a[href ='https://www.hackerrank.com/login']");



    await page.waitForSelector("input[name='username']");
    await page.click("input[name='username']");
    await page.type("input[name='username']", configJso.userId, { delay: 3 });


    await page.waitForSelector("input[name='password']");
    await page.type("input[name='password']", configJso.pass, { delay: 3 });



    await page.waitForSelector("button[data-analytics='LoginPassword']");
    await page.click("button[data-analytics='LoginPassword']");




    //const cookies = await page.cookies()
    //const cookieJson = JSON.stringify(cookies)
    //fs.writeFileSync('cookies.json', cookieJson)

    await page.waitForSelector("a[data-analytics='SkillsTestCardGetCertified']");
    await page.click("a[data-analytics='SkillsTestCardGetCertified']");


    await page.waitForSelector("a[data-analytics='NavBarContests']")
    await page.click("a[data-analytics='NavBarContests']");

    //************************************************* */
    await page.waitForSelector("a[href='/administration/contests/']");
    await page.click("a[href='/administration/contests/']");


    //await page.waitForSelector("a[href='/administration/contests/edit/153851']");
    //await page.click("a[href='/administration/contests/edit/153851']");



    await page.waitForSelector("a.backbone.block-center");
    let curls = await page.$$eval("a.backbone.block-center", function(tag) {
        let urls = [];
        for (let i = 0; i < tag.length; i++) {
            let url = tag[i].getAttribute("href");
            urls.push(url);
        }
        return urls;
    });




    for (let i = 0; i < curls.length; i++) {
        // let curl = curls[i];
        console.log(curls[i]);
        let tab = await browser.newPage();
        await handle(tab, args.url + curls[i], configJso.mode);


        // https://www.hackerrank.com/administration/contests/edit/153853"
        async function handle(tab, fullcurl, mode) {
            await tab.goto(fullcurl);
            await tab.bringToFront();

            // await tab.waitFor(1000);

            await tab.waitForSelector("li[data-tab='moderators']");
            await tab.click("li[data-tab='moderators']");

            await tab.click("button#cancelBtn.btn.btn");

            await tab.waitForSelector("input[id='moderator']");
            await tab.waitForSelector("input[id='moderator']");
            await tab.type("input[id='moderator']", configJso.mode, { delay: 30 });

            await tab.click("button.btn.moderator-save");

            await tab.close();
            await page.waitFor(1000);


        }





    }

}
run();