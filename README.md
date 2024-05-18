## Sales Agent Dashboard
## Overview
The Sales Agent Dashboard is a web application built with Angular that provides sales agents with a user-friendly interface to manage invoices, collections, and school data. It offers features such as viewing, creating, updating, and deleting invoices and collections, as well as generating analytics reports.

## Setup Instructions
To get started with the Sales Agent Dashboard, follow these steps:

Clone the repository:
## [https://github.com/njorogegwanjiru/SalesAgentDashboard.git]

Navigate to the project directory:
cd SalesAgentDashboard

Install dependencies:
npm install

Run the development server:
ng serve

Open the application in your browser:
Navigate to http://localhost:4200/ to view the application.

Install JSON Server
npm install -g json-server

Create a JSON file for your data:
eg. db.json

Start the JSON Server
npx json-server db.json

## Key Features
Manage Invoices: Create, update, delete, and view invoices.
Manage Collections: Create, update, delete, and view collections.
Analytics: Generate reports and visualize data related to sales and collections.
Responsive Design: The dashboard is designed to work seamlessly across devices of all sizes.

## Project Structure
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.2.

The project structure is organized as follows:

src/app/components: Contains Angular components for different parts of the application Thev components Include respective Angular services to handle data fetching and manipulation.
src/assets: Contains static assets such as images and stylesheets.

## Design Decisions
Angular Framework: Angular was chosen as per instructions.

## Responsive Design: 
The dashboard is designed to be responsive using Angular Material components to ensure a consistent user experience across devices.

## Modular Architecture:
 The application follows a modular architecture to promote code reusability and maintainability.

## State Management:
 Angular services are used for managing application state and handling data operations to ensure separation of concerns.
