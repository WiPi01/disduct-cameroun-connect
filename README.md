# Disduct Cameroun Connect

**Disduct Cameroun Connect** is a modern, open-source online marketplace for Cameroon, designed to connect buyers and sellers in a seamless, secure, and user-friendly environment. The platform aims to empower individuals and small businesses by providing them with the tools to reach a wider audience and effectively manage their online sales.

## ✨ Features

- **User Authentication:** Secure user registration and login.
- **Product Management:** Sellers can create, update, and manage their product listings.
- **Categorized Browsing:** Users can easily browse and search for products by category.
- **User Profiles:** Comprehensive user profiles displaying listings, reviews, and other relevant information.
- **Mobile-First Design:** A responsive and intuitive interface that works great on all devices.

## 🚀 Tech Stack

- **Frontend:**
  - **Framework:** React (with Vite).
  - **Language:** TypeScript.
  - **UI:** shadcn-ui, Radix UI, and Tailwind CSS.
  - **Routing:** React Router.
  - **State Management:** React Query.
- **Backend (BaaS):**
  - **Provider:** Supabase.
  - **Database:** PostgreSQL.
  - **Authentication:** Supabase Auth.
  - **Storage:** Supabase Storage.

## 📦 Getting Started

### Prerequisites

- Node.js and npm.
- A Supabase account and project.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone git@github.com:WiPi01/disduct-cameroun-connect.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd disduct-cameroun-connect
    ```
3.  **Install dependencies:**
    ```sh
    npm install
    ```
4.  **Configure environment variables:**
    - Create a `.env` file in the root of the project.
    - Add your Supabase project URL and anon key:
      ```
      VITE_SUPABASE_URL=your-supabase-url
      VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
      ```
5.  **Start the development server:**
    ```sh
    npm run dev
    ```

## 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request. For more details, please see the `improvements.md` file in the `docs` folder.

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
