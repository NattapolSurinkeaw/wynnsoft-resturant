import React from "react";

const Receipt_PDF = (elementId, today, order_number) => {
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

  toPng(dom, { pixelRatio: 3 }) // ใช้ pixelRatio 2x เพื่อความคมชัดที่ดีขึ้น
    .then((dataUrl) => {
      console.log("Image data URL generated");
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = dataUrl;
      img.onload = () => {
        console.log("Image loaded");

        const pdfWidth = 80; // ความกว้างของ PDF เป็น 80 มม.
        const padding = 2; // Padding 1rem (ประมาณ 4.23 มม.)

        // คำนวณความสูงของ PDF โดยคำนวณจากอัตราส่วนของภาพ
        const aspectRatio = img.height / img.width;
        const pdfHeight = pdfWidth * aspectRatio; // ความสูงของ PDF ตามอัตราส่วนภาพ

        // สร้าง PDF
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm", // หน่วยเป็นมิลลิเมตร
          format: [pdfWidth, pdfHeight + 2 * padding], // ขนาด PDF ที่กำหนดจากการคำนวณพร้อม padding
        });

        const imgProps = pdf.getImageProperties(img);
        const imageType = imgProps.fileType;

        // เพิ่ม padding ที่แกน X
        const xPosition = padding; // ตำแหน่ง X ของภาพที่มี padding
        const imgWidthWithPadding = pdfWidth - 2 * padding; // ความกว้างของภาพหลังจากลบ padding

        // เพิ่มภาพลงใน PDF
        pdf.addImage(
          dataUrl,
          imageType,
          xPosition,
          padding,
          imgWidthWithPadding,
          pdfHeight
        );

        console.log("Saving PDF...");
        pdf.save(`receipt-${today}-bill.pdf`);
      };
    })
    .catch((error) => {
      console.error("oops, something went wrong!", error);
    });

  // toPng(dom, { pixelRatio: 3 })
  //   .then((dataUrl) => {
  //     console.log("Generated image data URL:", dataUrl);
  //     const img = new Image();
  //     img.crossOrigin = "anonymous";
  //     img.src = dataUrl;
  //     img.onload = () => {
  //       console.log("Image loaded");

  //       const pdfWidth = 80; // กำหนดความกว้าง 80mm
  //       const pdfHeight = 297; // ความสูงสามารถปรับตามเนื้อหา (เช่น 297mm เท่ากระดาษ A4)

  //       const pdf = new jsPDF({
  //         orientation: "portrait",
  //         unit: "mm",
  //         format: [pdfWidth, pdfHeight], // กำหนดขนาดกระดาษแบบกำหนดเอง
  //       });

  //       pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, 0); // ให้ความกว้างเต็ม 80mm และสูงอัตโนมัติ

  //       console.log("Saving PDF...");
  //       if (order_number) {
  //         pdf.save(`receipt-${today}-bill-${order_number}.pdf`);
  //       } else {
  //         pdf.save(`receipt-${today}-bill.pdf`);
  //       }
  //     };
  //   })
  //   .catch((error) => {
  //     console.error("oops, something went wrong!", error);
  //   });
};

export default Receipt_PDF;
