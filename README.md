# gacha-task-manager

## How to run our app

Our app is available via Google Cloud on:
https://gacha-test-297999012574.us-west1.run.app/

To run locally:
- Your IP needs to be added as an allowed connection to our MySQL database
- Open two tabs in your terminal (one to run the backend and one to run the frontend)
- In tab 1:
  - `cd backend`
  - `npm i`
  - Create a .env file. It should contain the following:
  - ```
    DB_HOST=34.82.164.247
    DB_NAME=main_db
    DB_USER=root
    DB_PASS=cs35L
    ```
- run `npm start`

- In tab 2:
  -  `cd get-it-done-gacha`
  - `npm i`
  - `npm run build`

## OLD INSTRUCTIONS
- Your IP needs to be added as an allowed connection to our MySQL database
- Open two tabs in your terminal (one to run the backend and one to run the frontend)
- In tab 1:
  - `cd backend`
  - `npm i`
  - Create a .env file. It should contain the following:
  - ```
    DB_HOST=34.82.164.247
    DB_NAME=main_db
    DB_USER=root
    DB_PASS=cs35L
    ```
  - `node index.js` This should display something like:
  - ![image](https://github.com/user-attachments/assets/e2e938fd-f1d5-4091-888c-4fe58acb254a)

- In tab 2:
  -  `cd get-it-done-gacha`
  -  `npm i`
  -  `npm run dev` This should display something like:
  -  ![image](https://github.com/user-attachments/assets/5a2ddd13-a7bb-49d3-907e-321339c07733)
 
- Visit localhost:5173 in your browser


