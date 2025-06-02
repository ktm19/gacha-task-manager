# --- Frontend Stage: Build React App ---
FROM node:20 AS build-frontend

WORKDIR /app/client

# Copy and install dependencies
COPY get-it-done-gacha/package.json get-it-done-gacha/package-lock.json ./
RUN npm install

# Copy the rest of the frontend code
COPY get-it-done-gacha/ .

# Build the frontend
RUN npm run build

# --- Backend Stage: Setup Express Server ---
FROM node:20-slim 

WORKDIR /app/backend

# Copy backend package.json first and install deps
COPY backend/package.json backend/package-lock.json ./
RUN npm install

# Copy backend code
COPY backend/ .

# Copy built frontend into app
COPY --from=build-frontend /app/client ../frontend

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

EXPOSE 5173

# Start the app
CMD ["npm", "run", "start-prod"]