import React, { useState, useEffect } from 'react';
import Dropdown from 'antd/lib/dropdown';
import Button from 'antd/lib/button';
import notification from 'antd/lib/notification';
import { Preset as PresetType } from 'test-crawler-lib';

import { loadPresets } from '../server/crawler';
import { menu } from './PresetMenu';

const load = async (
    setDefault: boolean,
    setPreset: React.Dispatch<React.SetStateAction<PresetType>>,
    setPresets: React.Dispatch<React.SetStateAction<PresetType[]>>,
) => {
    try {
        const list = await loadPresets();
        setPresets(list);
        if (setDefault) {
            const defaultIndex = list.findIndex(({ name }: PresetType) => name === 'Default');
            if (defaultIndex !== -1) {
                setPreset({ ...list[defaultIndex], name: '' });
            }
        }
    } catch (error) {
        notification['warning']({
            message: 'Something went wrong while loading presets.',
            description: error.toString(),
        });
    }
}

interface Props {
    setDefault: boolean,
    setPreset: React.Dispatch<React.SetStateAction<PresetType>>,
}
export const Preset = ({ setPreset, setDefault }: Props) => {
    const [presets, setPresets] = useState<PresetType[]>([]);

    useEffect(() => { load(setDefault, setPreset, setPresets); }, []);
    return (
        <Dropdown overlay={menu(presets, setPreset)} trigger={['click']}>
            <Button icon="folder-open">
                Load saved preset
            </Button>
        </Dropdown>
    );
}
