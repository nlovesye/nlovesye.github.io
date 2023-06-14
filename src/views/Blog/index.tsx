import { MapApiLoaderHOC, Map, Marker, NavigationControl, InfoWindow } from 'react-bmapgl';

import styles from './index.module.less';

export default MapApiLoaderHOC({ ak: 'xbsoCabGU9I8fD1XUIomFvpob8t2fsGU' })(function Blog() {
  return (
    <div className={styles.blog}>
      <Map center={{ lng: 116.402544, lat: 39.928216 }} zoom="11">
        <Marker position={{ lng: 116.402544, lat: 39.928216 }} />
        <NavigationControl />
        <InfoWindow position={{ lng: 116.402544, lat: 39.928216 }} text="内容" title="标题" />
      </Map>
    </div>
  );
});
