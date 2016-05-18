// include depenencies (a-z)

const fs = require('fs');
const mkdirp = require('mkdirp');
const postcss = require('postcss');

// configure input, output and processors:

const inputFilename = 'src/index.css';
const outputDir = 'dist/';
const outputFilename = 'dist/index.css';

const processors = [
    require('postcss-import'),              // combine imports into one file
    require('postcss-css-variables'),       // replace variables by their calculated values
    require('autoprefixer')                 // vendor prefix for older browsers
];

if (process.env.NODE_ENV === 'production') {
    processors.push(require('cssnano'));    // minify css
}

// process input and write output to disk:

postcss(processors)
    .process(fs.readFileSync(inputFilename), {
        from: inputFilename,
        to: outputFilename.substr(outputDir.length), // file path relative to output dir
        map: { inline: false }
    })
    .then(writeOutput);


function writeOutput(result) {
    mkdirp(outputDir, (err) => {
        handleError(err);
        fs.writeFile(outputFilename, result.css, handleError);
        if (result.map) {
            fs.writeFile(`${outputFilename}.map`, result.map, handleError);
        }
    });
}

function handleError(err) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
}