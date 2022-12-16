import jsPDF from 'jspdf'
import { saveAs } from 'file-saver';
/**
 * 
 * @param eleId canvas id
 * @param pdfName pdf
 */
export function exportPDF(eleId, pdfName) {
  const canvas = document.querySelector(`#${eleId}`)

  const pageData = canvas.toDataURL('image/jpeg', 1.0)
  const contentWidth = canvas.width
  const contentHeight = canvas.height

  const pageHeight = (contentWidth / 592.28) * 841.89

  let leftHeight = contentHeight

  let position = 0

  const imgWidth = 595.28
  const imgHeight = (592.28 / contentWidth) * contentHeight
  const pdf = new jsPDF('', 'pt', 'a4')

  if (leftHeight < pageHeight) {
    pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
  } else {
    while (leftHeight > 0) {
      pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
      leftHeight -= pageHeight
      position -= 841.89

      if (leftHeight > 0) {
        pdf.addPage()
      }
    }
  }
  pdf.save(`${pdfName}.pdf`)
}

/**
 * 
 * @param labels fields from x-axis
 * @param data  data from y-axis
 * 
 * Generate CSV file based on the data from x-axis and y-axis
 */

export function exportCSV(labels, data) {
  var str = ""
  for (const v of labels)
    str += v + "\t"
  str += "\n";
  for (const v of data)
    str += v + "\t"
  var aaaa = "data:text/csv;charset=utf-8,\ufeff" + str;
  var link = document.createElement("a");
  link.setAttribute("href", aaaa);
  var date = new Date().getTime();
  var filename = new Date(date).toLocaleDateString();
  link.setAttribute("download", filename + ".csv");
  link.click();
}

/**
 * 
 * @param eleId canvas id
 * @param name name of the file
 */

export function exportHTML(canvasId, name) {
  // Get the canvas element
  var canvas = document.getElementById(canvasId);

  // Convert the canvas to a data URL
  var dataURL = canvas.toDataURL();

  // Create an image element
  var img = document.createElement('img');

  // Set the src attribute of the image to the data URL
  img.src = dataURL;

  // Create an HTML string that includes the image
  var html = '<html><body>' + img.outerHTML + '</body></html>';

  // Save the HTML to a file
  saveAs(new Blob([html], { type: 'text/html' }), name);
}