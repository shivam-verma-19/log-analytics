# Use an official Node.js image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first (Docker caching)
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the Next.js project
COPY . .

# Build the Next.js app
RUN npm run build

# Expose frontend port
EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "run", "start"]
