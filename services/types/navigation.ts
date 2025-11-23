import { RefObject } from 'react';
import { View } from 'react-native';

export type SectionRefs = {
    howItWorks: RefObject<View>;
    features: RefObject<View>;
    testimonials: RefObject<View>;
    faq: RefObject<View>;
};
