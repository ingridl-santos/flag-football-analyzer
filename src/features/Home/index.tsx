import VideoFileIcon from '@mui/icons-material/VideoFile';
import { useTranslation } from 'react-i18next';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import HomeTemplate from './templates/HomeTemplate';

const FEATURES = [
  {
    key: 'gameFootage',
    href: '/game-footage',
    icon: <VideoFileIcon fontSize="inherit" />,
  },
];

const HomePage = () => {
  const { t } = useTranslation('pageTitles');

  useDocumentTitle(t('home'));

  return <HomeTemplate features={FEATURES} />;
};

export default HomePage;
