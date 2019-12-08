import React from 'react';
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";

class TimeLengthControl extends React.Component {

    render() {
        return (
            <Container>
                <Typography variant={"h4"}
                            align={"center"}
                            id={this.props.titleID}
                >
                    {this.props.title}
                </Typography>
                <Grid container justify={"center"} spacing={3}>
                    <Grid item xs={4} align="center">
                        <Fab id={this.props.minID}
                                value='-'
                                onClick={this.props.onClick}
                        >
                            <ArrowDownwardIcon/>
                        </Fab>
                    </Grid>
                    <Grid item xs={4} align="center">
                        <Typography align={"center"} variant={"h3"}
                                    id={this.props.lengthID}>{this.props.length}</Typography>
                    </Grid>
                    <Grid item xs={4} align="center">
                        <Fab id={this.props.addID}
                                value='+'
                                onClick={this.props.onClick}
                        >
                            <ArrowUpwardIcon/>
                        </Fab>
                    </Grid>
                </Grid>
            </Container>
        )
    }
}

export default TimeLengthControl;
