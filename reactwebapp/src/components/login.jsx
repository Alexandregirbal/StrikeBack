import 
    React,
    { useState } 
from 'react';

import history from '../history'

import {
    Grid,
    Card,
    Button,
    TextField,
    Typography,

} from '@material-ui/core';

import { login as loginDAO } from '../DAOs/usersDAO';

import { useDispatch } from 'react-redux'
import { login } from '../actions'

const Login = () => {
    const [pseudo, setPseudo] = useState('')
    const [password, setPassword] = useState('')

    const _handleSubmit = () => {
        loginDAO(pseudo, password, false)
            .then((res) => {
                if (res.status === 200) {
                    res.json().then(resJson => {
                        dispatch(login(resJson.authToken, resJson.heards, resJson.ups, resJson.downs, resJson.reports, resJson.admin))
                        localStorage.setItem('pseudo',resJson.pseudo)
                        localStorage.setItem('pwd',resJson.password)
                        history.push('/')
                    })

                } else {
                    res.json().then(resJson => {
                        alert(resJson)
                    })
                }
            })
    }

    const dispatch = useDispatch()

    return (
        <Card style={{ margin: 20, padding: 20 }}>
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        required id="pseudo"
                        label="Pseudo"
                        onChange={(e) => {
                            setPseudo(e.target.value)
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        required
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        id="password"
                        type="password"
                        label="Password"
                        helperText="6 characters minimum"
                    />
                </Grid>
                <Grid item xs={12}>

                    <Button
                        onClick={(event) => _handleSubmit(event)}
                        variant="contained"
                        color="secondary"
                        component="span"
                    >
                        Login
                        </Button>

                </Grid>

            </Grid>
        </Card>
    )
}

/*const mapStateToProps = (state) => ({
	isLogged: state.authenticationReducer.token
})

export default connect(mapStateToProps)(Login)*/
export default Login