import React from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

function SaveAsPDF(elementId , today ,order_number) {
  console.log("Generating PDF for:", today, order_number); // ตรวจสอบค่าที่ได้รับ
  if (!today || !order_number) {
    console.error("Error: Missing today or order_number");
    return;
  }

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

        pdf.addImage(dataUrl, "PNG", 10, 10, 180, 0);
        console.log("Saving PDF...");
        if (order_number) {
          pdf.save(`receipt-${today}-bill-${order_number}.pdf`);
        } else {
          pdf.save(`receipt-${today}-bill.pdf`);
        }
      };
    })
    .catch((error) => {
      console.error("oops, something went wrong!", error);
    });
  }

export default SaveAsPDF;
