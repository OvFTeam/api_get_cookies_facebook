sudo apt-get -y update
sudo apt-get -y install python3 python3-pip unzip
mkdir -p ~/.config/pip/
rm -rf ~/.config/pip/pip.conf
echo "[global]" >>~/.config/pip/pip.conf
echo "break-system-packages = true" >>~/.config/pip/pip.conf
echo "export PATH="$HOME/.local/bin:$PATH"" >>~/.bashrc
source ~/.bashrc
pip install -r requirements.txt

sudo cp -r gunicorn.service /etc/systemd/system/gunicorn.service
sudo systemctl daemon-reload
sudo systemctl start gunicorn
sudo systemctl enable gunicorn

wget -N https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -P ~/
wget https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/121.0.6167.85/linux64/chromedriver-linux64.zip

sudo dpkg -i ~/google-chrome-stable_current_amd64.deb
unzip chromedriver_linux64.zip
sudo mv -f chromedriver_linux64/chromedriver /usr/local/bin/
sudo chown admin:admin /usr/local/bin/chromedriver
sudo chmod 0755 /usr/local/bin/chromedriver

rm ~/google-chrome-stable_current_amd64.deb
rm chromedriver-linux64.zip
rm -rf chromedriver-linux64
