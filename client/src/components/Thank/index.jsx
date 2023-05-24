import React from 'react';
import Card from 'react-bootstrap/Card';
import './styles.css';

function Confirmation() {
  return (
   
    <div className="containerr">
      <div>
        <Card className="texttank">
          <Card.Body>
            <Card.Title className='text-success'>Action successfully completed!</Card.Title>
          </Card.Body>
        </Card>
        <div className="balloons">
        <div className="balloon1"></div>
      <div className="balloon2"></div>
      <div className="balloon3"></div>
      <div className="balloon4"></div>
      <div className="balloon5"></div>
      <div className="balloon6"></div>
      </div>
    </div>
    </div>
  );
}

export default Confirmation;
