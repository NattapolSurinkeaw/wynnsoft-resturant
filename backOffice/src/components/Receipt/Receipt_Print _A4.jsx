import React from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";


const Receipt_Print_A4  = (elementId) => {

  const dom = document.getElementById(elementId);
  if (!dom) {
    console.error("Element not found:", elementId);
    return;
  }

  toPng(dom, { pixelRatio: 3 })
    .then((dataUrl) => {
      console.log("Generated image data URL:", dataUrl);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = dataUrl;
      img.onload = () => {
        console.log("Image loaded");

        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4", //"a4" ✅ ใช้ค่าตัวเลข
        });

        pdf.addImage(dataUrl, "PNG", 5, 5, 200, 0);
        console.log("Printing PDF...");
        pdf.autoPrint(); 
        window.open(pdf.output("bloburl"), "_blank");
      };
    })
    .catch((error) => {
      console.error("oops, something went wrong!", error);
    });
};


export default Receipt_Print_A4 ;
