# Abuse Reverter - Roblox Group Rank Manager

A simple web app and backend to **revert Roblox group ranks** by fetching users with a specific rank and assigning them a new rank automatically.

---

## Features

- Enter **Group ID**
- Fetch available **Group Roles** dynamically from Roblox API
- Select **Current Rank** and **New Rank** from dropdown menus
- Start revert process with one click
- See live progress and results
- Built with **Node.js**, **Express**, and **Vanilla JS** frontend
- Hosted for free on **Vercel** with automatic GitHub integration

---

## Demo

Live demo: [https://abuse-reverter.vercel.app/](https://abuse-reverter.vercel.app/)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16+
- A valid Roblox security cookie (DON'T SHARE IT WITH ANYONE)
- Git (optional, for cloning)

### Installation

1. Clone the repo  
```bash
git clone https://github.com/Vestavik/abuse-reverter.git
cd abuse-reverter
````

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file and add your Roblox cookie (optional for local, you can enter cookie in frontend)

```
ROBUX_COOKIE=_|WARNING:-DO-NOT-SHARE-THIS.--YOUR_ROBLOX_COOKIE_HERE
```

4. Run the server locally

```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

---

## Usage

1. Enter your **Roblox Security Cookie**
2. Enter the **Group ID**
3. Click **Fetch Roles** to load roles for that group
4. Select **Current Rank** (the rank to revert from)
5. Select **New Rank** (the rank to assign)
6. Click **Start Revert** to begin
7. Watch the log output for progress and completion

---

## Deployment

This project is easily deployable to **Vercel** for free:

1. Connect your GitHub repository to Vercel
2. Push commits to your main branch
3. Vercel auto-builds and deploys your app
4. Your app is live at your Vercel URL

---

## Folder Structure

```
/
├── public/            # Static frontend files
├── server.js          # Express backend server
├── package.json       # Node dependencies and scripts
├── README.md          # This file
└── .env               # Environment variables (optional)
```

---

## Technologies Used

* [Node.js](https://nodejs.org/)
* [Express](https://expressjs.com/)
* [noblox.js](https://www.npmjs.com/package/noblox.js) - Roblox API wrapper
* Vanilla JavaScript, HTML, and CSS

---

## Security Warning

**NEVER** share your Roblox security cookie with anyone.
This cookie gives full access to your Roblox account and can lead to account theft or loss of Robux and items.

---

## License

MIT License © Vestavik

---

## Contact

Questions or feedback? Open an issue or contact me on GitHub!
