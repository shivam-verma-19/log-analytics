# Use official Node.js image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the backend files
COPY . .

# Expose backend port
EXPOSE 4000

# Start the server
CMD ["node", "server.js"]
