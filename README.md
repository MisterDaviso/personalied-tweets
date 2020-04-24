# Node Auth Boilerplate
This is a boilerplate for an express app with local user authentication. It exists so I can have a customized boilerplate and I don't have to start from scratch on all my projects.

## What It Includes
* Local Auth (email and password)
* Passport and Passport-Local
* Sessions for saving user info and displaying flash messages
* Settings for PostgreSQL and Sequelize
* Hashed Passwords
* EJS templating and EJS layouts
* Sequelize User Model
* Materialize styling

## Included Models
| Column | Type | Notes |
|--------|------|---------------|
|id|Integer|Serial Primary Key|
|firstname|String|Required length > 1|

## Routes
**Routes in index.js (main)**
|Method|Path|Purpose|
|-----|---------|----------------|
|GET| `/` | Home Page|
|GET| `*` | Catch-all for 404's|

## Directions for Use

### 1. Clone the repository, but with a different name
``` sh
git clone <repo_link> <new_name>
```
**For Example**
```sh
git clone https://github.com/MisterDaviso/auth-boiler.git new-project-name
```

### 2. Install module dependencies
```sh
npm i 
```

### 3. Customize to your personal style!
Remove all the basic defaulty stuff I had. Please, I insist.
* Title in `layout.ejs`
* Logo field in the nav bar
* Switch Favicon to project-specific icon

### 4. Create a new database for the project
```sh
createdb <new_db_name>
```

### 5. Update your config.json
In `config/congi.json`, change the "database" value to the name you set in step 4. Other settings should be fine by default, so alter them at your own risk.

### 6. Migrate
