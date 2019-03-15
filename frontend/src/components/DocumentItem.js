import React from 'react';

export const DocumentItem = ({document}) =>
  <div className="row margin-t-50">
    {
      document && document.map((item) => {
        return (
          <div className="col-lg-3 margin-t-20">
            <div className="documents-box text-center hover-effect">
              <i className="pe-7s-file text-custom"></i>
              <h4 className="padding-t-15 portal-heading">
                <a href={item.document}>{item.name}</a>
              </h4>
            </div>
          </div>
        )
      })
    }
  </div>;
