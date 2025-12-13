#!/bin/bash
# Simple script to start the game server

echo "🌸 Starting Healing Story Game..."
echo "📍 Server will be available at: http://localhost:8000"
echo ""
echo "Choose your version:"
echo "  - Standalone version (recommended): http://localhost:8000/index-standalone.html"
echo "  - Phaser version (requires CDN): http://localhost:8000/index.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 -m http.server 8000
