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

## Format of Laravel PHP comment blocks

Before generating a doc, must have a nice format comment block above each PHP methods. 

```php
     /**
     * Lorem ipsum dolor sit amet, consectetur adipiscing elit. In mattis dictum lorem id bibendum.
     *
     * @param String  $value1
     * @param Boolean $value2
     * @return Mixed
     * @see https://stackoverflow.com
     * @version beta@1.2.0
     * @author Ronald Aug
     *
     */
```

- The very first line is a description of Class Method.
- The rest are parameters and return type.

----------

## Installation
```
npm install
```

----------

## Generate
```
npm run start
```

It will ask a few questions before generating.

1. **Directory Name**
     - A diretory name of current laravel project.
2. **Github Repo Link**
     - If there is a github repo, please provide in the answer. Class methods will show up with a specific line number and link to your repo.
3. **Model or Controller**
     - Generate `Models` or `Controllers` directory. 
     - Why does it generate for both at the same time? Because large task could produce errors. 
