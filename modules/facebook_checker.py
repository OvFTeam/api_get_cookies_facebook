

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


def check_status_facebook(username, password, code):
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(options=options)
    driver.get('https://mbasic.facebook.com/')
    driver.find_element(By.ID, 'm_login_email').send_keys(username)
    driver.find_element(By.NAME, 'pass').send_keys(password)
    driver.find_element(By.NAME, 'login').click()
    try:
        wrong_password_element = driver.find_element(By.ID, 'login_error')
        if wrong_password_element:
            return 'Sai mat khau', None
    except:
        if 'checkpoint' in driver.current_url:
            try:
                approvals_code = driver.find_element(By.NAME, 'approvals_code')
                if code:
                    approvals_code.send_keys(code)
                    driver.find_element(
                        By.NAME, 'submit[Submit Code]').click()
                    try:
                        wrong_code = driver.find_element(
                            By.NAME, 'approvals_code')
                        if wrong_code:
                            return 'Sai Code', None
                    except:
                        pass
                    for i in range(8):
                        if i == 7:
                            return 'Checkpoint', None
                        current_url = driver.current_url
                        if 'checkpoint' in current_url:
                            try:
                                button = WebDriverWait(driver, 10).until(
                                    EC.presence_of_element_located(
                                        (By.ID, "checkpointSubmitButton-actual-button"))
                                )
                                button.click()
                            except:
                                break
                        else:
                            break
                    return '2FA', driver.get_cookies()
                else:
                    if approvals_code:
                        return '2FA', None
            except:
                return 'Checkpoint', None
        else:
            try:
                driver.get('https://mbasic.facebook.com/')
                email = driver.find_element(By.ID, 'm_login_email')
                if email:
                    return 'Sai mat khau'
            except:
                return 'Khong bat 2FA', driver.get_cookies()
