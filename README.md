# 🌍 TourWise Frontend – Smart AI-Powered Travel Planner

The **TourWise Frontend** is a modern web interface built with **Next.js**, **React**, and **shadcn/ui**.
It allows users to generate AI-powered travel itineraries, visualize trip plans, and send them directly to their email — creating a seamless and personalized travel planning experience.

---

## ✨ Key Features

* 🔐 **JWT Authentication** — Secure user login & signup with JWT tokens.
* 💬 **AI Chat Interface** — Conversational input for itinerary generation.
* 🗓️ **Dynamic Itinerary Display** — View structured, day-by-day travel plans.
* 📧 **Save to Email** — Sends itinerary to user’s email via **n8n** automation workflow.
* 🎨 **Beautiful UI** — Built using **shadcn/ui**, **Tailwind CSS**, and **lucide-react** for icons.
* ⚡ **API Integration** — Connects seamlessly to the TourWise backend (FastAPI).

---

## 🧭 Architecture Overview

**Tech Stack**

| Layer                  | Technology                       |
| ---------------------- | -------------------------------- |
| **Frontend Framework** | Next.js (App Router)             |
| **UI Components**      | shadcn/ui, Tailwind CSS          |
| **Icons & Animations** | lucide-react, Framer Motion      |
| **Auth & State**       | JWT, React Context, LocalStorage |
| **HTTP Client**        | Axios                            |
| **Automation**         | n8n webhook integration          |


## ⚙️ Setup Instructions

### Clone the Repository

```bash
git clone https://github.com/SBAK729/Tourwise-UI.git
cd TourWise-UI
```

###  Install Dependencies

```bash
npm install
```

###  Run the App Locally

```bash
npm run dev
```

App will start at: **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Authentication Flow

1. User registers or logs in via `/signup` or `/login`.
2. On success, JWT token and user info are stored in **localStorage**.
3. Protected routes (like `/chat`) check token validity before access.
4. The `useAuth()` hook manages authentication state and logout.

Example:

```typescript
const { user, logout } = useAuth();
```

---

## 💬 Itinerary Generation & Display

* The **Chat Interface** accepts free-form text queries like:

  > “Plan a 5-day budget trip to Addis Ababa”

* On submit, it calls the backend endpoint:
  `POST /auth/generate-itinerary`

* The response (structured JSON itinerary) is displayed in an interactive UI:

  * Organized by day
  * Activities with time, title, description, and notes
  * Estimated total cost and budget breakdown

---

## 📧 Save to Email Feature

* Each itinerary card includes a **“Save to Email”** button.
* When clicked, it sends a POST request to **n8n webhook** with:

  ```json
  {
    "email": "user@example.com",
    "result": { /* itinerary data */ }
  }
  ```
* n8n formats the itinerary into HTML and sends it to the user via Gmail/SMTP.

Button Example:

```tsx
<Button onClick={handleSendToEmail}>Save to Email</Button>
```

---

## 🌟 Future Enhancements

* 🌐 Add Google Maps & nearby place visualization.
* 🗣️ Integrate speech-to-text for trip queries.
* 💾 Add “Save Itinerary” and “Share with Friends” options.
* 🧭 Offline caching for itineraries.

