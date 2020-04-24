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

### 6. Check user model for relevance to new project's needs
Like if you don't care about your user's birthday, then delete it. Erase it from existence. Populate it with fields that you care about. The things that are relevant to YOU. Make it personal. Make it deep. Make it meaningful.

### 7. Run the migration
Finaly, run the migration, and your project may begin.
```sh 
sequelize db:migrate
```

### 8. Create a file for environment variables
Oh did I say you were done? Yeah, I lied.
```sh
touch .env
```
This file is where all your top-secret keys are going to go, like session keys or API keys

### 9. Run the server. Make sure it works.
**With Nodemon**
```sh
nodemon
```

**Without Nodemon**
```sh
node index.js
```

### 10. Remove the strings to the boilerplate's repository.
```sh
git remote -v
```
If you run this, you will see the strings that hold you back from something truly yours. The code to run this is simple:
```sh
git remote remove origin
```

### 11. Create a new repository. Make it yours. Start your journey.
In creating a new repository, Github will provide you with steps necessary to do so. Still, I'll show you how to do connect your local repository to the one you make on Github.

```sh
git init
git add .
git commit -m "Initial Commit"
git remote add origin <new_repo_link>
git push origin master
```
**Happy Coding!**
