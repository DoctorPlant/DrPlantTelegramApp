import { Section, Cell, List } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';

import { Link } from '@/components/Link/Link';
import { Page } from '@/components/Page';

export const IndexPage: FC = () => {
  return (
      <Page back={false}>
        <List>
          <Section header="Dr. Plant 🌿" footer="Быстрая диагностика и рекомендации">
            <Link to="/plant-doctor">
              <Cell subtitle="Что с растением и чем подкормить">
                🌱 Диагностика растения
              </Cell>
            </Link>
          </Section>
        </List>
      </Page>
  );
};
