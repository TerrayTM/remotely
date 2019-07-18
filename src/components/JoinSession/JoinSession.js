import React from 'react';

import Loader from '../Loader/Loader';
import classes from './JoinSession.module.css';

const joinSession = (props) => (
    <div className={[classes.Backdrop, props.show ? classes.Show : classes.Hidden].join(' ')} onClick={props.close}>
        <div className={classes.Form}>
            <span className={classes.Close} onClick={props.close}>✕</span>
            <label>Session Identifier:</label>
            <input type="text" placeholder="XXXX-XXXX" maxLength="9" disabled={props.loading} value={props.session} onChange={props.onChangeSession} spellCheck={false}/>
            <label>Authentication Code:</label>
            <input type="text" placeholder="Code" maxLength="6" disabled={props.loading} value={props.passcode} onChange={props.onChangePasscode} spellCheck={false}/>
            {props.error ? <p className={classes.Error}>Invalid session ID or passcode.</p> : null}
            {props.loading ? <div className={classes.LoaderHolder}><Loader height="55.5"/></div> : <button onClick={props.submit}>Join Session</button>}
        </div>
    </div>
);

export default joinSession;