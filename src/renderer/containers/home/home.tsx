import * as React from 'react';

import { HomeSink } from './home-sink';
import { useSink } from 'redux-sink';

import * as styles from './home.scss';

export const Home: React.FunctionComponent = () => {
  const sink = useSink(HomeSink);
  return (
    <div className={styles.container}>
      <iframe className={styles.frame} src={'http://pc-play.games.dmm.co.jp/play/unitiax/'} />
    </div>
  );
};
