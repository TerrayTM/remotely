import React, { Component, createRef, Fragment } from 'react';
import { connect } from 'react-redux';

import classes from './Controller.module.css';
import * as actions from '../../store/actions/actions';

class Controller extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: null,
            height: null
        };
        this.controller = createRef();
        this.beforeStyle = null;
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onReize);
    }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id && this.props.id) {
            this.onResize();
            this.controller.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
    }

    computeCoordinates = (rectangle, clientX, clientY) => {
        let x = clientX - rectangle.left;
        let y = clientY - rectangle.top;

        if (this.props.size) {
            x = x / (this.state.width || 1) * this.props.size.width;
            y = y / (this.state.height || 1) * this.props.size.height;
        }

        x = Math.floor(x);
        y = Math.floor(y);

        return `${x}|${y}`;
    }

    onMouseDown = ({ clientX, clientY, target, nativeEvent }) => {
        if (nativeEvent.which === 3) {
            actions.sendRightMouseDown(this.computeCoordinates(target.getBoundingClientRect(), clientX, clientY));
        } else {
            actions.sendLeftMouseDown(this.computeCoordinates(target.getBoundingClientRect(), clientX, clientY));
        }
    }

    onMouseUp = ({ clientX, clientY, target, nativeEvent }) => {
        if (nativeEvent.which === 3) {
            actions.sendRightMouseUp(this.computeCoordinates(target.getBoundingClientRect(), clientX, clientY));
        } else {
            actions.sendLeftMouseUp(this.computeCoordinates(target.getBoundingClientRect(), clientX, clientY));
        }
    }

    onResize = () => {
        const width = window.innerWidth * 0.75;

        this.setState({
            width,
            height: width / (this.props.ratio || 1)
        });
    }

    onKeyUp = ({ key }) => {
        if (key === 'Backspace' || key === 'Enter') {
            key = `{${key.toUpperCase()}}`;
        }

        actions.sendKeyBoardKeys(key);
    }

    onKeyDown = (event) => {
        event.persist();
        event.preventDefault();
    }

    onContextMenu(event) {
        event.preventDefault();
    }

    render() {
        let style = null;
        let outerStyle = null;

        if (this.props.id) {
            style = {
                width: `${this.state.width}px`,
                height: `${this.state.height}px`
            };

            outerStyle = {
                height: `${this.state.height + 105}px`
            };

            this.beforeStyle = style;
        }

        return (
            <Fragment>
                <div ref={this.controller}></div>
                <section className={classes.Main} style={outerStyle}>
                    <div
                        className={classes.Video}
                        style={style || this.beforeStyle}
                        tabIndex="0"
                        onKeyUp={this.onKeyUp}
                        onKeyDown={this.onKeyDown}
                        onContextMenu={this.onContextMenu}
                    >
                        <div
                            onMouseDown={this.onMouseDown}
                            onMouseUp={this.onMouseUp}
                            style={{ backgroundImage: `url(data:image/jpeg;base64,${this.props.screenShot})` }}
                        />
                    </div>
                </section>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        screenShot: state.screenShot,
        ratio: state.ratio,
        id: state.id,
        size: state.size
    };
};

export default connect(mapStateToProps)(Controller);