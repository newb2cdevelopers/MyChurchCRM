import { jsPDF } from 'jspdf'
export const GenerateQR = (event,documentNumber, htmlElement,name="") => {

    let pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [150, 40]
    });

    pdf.setFontSize(15);
    pdf.text(`${event.name}`, 43, 20);    

    pdf.setFontSize(10);
    pdf.text(`${event.date.split("T")[0]} - ${event.date.split("T")[1].substring(0, 5)}`, 43, 25);
    pdf.text(`Número de documento: ${documentNumber}`, 43, 30);
    pdf.text(`${name}`, 43, 35);

    let base64Image = htmlElement.toDataURL();
    pdf.addImage(base64Image, 'png', 0, 0, 40, 40)
    pdf.save('QR.pdf')

}