sudo apt-get -y update
sudo apt-get -y install python3 python3-pip
pip install --break-system-packages --user -r requirements.txt
wget -N https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/121.0.6167.85/linux64/chrome-linux64.zip -P ~/
wget -N https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/121.0.6167.85/linux64/chromedriver-linux64.zip -P ~/
unzip ~/chrome-linux64.zip -d ~/chrome-linux64
unzip ~/chromedriver-linux64.zip -d ~/chromedriver-linux64
rm ~/chrome-linux64.zip
rm ~/chromedriver-linux64.zip
sudo mv -f ~/chromedriver /usr/local/bin/chromedriver
sudo mv -f ~/chrome-linux64/chrome /usr/local/bin/chrome
sudo chown root:root /usr/local/bin/chromedriver
sudo chown root:root /usr/local/bin/chrome
sudo chmod 0755 /usr/local/bin/chrome
sudo chmod 0755 /usr/local/bin/chromedriver
