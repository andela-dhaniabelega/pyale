import React from 'react';

export const Alert = ({message}) => {
  return (
      <div className="col-lg-12 margin-t-20">
        <h4 className="text-center">{message}</h4>
      </div>
  );
};
