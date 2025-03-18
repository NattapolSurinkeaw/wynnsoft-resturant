import React from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";


const Receipt_Print  = (elementId) => {

  const dom = document.getElementById(elementId);
  if (!dom) {
    console.error("Element not found:", elementId);
    return;
  }

  toPng(dom, { pixelRatio: 3 })
    .then((dataUrl) => {
      console.log("Image data URL generated");
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = dataUrl;
      img.onload = () => {
        console.log("Image loaded");

        const pdfWidth = 80;
        const padding = 2; 
        const aspectRatio = img.height / img.width;
        const pdfHeight = pdfWidth * aspectRatio;

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: [pdfWidth, pdfHeight + 2 * padding],
        });

        const imgProps = pdf.getImageProperties(img);
        const imageType = imgProps.fileType;
        pdf.addImage(
          dataUrl,
          imageType,
          padding,
          padding,
          pdfWidth - 2 * padding,
          pdfHeight
        );

        console.log("Printing PDF...");
        pdf.autoPrint(); 
        window.open(pdf.output("bloburl"), "_blank");
      };
    })
    .catch((error) => {
      console.error("Oops, something went wrong!", error);
    });
};


export default Receipt_Print ;
