import React from "react";
import { cate, foodDetail } from "../../components/mockData/foodMenu";
import { DataGrid } from '@mui/x-data-grid';
import { Box } from "@mui/material";

function FoodMenu() {
  const columns = [
    {
      field: "count",
      headerName: "ลำดับ",
      headerAlign: "center",
      align: "center",
      width: 100,
    },
    {
      field: "images",
      headerName: "รูป",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div className="p-1 flex justify-center items-center">
          <img
            src={params.value}
            alt=""
            style={{
              borderRadius: "5px",
              width: "60px",
              height: "60px",
              objectFit:"cover"
            }}
          />
        </div>
      ),
    },
    {
      field: "name",
      headerName: "ชื่อ",
      width: 250,
      editable: false,
    },
    { 
      field: 'cateID',
      headerName: 'หมวดหมู่',
      headerAlign: 'center',
      align: 'center',
      width: 150,
      valueGetter: (params) => {
        const category = cate.find(item => item.id === params.value);
        return category ? category.name : 'ไม่ระบุ';
      }
    },
    {
      field: "price",
      headerName: "ราคา (฿)",
      type: "number",
      headerAlign: "center",
      align: "right",
      width: 150,
      editable: false,
    },
    {
      field: "status",
      headerName: "สถานะ",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 170,
    },

    {
      field: "bestSeller",
      headerName: "สินค้าขายดี",
      headerAlign: "center",
      align: "center",
      type: "number",
      width: 110,
      editable: true,
    },
    {
      field: "detail",
      headerName: "รายละเอียด",
      sortable: false,
      width: 300,
      renderCell: (params) => {
        if (!params.value) {
          return "-";
        }
        return params.value;
      },
    },
    {
      field: "edit",
      headerAlign: "center",
      align: "center",
      sortable: false,
      width: 80,
      headerName: "",
    },

    {
      field: 'delete',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      width: 80,
      headerName: '', 
    },
  ];

  return (
    <div>
      <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid
          className="bg-white "
          rows={foodDetail}
          rowHeight={70}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableSelectionOnClick
        />
      </Box>
    </div>
  );
}

export default FoodMenu;
