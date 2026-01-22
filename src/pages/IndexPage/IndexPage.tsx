import { Section, List, Button, Placeholder } from '@telegram-apps/telegram-ui';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '@/components/Page';

import './IndexPage.css';
const appLogo = `${import.meta.env.BASE_URL}logo.png`;

export const IndexPage: FC = () => {
  const navigate = useNavigate();

  return (
    <Page back={false}>
      <div className="index-page">
        <Placeholder
          className="index-page__header"
          header="Dr. Plant 🌿"
          description="Ваш персональный помощник в мире комнатных растений"
        >
          <img src={appLogo} alt="Dr. Plant Logo" className="index-page__image" />
        </Placeholder>

        <div className="index-page__footer">
          <List>
            <Section header="Меню">
              <div className="index-page__buttons">
                <Button 
                  size="l" 
                  stretched 
                  onClick={() => navigate('/plant-doctor')}
                >
                  Узнать чем болеет растение
                </Button>
                <Button 
                  size="l" 
                  stretched 
                  mode="gray"
                  onClick={() => window.open('https://www.ozon.ru', '_blank')}
                >
                  Наш магазин на Ozon
                </Button>
              </div>
            </Section>
          </List>
        </div>
      </div>
    </Page>
  );
};
