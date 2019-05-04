import { useState, useEffect } from 'react';
import { parse } from 'query-string';
import { Preset as PresetType, CrawlerInput } from 'test-crawler-lib';

import { getDefaultViewport } from './viewport';

export const usePreset = (search: string) => {
    const initialPreset: PresetType = {
        name: '',
        id: '',
        crawlerInput: {
            method: 'spiderbot', // CrawlerMethod.SPIDER_BOT,
            url: 'http://localhost:3003/',
            viewport: getDefaultViewport(),
            autopin: true,
        }
    };
    const [preset, setPreset] = useState<PresetType>(initialPreset);

    useEffect(() => {
        if (search) {
            const { viewport, ...crawlerInputRaw } = parse(search) as any;
            const crawlerInput: CrawlerInput = { ...crawlerInputRaw, viewport: JSON.parse(viewport) }
            setPreset({ ...initialPreset, crawlerInput });
        }
    }, [search]);

    return { preset, setPreset };
}