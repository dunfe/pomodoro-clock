import React from 'react';
import Clock from './components/Clock';
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TimeLengthControl from "./components/TimeLengthControl";
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import Fab from "@material-ui/core/Fab";


function StartButton(props) {
    return (
        <Fab>
            <PlayCircleFilledWhiteIcon onClick={props.start}/>
        </Fab>
    )
}

function ResetButton(props) {
    return (
        <Fab>
            <RotateLeftIcon onClick={props.reset}/>
        </Fab>
    )

}

(function () {
    window.accurateInterval = function (fn, time) {
        var cancel, nextAt, timeout, wrapper;
        nextAt = new Date().getTime() + time;
        timeout = null;
        wrapper = function () {
            nextAt += time;
            timeout = setTimeout(wrapper, nextAt - new Date().getTime());
            return fn();
        };
        cancel = function () {
            return clearTimeout(timeout);
        };
        timeout = setTimeout(wrapper, nextAt - new Date().getTime());
        return {
            cancel: cancel
        };

    };
}).call(this);


class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleStart = this.handleStart.bind(this);
        this.state = {
            timer: 1500,
            brkLength: 5,
            seshLength: 25,
            intervalID: '',
            timerState: 'stopped',
            timerType: 'Session',
            alarmColor: {color: 'primary'}
        };

        this.setBrkLength = this.setBrkLength.bind(this);
        this.setSeshLength = this.setSeshLength.bind(this);
        this.decrementTime = this.decrementTime.bind(this);
        this.switchTimer = this.switchTimer.bind(this);
        this.phaseControl = this.phaseControl.bind(this);
        this.beginCountDown = this.beginCountDown.bind(this);
        this.buzzer = this.buzzer.bind(this);
        this.warning = this.warning.bind(this);
        this.lengthControl = this.lengthControl.bind(this);
        this.reset = this.reset.bind(this);
        this.timerControl = this.timerControl.bind(this)
    }


    decrementTime() {
        this.setState({
            timer: this.state.timer - 1
        })
    }

    switchTimer(num, str) {
        this.setState({
            timer: num,
            timerType: str,
            alarmColor: {color: 'primary'}
        })
    }

    phaseControl() {
        let timer = this.state.timer;
        this.warning(timer);
        this.buzzer(timer);
        if (timer < 0) {
            if (this.state.timerType === 'Session') {
                this.state.intervalID && this.state.intervalID.cancel();
                this.beginCountDown();
                this.switchTimer(this.state.brkLength * 60, 'Break')
            } else {
                this.state.intervalID && this.state.intervalID.cancel();
                this.beginCountDown();
                this.switchTimer(this.state.seshLength * 60, 'Session')
            }
        }
    }

    warning(_timer) {
        _timer < 61 ?
            this.setState({alarmColor: {color: 'secondary'}}) :
            this.setState({alarmColor: {color: 'primary'}});
    }

    buzzer(_timer) {
        if (_timer === 0) {
            this.audioBeep.play()
        }
    }


    beginCountDown() {
        this.setState({
            // eslint-disable-next-line no-undef
            intervalID: accurateInterval(() => {
                this.decrementTime();
                this.phaseControl()
            }, 1000)
        })
    }

    reset() {
        this.setState({
            brkLength: 5,
            seshLength: 25,
            timerState: 'stopped',
            timerType: 'Session',
            timer: 1500,
            intervalID: '',
            alarmColor: {color: 'primary'}
        });
        this.state.intervalID && this.state.intervalID.cancel();
        this.audioBeep.pause();
        this.audioBeep.currentTime = 0;
    }

    timerControl() {
        if (this.state.timerState === 'stopped') {
            this.beginCountDown();
            this.setState({timerState: 'running'});
        } else {
            this.setState({timerState: 'stopped'});
            this.state.intervalID && this.state.intervalID.cancel();
        }
    }


    setBrkLength(e) {
        this.lengthControl('brkLength', e.currentTarget.value,
            this.state.brkLength, 'Session');
    }

    setSeshLength(e) {
        this.lengthControl('seshLength', e.currentTarget.value,
            this.state.seshLength, 'Break');
    }

    lengthControl(stateToChange, sign, currentLength, timerType) {
        if (this.state.timerState === 'running') return;
        if (this.state.timerType === timerType) {
            if (sign === "-" && currentLength !== 1) {
                this.setState({[stateToChange]: currentLength - 1});
            } else if (sign === "+" && currentLength !== 60) {
                this.setState({[stateToChange]: currentLength + 1});
            }
        } else {
            if (sign === "-" && currentLength !== 1) {
                this.setState({
                    [stateToChange]: currentLength - 1,
                    timer: currentLength * 60 - 60
                });
            } else if (sign === "+" && currentLength !== 60) {
                this.setState({
                    [stateToChange]: currentLength + 1,
                    timer: currentLength * 60 + 60
                });
            }
        }
    }

    handleStart() {
        if (this.state.start) {
            this.setState({
                start: false
            })
        } else {
            this.setState({
                start: true
            })
        }
    }

    render() {
        return (
            <Container>
                <Typography mt="50px" align={"center"} variant={"h1"}>Pacorro Clock</Typography>
                <Grid container justify={"center"}>
                    <Grid item xs={6}>
                        <TimeLengthControl
                            titleID={'break-label'}
                            minID={'break-decrement'}
                            addID={'break-increment'}
                            lengthID={'break-length'}
                            title={'Break Length'}
                            onClick={this.setBrkLength}
                            length={this.state.brkLength}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TimeLengthControl
                            titleID={'session-label'}
                            minID={'session-decrement'}
                            addID={'session-increment'}
                            lengthID={'session-length'}
                            title={'Session Length'}
                            onClick={this.setSeshLength}
                            length={this.state.seshLength}
                        />
                    </Grid>
                </Grid>
                <audio id="beep" preload="auto"
                       src="https://goo.gl/65cBl1"
                       ref={(audio) => {
                           this.audioBeep = audio;
                       }}/>
                <Clock timer={this.state.timer}
                       timerType={this.state.timerType}
                       color={this.state.alarmColor.color}

                />
                <Grid container>
                    <Grid item xs={12} align="center">
                        <StartButton start={this.timerControl}/>
                        <ResetButton reset={this.reset}/>
                    </Grid>
                </Grid>
            </Container>
        )
    }
}

export default App;
