sudo apt-get -y update
sudo apt-get -y install python3 python3-pip unzip
mkdir -p ~/.config/pip/
echo "[global]" >> ~/.config/pip/pip.conf
echo "break-system-packages = true" >> ~/.config/pip/pip.conf
pip install -r requirements.txt

wget -N https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -P ~/
wget -N https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/121.0.6167.85/linux64/chromedriver-linux64.zip -P ~/

sudo dpkg -i ~/google-chrome-stable_current_amd64.deb
unzip ~/chromedriver_linux64.zip -d ~/
sudo mv -f ~/chromedriver /usr/local/bin/chromedriver
sudo chmod 0755 /usr/local/bin/chromedriver

rm ~/google-chrome-stable_current_amd64.deb
rm ~/chromedriver_linux64.zip
