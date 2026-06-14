# Use an official Nginx image as the base image
FROM nginx:alpine

# Copy the static files to the Nginx serving directory
COPY . /usr/share/nginx/html

# Set the working directory to the serving directory
WORKDIR /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
