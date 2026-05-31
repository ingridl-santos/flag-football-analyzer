import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import GameFootageTemplate from '.';
import SegmentControls from '../../components/SegmentControls';
import SegmentPanel from '../../components/SegmentPanel';
import VideoPlayerSection from '../../components/VideoPlayerSection';

const defaultVideoPlayerSection = (
  <VideoPlayerSection
    videoType={null}
    videoUrl={null}
    videoFileName={null}
    youtubeVideoId={null}
    currentTime={0}
    duration={0}
    isPlaying={false}
    segments={[]}
    activeSegmentId={null}
    onFileSelect={action('onFileSelect')}
    onYouTubeUrl={action('onYouTubeUrl')}
    onTimeUpdate={action('onTimeUpdate')}
    onDurationChange={action('onDurationChange')}
    onPlayStateChange={action('onPlayStateChange')}
    onSeek={action('onSeek')}
    onSegmentClick={action('onSegmentClick')}
  />
);

const defaultSegmentControls = (
  <SegmentControls
    videoLoaded={false}
    pendingStart={null}
    pendingEnd={null}
    pendingPlayType=""
    pendingTags={[]}
    onSetStart={action('onSetStart')}
    onSetEnd={action('onSetEnd')}
    onSetPendingPlayType={action('onSetPendingPlayType')}
    onSetPendingTags={action('onSetPendingTags')}
    onCreateSegment={action('onCreateSegment')}
  />
);

const defaultSegmentPanel = (
  <SegmentPanel
    videoType={null}
    segments={[]}
    activeSegmentId={null}
    isExportingZip={false}
    exportZipProgress={0}
    onDelete={action('onDelete')}
    onSetPlayType={action('onSetPlayType')}
    onSetTags={action('onSetTags')}
    onSegmentClick={action('onSegmentClick')}
    onExportCsv={action('onExportCsv')}
    onExportJson={action('onExportJson')}
    onExportZip={action('onExportZip')}
  />
);

const meta: Meta<typeof GameFootageTemplate> = {
  title: 'Features / Game Footage / Templates / Game Footage Template',
  component: GameFootageTemplate,
  parameters: {
    layout: 'padded',
  },
  args: {
    VideoPlayerHoc: defaultVideoPlayerSection,
    SegmentControlsHoc: defaultSegmentControls,
    SegmentPanelHoc: defaultSegmentPanel,
    showSegmentCreatedToast: false,
    onCloseToast: action('onCloseToast'),
  },
};

export default meta;

type Story = StoryObj<typeof GameFootageTemplate>;

export const Default: Story = {};

export const WithVideo: Story = {
  args: {
    VideoPlayerHoc: (
      <VideoPlayerSection
        videoType="file"
        videoUrl="mock://game-footage.mp4"
        videoFileName="game-footage.mp4"
        youtubeVideoId={null}
        currentTime={42}
        duration={180}
        isPlaying={false}
        segments={[]}
        activeSegmentId={null}
        onFileSelect={action('onFileSelect')}
        onYouTubeUrl={action('onYouTubeUrl')}
        onTimeUpdate={action('onTimeUpdate')}
        onDurationChange={action('onDurationChange')}
        onPlayStateChange={action('onPlayStateChange')}
        onSeek={action('onSeek')}
        onSegmentClick={action('onSegmentClick')}
      />
    ),
    SegmentControlsHoc: (
      <SegmentControls
        videoLoaded
        pendingStart={null}
        pendingEnd={null}
        pendingPlayType=""
        pendingTags={[]}
        onSetStart={action('onSetStart')}
        onSetEnd={action('onSetEnd')}
        onSetPendingPlayType={action('onSetPendingPlayType')}
        onSetPendingTags={action('onSetPendingTags')}
        onCreateSegment={action('onCreateSegment')}
      />
    ),
    SegmentPanelHoc: (
      <SegmentPanel
        videoType="file"
        segments={[]}
        activeSegmentId={null}
        isExportingZip={false}
        exportZipProgress={0}
        onDelete={action('onDelete')}
        onSetPlayType={action('onSetPlayType')}
        onSetTags={action('onSetTags')}
        onSegmentClick={action('onSegmentClick')}
        onExportCsv={action('onExportCsv')}
        onExportJson={action('onExportJson')}
        onExportZip={action('onExportZip')}
      />
    ),
  },
};

const WITH_SEGMENTS = [
  { id: '1', start: 10, end: 25, duration: 15, playType: 'Pass', tags: ['offense', 'air'] },
  { id: '2', start: 42, end: 83, duration: 41, playType: 'Run', tags: ['offense', 'rush'] },
];

export const WithSegments: Story = {
  args: {
    VideoPlayerHoc: (
      <VideoPlayerSection
        videoType="file"
        videoUrl="mock://game-footage.mp4"
        videoFileName="game-footage.mp4"
        youtubeVideoId={null}
        currentTime={42}
        duration={180}
        isPlaying={false}
        segments={WITH_SEGMENTS}
        activeSegmentId={null}
        onFileSelect={action('onFileSelect')}
        onYouTubeUrl={action('onYouTubeUrl')}
        onTimeUpdate={action('onTimeUpdate')}
        onDurationChange={action('onDurationChange')}
        onPlayStateChange={action('onPlayStateChange')}
        onSeek={action('onSeek')}
        onSegmentClick={action('onSegmentClick')}
      />
    ),
    SegmentControlsHoc: (
      <SegmentControls
        videoLoaded
        pendingStart={null}
        pendingEnd={null}
        pendingPlayType=""
        pendingTags={[]}
        onSetStart={action('onSetStart')}
        onSetEnd={action('onSetEnd')}
        onSetPendingPlayType={action('onSetPendingPlayType')}
        onSetPendingTags={action('onSetPendingTags')}
        onCreateSegment={action('onCreateSegment')}
      />
    ),
    SegmentPanelHoc: (
      <SegmentPanel
        videoType="file"
        segments={WITH_SEGMENTS}
        activeSegmentId={null}
        isExportingZip={false}
        exportZipProgress={0}
        onDelete={action('onDelete')}
        onSetPlayType={action('onSetPlayType')}
        onSetTags={action('onSetTags')}
        onSegmentClick={action('onSegmentClick')}
        onExportCsv={action('onExportCsv')}
        onExportJson={action('onExportJson')}
        onExportZip={action('onExportZip')}
      />
    ),
  },
};

export const WithActiveSegment: Story = {
  args: {
    ...WithSegments.args,
    VideoPlayerHoc: (
      <VideoPlayerSection
        videoType="file"
        videoUrl="mock://game-footage.mp4"
        videoFileName="game-footage.mp4"
        youtubeVideoId={null}
        currentTime={55}
        duration={180}
        isPlaying={false}
        segments={WITH_SEGMENTS}
        activeSegmentId="2"
        onFileSelect={action('onFileSelect')}
        onYouTubeUrl={action('onYouTubeUrl')}
        onTimeUpdate={action('onTimeUpdate')}
        onDurationChange={action('onDurationChange')}
        onPlayStateChange={action('onPlayStateChange')}
        onSeek={action('onSeek')}
        onSegmentClick={action('onSegmentClick')}
      />
    ),
    SegmentPanelHoc: (
      <SegmentPanel
        videoType="file"
        segments={WITH_SEGMENTS}
        activeSegmentId="2"
        isExportingZip={false}
        exportZipProgress={0}
        onDelete={action('onDelete')}
        onSetPlayType={action('onSetPlayType')}
        onSetTags={action('onSetTags')}
        onSegmentClick={action('onSegmentClick')}
        onExportCsv={action('onExportCsv')}
        onExportJson={action('onExportJson')}
        onExportZip={action('onExportZip')}
      />
    ),
  },
};

export const SegmentCreatedToast: Story = {
  args: {
    ...WithSegments.args,
    showSegmentCreatedToast: true,
  },
};

export const Loading: Story = {
  parameters: {
    noTranslations: true,
  },
};
