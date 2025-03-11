import React, { useState } from "react";

const OrderDetail = ({ onClickClose, selectedRow }) => {
  const [detailData, setDetailData] = useState(selectedRow);

  console.log(detailData);
  
  return <div>OrderDetail</div>;
};

export default OrderDetail;
