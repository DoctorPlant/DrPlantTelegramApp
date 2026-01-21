import type { ComponentType } from 'react';

import { IndexPage } from '@/pages/IndexPage/IndexPage';
import { PlantDoctorPage } from '@/pages/PlantDoctorPage';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
}

export const routes: Route[] = [
  { path: '/', Component: IndexPage },
  { path: '/plant-doctor', Component: PlantDoctorPage, title: 'Доктор Растение' },
];
