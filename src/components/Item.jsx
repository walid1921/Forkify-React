import React from 'react';


const Item = ({ recipes }) => {


  return (
    <>
      {
        recipes.map((i, item) =>
          <li className='flex items-center gap-4 pt-6 pb-4 hover:bg-color-grey-light-1 cursor-pointer transition-all ease-in duration-150'
            key={i.id}
            
          >


            <div className='pl-8 '>
              <img src={i.imgUrl} alt="" className='h-16 w-16 rounded-full ' />
            </div>

            <div >
              <h3 className='text-color-primary text-md uppercase font-semibold'>{i.title}</h3>
              <p className='text-sm text-color-grey-light-3
            '>{i.source}</p>
            </div>
          </li>
        )
      }

    </>
  );
};

export default Item;