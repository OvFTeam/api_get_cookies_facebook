sudo apt-get -y update
sudo apt-get -y install python3 python3-pip unzip
pip install -r requirements.txt

# Download Chrome and Chromedriver
wget -N https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -P ~/
wget -N https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/121.0.6167.85/linux64/chromedriver-linux64.zip -P ~/

# Install Chrome and Chromedriver
sudo dpkg -i ~/google-chrome-stable_current_amd64.deb
unzip ~/chromedriver_linux64.zip -d ~/
sudo mv -f ~/chromedriver /usr/local/bin/chromedriver

# Cleanup
rm ~/google-chrome-stable_current_amd64.deb
rm ~/chromedriver_linux64.zip
