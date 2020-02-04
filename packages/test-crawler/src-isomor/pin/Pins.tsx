import React from 'react';
import Spin from 'antd/lib/spin';
import Typography from 'antd/lib/typography';
import Masonry from 'react-masonry-component';

import {
    masonryStyle,
    masonryOptions,
} from '../pages/pageStyle';
import { PageData } from '../server/typing';
import { ErrorHandler } from '../common/ErrorHandler';
import { PinPage } from './PinPage';
import { Search } from '../search/Search';
import { setMasonry, onMasonryImg } from '../common/refreshMasonry';
import { RouteComponentProps } from 'react-router-dom';
import { usePins } from './usePins';
import { ProjectName } from '../projects/ProjectName';

const { Title } = Typography;

export const Pins = ({
    match: { params: { projectId } },
}: RouteComponentProps<{ projectId: string }>) => {
    const { pins: response, error } = usePins(projectId);
    if (error) {
        return <ErrorHandler description={error.toString()} />;
    }

    return (
        <>
            <Title level={3}>Pins</Title>
            <ProjectName projectId={projectId} />
            <Search response={response}>
                {(pins) => pins ? (
                    <Masonry
                        style={masonryStyle}
                        options={masonryOptions}
                        ref={(c: any) => { setMasonry(c && c.masonry); }}
                    >
                        {pins.map(({ id, url, png, viewport }: PageData) => (
                            <PinPage
                                projectId={projectId}
                                id={id}
                                key={id}
                                url={url}
                                png={png}
                                viewport={viewport}
                                onImg={onMasonryImg}
                            />
                        ))}
                    </Masonry>
                ) : <Spin />
                }
            </Search>
        </>
    );
}
