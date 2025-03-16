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

# Set environment variables inside the Docker container
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# Debugging: Print env variables inside the container
RUN echo "Supabase URL: $NEXT_PUBLIC_SUPABASE_URL" && \
    echo "Supabase Key: $NEXT_PUBLIC_SUPABASE_ANON_KEY"

# Build the Next.js app with environment variables
RUN NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    npm run build

# Expose frontend port
EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "run", "start"]
