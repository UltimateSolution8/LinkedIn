interface GTagEventParams {
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: any;
}

interface Window {
    gtag: (
        command: 'config' | 'event' | 'set' | 'js',
        targetId: string,
        config?: GTagEventParams | { user_id?: string; [key: string]: any }
    ) => void;
    dataLayer: any[];
}
