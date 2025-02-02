# Emote Backend API

A complete Backend API for Emote a social media networking app. 
This API allows user to register, login, post, message, get reels etc.

## Features

- Register
- Login
- Message
- Post
- Share media file like photos and videos

## Requiremments

- Node JS 20.x
- Npm 10.x
- MySQL

## Installation
1. Clone the repository: 
	```bash
		git clone https://github.com/Sam-spec-ops/emote_backend.git
		cd emote_backend
	```

3. Install the required dependencies:
	```bash
		npm install
	```

4. In the .env file replace:
    ```.env
        PORT= SERVER PORT
        EMAIL_ADDRESS = APP EMAIL ADDRESS
        EMAIL_PASSWORD = APP EMAIL PASSWORD
        SECRET_KEY = APP SECRET_KEY
    ```

5. Start the development server:
	```bash
		npm start
	```

## Api Endpoints

### Auth Endpoints:

- **POST** `/auth/register` - Register
- **POST** `/auth/login` - Login
- **POST** `/auth/sendotp` - Send OTP
- **POST** `/auth/validateotp` - Validate OTP

### Example Request Bodies

#### Creating an Account Registration:
```json
{
    "name": "Teslonix",
    "username": "Teslonix",
    "email": "Teslonix@gmail.com",
    "password": "Teslonix password",
    "gender": "other",
    "birthday": "data//month//year",
    "phonenumber": "+countrycode phonenumber"
}