import React, { Component } from 'react';
import { connect } from 'react-redux';

import JoinSession from './components/JoinSession/JoinSession';
import Controller from './components/Controller/Controller';
import * as actions from './store/actions/actions';
import Feature from './components/Feature/Feature';
import Logo from './components/Logo/Logo';
import One from './assets/img/1.png';
import Two from './assets/img/2.png';
import Three from './assets/img/3.png';
import classes from './App.module.css';

class App extends Component {
    state = {
        showJoinSession: false,
        session: '',
        passcode: ''
    }

    componentDidMount() {
        if (!this.props.connected && !this.props.error) {
            this.props.connectToServer();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.id !== this.props.id && this.props.id) {
            this.setState({ showJoinSession: false });
        }
    }

    onButtonClick = () => {
        if (this.props.id) {
            this.props.deleteFiles();
            this.props.closeConnection();
        } else {
            this.setState({
                showJoinSession: true,
                session: '',
                passcode: ''
            });
        }
    }

    onExitJoinSession = ({ target, currentTarget }) => {
        if (target !== currentTarget || this.props.loading) {
            return;
        }

        this.setState({ showJoinSession: false });
        setTimeout(() => {
            this.props.resetJoinError();
        }, 300);
    }

    onChangeSession = ({ target }) => {
        let value = target.value.split('-').join('');

        value = value.substring(0, Math.min(8, value.length));

        this.setState({
            session: value.length > 4 ? `${value.substring(0, 4)}-${value.substring(4)}` : value
        });
    }

    onChangePasscode = ({ target }) => {
        this.setState({ passcode: target.value });
    }

    onSubmitSession = () => {
        this.props.joinSession(this.state.session, this.state.passcode);
    }

    onDownload = () => {
        const tag = document.createElement('a');
        
        tag.setAttribute('download', 'Remotely.zip');
        tag.setAttribute('href', 'https://terrytm.com/files/Remotely.zip');
        tag.setAttribute('style', 'display: none;');
        
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    }

    render() {
        let error = null;

        if (!this.props.connected) {
            error = 'Loading...';
        }

        if (this.props.error) {
            error = 'Server Offline';
        } 

        return (
            <main>
                <JoinSession
                    show={this.state.showJoinSession}
                    close={this.onExitJoinSession}
                    session={this.state.session}
                    onChangeSession={this.onChangeSession}
                    passcode={this.state.passcode}
                    onChangePasscode={this.onChangePasscode}
                    submit={this.onSubmitSession}
                    loading={this.props.loading}
                    error={this.props.joinError}
                />
                <header className={classes.Header}>
                    <Logo small/>
                    <div>
                        <a href="https://terrytm.com/donate" rel="noopener noreferrer" target="_blank">Donate</a>
                        <a href="https://terrytm.com/contact" rel="noopener noreferrer" target="_blank">Contact</a>
                    </div>
                </header>
                <section className={classes.Hero}>
                    <Logo/>
                    <h2>Simple and secure <br className={classes.Break}/>remote desktop control.</h2>
                    <div className={classes.ButtonHolder}>
                        <button onClick={this.onDownload} className={classes.Download}>Download</button>
                        <button onClick={this.onButtonClick} disabled={error}>{error || (this.props.id ? 'Close Session' : 'Join Session')}</button>
                    </div>
                </section>
                <Controller/>
                {
                    this.props.files && this.props.files.length > 0 &&
                    <section className={classes.FileHolder}>
                        {this.props.files.map(i =>
                            <a 
                                key={i.path}
                                download={i.name} 
                                href={i.path}
                                className={classes.File}
                            >
                                {i.name.length > 14 ? `${i.name.substr(0, 14)}...` : i.name}
                            </a>
                        )}
                    </section>
                }
                <section className={classes.Description}>
                    <Feature src={One} title="Step 1: Download and Run App">
                        Download the compressed package. Extract the inner folder and start the Remotely
                        executable file. You can create a shortcut to the application for future access.
                    </Feature>
                    <Feature src={Two} title="Step 2: Start Client Session" reverse>
                        Click on start session to connect to server. If status shows "Server Error", 
                        it means the server is currently offline. Please try again in a few minutes.
                    </Feature>
                    <Feature src={Three} title="Step 3: Access Remote Desktop">
                        Go to this website from another computer. Click on join session and enter the
                        tokens provided by the app. Use the realtime video popup to control your PC remotely.
                    </Feature>
                </section>
                <section className={classes.Info}>
                    <div>
                        <h2>Useful Info</h2>
                        <hr/>
                        <p>
                            Remotely supports file transfers from remote PC. Simply drag and drop files 
                            into the upload region.
                            <br/><br/>
                            It is not recommended to remote control the current computer as this will cause
                            undesired effects.
                            <br/><br/>
                            Remotely uses the secret token for client side authentication, so please do
                            not share your token.
                            <br/><br/>
                            The desktop app will disconnect from the server if more than 5 consecutive
                            login attempts are made.
                        </p>
                    </div>
                </section>
                <section className={classes.Footer}>
                    <p>Made By Terry Zheng</p>
                    <p>Copyright © <a href="https://terrytm.com">TerryTM</a></p>
                </section>
            </main>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        connectToServer: () => dispatch(actions.connectToServer()),
        joinSession: (id, token) => dispatch(actions.joinSession(id, token)),
        closeConnection: () => dispatch(actions.closeConnection()),
        resetJoinError: () => dispatch(actions.resetJoinError()),
        deleteFiles: () => dispatch(actions.deleteFiles())
    };
};

const mapStateToProps = (state) => {
    return {
        connected: state.connected,
        error: state.error,
        loading: state.loading,
        id: state.id,
        joinError: state.joinError,
        files: state.files
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
