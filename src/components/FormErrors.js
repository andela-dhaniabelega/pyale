import React from 'react';

export const FormErrors = ({formErrors}) =>
  <div className='formErrors'>
    {Object.keys(formErrors).map((fieldName, i) => {
      if(formErrors[fieldName].length > 0){
        const style = {color: 'red'};
        return (
          <p key={i} style={style}>{formErrors[fieldName]}</p>
        )
      } else {
        return '';
      }
    })}
  </div>;
