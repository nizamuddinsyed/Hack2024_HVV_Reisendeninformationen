# Use the official Node-RED Docker image
FROM nodered/node-red:latest

# Install additional Node-RED nodes for Kafka
RUN npm install node-red-contrib-kafka-node

# Install any other necessary Node-RED nodes
# For example, dashboard nodes or additional libraries
RUN npm install node-red-dashboard
RUN npm install node-red-node-email
