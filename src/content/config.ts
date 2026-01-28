import { defineCollection, z } from 'astro:content';

const events = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        date: z.string(),
        description: z.string(),
    }),
});

export const collections = {
    'events': events,
};
