import React from 'react';

import classes from './Feature.module.css';

const feature = (props) => (
    <div className={classes.Feature}>
        <div className={props.reverse ? classes.Reverse : null}>
            <img src={props.src} alt="Feature"/>
            <div>
                <h4>{props.title}</h4>
                <hr/>
                <p>{props.children}</p>
            </div>
        </div>
    </div>
);

export default feature;