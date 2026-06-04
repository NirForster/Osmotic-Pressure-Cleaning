#!/bin/bash
echo "Testing sitemap endpoint..."
echo ""
echo "Waiting for server to be ready (make sure server is running on port 3000)..."
echo ""

# Test the endpoint
curl -s -o /tmp/sitemap-test.xml http://localhost:3000/sitemap.xml

if [ $? -eq 0 ]; then
    echo "✅ Sitemap endpoint is accessible"
    echo ""
    echo "Content-Type check:"
    curl -s -I http://localhost:3000/sitemap.xml | grep -i content-type
    echo ""
    echo "Sitemap size: $(wc -c < /tmp/sitemap-test.xml) bytes"
    echo ""
    echo "Number of URLs in sitemap:"
    grep -c "<url>" /tmp/sitemap-test.xml || echo "0"
    echo ""
    echo "Number of product URLs:"
    grep -c "/product/" /tmp/sitemap-test.xml || echo "0"
    echo ""
    echo "First 20 lines of sitemap:"
    head -20 /tmp/sitemap-test.xml
    echo ""
    echo "Full sitemap saved to: /tmp/sitemap-test.xml"
    echo ""
    echo "To view full sitemap: cat /tmp/sitemap-test.xml"
else
    echo "❌ Error: Could not fetch sitemap"
    echo "Make sure the server is running: cd server && npm run dev"
fi
