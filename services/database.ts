import { VaultItem } from '../types';

export interface ProductSpec {
    id: string;
    name: string;
    description: string;
    specs: Record<string, string>;
}

export interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    type: 'LAUNCH' | 'MEETING' | 'DEADLINE';
}

// --- PRODUCT CATALOG ---
export const PRODUCTS: ProductSpec[] = [
    {
        id: 'p1',
        name: 'Vegan Leather Zyn Case',
        description: 'Premium faux leather case for nicotine pouches. Magnetic closure.',
        specs: {
            'Material': 'PU Leather',
            'Dimensions': '70mm x 70mm x 25mm',
            'Colors': 'Midnight Black, Saddle Brown',
            'MOQ': '500 units',
            'Target Cost': '$2.50'
        }
    },
    {
        id: 'p2',
        name: 'Crutcheze Padding Set',
        description: 'Ergonomic foam padding for underarm crutches. Moisture wicking.',
        specs: {
            'Material': 'High-density Memory Foam',
            'Fabric': 'Antimicrobial Mesh',
            'SKUs': 'Standard, Tall, Youth',
            'Target Cost': '$4.20'
        }
    }
];

// --- SAVED IDEAS (VAULT) ---
export const SAVED_IDEAS: VaultItem[] = [
    {
        id: 'demo-tiktok-1',
        timestamp: new Date().toLocaleDateString(),
        type: 'DISCOVERY',
        title: 'The Chaos Packing Skit',
        data: {
            title: 'The Chaos Packing Skit',
            description: "Platform: TikTok\n\nHeadline: The Chaos Packing Skit\n\nScript: 'POV: You trying to pack your Zyn without the leather case. Cut to: The Hotz Case looking sleek.'",
            score: 9,
            type: 'TikTok / Visual Demo',
            tikTokScore: 'High',
            manufacturingStrategy: 'Private Label',
            strategyReason: 'Relatable pain point (messy packing) vs. Instant Solution (Sleek Case). High retention hook.'
        },
        notes: 'Viral Skit'
    },
    {
        id: 'demo-ig-1',
        timestamp: new Date().toLocaleDateString(),
        type: 'DISCOVERY',
        title: 'Texture ASMR',
        data: {
            title: 'Texture ASMR',
            description: "Platform: Instagram\n\nHeadline: Texture ASMR\n\nCaption: 'Sound on. The snap of the Hotz case is the new bubble wrap. #satisfying'",
            score: 8,
            type: 'Aesthetic/Visual',
            tikTokScore: 'Medium',
            manufacturingStrategy: 'Tweaked Design',
            strategyReason: 'Sensory marketing. Emphasizing the "snap" suggests high-quality build and fidget factor.'
        },
        notes: 'Aesthetic Post'
    }
];

// --- CALENDAR EVENTS ---
export const CALENDAR_EVENTS: CalendarEvent[] = [
    { id: 'e1', title: 'Q4 Inventory Order', date: '2024-10-15', type: 'DEADLINE' },
    { id: 'e2', title: 'TikTok Ad Shoot', date: '2024-10-20', type: 'MEETING' },
    { id: 'e3', title: 'Black Friday Launch', date: '2024-11-24', type: 'LAUNCH' }
];
