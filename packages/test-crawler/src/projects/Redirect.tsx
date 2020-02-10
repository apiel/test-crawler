import React from 'react';
import Modal from 'antd/lib/modal';

interface Props {
    url: undefined | string;
    setUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const Redirect = ({ url, setUrl }: Props) => {
    return (
        <Modal
            title="Redirect"
            visible={!!url}
            onCancel={() => setUrl(undefined)}
            footer={[
                <a
                    key="submit"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setTimeout(() => setUrl(undefined), 500)}
                >
                    Open
                </a>,
            ]}
        >
            <p>
                Test-crawler is running the crawlers on a remote container.
                To see the progress of the task open the URL: <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setTimeout(() => setUrl(undefined), 500)}
                >{url}</a>.
            </p>
            <p>Once the task finished, refresh the project to see the result.</p>
        </Modal>
    );
}
