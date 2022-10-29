FROM node:16

# Create app directory
WORKDIR /dist

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

Your App binds to the port define in the environment variable PORT, define it and expose the port 8080
ENV PORT 8080
EXPOSE 8080

Use CMD to run the node server.js command that will start your application
CMD [ "node", "index.js" ]
