import React from 'react';
import Button from 'antd/lib/button';
import Badge from 'antd/lib/badge';
import { Prompt } from 'react-router-dom';
import { ChangeStatus, ChangeType } from '../server/typing';
import { useApplyChanges } from './useApplyChanges';
import { applyChangesStyle } from './styles';
import { ApplyChangesCard } from './ApplyChangesCard';

export const ApplyChangesInfo = () => {
    const { changes, apply, cancel } = useApplyChanges();
    const [open, setOpen] = React.useState(true);
    if (!Object.values(changes).length) {
        // window.onbeforeunload = () => false;
        return null;
    }
    // window.onbeforeunload = () => true;

    const changesValues = Object.values(changes);
    const { storageType, item: { props: { projectId, timestamp } } } = changesValues[0];
    const values = {
        valid: 0,
        report: 0,
        pin: 0,
    }
    changesValues.forEach(({ item }) => {
        if (item.type === ChangeType.setZoneStatus) {
            let { status } = item.props;
            if (status === ChangeStatus.zonePin) status = ChangeStatus.valid;
            (values as any)[status]++;
        } else if (item.type === ChangeType.pin) {
            values.pin++;
        }
    });
    return <>
        <Prompt
            message='You have unsaved changes, are you sure you want to leave?'
        />
        {
            !open ? (
                <Button
                    style={applyChangesStyle}
                    type="primary"
                    size="small"
                    onClick={() => setOpen(true)}
                >
                    <Badge count={changesValues.length} style={applyChangesStyle}>View pending changes</Badge>
                </Button>
            ) : (
                    <ApplyChangesCard
                        setOpen={setOpen}
                        storageType={storageType}
                        projectId={projectId}
                        timestamp={timestamp}
                        values={values}
                        apply={apply}
                        cancel={cancel}
                    />
                )
            }
    </>
}
