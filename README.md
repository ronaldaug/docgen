# Laravel Comment Blocks to Markdown files

## Folder Structure

Keep **laravel project** folder inside this project folder

 **e.g**
 ```sh
    - laravel-project
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

It will prompt up and ask directory names in terminal. Answer the question and will generate a new folder `dist` in the same directory.

----------

## Get HTML format documentation
To generate Markdown files from `dist` to HTML format documentation,
Please use this repo [https://github.com/ronaldaug/md-to-doc](https://github.com/ronaldaug/md-to-doc)