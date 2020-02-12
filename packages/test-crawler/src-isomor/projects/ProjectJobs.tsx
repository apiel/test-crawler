import React from 'react';
import Typography from 'antd/lib/typography';
import { Job } from '../server/typing';
import Progress from 'antd/lib/progress';
import List from 'antd/lib/list';
import { timestampToString } from '../utils';

interface Props {
    jobs: Job[];
    loadJobs: () => Promise<void>;
}

export const ProjectJobs = ({ jobs, loadJobs }: Props) => {
    React.useEffect(() => {
        let timer: NodeJS.Timeout;
        if (jobs?.length) {
            timer = setInterval(loadJobs, 30000); // 30 sec
        } // else we could see if we can refresh project
        return () => clearInterval(timer);
    }, [jobs]);
    return jobs?.length ? (
        <List
            itemLayout="horizontal"
            bordered
            dataSource={jobs}
            style={{ marginBottom: 10 }}
            renderItem={({ status, startAt, stepsCount, stepsDone, currentStep, url }) => (
                <List.Item
                    actions={[
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            Open
                        </a>,
                    ]}
                >
                    <List.Item.Meta
                        title={<span>CI job {timestampToString(startAt.toString())}</span>}
                        description={<>
                            {!!stepsCount && stepsDone !== undefined && <Progress
                                percent={100 / stepsCount * stepsDone}
                                size="small"
                                format={() => `${stepsDone} of ${stepsCount}`}
                            />}
                            <span><Typography.Text code>{status}</Typography.Text> {currentStep}</span>
                        </>}
                    />
                </List.Item>
            )}
        />
    ) : null;
}
