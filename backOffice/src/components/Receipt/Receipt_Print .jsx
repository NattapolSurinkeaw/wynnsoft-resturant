import React from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

const Receipt_Print = (elementId) => {
  const dom = document.getElementById(elementId);
  if (!dom) {
    console.error("Element not found:", elementId);
    return;
  }

  toPng(dom, { quality: 1, scale: 2 })
    .then((dataUrl) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = dataUrl;
      img.onload = () => {
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const aspectRatio = img.height / img.width;
        const pdfHeight = pdfWidth * aspectRatio;

        pdf.addImage(
          dataUrl,
          "PNG",
          5, // ขอบซ้าย
          5, // ขอบบน
          pdfWidth - 1,
          pdfHeight
        );

        pdf.autoPrint();
        window.open(pdf.output("bloburl"), "_blank");
      };
    })
    .catch((error) => {
      console.error("Oops, something went wrong!", error);
    });
};

export default Receipt_Print;
