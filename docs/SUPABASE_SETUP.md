# Supabase Setup Guide for Disduct Cameroun Connect

## Introduction

This guide provides a complete, end-to-end walkthrough for setting up the Supabase backend for this project. Supabase serves as our all-in-one backend, providing the **PostgreSQL Database**, **User Authentication**, and **File Storage** needed for the application to run.

Following these steps is **mandatory** to be able to run the application locally, create a user account, and test its features.

---

## Step 1: Create a Supabase Project

First, you need a Supabase account and a project to work with.

1.  Navigate to **[supabase.com](https://supabase.com)** in your web browser and sign up for a free account.
2.  Once you are logged into your dashboard, click the **"New Project"** button.
3.  You will be prompted to choose an organization. You can use your default personal organization.
4.  Fill out the project details:
    -   **Name:** Give your project a clear name, for example: `disduct-cameroun-connect`.
    -   **Database Password:** Create a strong, secure password and **save it somewhere safe**. You will need this if you ever have to restore your database.
    -   **Region:** Choose the region closest to you or your users.
    -   **Pricing Plan:** Select the **Free Plan**. It is more than sufficient for development and testing.
5.  Click **"Create new project"**. It will take a few minutes for your new project to be provisioned.

## Step 2: Get Your Project API Credentials

To connect the application to your new Supabase project, you need to get its unique API keys.

1.  From your project's dashboard, find the gear icon for **Project Settings** in the bottom-left sidebar and click it.
2.  In the settings menu, click on the **API** tab.
3.  In this section, you will find the two credentials we need:
    -   Under **Project URL**, you will find your project's unique URL. Copy this value.
    -   Under **Project API Keys**, you will find the `anon` `public` key. This is the safe, public-facing key that allows the application to interact with your Supabase backend. Copy this key.

## Step 3: Configure Your Local Environment

Now, we need to securely store these credentials in the project so the application can use them without exposing them in the source code.

1.  In the root directory of this project, create a new file named exactly `.env.local`.
2.  Open this new file and paste the following content into it:

    ```
    VITE_SUPABASE_URL="PASTE_YOUR_PROJECT_URL_HERE"
    VITE_SUPABASE_ANON_KEY="PASTE_YOUR_ANON_PUBLIC_KEY_HERE"
    ```

3.  Replace the placeholder text with the actual **URL** and **anon key** you copied in the previous step.
4.  The `.gitignore` file is already configured to ignore `.env.local`, so you will never accidentally commit your secret keys to version control.

    **Note:** The application's Supabase client (`src/integrations/supabase/client.ts`) has been updated to read these values directly from your `.env.local` file. This ensures that your application always connects to the correct Supabase project you've configured.

## Step 4: Set Up the Database with the Supabase CLI

Your project is connected, but the database is empty. This project contains migration files that define the entire database structure (tables, functions, etc.). We will use the Supabase CLI (Command Line Interface) to "push" this structure to your new database.

1.  **Install the CLI:** If you haven't already, this command will install the Supabase CLI as a development dependency in the project.

    ```bash
    npm install --save-dev supabase
    ```

2.  **Login to Supabase:** **This is a crucial one-time step.** You need to authorize the Supabase CLI to connect to your account. Run the following command:

    ```bash
    npx supabase login
    ```

    This will open a browser window and ask you to log in and approve the authorization. Once you have, you can return to the terminal.

3.  **Link Your Project:** This command connects your local codebase to your remote Supabase project. 
    -   First, find your **Project Ref**. This is a unique 20-character ID for your project. You can find it in the URL of your dashboard: `https://app.supabase.com/project/YOUR_PROJECT_REF`.
    -   Run the following command in your terminal, replacing the placeholder with your actual Project Ref:

    ```bash
    npx supabase link --project-ref YOUR_PROJECT_REF_HERE
    ```

4.  **Push the Database Migrations:** This is the final and most important step. Run the following command in your terminal:

    ```bash
    npx supabase db push
    ```

    This command will find all the `.sql` files in the `supabase/migrations` directory, execute them in order, and build all the necessary tables (`profiles`, `products`) and functions (`search_products`, `get_category_counts`) in your live database.

## Step 5: Set Up File Storage for Product Images

The application allows users to upload images for their products. This requires a "bucket" in Supabase Storage.

1.  In your Supabase project dashboard, click on the **Storage** icon in the left sidebar (it looks like a cylinder).
2.  Click the **"Create a new bucket"** button.
3.  For the **Bucket name**, enter exactly `product-images`.
4.  Leave the bucket as **Public**.
5.  Click **"Create bucket"**.

This ensures that when users upload images via the "Create Product" form, the storage location exists and the images will be publicly viewable.

---

## You're All Set!

Your Supabase backend is now fully configured and connected to the application.

To start using the app:
1.  **Restart your development server** (e.g., run `npm run dev` in your terminal). This is crucial for it to load the new environment variables from your `.env.local` file.
2.  Open the application in your browser.
3.  You should now be able to **create an account, log in, and test all the features** we have built.
