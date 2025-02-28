import React, { useState, useEffect } from 'react'
import { getCategoryFoods } from '../../services/manageData.services';
import AddCategoryFood from './components/AddCategoryFood';
import EditCategoryFood from './components/EditCategoryFood';

function CategoryFood() {
  const [categFood, setCateFood] = useState([]);
  const [handleCreate, setHandleCreate] = useState(false);
  const [handleEdit, setHandleEdit] = useState(false);

  useEffect(( ) => {
    getCategoryFoods().then((res) => {
      console.log(res);
      setCateFood(res.cateFood);
    })
  }, [])

  return (
    <div>
      <div>
        <h1>หมวดหมู่เมนู</h1>
        <button 
          className=''
          onClick={() => setHandleCreate(!handleCreate)}
        >+ เพิ่มหมวดหมู่</button>
      </div>

      <div className='w-full flex gap-5'>
        <div className="w-full relative overflow-x-auto">
          <table className="w-[600px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" className="px-6 py-3">
                        ลำดับ
                      </th>
                      <th scope="col" className="px-6 py-3">
                        รูปภาพ
                      </th>
                      <th scope="col" className="px-6 py-3">
                        สถานะ
                      </th>
                  </tr>
              </thead>
              <tbody>
                {
                  categFood.map((cate) => (
                    <tr key={cate.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {cate.id}
                      </th>
                      <td className="px-6 py-4">
                        <div className='flex gap-2'>
                          <img className='w-[70px] h-[70px]' src={cate.thumbnail} alt="" />
                          <p>{cate.title}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button>สถานะ</button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
          </table>
        </div>

        {
          handleCreate && <AddCategoryFood />
        }

        {
          handleEdit && <EditCategoryFood />
        }
      </div>
    </div>
  )
}

export default CategoryFood