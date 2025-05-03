FROM node:22.1.0

WORKDIR /app
ENV NODE_ENV=development

# Copy package files
COPY package*.json ./

# Install all dependencies including dev dependencies
RUN npm install
RUN npm install -g ts-node-dev

# Copy source files
COPY . .

CMD ls

EXPOSE 8080

# Run with nodemon for hot-reloading
CMD ["npm", "run", "dev"]
