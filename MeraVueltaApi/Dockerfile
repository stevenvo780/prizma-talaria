FROM node:14.19.3-alpine

WORKDIR /usr/src/app

# Copy source files (node_modules and root /dist excluded via .gcloudignore,
# but vendor-contracts/dist IS included)
COPY . .

# Install dependencies - olympo-contracts (Prizma) installs from ./vendor-contracts
RUN npm install --prefer-offline

# Build TypeScript
RUN npm run build

EXPOSE 8080

ENV PORT=8080

CMD ["node", "dist/index.js"]
