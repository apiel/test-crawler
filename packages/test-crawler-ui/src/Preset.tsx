import React, { useState, useEffect } from 'react';
import Dropdown from 'antd/lib/dropdown';
import Button from 'antd/lib/button';
import Menu from 'antd/lib/menu';
import { Preset as PresetType } from 'test-crawler-lib';
import { loadPresets } from './server/crawler';

const menu = (presets: PresetType[], setPreset: React.Dispatch<React.SetStateAction<PresetType>>) => (
    <Menu>
        { presets && presets.map((preset) => (
            <Menu.Item
                key={`preset-${preset.id}`}
                onClick={() => { setPreset(preset); }}
            >
                {preset.name}
            </Menu.Item>
        ))}
    </Menu>
);

export const Preset = ({ setPreset, setDefault }: any) => {
    const [presets, setPresets] = useState<PresetType[]>([]);
    const load = async () => {
        const list = await loadPresets();
        setPresets(list);
        if (setDefault) {
            const defaultIndex = list.findIndex(({ name }: PresetType) => name === 'Default');
            if (defaultIndex !== -1) {
                setPreset({ ...list[defaultIndex], name: '' });
            }
        }
    }
    useEffect(() => { load(); }, []);
    return (
        <Dropdown overlay={menu(presets, setPreset)} trigger={['click']}>
            <Button icon="folder-open">
                Load saved preset
            </Button>
        </Dropdown>
    );
}
