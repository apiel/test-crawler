import React from 'react';
import Menu from 'antd/lib/menu';
import { Preset as PresetType } from 'test-crawler-lib';

export const menu = (
    presets: PresetType[],
    setPreset: React.Dispatch<React.SetStateAction<PresetType>>,
) => (
        <Menu>
            {presets && presets.map((preset) => (
                <Menu.Item
                    key={`preset-${preset.id}`}
                    onClick={() => { setPreset(preset); }}
                >
                    {preset.name}
                </Menu.Item>
            ))}
        </Menu>
    );
