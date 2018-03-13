const fs = require('fs')
const path = require('path')
const child_process = require('child_process')
var http = require('http');

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        filelist = fs.statSync(path.join(dir, file)).isDirectory()
            ? walkSync(path.join(dir, file), filelist)
            : filelist.concat(path.join(dir, file));
    });
    return filelist;
}

const getJavaFilePaths = (dirPath)=>{
    let filePaths = walkSync(dirPath)
    let javaPaths = []

    filePaths.forEach(file => {
        if (!file.match(/model/) && !file.match(/sql/) && path.basename(file).match(/[a-zA-Z0-9._/]+[.]java$/g)) {
            javaPaths.push(file)
        }
    })
    console.log(javaPaths);
    return javaPaths;
}

const fileFuzzer = (filePath) => {
    // reading the file line by line as an array
    let lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
    fs.writeFileSync(filePath, '', {encoding:'utf8'});

    lines.forEach(line=>{
        let rnd = Math.random();
        // Random.integer(0, 1)
        
        if(rnd>0.70 && !line.match(/<.+>/) && (line.match(/while/) || line.match(/if/)))
            line = line.replace('<', '>')
        else if(rnd<0.30 && !line.match(/<.+>/) && (line.match(/while/) || line.match(/if/)))
            line = line.replace('>', '<')

        rnd = Math.random()
        if(rnd > 0.70)
            line = line.replace('==', '!=')
        else
            line = line.replace('!=', '==')
       
        rnd = Math.random()
        if(rnd > 0.70 && !line.match(/@/) && !line.match(/\\/))
            line = line.replace(/"([^"strings"]*)"/g, `"demo"`)
    
        
        // Adding new line to the end of each line to keep the format
        if(line != '\r')
            line += '\n'

        fs.appendFileSync(filePath, line, {encoding:'utf8'});
    })
}

const commitFuzzer = (master_sha1, n) => {
    child_process.execSync(`git stash && git checkout fuzzer && git checkout stash -- . && git commit -am "Fuzzing master:${master_sha1}: # ${n}" && git push`)
    child_process.execSync('git stash drop');
    let lastSha1 = child_process.execSync(`git rev-parse fuzzer`).toString().trim()
    return lastSha1;
}

const reverToFirstCommit = (firstSha1, n) => {
    child_process.execSync(`git checkout ${firstSha1}`)
}

const triggerJenkinsBuild = (jenkinsIP, jenkinsToken, githubURL, sha1) => {
    try {
        child_process.execSync(`curl "http://172.17.177.21:8080/git/notifyCommit?url=https://github.ncsu.edu/rmehta4/Hello&branches=fuzzer"
`)
        console.log(`Succesfully trigger build for fuzzer:${sha1}`)
    } catch (error) {
        console.log(`Couldn't trigger build for fuzzr:${sha1}`)
    }
}

const runFuzzingProcess = (n) => {
    let master_sha1 = process.env.MASTER_SHA1;
    let sha1 = process.env.SHA1;
    let jenkinsIP = process.env.JENKINS_IP;
    let jenkinsToken = process.env.JENKINS_BUILD_TOKEN;
    let githubURL = process.env.GITHUB_URL
    for (var i = 0; i < n; i++) {
        let javaPaths = getJavaFilePaths('src/main/edu/ncsu/csc/itrust');
        reverToFirstCommit(sha1)
        javaPaths.forEach(javaPath =>{
            let rnd = Math.random();
            if(rnd > 0.90)
                fileFuzzer(javaPath);
        })
        let lastSha1 = commitFuzzer(master_sha1, i);
        triggerJenkinsBuild(jenkinsIP, jenkinsToken, githubURL, lastSha1)
    }
}

runFuzzingProcess(3);
