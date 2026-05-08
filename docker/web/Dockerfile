FROM webdevops/php-apache-dev:8.5

# Update and install
RUN apt-get update && apt-get install -y

#Nano
RUN apt-get install -y nano

#Keyring
RUN mkdir -p /etc/apt/keyrings

# Node.js
RUN curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
RUN NODE_MAJOR=20 && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list
RUN apt-get update && apt-get install -y nodejs && npm install -g npm@11.13.0
RUN npx -y playwright@1.59.1 install-deps chromium

USER application
