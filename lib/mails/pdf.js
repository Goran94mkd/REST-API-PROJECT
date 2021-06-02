const PDFDocument = require('pdfkit');
const fs = require('fs');

module.exports = (blogPost) => {
  // promisify this method!
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(`pdfs/blogpost-${blogPost._id}.pdf`));
  doc
    .fontSize(25)
    .text(`Title: ${blogPost.title}, content: ${blogPost.content}`, 100, 100);

  doc.end();
}