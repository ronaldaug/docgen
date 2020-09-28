const fs = require('fs');
const lineNumber = require('line-number');
const path = require("path");
const fse = require('fs-extra');
const { stdin, stdout } = process;
function prompt(question) {
  return new Promise((resolve, reject) => {
    stdin.resume();
    stdout.write(question);

    stdin.on('data', data => resolve(data.toString().trim()));
    stdin.on('error', err => reject(err));
  });
}

/**
 * @see https://stackoverflow.com/questions/41462606/get-all-files-recursively-in-directories-nodejs
 */
let files = [];
function ThroughDirectory(Directory) {
  fs.readdirSync(Directory).forEach(File => {
      const Absolute = path.join(Directory, File);
      if (fs.statSync(Absolute).isDirectory()) return ThroughDirectory(Absolute);
      else return files.push(Absolute);
  });
}

/**
 * Read Files Content
 */
function readFileContents(dir) {

    ThroughDirectory(dir);

    files.forEach(filename => {
        const data = fs.readFileSync(filename, 'utf-8')
        files.push({filename,data})
    });

    return files;
}

const generateMD = async (folderPath)=>{

      const allFiles = await readFileContents(folderPath);

      const classPattern = new RegExp(`class\\s.*`,"gm");
      const commentPattern = new RegExp(`\\/\\/?\\s*\\*[\\s\\S]*?\\*\\s*\\/\\/?`,"gm");
      const funcPattern =  new RegExp(`(public|protected|private)\\s.*function\\s.*`,"gm");

      const classes = [];
      allFiles.forEach(eachFile=>{
        const eachData = eachFile.data?eachFile.data.match(classPattern):'';
        const data = {
            name:eachFile.filename,
            class:eachData
        }
        classes.push(data);
      })

      const comments = [];
      allFiles.forEach(eachFile=>{
        const eachData = eachFile.data?eachFile.data.match(commentPattern):'';
        const data = {
            name:eachFile.filename,
            data:eachData
        }
        comments.push(data);
      })

      const funcs = [];
      allFiles.forEach(eachFile=>{
          const eachData = eachFile.data?lineNumber(eachFile.data,funcPattern):'';
          const data = {
              name:eachFile.filename,
              data:eachData
            }
          funcs.push(data);
      })

      const doc = [];

      comments.forEach((c,i)=>{

        let classN = '';
        if(c.name == classes[i].name){
           classN = classes[i].class;
        }

        if(c.name == funcs[i].name){

            const desc = [];

            if(c.data){
              c.data.forEach((e,idx)=>{
                  if(!funcs[i].data[idx]){
                    return;
                  }
                  const lines   = e.split("\n");
                  const head    = lines[1];
                  const params  = lines.filter(a=>a.includes("@"));
                  desc.push({head,params,func:funcs[i].data[idx]});
              })
            }

            doc.push({
                class:classN,
                name:c.name,
                data:desc
            })
        }
      })

      const removeStar = (s)=>{
        if(!s.includes("*")){
          return s;
        }
        return s.split("*")[1];
      }

      const loopParams = (params)=>{
          return params.map(x=>x.trim()+'\n').join("");
      }


      const getFuncName = (func)=>{

        if(!Object.keys(func)){return}

        let str = '';
        let typ = '';

        const {match,number} = func;

        const funcName = match.split(" ")[2].split("(")[0];

        if(match.includes("public")){
          typ = 'Public';
          str = match.replace("public static function ","");
          str = str.replace("public function ","");
        }

        if(match.includes("protected")){
          typ = 'Protected';
          str = match.replace("protected static function ","");
          str = str.replace("protected function ","");
        }

        if(match.includes("private")){
          typ = 'Private';
          str = match.replace("private static function ","");
          str = str.replace("private function ","");
        }

        str = str.replace("{","");
        return `## ${funcName} \n\n ${typ} Method - ${str.trim()}  [ Line number - **${number}** ]`;
      }

      const loopData = (data)=>{
            return data.map(d=>{
                return `${getFuncName(d.func)}\n> ${removeStar(d.head).trim()}\n${loopParams(d.params)}\n----------\n\n`
            }).join("")
      }


      doc.forEach(d=>{
        if(!d.name){return};
        let finalDoc = '';
        const filename = d.name.split("/").pop();
        finalDoc += `# ${d.class?d.class[0].split(" ")[1]:''}\n\n`;
        finalDoc += `${filename} \n\n`;
        finalDoc += `Path - ${d.name}\n\n`;
        finalDoc += `${loopData(d.data)||'No Comment Block.\n'}\n`;
        fse.outputFileSync(`dist/${filename.replace(".php","")}.md`, finalDoc);
      })
      return 'done!';
}

/**
 * Asking project folder name
 */
async function askingFolderName() {
    try {
      let projectFolder = await prompt("Project directory name? ");
      let picked = await prompt("Model or Controller? ");

      if(!picked){
         picked = await prompt("Please type 'Model' or 'Controller'");
      }

      if(picked.toLowerCase().includes("model")){

        // Generate Models
        const ModelfolderPath = projectFolder+'/app/Models';
        const modelData = await generateMD(ModelfolderPath);

      }else{

        // Generate Controller
        const ControllerfolderPath = projectFolder+'/app/Http/Controllers';
        const controllerData = await generateMD(ControllerfolderPath);
      }

      console.log("Successfully generated!");
      stdin.pause();

    } catch(error) {
      console.log("There's an error!");
      console.log(error);
    }
    process.exit();
}

askingFolderName();