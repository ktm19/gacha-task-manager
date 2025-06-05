# Gacha Get-It-Done

## How to run our app

Our app is available via Google Cloud on:
https://gacha-test-297999012574.us-west1.run.app/

To run locally:
- `cd get-it-done-gacha`
- `npm ci`
- `npm run build` You should see something like:  
   ![image](https://github.com/user-attachments/assets/df3fc439-277b-4e31-b5bf-f11a93f65642)

- `cd ../backend`
- `npm ci`
- Create a .env file with the credentials in the tarball.
- `node index.js` You should see the database credentials, then something like:
  ![image](https://github.com/user-attachments/assets/867b0435-654a-4fad-99fe-f3dd7d13761f)

- Visit localhost:8080 in your browser.
 
Getting errors?
- If it's related to connecting to the database, make sure you're using an IP in one of these ranges: 149.142.0.0/16, 164.67.0.0/16, 128.97.0.0/16, 169.232.0.0/16, 131.179.0.0/16. If you want to connect using a different IP address, let us know, and we can add it manually as an allowed connection.
