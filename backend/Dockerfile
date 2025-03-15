# Use the latest stable Node.js image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (improves Docker caching)
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the entire backend project
COPY . .

# Expose the backend port
EXPOSE 4000

# Start the application
CMD ["npm", "run", "start"]
