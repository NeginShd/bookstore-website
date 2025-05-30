#!/bin/bash

# Test script for Google Gemini API
# Replace YOUR_ACTUAL_API_KEY with your real API key

API_KEY="YOUR_ACTUAL_API_KEY"

echo "Testing Google Gemini API..."
echo "================================"

curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}" \
  -H 'Content-Type: application/json' \
  -X POST \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "Explain how AI works in a few words"
          }
        ]
      }
    ]
  }' \
  | jq '.' 2>/dev/null || cat

echo -e "\n\nIf you see JSON response above, your API key is working!"
echo "If you see an error, check:"
echo "1. Replace YOUR_ACTUAL_API_KEY with your real key"
echo "2. Ensure your API key has Gemini API access enabled"
echo "3. Check your Google Cloud billing is set up" 