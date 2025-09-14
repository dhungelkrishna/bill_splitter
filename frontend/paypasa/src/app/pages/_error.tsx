// pages/_error.tsx
import { NextPage, NextPageContext } from 'next';
import React from 'react';

// page will receive 400 / 500 like statuscode as a props. 
interface ErrorProps {
  statusCode: number | null;
}

// next js Error Componennt
const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <div>
      <h1>
        {statusCode
          ? `An error ${statusCode} occurred on the server`
          : 'An error occurred on the client'}
      </h1>
      <p>
        Sorry about that. We're working on fixing it.
      </p>
    </div>
  );
};