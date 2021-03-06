import React, { Fragment } from 'react'

import {
    AppBar,
    Typography,
    Button,
    Toolbar,
    Grid
} from '@material-ui/core'

import Fab from '@material-ui/core/Fab';

//ICONS
import AddIcon from '@material-ui/icons/Add';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import '../styles/navbar.css'
import { connect, useDispatch } from 'react-redux'

import history from '../history'
import { logout } from '../actions'

const NavBar = (props) => {
    const dispatch = useDispatch()

    const _logOut = () => {
        dispatch(logout())
        history.push('/')
    }

    return (
        <AppBar position="sticky">
            <Toolbar>
                <Grid
                    container
                    spacing={3}
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                >
                    <Grid item xs={3}>
                        <Typography
                            variant="h4"
                            onClick={() => history.push('/')}
                            className='NavBar-Title'
                        >
                            Strike Back
                        </Typography>
                    </Grid>



                    {!props.isLogged
                        &&
                        <Fragment>
                            <Grid item xs={2}>


                                <Button
                                    href='/signup'
                                    color="inherit"
                                    startIcon={<AccountCircleIcon />}
                                >
                                    Sign Up
                                </Button>

                            </Grid>
                            <Grid item xs={2}>
                                <Button
                                    href='/login'
                                    color="inherit"
                                    startIcon={<AccountCircleIcon />}
                                >
                                    Login
                                </Button>
                            </Grid>
                        </Fragment>
                    }
                    {props.isLogged
                        &&
                        <>
                        <Grid item xs={props.isAdmin ? 2 : 3}>
                            <Button
                                onClick={_logOut}
                                color="inherit"
                                startIcon={<ExitToAppIcon/>}
                            >
                                Log Out
                            </Button>
                        </Grid>

                        <Grid item xs={props.isAdmin ? 2 : 3}>
                            <Button
                                onClick={() => history.push('/myactivities')}
                                color="inherit"
                                startIcon={<AccountCircleIcon />}
                            >
                                My Activities
                            </Button>
                        </Grid>
                        </>
                    }
                    {props.isAdmin
                        &&
                        <Grid item xs={2}>
                            <Button
                                onClick={() => history.push('/admin')}
                                color="inherit"
                                startIcon={<SupervisorAccountIcon />}
                            >
                                Administrator
                            </Button>
                        </Grid>
                    }
                    <Grid item xs={2}></Grid>
                    <Grid item xs={1}>
                        <Fab
                            color="secondary"
                            aria-label="add"
                            onClick={() => history.push('/addRemark')}
                        >
                            <AddIcon />
                        </Fab>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}



const mapStateToProps = (state) => ({
    isLogged: state.authenticationReducer.isLoggedIn,
    token: state.authenticationReducer.token,
    isAdmin: state.authenticationReducer.isAdmin
})

export default connect(mapStateToProps)(NavBar)