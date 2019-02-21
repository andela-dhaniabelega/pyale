import React from 'react';
import { Link } from 'react-router-dom';

class Rent extends React.Component {
  render() {
  	return (
            <section className="section pt-5" id="rent">
              <div className="container">
                <div className="row">
                    <div className="col-lg-8 offset-lg-2">
                        <h1 className="section-title text-center">Available For Rent</h1>
                        <div className="section-title-border margin-t-20"></div>
                        <p className="section-subtitle text-muted text-center font-secondary padding-t-30">
                            Explore our available rentals. Our rates are competitive and you can pay monthly, quarterly,
                            or annually. You also gain access to our dedicated tenant portal, which provides
                            an easy way to pay bills, access relevant documents, raise issues and much more.
                        </p>
                    </div>
                </div>

                <div className="row margin-t-30">
                    <div className="col-lg-4">
                        <div className="blog-box margin-t-30 hover-effect">
                            <img src="images/blog/img-1.jpg" className="img-fluid" alt="" />
                            <div>
                                <h5 className="mt-4 text-muted">Commercial Property</h5>
                                <h4 className="mt-3"><Link to="JavaScript:Void(0);" className="blog-title"> Sample Property </Link></h4>
                                <p className="text-muted">Lorem Ipsum Dolor Isect to go and have a lorem Ipsum dolor isect and some more..</p>
                                <div className="mt-3">
                                    <Link to="JavaScript:Void(0);" className="read-btn">Read More <i className="mdi mdi-arrow-right"></i></Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="blog-box margin-t-30 hover-effect">
                            <img src="images/blog/img-2.jpg" className="img-fluid" alt="" />
                            <div>
                                <h5 className="mt-4 text-muted">Commercial Property</h5>
                                <h4 className="mt-3"><Link to="JavaScript:Void(0);" className="blog-title">Sample Property</Link></h4>
                                <p className="text-muted">Lorem Ipsum Dolor isect to go and have some lorem upsum dolor isect and some more...</p>
                                <div className="mt-3">
                                    <Link to="JavaScript:Void(0);" className="read-btn">Read More <i className="mdi mdi-arrow-right"></i></Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="blog-box margin-t-30 hover-effect">
                            <img src="images/blog/img-3.jpg" className="img-fluid" alt="" />
                            <div>
                                <h5 className="mt-4 text-muted">Residential Property</h5>
                                <h4 className="mt-3"><Link to="JavaScript:Void(0);"className="blog-title">Sample Property</Link></h4>
                                <p className="text-muted">Lorem Ipsum dolor to go and have some fun and some additional lorem ipsum...</p>
                                <div className="mt-3">
                                    <Link to="JavaScript:Void(0);" className="read-btn">Read More <i className="mdi mdi-arrow-right"></i></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
  	);
  }
}
export default Rent;