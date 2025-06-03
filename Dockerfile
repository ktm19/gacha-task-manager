# --- Frontend Stage: Build React App ---
FROM node:20 AS build-frontend

WORKDIR /app/client

# Copy only package.json and package-lock.json first for dependency caching
COPY get-it-done-gacha/package.json get-it-done-gacha/package-lock.json ./
RUN npm ci # Use npm ci for cleaner installs

# Copy the rest of the frontend code
COPY get-it-done-gacha/ .

# Build the frontend
RUN npm run build

# --- Backend Stage: Setup Express Server ---
FROM node:20-slim 

WORKDIR /app/backend

# Copy backend package.json first and install deps
COPY backend/package.json backend/package-lock.json ./
RUN npm ci

# Copy backend code
COPY backend/ .

# Copy built frontend into app
COPY --from=build-frontend /app/client ../frontend

# --- Combine Frontend and Backend ---

WORKDIR /app

# Copy built frontend assets from the build-frontend stage
COPY --from=build-frontend /app/client/dist ./frontend/dist

EXPOSE 8080

# Set the final working directory to where your backend's entry point is
WORKDIR /app/backend

# Start the backend Express server, which will also serve the frontend
CMD ["node", "index.js"]