import React from 'react';

import classes from './Logo.module.css';

const logo = (props) => (
    <div className={[classes.Logo, props.small ? classes.Small : null].join(' ')}>
        <div></div>
        <h1>Remotely</h1>
    </div>
);

export default logo;