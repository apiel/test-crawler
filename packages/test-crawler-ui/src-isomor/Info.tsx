import React from 'react';

const infoStyle = {
    lineHeight: 1.2,
    borderLeft: '8px solid #EEE',
    paddingLeft: 15,
    color: '#666',
    textAlign: 'justify' as 'justify',
}

export const Info = ({ children }: any) => (
    <div style={infoStyle}>
        { children }
    </div>
);
