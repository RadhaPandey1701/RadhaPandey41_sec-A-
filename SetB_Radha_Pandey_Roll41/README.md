# Practical Test - Set B
Name: Radha Pandey | B.Tech CSE | Roll No: 41

Requires Node.js 18+ (check with `node -v`). Open the SetB folder in VS Code (File > Open Folder), then Terminal > New Terminal.

## B1 - JWT Authentication API
    cd b1-jwt-api
    npm install
    npm start        # http://localhost:3000
    npm test         # optional self-test

Try it (PowerShell: use curl.exe, or use Postman / Thunder Client):
    curl -X POST localhost:3000/register -H "Content-Type: application/json" -d '{"username":"radha","password":"secret1"}'
    curl -X POST localhost:3000/login    -H "Content-Type: application/json" -d '{"username":"radha","password":"secret1"}'
    curl localhost:3000/profile -H "Authorization: Bearer <token-from-login>"

## B2 - Shopping Cart with Discount
    cd b2-cart
    npm install
    npm run dev      # open the http://localhost:5173 link shown
    npm test         # optional self-test

Discount rule used: 10% off when total >= 1000.
