import React from 'react';

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

class Clock extends React.Component {

    clockify() {
        let minutes = Math.floor(this.props.timer / 60);
        let seconds = this.props.timer - minutes * 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return minutes + ':' + seconds;
    }

    render() {
        return (
            <Container>
                <Typography align={"center"} variant={"h2"}>
                    {this.props.timerType}
                </Typography>
                <Typography align={"center"} variant={"h1"} color={this.props.color}>
                    {this.clockify()}
                </Typography>
            </Container>
        )
    }
}

export default Clock;
