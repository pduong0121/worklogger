#!/bin/bash

echo "Installing backend dependencies..."
cd backend
npm install
npm start &

sleep 5

echo "Installing frontend dependencies..."
cd ../frontend
npm install
npm start
