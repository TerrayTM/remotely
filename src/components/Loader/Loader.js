import React from 'react';

import classes from './Loader.module.css';

const loader = (props) => (
    <div className={classes.Loader} style={{ width: props.width ? `${props.width}px` : null, height: props.height ? `${props.height}px` : null }}>
        <div></div><div></div><div></div><div></div>
    </div>
);

export default loader;