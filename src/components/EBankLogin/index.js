import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class EBankLogin extends Component {
  state = {userId: '', pin: '', showErrorMsg: false, errorMsg: ''}

  onChangeUserId = e => {
    this.setState({userId: e.target.value})
  }

  onChangePin = e => {
    this.setState({pin: e.target.value})
  }

  onFormSubmit = async e => {
    e.preventDefault()
    const {userId, pin} = this.state
    const userDetails = {user_id: userId, pin}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.navigateToLandingPage(data.jwt_token)
    } else {
      this.failureView(data.error_msg)
    }
  }

  navigateToLandingPage = jwtToken => {
    // console.log(this.props)
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 10})

    history.replace('/')
  }

  failureView = errorMsg => {
    this.setState({errorMsg, showErrorMsg: true})
  }

  render() {
    const {userId, pin, errorMsg, showErrorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="app-container">
        <div className="log-in-container">
          <div className="image-container">
            <img
              className="website-login-image"
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
            />
          </div>
          <div className="form-container">
            <form onSubmit={this.onFormSubmit} className="form">
              <h1 className="main-heading">Welcome Back!</h1>
              <div className="user-id-container">
                <label className="label" htmlFor="userId">
                  User ID
                </label>
                <br />
                <input
                  onChange={this.onChangeUserId}
                  value={userId}
                  type="text"
                  id="userId"
                  className="input"
                />
              </div>
              <div className="password-container">
                <label className="label" htmlFor="password">
                  PIN
                </label>
                <br />
                <input
                  onChange={this.onChangePin}
                  value={pin}
                  type="password"
                  id="password"
                  className="input"
                />
              </div>
              <div className="button-container">
                <button type="submit" className="login-btn">
                  Login
                </button>
                {showErrorMsg ? (
                  <p className="error-message">*{errorMsg}</p>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default EBankLogin
