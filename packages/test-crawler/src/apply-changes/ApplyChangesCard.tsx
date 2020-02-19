import React from 'react';
import Card from 'antd/lib/card';
import Button from 'antd/lib/button';
import Icon from 'antd/lib/icon';
import { StorageType } from '../server/storage.typing';
import { timestampToString } from '../utils';
import { getColorByStatus } from '../diff/DiffZone';
import { ChangeStatus } from '../server/typing';
import { applyChangesStyle } from './styles';
import { ApplyChangesProjectName } from './ApplyChangesProjectName';

export const ApplyChangesCard = ({
    storageType,
    projectId,
    timestamp,
    setOpen,
    values,
    apply,
    cancel,
}: {
    storageType: StorageType,
    projectId: string,
    timestamp: string,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    values: {
        valid: number,
        report: number,
        pin: number,
    },
    apply: (storageType: StorageType) => () => Promise<void>,
    cancel: () => void,
}) => (
        <Card
            style={{ ...applyChangesStyle, animation: '0.1s ease-out 0s 1 slideInFromLeft', }}
            size="small"
        >
            <Icon
                style={{
                    ...applyChangesStyle,
                    right: applyChangesStyle.right + 3,
                    top: applyChangesStyle.top + 3,
                    backgroundColor: '#fff',
                    color: '#999',
                    boxShadow: '0 0 0 1px #d9d9d9 inset',
                    borderRadius: 3,
                }}
                onClick={() => setOpen(false)}
                type="shrink"
            />
            <ApplyChangesProjectName projectId={projectId} storageType={storageType} />
            <p style={{ color: '#999', marginTop: 0 }}>{timestampToString(timestamp)}</p>
            <p>
                {
                    Object.keys(values).map((key, index) => (<span key={`change-${key}`}>
                        <span style={{
                            ...(index > 0 && { marginLeft: 10 }),
                            color: getColorByStatus(key as ChangeStatus)
                        }}>■</span> <b>{(values as any)[key]}</b> {key}
                    </span>))
                }
            </p>
            <div style={{ textAlign: 'center' }}>
                <Button icon="undo" size="small" onClick={cancel}>Cancel</Button>
                &nbsp;
                <Button size="small" icon="check" onClick={apply(storageType)}>Apply</Button>
            </div>

        </Card>
    );
