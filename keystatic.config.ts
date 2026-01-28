import { config, fields, collection } from '@keystatic/core';

export default config({
    storage: {
        kind: 'local',
    },
    ui: {
        brand: { name: 'Dai Vai Admin' },
        navigation: {
            'Contenuti': ['events'],
        },
    },
    collections: {
        events: collection({
            label: 'Eventi',
            slugField: 'title',
            path: 'src/content/events/*',
            format: { data: 'yaml' },
            schema: {
                title: fields.slug({ name: { label: 'Titolo' } }),
                date: fields.text({ label: 'Data (es. 15 Gennaio 2025)' }),
                description: fields.text({ label: 'Descrizione' }),
            },
        }),
    },
});
