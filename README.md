# LAMP Stack Project – Contact Manager

This project was developed by Sultan Lodi, 


This project is a simple **Contact Manager** web application built on the **LAMP stack** (Linux, Apache, MySQL, PHP).  
It allows users to **register, log in, add, search, edit, and delete contacts**.  

---

## Features
- User registration with unique login
- Secure login and logout system
- Add, search, edit, and delete personal contacts
- Each user only sees their own contacts
- Frontend: HTML, CSS, JavaScript (with Fetch API calls to PHP backend)
- Backend: PHP REST-style APIs connected to MySQL
- Database: MySQL with two main tables (`Users`, `Contacts`)
- Passwords should be stored securely (hashed using `password_hash()`)

---

## 📂 Project Structure
/LAMPAPI

├── addContact.php

├── deleteContact.php

├── editContact.php

├── LoginContact.php

├── RegisterContact.php

├── SearchContact.php


/html

├── index.html # Login page

├── signup.html # Registration page

├── dashboard.html # Contact manager (search/add/edit/delete)

├── styles.css # Styling

├── main.js # Frontend logic




---

## 🗄️ Database Design
The database schema is documented with an **Entity Relationship Diagram (ERD)**.  

### Tables:
**Users**
- `ID` (Primary Key)
- `FirstName`
- `LastName`
- `Login` (unique username)
- `Password` (hashed)

**Contacts**
- `ID` (Primary Key)
- `FirstName`
- `LastName`
- `Email`
- `Phone`
- `UserID` (Foreign Key → Users.ID)

📌 Relationship: One user can have many contacts.

An ERD diagram (`LampStack Project.pdf`) is included in the project files.

---
