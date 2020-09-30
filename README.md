# Laravel Comment Blocks to Markdown files

## Folder Structure

Keep **laravel project** folders in this docgen folder. 

 **e.g**
 ```sh
    - laravel-project1
    - laravel-project2
    - laravel-project3
    - gen.js
    - package.json
    - README.md
 ```
---------

## Installation
```
npm install
```

----------

## Generate
```
npm run start
```

It will ask a few questions before generated.

1. **Directory Name**
     - A diretory name of current laravel project.
2. **Github Repo Link**
     - If there is a github repo, please provide in the answer. Class methods will show up with a specific line number and link to your repo.
3. **Model or Controller**
     - Generate `Models` or `Controllers` directory. 
     - Why does it generate for both at the same time? Because large task could produce errors. 
