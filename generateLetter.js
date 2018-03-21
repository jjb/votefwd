 //generateLetter.js
'use strict'

var PDFDocument = require('pdfkit');
var fs = require('fs');

let doc = new PDFDocument();
doc.pipe(fs.createWriteStream('./file.pdf'));

doc.text('Hello world!');
doc.end();

