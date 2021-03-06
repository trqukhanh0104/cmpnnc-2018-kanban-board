import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendRequest } from '../services/Http.services'
import { AuthenticateService } from '../services/AuthenticateService'
import '../assets/css/login.css';

import swal from 'sweetalert2'


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            formErrors: { email: '', password: '' },
            errLogin: false,
            msg: '',
            sending: false
        }
    }
    componentDidMount() {
        // console.log(this);
        // this.props.dispatch({
        //     type: 'UPDATE_USER',
        //     isAuth: true,
        //     username: 'congluc19297@gmail.com',
        // })
    }
    onChangeEmail = (e) => {
        this.setState({ email: e.target.value })
        this.validateField('email', e.target.value)
    }
    onChangePassword = (e) => {
        this.setState({ password: e.target.value })
        this.validateField('password', e.target.value)
    }
    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.email;
        let passwordValid = this.state.password;

        switch (fieldName) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : 'Địa chi email không hợp lệ';
                break;
            case 'password':
                passwordValid = value.length >= 6;
                fieldValidationErrors.password = passwordValid ? '' : 'Mật khẩu ít nhất 6 ký tự';
                break;
            default:
                break;
        }
    }
    onSubmit = (e) => {
        e.preventDefault();
        const { email, password, formErrors } = this.state;
        if (formErrors.email === '' && formErrors.password === '') {
            let data = {
                'username': email,
                'password': password
            };

            this.setState({ sending: true });
            sendRequest('post', 'users/login', data).then((res) => {
                // console.log(res);
                // console.log('data', data);
                if (!res.isError) {
                    if (res.data.code === 0) {
                        this.props.dispatch({
                            type: 'UPDATE_USER',
                            isAuth: res.data.data.id,
                            username: res.data.data.username,
                        })
                        AuthenticateService.setAuthenticateUser(res.data.data.id, res.data.data.username)
                        this.props.history.push({
                            pathname: '/',
                        })
                    } else{
                        this.setState({ sending: false });
                        swal('Error!', 'Đăng nhập thất bại', 'error')
                    }
                } else {
                    this.setState({ sending: false });
                    this.setState({ errLogin: true });
                    this.setState({ msg: "Something went wrong!" })
                }
                // this.props.dispatch({
                //     type: 'UPDATE_USER',
                //     isAuth: true,
                //     username: email,
                // })
                // AuthenticateService.setAuthenticateUser(res.data.data.id, email)
                // this.props.history.push({
                //     pathname: '/',
                // })
                // swal('Success!', 'Đăng nhập thành công', 'success')
            })
        }
    }
    renderErrorLogin() {
        if (this.state.errLogin) {
            return (
                <div className="alert alert-danger">
                    <button type="button" className="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                    <strong>Error!</strong> {this.state.msg}
                </div>);
        } else {
            return;
        }
    }
    render() {
        const {
            email,
            password,
            formErrors
        } = this.state
        let errEmail, errPw;
        if (formErrors.email) {
            errEmail = <label id="email-error" className="error">{formErrors.email}</label>;
        }
        if (formErrors.password) {
            errPw = <label id="password-error" className="error">{formErrors.password}</label>;
        }
        return (
            <div id="page-login">
                <div className="container">
                    <div className="card card-container">
                        <img id="profile-img" alt="" className="profile-img-card" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" />
                        <p id="profile-name" className="profile-name-card"></p>
                        {this.renderErrorLogin()}
                        <form onSubmit={this.onSubmit} id="form-signin" className="form-signin">
                            <span id="reauth-email" className="reauth-email"></span>
                            <div className="form-group">
                                <input onChange={this.onChangeEmail} value={email} type="email" name="email" id="email" className="form-control" placeholder="Email address" required />
                                {errEmail}
                            </div>
                            <div className="form-group">
                                <input onChange={this.onChangePassword} value={password} type="password" name="password" id="password" className="form-control" placeholder="Password" required />
                                {errPw}
                            </div>
                            <button className={this.state.sending ? 'btn btn-lg btn-primary btn-block btn-signin sending' : 'btn btn-lg btn-primary btn-block btn-signin'} type="submit">
                                <div className="loader"></div>
                                Đăng nhập</button>
                        </form>
                        <div><a href="/register" className="register">Đăng ký một tài khoản!</a></div>
                    </div>
                </div>
            </div>
        );
    }
}
// export default Login;

const mapStateToProps = state => {
    return { user: state.user };
};

export default connect(mapStateToProps)(Login);