import React from 'react';
import Card from 'antd/lib/card';
import Icon from 'antd/lib/icon';
import Masonry from 'react-masonry-component';

const cardStyle = {
    width: 320,
    marginBottom: 10,
};

const coverStyle = {
    textAlign: 'center',
    // borderBottom: '1px solid #888',
}

const imgStyle = {
    // width: 300,
}

const masonryStyle = {
    paddingTop: 10,
    paddingBottom: 10,
}

const masonryOptions = {
    gutter: 10,
    // percentPosition: true,
    fitWidth: true,
}

const iconTheme = ''; // twoTone

export const PinsMap = ({ pins }) => (
    <Masonry style={masonryStyle} options={masonryOptions}>
        {pins.map(({ id, url, png }) => (
            <Card
                key={id}
                hoverable
                style={cardStyle}
                cover={png && (
                    <div style={coverStyle}>
                        <img style={imgStyle} alt="" src={`/crawler/thumbnail/base/${id}`} />
                    </div>
                )}
            >
                <p><Icon type="link" /> <a href={url}>{url}</a></p>
                {!png && <p><Icon type="picture" theme={iconTheme} /> No screenshot available</p>}
            </Card>
        ))}
    </Masonry>
);
