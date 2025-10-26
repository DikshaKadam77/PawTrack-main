# 1. Use an official Node.js image as the base
FROM node:18-alpine AS build

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy the rest of your app's source code
COPY . .

# 5. Build your React app for production
RUN npm run build

# --- Production Stage ---

# 6. Use a lightweight Nginx server to serve the static files
FROM nginx:1.25-alpine

# 7. Copy the built app from the 'build' stage
COPY --from=build /app/build /usr/share/nginx/html

# 8. Expose port 80 and start Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
